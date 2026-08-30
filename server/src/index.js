import 'dotenv/config';
import express from 'express';
import cors from 'cors';

import * as cache from './cache.js';
import { dedupe, stats as queueStats } from './queue.js';
import { lookupItem, lookupTradingPost, NotFoundError, ScrapeError } from './jellyneo.js';
import { browserUp, closeBrowser, userAgent } from './browser.js';

const PORT = Number(process.env.PORT || 8787);
const TOKEN = process.env.NEOSNIPE_TOKEN || '';

const app = express();
app.use(express.json({ limit: '64kb' }));

// The extension calls from a chrome-extension:// origin; some contexts send "null".
app.use(cors({ origin: true, allowedHeaders: ['Content-Type', 'X-NeoSnipe-Token'] }));

app.get('/health', (_req, res) => {
  res.json({ ok: true, browserUp: browserUp(), cacheSize: cache.size(), userAgent: userAgent(), queue: queueStats() });
});

// Without this, any page the user visits could drive their local browser pool.
app.use('/api', (req, res, next) => {
  if (!TOKEN) return res.status(500).json({ error: 'server_misconfigured', detail: 'NEOSNIPE_TOKEN is not set' });
  if (req.get('X-NeoSnipe-Token') !== TOKEN) return res.status(401).json({ error: 'unauthorized' });
  next();
});

async function priceFor({ name, imageHash, itemId }) {
  const key = cache.cacheKey({ name, imageHash });

  const hit = cache.get(key);
  if (hit) {
    if (!hit.ok) {
      const err = new NotFoundError(name);
      err.cached = true;
      throw err;
    }
    return { ...hit.payload, cached: true, fetchedAt: hit.fetchedAt };
  }

  return dedupe(key, async () => {
    // Another caller may have filled the cache while we waited in the queue.
    const raced = cache.get(key);
    if (raced?.ok) return { ...raced.payload, cached: true, fetchedAt: raced.fetchedAt };

    try {
      console.log(`[scrape] ${name || itemId}`);
      const item = await lookupItem({ name, imageHash, itemId });
      const fetchedAt = cache.put(key, item, true);
      return { ...item, cached: false, fetchedAt };
    } catch (err) {
      if (err instanceof NotFoundError) cache.put(key, { error: 'not_found' }, false);
      throw err;
    }
  });
}

app.post('/api/price', async (req, res) => {
  const { name, imageHash, itemId } = req.body || {};
  if (!name && !itemId) return res.status(400).json({ error: 'bad_request', detail: 'name or itemId is required' });

  try {
    res.json(await priceFor({ name, imageHash, itemId }));
  } catch (err) {
    if (err instanceof NotFoundError) {
      return res.status(404).json({ error: 'not_found', query: name, candidates: err.candidates || [] });
    }
    if (err instanceof ScrapeError) {
      // 502, not 500: the upstream site changed shape, our server is fine.
      return res.status(502).json({ error: 'scrape_failed', field: err.field, detail: err.message });
    }
    console.error('[price] lookup failed:', err);
    res.status(500).json({ error: 'internal', detail: err.message });
  }
});

/**
 * Trading post history for one item, keyed by its Jelly Neo item id (which the
 * price response carries). Separate from /api/price because the upstream page
 * is slow to generate, so it is only fetched when someone opens that tab.
 */
app.post('/api/trading-post', async (req, res) => {
  const { itemId } = req.body || {};
  if (!itemId) return res.status(400).json({ error: 'bad_request', detail: 'itemId is required' });

  const key = `tp:${itemId}`;
  const hit = cache.get(key);
  if (hit?.ok) return res.json({ ...hit.payload, cached: true, fetchedAt: hit.fetchedAt });

  try {
    const data = await dedupe(key, async () => {
      const raced = cache.get(key);
      if (raced?.ok) return { ...raced.payload, cached: true, fetchedAt: raced.fetchedAt };
      console.log(`[scrape] trading post ${itemId}`);
      const tp = await lookupTradingPost({ itemId });
      const fetchedAt = cache.put(key, tp, true);
      return { ...tp, cached: false, fetchedAt };
    });
    res.json(data);
  } catch (err) {
    if (err instanceof ScrapeError) {
      return res.status(502).json({ error: 'scrape_failed', field: err.field, detail: err.message });
    }
    console.error('[trading-post] lookup failed:', err);
    res.status(500).json({ error: 'internal', detail: err.message });
  }
});

app.delete('/api/cache', (req, res) => {
  if (req.query.name) {
    return res.json({ removed: cache.remove(cache.cacheKey({ name: req.query.name, imageHash: req.query.imageHash })) });
  }
  res.json({ removed: cache.clear() });
});

const server = app.listen(PORT, '127.0.0.1', () => {
  console.log(`neo-snipe server on http://127.0.0.1:${PORT}`);
  if (!TOKEN) console.warn('WARNING: NEOSNIPE_TOKEN is unset — /api routes will refuse every request.');
});

for (const signal of ['SIGINT', 'SIGTERM']) {
  process.on(signal, async () => {
    server.close();
    await closeBrowser();
    cache.close();
    process.exit(0);
  });
}

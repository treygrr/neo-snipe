const CONCURRENCY = Number(process.env.SCRAPE_CONCURRENCY || 2);
const MIN_INTERVAL_MS = Number(process.env.SCRAPE_MIN_INTERVAL_MS || 1000);

let active = 0;
let lastStart = 0;
const pending = [];
const inFlight = new Map();

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

function pump() {
  if (active >= CONCURRENCY || pending.length === 0) return;
  const job = pending.shift();
  active++;

  (async () => {
    // Floor the rate at which we hit Jelly Neo, regardless of concurrency.
    const wait = lastStart + MIN_INTERVAL_MS - Date.now();
    if (wait > 0) await sleep(wait);
    lastStart = Date.now();
    try {
      job.resolve(await job.fn());
    } catch (err) {
      job.reject(err);
    } finally {
      active--;
      pump();
    }
  })();
}

/** Runs `fn` under the global concurrency cap and rate limit. */
export function schedule(fn) {
  return new Promise((resolve, reject) => {
    pending.push({ fn, resolve, reject });
    pump();
  });
}

/**
 * Runs `fn` under `key`, coalescing concurrent callers so a burst of identical
 * lookups results in exactly one scrape.
 */
export function dedupe(key, fn) {
  const existing = inFlight.get(key);
  if (existing) return existing;

  const promise = schedule(fn).finally(() => inFlight.delete(key));
  inFlight.set(key, promise);
  return promise;
}

export function stats() {
  return { active, queued: pending.length, inFlight: inFlight.size };
}

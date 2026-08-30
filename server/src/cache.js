import Database from 'better-sqlite3';
import { mkdirSync } from 'node:fs';
import { dirname, resolve } from 'node:path';

const DB_PATH = resolve(process.env.CACHE_DB || 'data/cache.db');
const HIT_TTL_MS = Number(process.env.HIT_TTL_MS || 24 * 60 * 60 * 1000); // 24h
const MISS_TTL_MS = Number(process.env.MISS_TTL_MS || 60 * 60 * 1000); //  1h

mkdirSync(dirname(DB_PATH), { recursive: true });

const db = new Database(DB_PATH);
db.pragma('journal_mode = WAL');
db.exec(`
  CREATE TABLE IF NOT EXISTS prices (
    key        TEXT PRIMARY KEY,
    payload    TEXT    NOT NULL,
    fetched_at INTEGER NOT NULL,
    ok         INTEGER NOT NULL
  );
`);

const stmts = {
  get: db.prepare('SELECT payload, fetched_at, ok FROM prices WHERE key = ?'),
  put: db.prepare(`INSERT INTO prices (key, payload, fetched_at, ok) VALUES (?, ?, ?, ?)
                   ON CONFLICT(key) DO UPDATE SET
                     payload = excluded.payload,
                     fetched_at = excluded.fetched_at,
                     ok = excluded.ok`),
  del: db.prepare('DELETE FROM prices WHERE key = ?'),
  clear: db.prepare('DELETE FROM prices'),
  count: db.prepare('SELECT COUNT(*) AS n FROM prices'),
};

/** Normalised cache key: item name is authoritative, image hash disambiguates. */
export function cacheKey({ name, imageHash }) {
  const norm = String(name || '').toLowerCase().replace(/\s+/g, ' ').trim();
  return `${norm}|${imageHash || ''}`;
}

export function get(key) {
  const row = stmts.get.get(key);
  if (!row) return null;

  const ttl = row.ok ? HIT_TTL_MS : MISS_TTL_MS;
  if (Date.now() - row.fetched_at > ttl) {
    stmts.del.run(key);
    return null;
  }
  return { payload: JSON.parse(row.payload), fetchedAt: row.fetched_at, ok: Boolean(row.ok) };
}

export function put(key, payload, ok = true) {
  const fetchedAt = Date.now();
  stmts.put.run(key, JSON.stringify(payload), fetchedAt, ok ? 1 : 0);
  return fetchedAt;
}

export function remove(key) {
  return stmts.del.run(key).changes;
}

export function clear() {
  return stmts.clear.run().changes;
}

export function size() {
  return stmts.count.get().n;
}

export function close() {
  db.close();
}

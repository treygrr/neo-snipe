// Politeness toward Jelly Neo: at most one request in flight and a floor
// between them, so a burst of clicks trickles rather than stampedes.
const MAX_CONCURRENT = 1;
const MIN_INTERVAL_MS = 700;

let active = 0;
let lastStart = 0;
const pending = [];
const inFlight = new Map();

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

function pump() {
  if (active >= MAX_CONCURRENT || !pending.length) return;
  const job = pending.shift();
  active++;

  (async () => {
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

export function schedule(fn) {
  return new Promise((resolve, reject) => {
    pending.push({ fn, resolve, reject });
    pump();
  });
}

/** Coalesces concurrent callers for the same key into one piece of work. */
export function dedupe(key, fn) {
  const existing = inFlight.get(key);
  if (existing) return existing;

  const promise = schedule(fn).finally(() => inFlight.delete(key));
  inFlight.set(key, promise);
  return promise;
}

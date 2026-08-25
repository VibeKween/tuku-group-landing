/**
 * Best-effort fixed-window rate limiting on top of KV (no atomic increment
 * available, same tradeoff the existing tuku-booking-api KV usage accepts).
 * Good enough to blunt brute-force passphrase guessing; not a hard guarantee
 * under concurrent requests.
 */

const WINDOW_MS = 15 * 60 * 1000; // 15 minutes
const MAX_ATTEMPTS = 5;

export async function checkAndRecordAttempt(kv, key) {
  const now = Date.now();
  const raw = await kv.get(key);
  let record = raw ? JSON.parse(raw) : { count: 0, windowStart: now };

  if (now - record.windowStart > WINDOW_MS) {
    record = { count: 0, windowStart: now };
  }

  if (record.count >= MAX_ATTEMPTS) {
    return { allowed: false, retryAfterMs: WINDOW_MS - (now - record.windowStart) };
  }

  record.count += 1;
  await kv.put(key, JSON.stringify(record), { expirationTtl: Math.ceil(WINDOW_MS / 1000) });
  return { allowed: true };
}

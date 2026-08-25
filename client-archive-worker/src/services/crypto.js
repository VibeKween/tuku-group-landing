/**
 * WebCrypto-only auth primitives. Workers has no native bcrypt/argon2, so
 * passphrase hashing uses PBKDF2 (built into SubtleCrypto). Cookies are
 * stateless: HMAC-signed rather than looked up in a session store.
 */

const PBKDF2_ITERATIONS = 100000;

function toB64Url(bytes) {
  let str = btoa(String.fromCharCode(...new Uint8Array(bytes)));
  return str.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

function fromB64Url(str) {
  str = str.replace(/-/g, '+').replace(/_/g, '/');
  while (str.length % 4) str += '=';
  const bin = atob(str);
  const bytes = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i);
  return bytes;
}

function timingSafeEqual(a, b) {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) diff |= a[i] ^ b[i];
  return diff === 0;
}

async function pbkdf2(passphrase, salt, iterations = PBKDF2_ITERATIONS) {
  const key = await crypto.subtle.importKey(
    'raw',
    new TextEncoder().encode(passphrase),
    'PBKDF2',
    false,
    ['deriveBits']
  );
  const bits = await crypto.subtle.deriveBits(
    { name: 'PBKDF2', salt, iterations, hash: 'SHA-256' },
    key,
    256
  );
  return new Uint8Array(bits);
}

export async function hashPassphrase(passphrase) {
  const salt = crypto.getRandomValues(new Uint8Array(16));
  const hash = await pbkdf2(passphrase, salt);
  return `pbkdf2$${PBKDF2_ITERATIONS}$${toB64Url(salt)}$${toB64Url(hash)}`;
}

export async function verifyPassphrase(passphrase, stored) {
  const parts = stored.split('$');
  if (parts.length !== 4 || parts[0] !== 'pbkdf2') return false;
  const iterations = parseInt(parts[1], 10);
  const salt = fromB64Url(parts[2]);
  const expected = fromB64Url(parts[3]);
  const actual = await pbkdf2(passphrase, salt, iterations);
  return timingSafeEqual(actual, expected);
}

async function hmacKey(secret) {
  return crypto.subtle.importKey(
    'raw',
    new TextEncoder().encode(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign', 'verify']
  );
}

/** Stateless signed cookie value: "<clientId>.<expiresAtMs>.<sigB64url>" */
export async function signAccessCookie(clientId, expiresAtMs, secret) {
  const payload = `${clientId}.${expiresAtMs}`;
  const key = await hmacKey(secret);
  const sig = await crypto.subtle.sign('HMAC', key, new TextEncoder().encode(payload));
  return `${payload}.${toB64Url(sig)}`;
}

/** Returns the clientId if the cookie is valid, unexpired, and matches expectedClientId; otherwise null. */
export async function verifyAccessCookie(cookieValue, expectedClientId, secret) {
  if (!cookieValue) return null;
  const parts = cookieValue.split('.');
  if (parts.length !== 3) return null;
  const [clientId, expiresAtStr, sigB64] = parts;
  if (clientId !== expectedClientId) return null;
  const expiresAtMs = parseInt(expiresAtStr, 10);
  if (!Number.isFinite(expiresAtMs) || Date.now() > expiresAtMs) return null;

  const key = await hmacKey(secret);
  const payload = `${clientId}.${expiresAtStr}`;
  const valid = await crypto.subtle.verify(
    'HMAC',
    key,
    fromB64Url(sigB64),
    new TextEncoder().encode(payload)
  );
  return valid ? clientId : null;
}

export async function sha256Hex(input) {
  const digest = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(input));
  return [...new Uint8Array(digest)].map((b) => b.toString(16).padStart(2, '0')).join('');
}

/** Constant-time compare for the admin bearer token. */
export function timingSafeEqualString(a, b) {
  const ab = new TextEncoder().encode(a);
  const bb = new TextEncoder().encode(b);
  if (ab.length !== bb.length) return false;
  return timingSafeEqual(ab, bb);
}

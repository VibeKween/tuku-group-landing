# Onboarding a new client archive

Runbook for adding a new client to the private client archive system (the
same system `full-charge` uses). Follow this end to end for any new client -
skipping a step is the actual risk here, not any missing backend capability.

Read `client-archive-worker/README.md` first for what this system is and
how its pieces fit together. This document is the step-by-step process;
that one is the reference.

## Before you start

- The worker is deployed and its production route is live (see
  `wrangler.toml`'s `[env.production].routes` and `README.md`'s route
  mounting section).
- You have the `ADMIN_TOKEN` value (see `credentials.local.txt`, gitignored,
  or wherever it's been moved to since - a password manager, ideally).
- You have `wrangler` authenticated against the Cloudflare account
  (`wrangler whoami` to check).

## 1. Pick the client slug

Lowercase, hyphenated, e.g. `of-the-culture`. This becomes:
- The `clients.id` primary key
- The URL path: `tukugroup.com/clients/<slug>/`
- The directory: `website/clients/<slug>/`

Must not collide with an existing slug. Check `website/clients/index.html`
and the `clients` table for what's already taken.

## 2. Build the client's bespoke frontend

**This is real design/dev work, not automated.** Each client's portal is
intentionally its own hand-built visual concept - see the "Key decisions"
section of `docs/builds/full-charge-client-archive.md` for why this is a
deliberate choice, not a gap. `full-charge`'s files
(`website/clients/full-charge/index.html` and `field/`) are the reference
implementation to build from, not a template to reuse verbatim.

What can be reused as-is, because it's already generic:
- `website/clients/full-charge/field/reader.js` + `reader.css` - the reader
  module takes an artifact object and has zero client-specific knowledge.
  Copy it into the new client's `field/` directory unchanged.

What must be built new for this client:
- A gate page (`website/clients/<slug>/index.html`) - the password prompt,
  calling `/clients/<slug>/unlock` and `/clients/<slug>/lock`.
- A field page (`website/clients/<slug>/field/index.html` +
  a `board.js` or equivalent) - calling `/clients/<slug>/board` and
  rendering whatever visual concept this client's portal uses. It does not
  have to be a spatial "board" like Full Charge's - it just has to render
  the `{client, sessions, artifacts, board}` shape documented in
  `client-archive-worker/README.md`'s Routes section.

Whatever visual system this client uses, keep the metadata block pattern
from `full-charge`'s placeholder/gate (canonical URL, OG/Twitter tags,
`<meta name="robots" content="noindex, nofollow">`, the GA4 snippet) - see
`CLAUDE.md`'s Client Archive section for why (unlisted-but-public, matching
the rest of the client archive).

## 3. Create the D1 records

Generate a passphrase hash - **never hand-roll this**, use the same PBKDF2
helper the worker itself uses:

```js
// from client-archive-worker/src/services/crypto.js, adapted for a one-off Node script:
const { webcrypto: crypto } = require('node:crypto');
function toB64Url(bytes) {
  return Buffer.from(bytes).toString('base64').replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}
async function hash(passphrase) {
  const salt = crypto.getRandomValues(new Uint8Array(16));
  const key = await crypto.subtle.importKey('raw', new TextEncoder().encode(passphrase), 'PBKDF2', false, ['deriveBits']);
  const bits = await crypto.subtle.deriveBits({ name: 'PBKDF2', salt, iterations: 100000, hash: 'SHA-256' }, key, 256);
  return `pbkdf2$100000$${toB64Url(salt)}$${toB64Url(new Uint8Array(bits))}`;
}
hash('the-clients-passphrase').then(console.log);
```

Then insert both rows against the **remote** (production) database:

```sql
INSERT INTO clients (id, name, site_url, accent_hex, created_at)
VALUES ('<slug>', '<Display Name>', '<https://client-site.com or NULL>', '<#hex accent>', '<ISO timestamp>');

INSERT INTO access_grants (id, client_id, passphrase_hash, expires_at, created_at)
VALUES ('<uuid>', '<slug>', '<the pbkdf2$... hash from above>', NULL, '<ISO timestamp>');
```

```
wrangler d1 execute CLIENT_ARCHIVE_DB --remote --command "<the INSERT above>"
```

(Run from `client-archive-worker/`, same as any other D1 operation there.)

## 4. Confirm it's admin-manageable

This is the step that's easy to forget - the whole point of this checklist.

1. Go to `/admin`, enter the `ADMIN_TOKEN`.
2. The new client should appear in the client list with a doc count of 0.
3. Select it, confirm the (empty) history view and upload panel render.
4. Upload the client's first real artifact through the drag-and-drop panel.
5. Confirm it now shows `v1` with the `LATEST` badge.

If any of this doesn't work, something above was missed - it is not a
backend limitation (the admin dashboard is already generic across clients;
see the "confirming... architecture will allow us to scale" discussion in
`docs/builds/full-charge-client-archive.md`).

## 5. Test the client-facing flow end to end

- Visit `/clients/<slug>/`, confirm the gate loads with correct metadata.
- Unlock with the real passphrase (wrong passphrase should shake/reject first).
- Confirm the field renders the uploaded artifact.
- Open it in the reader, confirm zoom/open-full/save-a-copy all work.
- Confirm `LOCK` returns to the gate and a repeat unauthenticated visit is
  actually gated (not cached/bypassed).

## 6. List it (if it should be discoverable via the balloon)

Add a row to `website/clients/index.html` pointing at `<slug>/` if this
client should be reachable the same way `full-charge` and the others are -
unlisted-but-public, `noindex`, not in `sitemap.xml`. Skip this if the
client should only be reachable via a direct link shared privately.

## 7. Deploy

- Commit the new client's frontend files and any doc updates.
- No `wrangler.toml` changes are needed - the worker's routes use a
  wildcard for the client slug (`/clients/*/unlock` etc.), so a new client
  works immediately once its D1 rows exist.
- Merging to `main` is what puts the new static pages live via Cloudflare
  Pages - follow the workspace's production-approval workflow
  (`CLAUDE.md`) before doing that.

## Pitfalls

- **Never reuse the `ADMIN_TOKEN` as a client passphrase, or vice versa.**
  They are deliberately separate credentials - one gates board viewing for
  one client, the other gates upload access across every client.
- **Never hand-roll the passphrase hash.** Use the PBKDF2 scheme above, not
  a plain SHA-256 or an unsalted hash.
- **Don't skip step 4.** A client that isn't verified in `/admin` before
  going live means the first real upload becomes the first time anyone
  finds out something's wrong.
- Re-uploading an artifact for this client is always a new version, never
  an overwrite - see `client-archive-worker/README.md`'s Versioning section.

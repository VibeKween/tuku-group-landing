# tuku-client-archive-api

Track A of the Full Charge client archive build (see
`website/design_handoff_full_charge/README.md` and the approved plan in
`/Users/falonbahal/.claude/plans/cryptic-sprouting-garden.md`). Backs the
private per-client archive: auth, the board data payload, artifact
streaming, and a central admin dashboard for uploading/versioning artifacts
across every client (not scattered per-client controls - built this way
deliberately so it scales to many clients, each with their own artifact
history, from one place).

Kept as its own worker, separate from `../workers/` (`tuku-booking-api`),
so a bug here can't take down the booking flow and vice versa.

## Provisioning status (2026-08-25)

D1, R2, KV, both secrets, and the real `full-charge` client + passphrase
grant are all provisioned in Cloudflare and populated with real data.
Deployed to `https://tuku-client-archive-api.falonbahal.workers.dev` and
verified end-to-end against that live deployment (unlock, board, artifact
streaming, admin upload, append-only versioning all confirmed working on
real infrastructure, not just local Miniflare).

**Not yet done**: the production route (see `[env.production].routes`
below) is configured in `wrangler.toml` but the worker has not been
re-deployed with it, and `dev` has not been merged to `main` — so nothing
is reachable on `tukugroup.com` yet. Both are held for explicit approval
per the workspace's production-deploy workflow, not a technical blocker.

If provisioning this from scratch again (e.g. a second environment):
1. `wrangler d1 create tuku-client-archive` → paste the `database_id` into `wrangler.toml`.
2. `wrangler d1 execute CLIENT_ARCHIVE_DB --remote --file=migrations/0001_init.sql`.
3. `wrangler r2 bucket create tuku-client-artifacts`.
4. `wrangler kv:namespace create RATE_LIMIT` → paste the id into `wrangler.toml`.
5. `wrangler secret put COOKIE_SECRET` and `wrangler secret put ADMIN_TOKEN` — two independent values. `ADMIN_TOKEN` must never equal or derive from any client's passphrase.
6. Insert the client's row into `clients`, and one `access_grants` row with a PBKDF2 hash (use `hashPassphrase` from `src/services/crypto.js` — don't hand-roll a hash).

## Route mounting

`wrangler.toml`'s `[env.production].routes` lists one pattern per exact
endpoint this worker implements (`/clients/*/unlock`, `/lock`, `/board`,
`/artifact/*`, `/admin`, `/admin/*`) rather than a single blanket
`tukugroup.com/clients/*`. The reason: `tukugroup.com` is served by
Cloudflare Pages, including every client's static gate/field HTML - not
just `full-charge`, but the other 6 client-archive slugs too. A blanket
`/clients/*` route would intercept *all* of those page loads and 404 them,
since this worker has no static assets to serve. The narrow patterns match
only this worker's actual API shapes; a plain page load like
`/clients/full-charge/` or `/clients/voyj/` never matches any of them and
reaches Pages exactly as it does today.

## Routes

- `POST /clients/:client/unlock` — `{ passphrase }` → sets the signed access cookie.
- `POST /clients/:client/lock` — clears it.
- `GET /clients/:client/board` — requires the cookie; returns the same shape as `board.fixture.json`.
- `GET /clients/:client/artifact/:id` — requires the cookie; streams the R2 object. `?download=1` adds `Content-Disposition`.
- `GET /admin` — the dashboard: client picker, per-client artifact/version history, drag-and-drop upload panel. Gated by `ADMIN_TOKEN`, entered client-side and sent as a Bearer token on every request below.
- `GET /admin/clients` — list of clients with a doc count each, for the picker.
- `GET /admin/clients/:id/artifacts` — full version history for one client (every version, not just latest - so the admin can see what a re-upload is about to supersede).
- `POST /admin/artifacts` — multipart upload, gated by `Authorization: Bearer <ADMIN_TOKEN>`.

## Versioning

Every upload through `/admin/artifacts` is a **new row**, never an update.
`resolveNextVersion` + `finalizeArtifactVersion` in `src/services/db.js`
compute the next `version` for a given `(client_id, doc_slug)`, upload to a
version-numbered R2 key, insert the new row, and only then flip the prior
row's `is_latest` to 0. A client's session history is never destroyed by a
later upload.

## Local dev

```
cp .dev.vars.example .dev.vars   # fill in real random values, never commit this file
npm install
npm run dev
```

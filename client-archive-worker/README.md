# tuku-client-archive-api

Backend for the private per-client archive system (see
`website/design_handoff_full_charge/README.md` for the original Full Charge
spec this was built from): auth, the board data payload, artifact
streaming, and a central admin dashboard for uploading/versioning artifacts
across every client (not scattered per-client controls - built this way
deliberately so it scales to many clients, each with their own artifact
history, from one place).

Kept as its own worker, separate from `../workers/` (`tuku-booking-api`),
so a bug here can't take down the booking flow and vice versa.

**Adding a new client?** Follow `ONBOARDING-NEW-CLIENT.md` end to end - it's
the runbook. Everything below is reference material for how this system
works, not a checklist to follow in order.

Current build status (what's live, what's tested, what's still open):
`docs/builds/full-charge-client-archive.md` at the repo root.

## Provisioning status (2026-08-25)

D1, R2, KV, both secrets (set separately for the default AND `production`
environments - see the callout after the checklist below on why that's not
automatic), and the real `full-charge` client + passphrase grant are all
provisioned in Cloudflare with real data. Deployed to production with the
real route live - verified directly against `https://tukugroup.com`
(unlock, board, artifact streaming, admin dashboard, lock all confirmed
working against the real domain, not just `workers.dev` or local
Miniflare).

`dev` has since been merged to `main` (2026-08-26) - Cloudflare Pages has
published the real gate/field/reader pages, and `/clients/full-charge/` no
longer serves the placeholder. Both backend and frontend are fully live.

If provisioning this from scratch again (e.g. a second environment):
1. `wrangler d1 create tuku-client-archive` → paste the `database_id` into `wrangler.toml`.
2. `wrangler d1 execute CLIENT_ARCHIVE_DB --remote --file=migrations/0001_init.sql`.
3. `wrangler r2 bucket create tuku-client-artifacts`.
4. `wrangler kv:namespace create RATE_LIMIT` → paste the id into `wrangler.toml`.
5. `wrangler secret put COOKIE_SECRET` and `wrangler secret put ADMIN_TOKEN` — two independent values. `ADMIN_TOKEN` must never equal or derive from any client's passphrase.
6. Insert the client's row into `clients`, and one `access_grants` row with a PBKDF2 hash (use `hashPassphrase` from `src/services/crypto.js` — don't hand-roll a hash).

**Secrets are scoped per named environment, same as bindings.**
`wrangler secret put NAME` without a flag sets it only on the *default*
environment. If `wrangler.toml` deploys to `--env production` (this one
does, for the real domain), that's a different underlying Worker script
with its own secrets - run `wrangler secret put NAME --env production`
too, or the production deploy will have `env.ADMIN_TOKEN`/`env.COOKIE_SECRET`
silently `undefined`. `wrangler secret list --env production` shows what's
actually set there.

## Route mounting

`wrangler.toml`'s `[env.production].routes` lists one pattern per exact
endpoint this worker implements (`/clients/unlock/*`, `/clients/lock/*`,
`/clients/board/*`, `/clients/artifact/*`, `/admin`, `/admin/*`) rather than
a single blanket `tukugroup.com/clients/*`. The reason: `tukugroup.com` is
served by Cloudflare Pages, including every client's static gate/field HTML
- not just `full-charge`, but the other 6 client-archive slugs too. A
blanket `/clients/*` route would intercept *all* of those page loads and
404 them, since this worker has no static assets to serve. The narrow
patterns match only this worker's actual API shapes; a plain page load like
`/clients/full-charge/` or `/clients/voyj/` never matches any of them and
reaches Pages exactly as it does today.

**Why the client slug comes last in every path** (`/clients/unlock/:client`,
not `/clients/:client/unlock`): Cloudflare Workers Routes only allow a
wildcard at the very start of the hostname or the very end of the path,
never in the middle. A first attempt at `tukugroup.com/clients/*/unlock`
etc. was rejected live with error code 10022 ("Route pattern may only
contain wildcards at the beginning of the hostname and the end of the
path"). Putting the slug last means every route pattern only needs a
trailing wildcard - and that PUT request replaces the worker's entire route
set atomically, so even the routes that *were* valid (`/admin`, `/admin/*`)
failed to apply alongside the 4 that weren't. Confirm any future route
change with `wrangler deploy --dry-run --env production` before relying on
it, and verify live with a real request afterward - a successful upload
doesn't guarantee the routes actually took effect.

## Routes

- `POST /clients/unlock/:client` — `{ passphrase }` → sets the signed access cookie.
- `POST /clients/lock/:client` — clears it.
- `GET /clients/board/:client` — requires the cookie; returns the same shape as `board.fixture.json`.
- `GET /clients/artifact/:client/:id` — requires the cookie; streams the R2 object. `?download=1` adds `Content-Disposition`.

The client slug is always the LAST path segment in every route above, not
embedded in the middle (`/clients/unlock/:client`, not
`/clients/:client/unlock`). This isn't stylistic - see "Route mounting"
below for why it's structurally required.
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

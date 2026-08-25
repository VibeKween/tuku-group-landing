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

## Not yet provisioned

Nothing in this worker has been deployed or pointed at real Cloudflare
resources. Before it can run for real:

1. `wrangler d1 create tuku-client-archive` → paste the `database_id` into `wrangler.toml`.
2. `wrangler d1 execute CLIENT_ARCHIVE_DB --remote --file=migrations/0001_init.sql` (or `npm run migrate:local` against a local D1 for dev).
3. `wrangler r2 bucket create tuku-client-artifacts`.
4. `wrangler kv:namespace create RATE_LIMIT` → paste the id into `wrangler.toml`.
5. `wrangler secret put COOKIE_SECRET` and `wrangler secret put ADMIN_TOKEN` — two independent random values. `ADMIN_TOKEN` must never equal or derive from any client's passphrase.
6. Insert the `full-charge` row into `clients`, and one `access_grants` row with a PBKDF2 hash (use `hashPassphrase` from `src/services/crypto.js` to generate it — don't hand-roll a hash).
7. Decide and wire the real route pattern in `wrangler.toml` (commented out for now — final `/clients/*` mounting under tukugroup.com is still TBD per the plan).

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

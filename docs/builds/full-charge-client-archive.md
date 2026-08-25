# BUILD PROGRESS — Full Charge Client Archive

**Feature:** Private per-client archive (`/clients/full-charge/`)
**Spec:** `website/design_handoff_full_charge/README.md`
**Branch:** `dev` — pushed to `origin/dev`, not merged to `main`
**Adding another client to this system?** See
`client-archive-worker/ONBOARDING-NEW-CLIENT.md` — that's the runbook; this
document is a status/decisions log, not a process to follow.

## Current state

- **Backend is live on Cloudflare**: D1, R2, and KV are provisioned, migrated,
  and seeded with the real `full-charge` client. Deployed to
  `https://tuku-client-archive-api.falonbahal.workers.dev`. Verified
  end-to-end against real infrastructure (unlock, board, artifact streaming,
  admin upload, append-only versioning).
- **Frontend (gate, field, reader) is built and tested, but not deployed
  anywhere real** — it only exists on `dev`. Cloudflare Pages deploys
  `main`, so merging is what would actually put it on `tukugroup.com`.
- **Admin dashboard** (`/admin`) is a central, multi-client tool — client
  picker, per-client version history, drag-and-drop upload — styled to
  match tukugroup.com's real design system (JetBrains Mono, black/white/gold,
  hairline borders). Gated by a separate `ADMIN_TOKEN` secret, never the
  client passphrase.

## Key decisions

- **Each client has its own login page and its own password** — not a
  shared gate or a shared passphrase. `access_grants` is keyed per
  `client_id` with an independent `passphrase_hash` per row; the gate/field
  pages themselves reference their client directly rather than being a
  generic templated portal. Onboarding a new client is a new `clients` row,
  a new `access_grants` row, and a new set of gate/field/reader files for
  that client — no schema or backend changes.
- **Building a new client's bespoke site must include making it
  admin-manageable from day one**, not an afterthought bolted on later. The
  admin dashboard is already generic across clients - the risk isn't
  backend capability, it's forgetting the step when a new client's build
  happens. Full process now lives in
  `client-archive-worker/ONBOARDING-NEW-CLIENT.md`.
- Separate Worker (`client-archive-worker/`), not an extension of `workers/`
  (`tuku-booking-api`) — isolates blast radius.
- Admin auth is a distinct `ADMIN_TOKEN` secret; a client passphrase leak
  must never also grant upload access.
- Artifact versioning is append-only (new D1 row + new R2 key per upload).
  Revisions are pinned to their doc's original session/meeting date — a
  later upload never moves the chrono pin or spawns a new tick, regardless
  of what date is in the upload form.
- Design and data logic are deliberately decoupled: the backend only knows a
  generic client/session/artifact shape and streams whatever HTML a client's
  artifact is. Each client's portal is its own hand-built frontend calling
  the same four endpoints (`unlock`, `lock`, `board`, `artifact/:id`) - a
  future client with a different visual concept needs no backend changes.
  The admin dashboard is a separate internal tool with its own styling,
  independent of any client portal's look.
- GA reuses the existing `G-5KTM9YBETS` property with custom events, not a
  separate stream.
- Passphrase hashing is PBKDF2 via WebCrypto (Workers has no native
  bcrypt/argon2).
- Every JSON API response sets `Cache-Control: private, no-store` explicitly
  (one shared `jsonResponse` helper in `services/http.js`), since
  Cloudflare's edge can otherwise cache GET responses by default.

## Notable bugs found and fixed during QA

- **Auth fallback leak**: the field page's dev-only fixture fallback didn't
  distinguish "worker unreachable" from "401 unauthorized" — an
  unauthenticated visit could render fixture data instead of redirecting to
  the gate. Fixed; the gate's own `?still=1` preview degrades to an empty
  board instead.
- **Missing GA hook**: the reader never exposed a zoom-change callback, so
  `artifact_zoom` silently never fired. Added `onZoomChange`.
- **Session-date drift**: uploading a revision with the date field defaulted
  to today created a *new* session/chrono tick instead of staying pinned to
  the doc's original meeting date. Fixed — revisions always inherit the
  first version's session now, confirmed via a real upload with a
  deliberately different date.
- **Connector shape didn't match the design**: `_drawConnector` interpolated
  its curve control points toward the card's x-position, producing a
  diagonal line. The design's actual hand-authored path
  (`M300 228 C305 272, 299 304, 303 336`) is almost perfectly vertical - a
  small wobble directly below the tick, independent of where the card sits.
  Rewrote the path to match that shape instead of interpolating toward
  `cardX` (which is no longer a parameter of this function at all). Also
  fixed a related dasharray bug along the way: the stroke's hardcoded
  `stroke-dasharray` length would silently clip a longer path (the dash
  pattern repeats "on/off" for that fixed length rather than scaling to the
  path); now measured via `getTotalLength()`.

## Not fully verified

- True narrow-viewport rendering (375/414/768) — available browser
  automation couldn't force a genuine narrow CSS viewport; verified
  statically instead (correct `@media` breakpoints with real layout changes
  exist for gate/field/reader).
- `prefers-reduced-motion` — code path matches spec intent, not visually
  confirmed in a live reduced-motion session.
- Lighthouse / formal a11y audit — not run.

## Route mounting decision (2026-08-25)

Decided and wired into `wrangler.toml`'s `[env.production].routes` (see
`client-archive-worker/README.md` for the full rationale): one route
pattern per exact endpoint this worker implements
(`/clients/unlock/*`, `/clients/lock/*`, `/clients/board/*`,
`/clients/artifact/*`, `/admin`, `/admin/*`), not a single blanket
`tukugroup.com/clients/*`. (The URL shape shown here reflects the reshape
below - the client slug had to move from the middle to the end of each
path once the middle-wildcard constraint surfaced during actual deploy.)

Why not the blanket pattern: `tukugroup.com` is served by Cloudflare Pages,
which hosts every client's static gate/field HTML - not just `full-charge`,
but the other 6 client-archive slugs too (`voyj`, `skate-iq`, etc.), plus
the client index itself. A blanket `/clients/*` route would intercept every
one of those page loads at the Cloudflare routing layer before Pages ever
saw them, and this worker has no static assets to serve in response - it
would 404 pages that work fine today. Scoping to the worker's actual
endpoint shapes means a plain page load never matches any pattern and
reaches Pages unchanged, while only genuine API calls (unlock/lock/board/
artifact/admin) reach the worker - for any client slug, not just
full-charge, since the pattern uses `*` for the slug position.

This is config only so far - `wrangler.toml` has the routes, but the worker
has not been re-deployed with them, and `dev` has not been merged to `main`.
Both remain held for explicit approval before anything on tukugroup.com
actually changes.

Caught via `wrangler deploy --dry-run --env production` before it mattered:
wrangler does not inherit top-level `d1_databases`/`r2_buckets`/
`kv_namespaces` into named environments. Without env-scoped copies of all
three, a production deploy would have shipped a worker with no database,
storage, or rate-limit access at all. Added
`[[env.production.d1_databases]]` etc., kept in sync with the top-level
bindings; dry-run now shows all three present for `--env production`.

## Route URL reshape (2026-08-25)

The first real production deploy attempt (`wrangler deploy --env
production`) surfaced something `--dry-run` couldn't have caught, because
route validation only happens against the real API: all 4
`/clients/*/unlock|lock|board|artifact/*` patterns were rejected with error
code 10022 - Cloudflare Workers Routes only allow a wildcard at the start
of the hostname or the end of the path, never in the middle. A pattern with
the client slug in the middle of the path (`/clients/*/unlock`) is
structurally invalid, not just a syntax slip.

Worse: the route-set PUT is atomic. Because 4 of the 6 patterns were
invalid, **none** of the 6 were created - including `/admin` and
`/admin/*`, which were individually valid on their own. Confirmed nothing
was actually live by testing `https://tukugroup.com/admin` directly (it
returned the homepage - Cloudflare Pages' own fallback for an unmatched
path, not this worker). No unintended exposure happened, but it was closer
than a `--dry-run` alone would have suggested; **verify routes with a real
request after deploying, don't just trust an error-free CLI output.**

Fix: reshaped every client-facing endpoint so the slug is the LAST path
segment - `/clients/unlock/:slug`, `/clients/lock/:slug`,
`/clients/board/:slug`, `/clients/artifact/:slug/:id` (was
`/clients/:slug/unlock` etc.). This makes every route pattern a simple
trailing wildcard, which Cloudflare allows, without losing the "any client
slug works, no wrangler.toml changes per client" property. Touched:
`src/index.js` (route table), `src/services/db.js` (generated artifact
`url`/`download_url`), `src/handlers/unlock.js` (cookie `Path` widened from
`/clients/<slug>` to `/clients`, since the API paths no longer share that
literal prefix - safe, because the cookie's signed `clientId` is still
checked server-side regardless of how broad the browser's Path scoping is),
and both frontend files (`website/clients/full-charge/index.html`,
`field/index.html`, `field/board.js`) plus the local test proxy's patterns.
Re-verified the entire flow locally (unlock → board → artifact → reader →
lock, plus a fresh admin upload) against the new shape before
redeploying - see the note above about not trusting dry-run/deploy success
alone.

## Production deploy (2026-08-25)

Worker deployed with `wrangler deploy --env production`; all 6 routes
accepted this time (the reshaped, trailing-wildcard-only patterns above).

One more environment-scoping gap surfaced immediately after, same class as
the D1/R2/KV bindings issue: **secrets are also scoped per named
environment**, and `wrangler secret put ADMIN_TOKEN`/`COOKIE_SECRET`
(without `--env production`) had only ever set them on the *default*
environment - the one actually deployed to `tukugroup.com` had neither.
`wrangler secret list --env production` showed `[]` where the default
environment showed both. `/admin/clients` with the correct token was
returning `unauthorized` because `env.ADMIN_TOKEN` was simply undefined in
production. Fixed by running `wrangler secret put <NAME> --env production`
for both secrets (fresh random value for `COOKIE_SECRET` - no live sessions
existed yet to preserve; same value as before for `ADMIN_TOKEN` so the
credential in `credentials.local.txt` stays correct).

**General lesson from this whole session, worth restating**: for this
worker, `--dry-run` only validates config shape (bindings, vars) - it does
not validate routes against Cloudflare's actual API, and it says nothing
about which named environment secrets live in. Every deploy needs a real,
live request against the actual production behavior afterward, not just a
clean CLI exit code.

Full verification performed directly against `https://tukugroup.com` after
both fixes: unlock (wrong passphrase rejected, correct passphrase
succeeds) → board (real D1 data) → artifact (real R2 content streamed) →
lock (cookie cleared) → admin dashboard (token-gated, real client list).
Confirmed zero collateral impact: `/clients/voyj/` still serves its own
unrelated static placeholder untouched, and `/clients/full-charge/` itself
still serves the OLD static placeholder (expected - `dev` hasn't been
merged to `main` yet, so Pages hasn't published the new gate/field pages).

## Still open

- **Merging `dev` to `main`** — needed for the static frontend
  (gate/field/reader) to actually deploy via Cloudflare Pages. The backend
  is fully live; only the client-facing pages are still pending.

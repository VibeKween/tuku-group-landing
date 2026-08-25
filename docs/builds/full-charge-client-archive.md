# BUILD PROGRESS — Full Charge Client Archive

**Feature:** Private per-client archive (`/clients/full-charge/`)
**Spec:** `website/design_handoff_full_charge/README.md`
**Branch:** `dev` — 3 commits pushed to `origin/dev`, not merged to `main`

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
(`/clients/*/unlock`, `/lock`, `/board`, `/artifact/*`, `/admin`,
`/admin/*`), not a single blanket `tukugroup.com/clients/*`.

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

## Still open

- **Deploy the worker with the new production route** (`wrangler deploy --env production`) — config is in place, not yet applied.
- **Merging `dev` to `main`** — needed for the static frontend to actually
  deploy via Cloudflare Pages.
- **Production deploy approval** — per `CLAUDE.md`'s workflow, both of the
  above need an explicit go-ahead before anything on tukugroup.com changes.

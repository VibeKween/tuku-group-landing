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

## Still open

- **Route mounting under tukugroup.com** — deliberately deferred. Whatever
  pattern is chosen must pass through to the static gate/field pages and
  only intercept the worker's own API-shaped paths (a blanket `/clients/*`
  route would 404 every static client page).
- **Merging `dev` to `main`** — needed for the static frontend to actually
  deploy via Cloudflare Pages.
- **Production deploy of the worker to the real domain** — requires explicit
  approval per `CLAUDE.md`'s workflow.

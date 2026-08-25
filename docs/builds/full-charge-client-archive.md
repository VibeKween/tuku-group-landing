# BUILD PROGRESS — Full Charge Client Archive

**Feature:** Private per-client archive (`/clients/full-charge/`)
**Spec:** `website/design_handoff_full_charge/README.md`
**Branch:** `dev` (worktree at `01-TUKU-GROUP-dev/`) — nothing committed yet

---

## Current State

| Track | Status | Notes |
|-------|--------|-------|
| A. Data + auth + admin upload | ✅ Built, tested | `client-archive-worker/` — D1, R2, KV, PBKDF2 auth, append-only versioning |
| B. Gate (`/clients/full-charge/`) | ✅ Built, tested | Real HTML/CSS/JS from `Full Charge Password.dc.html` |
| C. Field (`/clients/full-charge/field/`) | ✅ Built, tested | Board/motion/drag from `Full Charge Field.dc.html` |
| D. Reader (`field/reader.js`) | ✅ Built, tested | Self-contained module, consumed by C |
| E. Full QA pass | ◐ Partial | See below — some checks blocked by tooling, not by the build |
| Deploy | ⏳ Not started | Blocked on decisions below, needs explicit approval per `CLAUDE.md` |

---

## What's been verified

Ran the whole system together (static pages + worker on one origin, via a local
proxy standing in for the eventual production route) and drove it through a
real browser:

- Wrong passphrase → shake + `NOT THAT ONE.`; correct passphrase → cookie set → field
- Cookie is scoped per-client (can't be replayed against a different client id)
- Board payload matches `board.fixture.json`'s shape exactly, rendered from live D1 data
- Load sequence (headline rotation → zoom to latest pin → rest on final word → squiggle draw)
- Drag/pan on the board, `THE BIG PICTURE` / `LATEST PIN` framing
- Reader: opens real R2-streamed artifact content, zoom, wheel-forwarding, `OPEN FULL`, `SAVE A COPY` (correct `Content-Disposition` filename), close returns to the same board view
- `LOCK` clears the cookie server-side (confirmed via a follow-up 401, not just the redirect)
- **Append-only versioning**: re-uploaded the same doc through the admin endpoint — board shows only the new version as latest, but the old version's row and R2 object are still directly fetchable by id. Nothing is overwritten.
- Rate limiting on unlock attempts (5 per 15 min per IP+client) confirmed via 429s
- Zero console errors across the full flow
- GA custom events fire with correct payloads: `artifact_open`, `artifact_close` (with `duration_ms`), `artifact_zoom` (added during this QA pass - see below), `board_fit`, `board_latest_pin`, `board_drag` (fires once per session, not per pointermove), `lock`, `client_unlock_attempt`

### Bug found and fixed during testing

The field page's offline-dev fallback (meant only for developing
`field/index.html` standalone without the worker running) didn't distinguish
"worker unreachable" from "401 unauthorized" — a direct, unauthenticated visit
to `/clients/full-charge/field/` would render the local fixture instead of
being bounced to the gate. Fixed: a real 401 now redirects to the gate; the
gate's own unauthenticated `?still=1` preview iframe (which must never
redirect, since it's nested inside the gate) degrades to an empty/generic
board instead of leaking fixture data. Both paths re-verified after the fix.

A second, smaller gap surfaced while verifying GA coverage against the plan:
the reader module never exposed a zoom-change hook, so `artifact_zoom` (one
of the events promised in the build plan) was never actually wired. Added
`FullChargeReader.onZoomChange(callback)` (mirrors the existing `onClose`
pattern) and wired it in `board.js` next to the `onClose` GA call. Verified
firing with the correct `{artifact_id, zoom}` payload after a real UI click.

### Fidelity check against design reference screenshots (2026-08-24)

User supplied reference screenshots from `design_handoff_full_charge/screens/`
(gate x2, field x2, reader x1) to verify against. Cross-checked structure
directly against `Full Charge Field.dc.html`'s source, not just the images:

- **Card preview scale/fade**: confirmed byte-identical CSS to the design
  (1440x1900 iframe, `scale(0.3611)`, same gradient stops) - no fix needed.
  What looked like a discrepancy in an earlier screenshot was just a
  different board zoom level at capture time.
- **"WHAT ARE WE ASKING?" caption** was missing from the live view - not a
  code bug, the local test session just hadn't been given a `label` (an
  admin-upload test-data gap, patched directly in local D1 for verification).
  The code was already correctly conditional on `session.label`.
- **Plum dashed "reach" line**: genuinely missing. The design (lines 46-48)
  draws this unconditionally - a permanent decorative mark from the latest
  card toward the next unused chrono tick, not something that only appears
  once a second real artifact exists. `board.js` only drew connectors
  between a tick and its own real artifact, so with one artifact this mark
  never appeared. Added `_drawFutureReach()`, called once after all real
  artifacts render, reaching toward the first tick in `TICKS` not yet used
  by a session. Verified visually in both the zoomed-to-latest-pin and
  zoomed-out ("the big picture") views - matches the reference structure.

### Not fully verified (tooling limitation, not a known defect)

- True mobile-viewport rendering (375/414/768) — the available browser
  automation couldn't force a genuine narrow CSS viewport in this
  environment. Verified statically instead: correct `@media` breakpoints
  exist and contain real layout changes in the gate (480px), field (640px,
  per spec), and reader (375px, the exact width the spec calls out for
  re-checking the toolbar).
- `prefers-reduced-motion` — code path exists and matches the spec's
  intended behavior (skip straight to rest state, squiggle pre-drawn); not
  visually confirmed in a real reduced-motion browser session.
- Lighthouse / formal a11y audit — not run.

---

## Admin dashboard (2026-08-25)

User asked how artifact upload/versioning should work day-to-day, thinking
forward to many clients and many artifacts, not just the one Full Charge
artifact that exists today. Considered putting a small "admin" trigger on
each client's own field page (a drawer overlay), but that doesn't scale -
managing N clients would mean visiting N private pages. Went with a
centralized `/admin` dashboard instead: a client picker (pulled from the
`clients` table, with a per-client doc count), per-client version history,
and the drag-and-drop upload panel scoped to whichever client is selected.
Adding a new client is just another row - no new UI to build per client.

Backend additions (`src/services/db.js`): `listClientsWithCounts` and
`listArtifactHistory` (every version for a client, not just `is_latest`, so
the admin can see what a re-upload is about to supersede). Both gated by
the same `isAdminAuthorized` check as the existing upload endpoint - no new
auth path introduced.

Verified end-to-end in the browser: connected with the token, saw both
clients with correct doc counts, selected Full Charge, saw its v1 history,
uploaded the same doc again through the real drag-and-drop flow (file_upload
tool simulating a real drop) - history table updated in place with v2 marked
LATEST and v1 preserved below it, no page reload, zero console errors.

## Admin dashboard restyle + design/logic separation (2026-08-25)

User wants different visual aesthetics per client portal as clients get
onboarded, and asked whether the admin dashboard's design and the data
logic are coupled - explicitly wanting to avoid creating dependencies that
would limit that later. Answer: they're already separate, by construction.
The backend only knows a generic `client / sessions / artifacts` shape and
streams whatever HTML a client's artifact is; it has no opinion on visual
style. Each client's actual portal (gate + field + reader) is its own
hand-built static page set that happens to call the same four generic
endpoints (`unlock`, `lock`, `board`, `artifact/:id`) - a future client
with a completely different concept just gets new pages calling the same
contract, no backend changes required. The admin dashboard is a third,
separate thing: an internal operator tool, styled consistently as *the
user's own* design language, independent of any individual client's portal
style.

One soft coupling flagged, not fixed (no second client exists yet to
justify it): `board_x`/`board_y`/`connector_color` are Full-Charge-specific
column names in the shared `artifacts` table. Nullable, so harmless today.
If a future client's portal needs meaningfully different per-artifact
metadata, that's the point to generalize into a flexible JSON column rather
than adding more client-specific columns.

Restyled the dashboard itself (`src/admin-page.js`) to match
tukugroup.com's actual design system rather than an ad-hoc dark tool look -
pulled real values from `website/css/main.css` and `website/book/booking.css`:
JetBrains Mono, black/white/gold with blue-accent interactive states,
hairline borders, no rounded corners, opacity/color-based hover states (no
boxed borders). Re-tested the full connect -> select client -> view history
-> upload -> history-refreshes-in-place loop after the restyle - v3 uploaded
correctly, LATEST badge moved, v1/v2 preserved, zero console errors.

## Admin dashboard type/shape refinement (2026-08-25)

User feedback after seeing it live: buttons too square, type too large
overall. Softened corners (buttons `border-radius: 6px`, inputs and the
drop zone `3-6px`, selected client row now a soft rounded highlight instead
of a hard-edged underline) and tightened the whole type scale down a step
(base `15px`, h1 `1.375rem`, body/table text `0.8125-0.875rem`, labels/table
headers smaller still). Re-verified live, console clean.

## Session date locking (2026-08-25)

Real bug, surfaced by the user noticing the pinned date had moved after the
"full workflow" walkthrough: uploading a revision through the admin
dashboard, with the date field defaulting to today, created a *new*
session/chrono tick instead of staying attached to the doc's original
meeting date. The pinned date must represent when the meeting happened and
must never move just because a later revision gets uploaded on a different
day.

Root cause: `finalizeArtifactVersion` always ran `findOrCreateSession` using
whatever `occurred_on` came from the form, with no distinction between "this
is a doc's first version" and "this is a revision." Fixed in
`src/services/db.js`: `resolveNextVersion` now also resolves the prior
version's `session_id` and `occurred_on`; `finalizeArtifactVersion` reuses
that session directly for any revision (`priorId` set), and only calls
`findOrCreateSession` for a doc's true first upload. The download filename's
date is likewise locked to the original session's date for revisions, not
the upload form's date.

Card UI (`board.js` + `index.html`): added a `v{n} · updated {date}` note in
the card footer, visually separate from the pinned tick date, so version
history stays visible without the meeting date ever appearing to move.
Admin dashboard: added a hint under the Session date field clarifying it
only applies to a doc's first upload.

Verified by manually correcting the (already-wrong) local test data to what
the fix would have produced, then uploading a real v4 through
`/admin/artifacts` with a deliberately different `occurred_on` - confirmed
the response still resolved to the original session id and the 8.19.26
filename date, and the field correctly rendered a single tick with the new
version noted on the card.

## Cache-Control hardening + card weight tweak (2026-08-25)

User asked whether the field reliably shows the latest admin-uploaded data.
It already did (every API response is generated fresh from D1, no app-level
caching), but none of the JSON endpoints set an explicit `Cache-Control`
header - fine today, but once this sits behind Cloudflare's edge, GET
responses without a directive can get cached there by default. Consolidated
the three duplicated local `json()`/`jsonResponse()` helpers across
`board.js`, `admin.js`, and `unlock.js` into one shared
`jsonResponse` in `services/http.js` that always sets
`Cache-Control: private, no-store` (matches what `artifact.js` already did).
Verified headers on both `/clients/full-charge/board` and `/admin/clients`.

Also: the card's new `v{n} · updated {date}` note (see session-locking fix
above) was visually too heavy in accent blue - it read as a call-out competing
with "OPEN ->" rather than quiet metadata. Changed to the same muted grey as
the "HTML" label at reduced opacity.

## Decisions made during this build

- **Separate Worker** (`client-archive-worker/`), not an extension of
  `workers/` (`tuku-booking-api`) — isolates blast radius.
- **Admin upload uses a distinct `ADMIN_TOKEN` secret**, never the client
  passphrase — a client-side passphrase leak must not also grant upload access.
- **Artifact versioning is append-only** — every upload is a new D1 row and a
  new R2 key (`<client>/<doc-slug>/v<n>.html`); `is_latest` moves forward,
  nothing is deleted or overwritten. This is what makes the drag-and-drop
  admin UI safe to use repeatedly without losing history.
- **GA**: reuses the existing G-5KTM9YBETS property with custom events
  (unlock attempts, board interactions, artifact open/close with dwell time,
  lock) rather than a separate stream — this is deliberately a low-traffic,
  high-signal surface, not something that needs its own property.
- Passphrase hashing is PBKDF2 via WebCrypto (Workers has no native
  bcrypt/argon2 — the spec's suggestion of either wasn't runnable as written).

## Still open

- **Route mounting under tukugroup.com** — not decided yet (deliberately
  deferred by request). `client-archive-worker/wrangler.toml` documents the
  requirement: whatever pattern is chosen must pass through static
  gate/field pages to the site and only intercept the worker's own API-shaped
  paths (`/clients/:id/unlock`, `/lock`, `/board`, `/artifact/:id`,
  `/admin*`) — a blanket `/clients/*` route would 404 the static pages.
- **Cloudflare provisioning** — no real D1 database, R2 bucket, KV namespace,
  or secrets exist yet. Checklist is in `client-archive-worker/README.md`.
- **Production deploy** — requires explicit approval per `CLAUDE.md`'s
  workflow; nothing has been pushed past `dev`.

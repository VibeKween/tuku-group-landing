# Handoff: TUKU balloon overlay + client index

## Overview
Two connected pieces for tukugroup.com:

1. **Balloon overlay** — a smiley balloon rises from below the fold on the landing page, drifts on a soft breeze near the top-right, and can be grabbed and repositioned. Attached to it is a small animated-gradient link labelled "clients only!" that leads to the client archive.
2. **Client index page** — the destination. A list of client rooms.

The balloon is the entry point. The index is where it goes.

## Scope of this handoff — read first
**Build only two things: the balloon overlay and the client index page.**

Out of scope for now, and explicitly not to be built:
- Passphrase / password protection of any kind
- Individual client rooms behind the index
- The Full Charge board

Those are still in design. The index should render its list of clients as inert — visible, correctly styled, not yet linked to anything. Leave the rows as plain markup a later pass can wire up. Do not scaffold, stub, or anticipate the gate or the rooms.

## About the design files
Everything in this bundle except `tuku-balloon.js` is a **design reference authored in HTML** — a prototype showing intended look and behavior, not production code to lift wholesale. The task is to recreate these designs in the target codebase (VibeKween/tuku-group-landing, static HTML/CSS/JS, no build step) using its established patterns.

`tuku-balloon.js` is the exception: it is **production-ready, dependency-free, and meant to ship as-is**. Drop it in and point one script tag at it.

The `.dc.html` prototypes each load a sibling `support.js` runtime (included). Open them directly in a browser to see the intended motion — reading the source alone will not convey the timing.

## Fidelity
**High-fidelity.** Colors, typography, motion timing, and easing are final. Match them.

---

## Task 1 — Ship the balloon overlay

### What to do
Copy `tuku-balloon.js` and `balloon-smiley.png` into the repo and add one tag to the landing page template:

```html
<script src="/tuku-balloon.js" defer
        data-image="/images/balloon-smiley.png"
        data-href="<DESTINATION>"></script>
```

The script appends its own fixed-position overlay to `<body>`. No wrapper element, no markup change, no iframe. The overlay field is `pointer-events: none` everywhere except the balloon and its label, so nav, links, and scroll underneath behave normally.

### Decide the destination path yourself
`<DESTINATION>` is deliberately unset. **Determine it from the repo's existing content and URL conventions** — look at how `ideas/`, `signals/`, `studio.html`, `approach.html`, and `book/` are structured and named, and pick the path that fits. `/clients/` is a reasonable default but is not a decision that has been made. Whatever you choose, it must be consistent with the sitemap and `robots.txt` handling of the other sections.

**The client page is not gated.** No auth, no server-side protection, no login, and no passphrase step in this pass — see the scope note at the top. Do consider whether the page belongs in `sitemap.xml` and whether it should be `noindex`; the label reads "clients only!" so an unlisted-but-public page is the intent.

### Repo caution
The repo carries two parallel trees: root (`index.html`, `css/`, `images/`) and `website/` (a near-identical mirror). Establish which one actually deploys before placing files, and if both are live, update both.

### Script API
Data attributes on the script tag: `data-image`, `data-href`, `data-label`, `data-rise-delay` (s), `data-rise-duration` (s), `data-balloon-size` (px), `data-breeze`, `data-z-index`, `data-once`, `data-auto="false"`.

Programmatic: `TukuBalloon.mount({...})` / `TukuBalloon.unmount()` / `TukuBalloon.defaults`.

### Motion spec (already implemented — for review, not reimplementation)
- **Rise**: 2s delay, then 43s from below the fold to a resting inset of 30px top. Easing `1 - (1-p)^2.2`, with a horizontal sine sway of ±4.5vw over 2.4 cycles.
- **Float**: layered sine breeze (periods ~0.041–0.14 Hz), spring pull toward rest, a soft containment field keeping it in the upper-right band (top 34% of viewport, right 70% of width), edge bounce at 0.5 restitution, and per-frame damping of `0.5^dt`.
- **Bob**: 5.6s ease-in-out, ±10px vertical.
- **Sway**: 7.2s ease-in-out alternate, -3.4deg to +3.6deg, transform-origin 50% 12%.
- **Label gradient**: 1.5s ease-in-out cycle across #D63FB8 → #A855F7 → #F472B6 → #A855F7 → #D63FB8, 300% background-size, clipped to text.
- **Drag**: pointer capture on the image; on release the balloon parks where it was left and physics stop. This is intentional — the visitor gets to keep it where they put it.

### Reduced motion
Handled. Under `prefers-reduced-motion: reduce` the script mounts a static variant: balloon in its resting position top-right, label intact, every animation and the drag physics disabled. The entry point survives; only the motion is dropped. Override with `respectReducedMotion: false`.

### Persistence
Default is every page load. `data-once="true"` limits it to once per session via `sessionStorage` (no cookie-banner implication). **Recommendation: landing page only, every load** — include the script tag on the home template and nowhere else. The rise is the point; suppressing it costs more than the repetition does.

### Before it ships
- Confirm the transparent PNG survives whatever image pipeline the host runs.
- Check `z-index` (default 2147483000) against any existing fixed nav or banner.
- Verify at 375px: the balloon caps at `min(248px, 44vw)` and reserves a right-edge inset for the label, but check against the real header.

---

## Task 2 — Client index page

Design reference only. Recreate in the repo's static HTML/CSS/JS idiom.

**Build the index view and nothing past it.** `Client Archive.dc.html` is the reference, but it prototypes more than is being built: it also contains a passphrase step and inner client rooms. Ignore both. Take the index — the page title, the list of client names, the type and spacing — and stop there.

The client rows are not links yet. Render them as static text at their final size, weight, and rhythm. No hover treatment implying navigation, no href, no click handler, no disabled state, no "coming soon". They should simply sit there looking correct.

A later pass adds the gate and the rooms. This pass does not prepare for it.

---

## Design tokens
| Token | Value |
| --- | --- |
| Label gradient | #D63FB8, #A855F7, #F472B6 |
| Label underline | #D63FB8, 1px, offset 2px, skip-ink none |
| Label type | JetBrains Mono 600, 0.7rem, 0.06em tracking, width 4.6em |
| Balloon shadow | `drop-shadow(0 14px 26px rgba(20,30,50,.16))` |
| Balloon size | `min(248px, 44vw)` |
| Overlay z-index | 2147483000 |
| Viewport padding | 24px (rest position 30px top) |

Site type and color otherwise follow the repo's existing `css/main.css` and `BRAND-GUIDELINES.txt` — do not introduce new site-level tokens.

## Assets
- `balloon-smiley.png` — transparent PNG, the balloon itself. Ships.
- Everything else in the prototypes is CSS.

## Files in this bundle
| File | Role |
| --- | --- |
| `tuku-balloon.js` | **Production.** The standalone overlay. Ship this. |
| `balloon-smiley.png` | **Production.** The balloon image. |
| `Balloon Implementation Note.dc.html` | The written note this README expands on. |
| `TUKU Landing Balloon.dc.html` | Prototype: balloon over the landing page. Reference for motion. |
| `Client Archive.dc.html` | Prototype. **Use the index view only** — it also contains the passphrase step and client rooms, which are out of scope. |
| `support.js` | Runtime the `.dc.html` prototypes need to open in a browser. Not for production. |

## Repo
`VibeKween/tuku-group-landing`, branch `main`. Static site, no build step. Root and `website/` are parallel trees — confirm the deploy target first.

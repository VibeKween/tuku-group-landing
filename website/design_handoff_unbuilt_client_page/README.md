# Handoff: Unbuilt Client Page ("You weren't supposed to find this page") + Avatar Machine

## Overview
A placeholder page served for client entries in the Tuku Group client archive that have no
public page yet. It refuses the visitor in the archive's voice, then offers a small reward:
a procedurally drawn animal avatar the visitor can reroll and download as a profile picture.

Two pieces:
1. **Placeholder page** — `Unbuilt Client Page.dc.html` (approved). `Client Placeholder Options.dc.html`
   holds the earlier explorations for context only.
2. **Avatar Machine** — the generator. `avatar-gen.js` is the engine (framework-free);
   `Avatar Machine.html` is a standalone 20-card grid version of the same engine.

## About the Design Files
The files in this bundle are **design references created in HTML** — prototypes showing the
intended look and behavior, not production code to paste in. Recreate the page in the target
codebase using its existing patterns (React/Next, Vue, Astro, etc.). If no environment exists
yet, pick the framework that fits the rest of tukugroup.com and implement there.

**Exception:** `avatar-gen.js` is intentionally plain, dependency-free ES5-compatible JS and
*can* be used as-is (or ported nearly line-for-line). It is pure logic — seeded PRNG, path
math, SVG string assembly, PNG export — with no framework assumptions.

## Fidelity
**High fidelity.** Colors, type sizes, spacing, copy, and interaction behavior are final.
Recreate 9a to the pixel. The other options in the same file (1a–8b) are earlier explorations,
kept for context only — do not build them.

## Screens / Views

### 1. Unbuilt client page — **build this**
File: `Unbuilt Client Page.dc.html` (option 9a in the exploration file is its origin).
**Purpose:** tell the visitor this client's page is not open, then give them something to play with.

**Layout** — full-viewport, vertically and horizontally centered, responsive without breakpointed rewrites.
- Root: `min-height: 100dvh`, flex column, `align-items: center`, `justify-content: center`,
  `gap: clamp(28px, 5vh, 64px)`, `padding: clamp(28px, 5vh, 64px) clamp(24px, 6vw, 64px)`,
  `text-wrap: pretty`. Background `#ffffff`, text `#000000`.
- `.pair`: CSS grid, `grid-template-columns: minmax(0, 1.25fr) minmax(0, 0.75fr)`,
  `align-items: center`, `gap: clamp(36px, 5vw, 72px)`, `max-width: 940px`.
  The copy track is deliberately wider so the headline holds its authored two-line break.
- `.copy`: flex column, `gap: clamp(14px, 2vw, 20px)`.
- `.art`: flex column, centered, `gap: clamp(14px, 2.2vw, 20px)`,
  `max-width: min(340px, 46vh)` — capped against viewport height so the centered block never scrolls.
- Footer sits in normal flow under the pair (centered), 11px at 35% opacity.
- Under 780px: `.pair` becomes one column, `max-width: 420px`, items centered, copy text centered,
  `.art` `max-width: min(320px, 76vw)`.

**Components**
1. Headline — `You weren't supposed` / `to find this page.` — static, present on load.
   `font-size: clamp(1.5rem, 3.6vw, 2rem)`, weight 300, line-height 1.2, letter-spacing −0.035em,
   `white-space: nowrap` with the authored `<br>` (must always read as two lines).
2. Body line 1 — `Something is happening back there, but it's not for you.`
3. Body line 2 — `Here is an animal instead.`
   Both: `font-size: clamp(0.875rem, 2.2vw, 0.9375rem)`, line-height 1.75, black at 60% opacity.
   Each paragraph contains a `visibility: hidden` copy of its full text to reserve the box, with the
   typed text absolutely positioned on top — this prevents any reflow while typing.
4. Avatar — square, `width: 100%` of `.art`, `aspect-ratio: 1`, cursor pointer. Click = reroll.
5. Controls — centered under the avatar, 13px, row `gap: 18px`:
   `try again` (hover 45% opacity) · `/` at 25% · `adopt` (55% opacity, hover 100%).
   Both are 44px minimum touch targets.
6. Footer — `© 2026 Tuku Group, LLC.`

**Motion — the reveal is the joke; keep the timing**
Single 34ms tick driving a character index:
- Headline is already on screen at load. Nothing animates it.
- **Lead-in:** 26 ticks (~0.9s) of nothing.
- Line 1 types one character per tick (~1.9s), hairline caret blinking at the end of it.
- **Punchline pause:** 78 ticks (~2.6s) with the caret parked at the end of line 1.
- Line 2 types (~0.9s), caret moves to it.
- When line 2 finishes, the avatar starts shaking its head "no":
  `animation: shakeNo 7s ease-in-out infinite`, `transform-origin: 50% 88%`.
  `@keyframes shakeNo` shakes in the first 24% (rotate −3.2° → +3° → −2.6° → +2.2° → −1.2° → 0,
  with ±5px x-offset) then rests for the remainder, so it re-shakes roughly every 7 seconds.
- Caret: 1px wide, `height: 1.05em`, `vertical-align: -0.16em`, `margin-left: 0.12em`,
  `@keyframes blinkCursor` 1s steps(1) — visible only on the line currently typing.
- Respect `prefers-reduced-motion` in production: render both lines complete and skip the shake.

### 2. Avatar Machine (standalone toy, optional)
A 5 × 4 grid of 20 small square cards that fits its container without scrolling
(full-height flex layout; `grid-template-rows: repeat(4, minmax(0,1fr))`; each `.tile` is
`aspect-ratio: 1; height: 100%; justify-self: center`). Controls: **Shuffle** (new seeds from
the same base), **New seed** (new base), **Download all**, tap any card to reroll just that one,
per-card **PNG** button (visible on hover; always visible under 640px width).
Page chrome: JetBrains Mono / ui-monospace, background `#faf9f7`, ink `#111`, 1px borders,
uppercase 11px buttons with 0.12em tracking that invert on hover.

## Interactions & Behavior
- **Reroll**: clicking the avatar, or `try again`, assigns a new random seed and redraws. No animation.
- **Adopt / download**: rasterizes the current SVG to a 1024 × 1024 PNG on a white background,
  injects metadata (below), and triggers a download named
  `i-went-to-tukugroup.com-and-all-i-got-was-this-lousy-animal.png`.
- **Determinism**: a seed always produces the same animal. Seeds are safe to persist or share in a URL
  (`?a=<seed>`) if you want linkable avatars — not implemented in the prototype.
- No hover state on the avatar itself; cursor: pointer is the only affordance.
- Responsive: below ~820px, stack to a single column — copy first, avatar (max 320px wide) below,
  controls under it; padding 24px.

## Accessibility
- Each generated SVG carries `role="img"`, an `aria-label`, a `<title>` and a `<desc>`:
  - title: `A lousy animal from tukugroup.com`
  - desc: `Procedurally drawn animal avatar. Seed <seed>. Made by Tuku Group, LLC — https://tukugroup.com`
- Controls are text, not icons. Make them real `<button>`s in production (the prototype uses spans).
- Contrast: all copy is black on white (or white on black in earlier options) — AA+ at every size used.

## PNG metadata
Exports embed PNG `tEXt` chunks (written manually after the IHDR chunk — see `withMeta` in
`avatar-gen.js`; canvas `toBlob` alone cannot carry metadata):
Title, Description, Author (`Tuku Group, LLC`), Source (`https://tukugroup.com`),
Copyright, Software (`Tuku Avatar Machine`). Keep this behavior — it is how a downloaded avatar
points back to the site.

## State Management
Minimal, all local:
- `seed: number` — the current avatar (page); `baseSeed` + `seeds: number[20]` for the grid version.
- `reroll()` → new random seed; grid `shuffle()` → derive 20 seeds from the base via the seeded PRNG;
  `reseed()` → new base.
No data fetching, no persistence, nothing leaves the browser.

## Generator engine (avatar-gen.js)
- `mulberry32(seed)` PRNG drives every choice, so output is reproducible.
- **Sketch rendering:** every shape is drawn as three passes over the same points — a filled pass
  (jitter 0.6), a 2.2px ink stroke (jitter 1.5), and a thinner 55%-width stroke at 42% opacity
  (jitter 3.2). Points are smoothed with a Catmull-Rom → cubic Bézier conversion. This is what makes
  it read as pencil rather than flat vector; keep all three passes.
- **Independent weighted trait layers** (not one mutually exclusive style):
  ears (round 3 / point 3 / long 2 / floppy 3 / tiny 1.5 / tuft 1),
  snout (muzzle 3 / disc 2.5 / beak 1.5 / long 2 / none 1),
  eyes (dot 3 / ring 3 / sleepy 2 / googly 1.5 / wink 1.2),
  markings (none 2.5 / spots 2 / stripes 2 / patch 2 / blaze 1.5),
  horns (none 5 / cow 1.6 / goat 1.4 / antler 1.1 / nub 1.2),
  extras (none 3.4 / collar 1.6 / bow 1.2 / monocle 1 / hat 1.1 / tongue 1.2).
- SVG viewBox 0 0 200 200; head centered at (100, 96) with rx 46–60, ry 44–62.

## Design Tokens
Type
- Family: `'JetBrains Mono', ui-monospace, SFMono-Regular, Menlo, monospace` (Google Fonts, weights 300/400/500)
- Headline 36px / 300 / lh 1.15 / ls −0.035em
- Body 15px / 400 / lh 1.7
- Controls 13px / 400
- Footer & meta 11px / 400 (uppercase variants use 0.12–0.24em tracking)

Color
- Page white `#ffffff`; ink `#000000`; toy page ground `#faf9f7`, ink `#111111`
- Opacity ramp for secondary text: 0.6 body, 0.55 secondary control, 0.35 footer, 0.25 separator
- Avatar ink `#141414`
- Avatar fur/accent palette (bright, deliberately unexpected):
  `#FF3D6E`, `#FF7A00`, `#FFD400`, `#8AFF1F`, `#00E0A4`, `#00C2FF`,
  `#6B4BFF`, `#FF5CE1`, `#00FFD5`, `#C4FF00`, `#FF9E80`, `#B388FF`
- Avatar card grounds: `#FFFFFF`, `#FFF8E1`, `#F2FFE0`, `#E8F6FF`, `#FFEDF6`, `#F3ECFF`

Spacing — 72px page gutter, 60px column gap, 20px copy rhythm, 18px avatar-to-controls, 16px control gap
Radius — none, except the circular avatar variant (`border-radius: 50%`) in option 9b
Shadows — none in 9a

## Assets
None. Every graphic is generated at runtime; no image files, no icon set, no external requests
beyond the Google Fonts stylesheet.

## Mobile
- `Unbuilt Client Page.dc.html` is the responsive build: a single `auto-fit` grid that
  collapses to one stacked column under ~820px (copy first, avatar below at 100% width capped at
  380px, controls under it). Type scales with `clamp()` — headline 26 → 36px, body 14 → 15px.
  Page padding `clamp(28px, 7vw, 72px)`; uses `100dvh` so mobile browser chrome doesn't clip it.
- Both controls have a 44px minimum touch target.
- Avatar Machine on small screens: 3 columns with auto rows, page scrolls (the no-scroll fit only
  applies to desktop/embedded frames), per-card PNG buttons always visible on touch devices
  (`@media (hover: none)`), buttons at 40px min height.

## Files
- `Unbuilt Client Page.dc.html` — **the approved design.** Build this one.
- `Client Placeholder Options.dc.html` — all explorations; **build option 9a** (search `id="9a"`).
  Ignore 1a–8b (earlier directions) except as context.
- `avatar-gen.js` — the generator engine: PRNG, sketch renderer, trait pools, `avatar(seed)`,
  `download(seed, size, name)`, PNG metadata injection. Usable as-is.
- `Avatar Machine.html` — standalone grid version of the toy (self-contained, works offline).

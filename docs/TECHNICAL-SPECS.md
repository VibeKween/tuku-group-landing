<div align="center">

```
  @@@@@@@       @@@@@@@
 @@@@@@@@@     @@@@@@@@@
@@@@@@@@@@@   @@@@@@@@@@@
@@@@@@@@@@@@@@@@@@@@@@@@@@@
@@@@@@@@@@@@@@@@@@@@@@@@@@@
Craft over noise.
@@@@@@@@@@@@@@@@@@@@@
@@@@@@@@@@@@@@@@@
@@@@@@@@@@@@@
@@@@@@@@@
@@@@@
@
```

</div>

<div align="center">
<h2>TUKU GROUP technical specifications. Architecture, layout, and deployment reference.</h2>
</div>

```
//
```

**typography system**

| property | value |
|---|---|
| primary font | JetBrains Mono |
| weights loaded | 300, 400, 500, 600 |
| fallback stack | Courier New, monospace |
| base size (mobile) | 16px |
| base size (desktop) | 18px |
| body line height | 1.8 |
| font loading | Google Fonts CDN with preconnect |

The font is loaded via two preconnect hints and a single stylesheet link -

```html
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@300;400;500;600&display=swap" rel="stylesheet">
```

Typography hierarchy -

```
h1              brand name (TUKU GROUP)
h2              section headers (visually hidden, accessibility)
.philosophy-header   gold accent spans for key concepts
p               body text at 1.8 line height
```

Font synthesis is disabled globally with `font-synthesis: none` to prevent browser-generated bold/italic variations that break the monospace consistency.

```
//
```

**layout values**

```
max-width           600px centered content container
vertical spacing    80px between content blocks
vertical (mobile)   60px between content blocks
breakpoint          768px (single breakpoint, mobile-first)
section pattern     <section class="block"> for each concept
page wrapper        <main class="page">
```

The 600px container is the absolute constraint. No content breaks wider. On mobile, the container is fluid with padding. The single breakpoint at 768px handles the transition - there are no intermediate breakpoints.

```
//
```

**css architecture**

Single stylesheet at `css/main.css`. No preprocessor. No PostCSS. No utility classes.

Custom properties define the color system -

```css
--color-black: #000000
--color-white: #FFFFFF
--color-gold: #C19A4B
```

Extended blue palette for studio and payment pages is defined in `payment.css` -

```css
--color-blue-light: #f0f9ff
--color-blue-medium: #e0f2fe
--color-blue-accent: #5691c8
--color-blue-deep: #4a7ba7
```

Selection styling is branded - custom colors on text selection for consistency.

The CSS is mobile-first. Base styles target mobile. The single `@media (min-width: 768px)` query adds desktop adjustments - larger font size, wider spacing, layout shifts.

```
//
```

**html structure**

Every page follows the same pattern -

```html
<main class="page">
    <section class="block">
        <!-- single concept -->
    </section>
    <section class="block">
        <!-- next concept -->
    </section>
    <section class="block footer">
        <!-- contact section -->
    </section>
</main>
```

The footer section gets an additional `.footer` class for distinct styling. Philosophy headers use `<span class="philosophy-header">` for gold accent treatment inline within paragraphs.

```
//
```

**cloud background system**

`cloud-system-static.js` renders subtle animated cloud elements on the homepage background. Pure vanilla JavaScript - no canvas library, no animation framework.

The system is intentionally understated. Clouds drift slowly. They exist to add organic texture to the black and white palette without drawing attention.

```
//
```

**split-flap display**

The homepage features a terminal-style split-flap ticker that cycles through project names. Built in vanilla JavaScript. The animation mimics mechanical departure board displays - characters flip sequentially to reveal each project name.

This component lives in the main `index.html` and is self-contained.

```
//
```

**balloon overlay**

`tuku-balloon.js` mounts a fixed-position overlay on the homepage - a smiley balloon that rises from below the fold after a short delay, drifts near the top-right on a soft physics-based breeze, and can be dragged and left wherever the visitor drops it. Dependency-free, framework-free, ~6KB.

```
rise           2s delay, then 43s ease from below the fold to a 30px top rest
float          layered sine breeze + spring pull toward rest + edge bounce
bob / sway     5.6s vertical bob, 7.2s rotational sway, both CSS keyframes
label          "clients only!" - animated gradient text-fill, links to /clients/
reduced motion respected - static resting position, no physics, no drag
```

The field is `pointer-events: none` everywhere except the balloon and its label, so the rest of the page stays fully interactive. Mounts via `TukuBalloon.mount({...})` or auto-mounts from `data-*` attributes on its own `<script>` tag - see the tag in `index.html` for the current configuration.

```
//
```

**client archive**

The balloon's label links to `/clients/` - an index of client names, unlisted (`noindex`, not in `sitemap.xml`) but reachable by anyone who follows the balloon. Rows are real links to `/clients/<slug>/`.

Most client slugs still serve the same placeholder page - a typing-animation gag ("Oops. You weren't supposed to find this page") paired with a generative animal-avatar toy. The art area starts blank (a card, white on both faces) and flips over via a 3D `rotateY` transform once "Here's an" has been typed on the second line, with the reroll/download controls fading in after the flip completes - skipped entirely under reduced motion, which shows everything settled immediately.

The avatar engine (`clients/avatar-gen.js`) is framework-free: a seeded PRNG drives independently-weighted trait layers (ears, snout, eyes, markings, horns, extras), rendered as hand-sketched SVG paths, exportable as a PNG with embedded metadata pointing back to the site. Clicking the avatar or "remix" rerolls it; "adopt" downloads it.

```
slugs           of-the-culture, voyj, skate-iq, mfsp-io, full-charge, redacted, cryptogains
shared assets   clients/avatar-gen.js, unbuilt-client.css, unbuilt-client.js
per-client      clients/<slug>/index.html - identical body, unique metadata/canonical
```

As real client rooms get built, each slug's placeholder is replaced with actual content - the URL doesn't change. `full-charge` is the first: a passphrase gate over a spatial "field" board of session artifacts with an in-page reader, backed by its own Cloudflare Worker + D1 + R2 (`client-archive-worker/`, separate from the booking API worker). The backend is live on Cloudflare and provisioned with real data; the frontend is built and tested but only lives on the `dev` branch so far - see `CLAUDE.md`'s Client Archive section and `docs/builds/full-charge-client-archive.md` for current status. To add another client to this same system, follow `client-archive-worker/ONBOARDING-NEW-CLIENT.md`.

```
//
```

**generative art system**

The IDEAS case study pages use p5.js for full-viewport generative visualizations. Each page has a unique system -

| page | visualization |
|---|---|
| IDEAS hub | particle system - ideas in motion |
| OF THE CULTURE | orbital emergence - brand development |
| [REDACTED] | precision accumulation - documentation |
| INVISIBLE SCAFFOLDING | network connections - methodology |

The hero container uses safe viewport height and CSS containment for reliable mobile rendering -

```css
.hero {
    width: 100vw;
    height: 100vh;
    min-height: 100svh;
    contain: layout style paint;
}

#hero-art canvas {
    width: 100% !important;
    height: 100% !important;
    object-fit: cover;
    transform: translateZ(0);
}
```

`100svh` prevents iOS Safari address bar issues. `contain` isolates layout recalculation. `translateZ(0)` forces GPU compositing.

```
//
```

**payment integration**

The private portal at `/fewer-better-slower/` uses Stripe for payment processing. The backend runs on Node.js/Express in the `/payment/` directory.

Services offered through the portal -

```
consultation     $500
sprint           $5,000
retainer         $8,000/mo
```

The portal uses accordion-style service selection with the TUKU blue palette. The public `/studio.html` page mirrors this interface without payment processing.

Stripe integration uses Stripe.js on the frontend (PCI-compliant) and webhook verification on the backend. Credentials are never committed - they live in environment variables configured on the hosting platform.

```
//
```

**seo and social**

Structured data uses JSON-LD with Organization schema. Meta tags cover Open Graph and Twitter Card standards.

```
og:image        images/tuku-group-og-compact.png (1200x630)
twitter:card    summary_large_image
canonical       https://tukugroup.com/
robots          index, follow
sitemap         /sitemap.xml
robots.txt      /robots.txt
llm.txt         /llm.txt (LLM context file)
```

The `llm.txt` file provides structured context about TUKU GROUP for language models - services, methodologies, case studies, and technical capabilities.

```
//
```

**deployment**

| environment | url |
|---|---|
| production | https://tukugroup.com |
| preview | https://tuku-group-landing.pages.dev |
| legacy (deprecated) | https://vibekween.github.io/tuku-group-landing/ |

Cloudflare Pages deploys from the main branch automatically. DNS is managed through Cloudflare with nameservers at GoDaddy.

The dual directory structure requires syncing `/website/` (development) to root (production) before every commit -

```bash
cp website/index.html .
cp website/approach.html .
cp -r website/css .
cp website/cloud-system-static.js .
cp website/tuku-balloon.js .
cp website/images/balloon-smiley.png images/
cp -r website/clients .
```

Failing to sync means Cloudflare deploys stale root files while `/website/` has the current code.

```
//
```

**performance**

Target is sub-2 second load times. The site achieves this through -

- No framework overhead. Raw HTML served directly.
- Single CSS file. No render-blocking chain.
- Font preconnect hints eliminate DNS lookup delay.
- p5.js loads only on IDEAS pages that use generative art.
- Stripe.js loads only on the payment portal page.
- Images are minimal - the site is predominantly typographic.

```
//
```

**security**

Credentials are never committed. The `.gitignore` covers all credential patterns.

Before any commit -

```bash
find . -name "*.env*" -not -path "./node_modules/*"
grep -r "pk_live\|sk_live\|whsec_" . --exclude-dir=node_modules
```

Stripe keys, webhook secrets, and API tokens live in platform environment variables only. The repo contains `.env.example` files with placeholder values for development setup.

*A TUKU GROUP project - tukugroup.com*

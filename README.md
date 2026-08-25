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
<h2>Independent creative house. Landing page and digital home for tukugroup.com.</h2>
</div>

```
//
```

**what this is**

The primary web presence for TUKU GROUP - an independent creative house for ventures that matter. Pure HTML, CSS, and vanilla JavaScript. No frameworks. No build tools. No dependencies beyond Google Fonts.

What it is not - a template, a CMS-driven site, or a component library. Every page is hand-written and intentional.

```
//
```

**site architecture**

The site has four layers - public pages, case studies with generative art, an unlisted client archive, and a private payment portal.

| path | purpose |
|---|---|
| `/` | manifesto-style homepage with cloud background, split-flap ticker, and the balloon overlay entry point |
| `/approach.html` | methodology and philosophy |
| `/studio.html` | public engagement page |
| `/book/` | scheduling flow for a conversation |
| `/ideas/` | case studies hub with p5.js particle system |
| `/ideas/of-the-culture/` | house brand case study - orbital emergence |
| `/ideas/redacted/` | 400-page documentation case study - precision accumulation |
| `/ideas/invisible-scaffolding/` | philosophy methodology - network emergence |
| `/ideas/voyj-discovery/` | pillar discovery engagement |
| `/clients/` | client archive index - unlisted, `noindex`, not in the sitemap |
| `/clients/<slug>/` | one page per client; most still serve a placeholder "unbuilt" gag page with a generative animal-avatar toy, swapped for real content as each room is built - `full-charge` is the first real build (passphrase-gated archive, see below) |
| `/fewer-better-slower/` | private payment portal with Stripe integration |

A smiley balloon rises on the homepage after a short delay and drifts near the top-right, carrying a small animated-gradient "clients only!" label that links to `/clients/`. The private portal at `/fewer-better-slower/` is not linked from any public page - it exists for direct sharing to qualified leads only. The client archive is different: it's reachable by anyone who follows the balloon, just not indexed or listed anywhere.

The `full-charge` client archive is backed by its own Cloudflare Worker,
D1, and R2 (`client-archive-worker/`, separate from the booking API
worker). To add another client to this same system, follow
`client-archive-worker/ONBOARDING-NEW-CLIENT.md` end to end - it's written
as a runbook, not background reading.

```
//
```

**the stack**

```
html/css/js        no frameworks, no preprocessors
jetbrains mono     monospace typography via google fonts cdn
p5.js              generative art on ideas case study pages
stripe.js          payment processing on private portal
cloudflare pages   hosting and deployment from main branch
google analytics   GA4 tracking (G-5KTM9YBETS)
```

```
//
```

**run it**

Static site. Open `index.html` in a browser or use any local server.

1. Clone the repository
```bash
git clone https://github.com/VibeKween/tuku-group-landing.git
cd tuku-group-landing
```

2. Open locally
```bash
open index.html
```

3. Or use a static server for live reload
```bash
python3 -m http.server 8000
```

For payment portal development, the `/payment/` directory requires Node.js -

```bash
cd payment
npm install
cp .env.example .env
npm run dev
```

```
//
```

**deployment**

Cloudflare Pages deploys automatically from the main branch.

- Production - https://tukugroup.com
- Preview - https://tuku-group-landing.pages.dev

The repo has a dual directory structure. Development happens in `/website/`. Production serves from root. Every change requires syncing both locations -

```bash
cp website/index.html .
cp website/approach.html .
cp -r website/css .
cp website/cloud-system-static.js .
```

Commit both locations or the deploy will serve stale files.

```
//
```

**design principles**

```
craft over noise       every element earns its place
fewer better slower    restraint as methodology
manifesto-driven       each section communicates one concept
declarative tone       statements, not explanations
massive whitespace     space is a design decision
mobile-first           single breakpoint at 768px
pure implementation    no abstractions between intent and output
```

```
//
```

**documentation**

Project documentation lives in `/docs/`. Key references -

- [Brand Guidelines](docs/BRAND-GUIDELINES.md) - wordmark, voice, color, positioning
- [Technical Specs](docs/TECHNICAL-SPECS.md) - typography, layout, CSS architecture, deployment

*A TUKU GROUP project - tukugroup.com*

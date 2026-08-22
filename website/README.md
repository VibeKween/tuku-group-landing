# Website Files - tukugroup.com

Core website files for the live Tuku Group landing page. This is the **development** tree - see the root-level `CLAUDE.md` for the dual-directory deployment process (changes here must be synced to the repo root before they go live).

## Files

- `index.html` - Main landing page with manifesto content, split-flap ticker, and the balloon overlay entry point
- `cloud-system-static.js` - Static cloud background system with mobile optimizations
- `tuku-balloon.js` - Standalone balloon overlay script (dependency-free) - rises on the homepage and links to `/clients/`
- `approach.html`, `studio.html`, `services.html` - Public pages
- `CNAME` - Custom domain configuration

## Directories

- `css/` - Complete styling system (`main.css`)
- `images/` - Site assets, favicon, balloon artwork, and visual elements
- `fonts/` - Typography assets (currently empty - using Google Fonts CDN)
- `signals/` - Signals subpage with content management
- `book/` - Scheduling flow for a conversation
- `ideas/` - Case studies hub and individual case study pages (generative art via p5.js)
- `clients/` - Unlisted client archive (index + per-client placeholder pages) - see `docs/TECHNICAL-SPECS.md` for details
- `payment/` - Node.js/Express backend for Stripe integration
- `fewer-better-slower/` - Private payment portal frontend

## Development

**Local Testing:** Open `index.html` in browser or use a local static server
**Live Deployment:** Main branch auto-deploys to https://tukugroup.com via Cloudflare Pages
**CSS System:** JetBrains Mono typography with custom properties in `css/main.css`

## Mobile Optimization

**Cloud System Performance** (October 2025)
- **Issue Resolved**: Mobile jumpiness from excessive resize events
- **Solution**: Intelligent debounced resize handling with threshold detection
- **Performance**: Device pixel ratio limiting and canvas optimization for mobile devices
- **Compatibility**: Optimized for iOS Safari address bar changes and Android viewport adjustments

## Important Notes

- Test locally before production deployment
- Maintain mobile-first responsive design
- Preserve ultra-minimal manifesto aesthetic
- Every change here must be copied to the repo root and committed alongside it - see `CLAUDE.md` for the exact sync commands

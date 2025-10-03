# Website Files - tukugroup.com

Core website files for the live Tuku Group landing page.

## Files

- `index.html` - Main landing page with manifesto content
- `cloud-system-static.js` - Static cloud background system with mobile optimizations  
- `CNAME` - GitHub Pages custom domain configuration

## Directories

- `css/` - Complete styling system (main.css)
- `images/` - Site assets, favicon, and visual elements
- `signals/` - Signals subpage with content management
- `fonts/` - Typography assets (currently empty - using Google Fonts CDN)

## Development

**Local Testing:** Open `index.html` in browser or use live server
**Live Deployment:** Main branch auto-deploys to https://tukugroup.com
**CSS System:** JetBrains Mono typography with custom properties

## Mobile Optimization

**Cloud System Performance** (October 2025)
- **Issue Resolved**: Mobile jumpiness from excessive resize events
- **Solution**: Intelligent debounced resize handling with threshold detection
- **Performance**: Device pixel ratio limiting and canvas optimization for mobile devices
- **Compatibility**: Optimized for iOS Safari address bar changes and Android viewport adjustments

## Important Notes

- Work in dev branch for development
- Test locally before production deployment  
- Maintain mobile-first responsive design
- Preserve ultra-minimal manifesto aesthetic
- Mobile cloud system automatically optimizes for device performance
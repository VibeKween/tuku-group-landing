# CLAUDE.md

This file provides guidance to Claude Code when working with this TUKU GROUP landing page repository.

## Project Overview

This is the main TUKU GROUP landing page with an integrated private payment portal. The site maintains TUKU's ultra-minimal, manifesto-style design following the brand ethos "Craft over noise. Fewer, better, slower."

## 🚨 CRITICAL: Deployment Process

**MANDATORY FOR ALL CHANGES:**

This project has a dual directory structure that requires special deployment handling:

- **Development:** Work in `/website/` directory
- **Production:** Cloudflare Pages deploys from **root directory**

**EVERY FILE CHANGE REQUIRES:**
1. Modify files in `/website/` directory
2. Copy changed files to root for deployment
3. Commit both locations to prevent discrepancies

**Quick Reference:**
```bash
# Copy files to root after changes
cp website/index.html .
cp website/portfolio-approach.html .
cp -r website/css .
cp website/cloud-system-static.js .
cp website/favicon.ico .
cp -r website/fewer-better-slower .
cp -r website/ideas .
```

## Site Architecture

### Public Pages
- **Homepage** (`/`): Main manifesto-style landing page
- **Portfolio Approach** (`/portfolio-approach.html`): Methodology explanation page

### IDEAS Case Studies
- **IDEAS Hub** (`/ideas/`): Case studies overview with generative particle system
- **VOYJ Pillar Discovery** (`/ideas/voyj-discovery/`): Strategic identity case study with language excavation methodology
- **OF THE CULTURE** (`/ideas/of-the-culture/`): House brand case study with emergence visualization
- **[REDACTED]** (`/ideas/redacted/`): 400-page documentation case study with precision accumulation
- **INVISIBLE SCAFFOLDING** (`/ideas/invisible-scaffolding/`): Philosophy methodology with network emergence

### Private Payment Portal
- **Location**: `/fewer-better-slower/` (non-discoverable URL for qualified leads)
- **Purpose**: Secure payment interface shared selectively via direct link
- **Design**: Accordion-style service selection with expandable details

## Payment Portal Features

### Service Offerings
1. **Initial Consultation** - $1,200
   - Full discovery and strategic scoping
   - Complete roadmap with clear milestones

2. **Two-Week Sprint** - $4,500
   - Focused execution on single milestone
   - Brand foundation, design system, platform build
   - Packages available for extended engagements

3. **Monthly Retainer** - $1,500
   - Ongoing guidance after project completion
   - Available to completed sprint clients only

### Customer Journey Flow
1. **"Begin with a call."** - Conversation to understand vision and determine fit
2. **"Move to discovery."** - Full consultation mapping scope and constraints
3. **"From there, we work in focused sprints."** - Two weeks per milestone
4. **"After the project, ongoing support is available."** - Continuity post-launch

### Technical Implementation
- **Frontend**: Vanilla HTML/CSS/JavaScript (no frameworks)
- **Payment**: Stripe integration with secure API endpoints
- **Design**: TUKU blue accent colors with cloud background system
- **Validation**: Whitelist-based email validation with 50+ major providers

## Design System

### Colors
```css
--color-black: #000000    /* Primary text and backgrounds */
--color-white: #FFFFFF    /* Background and inverted text */
--color-blue-accent: #4A90E2  /* Payment buttons and accents */
--color-blue-light: #E8F4FD   /* Input focus backgrounds */
--color-gold: #C19A4B     /* Philosophy headers */
```

### Typography
- **Font**: JetBrains Mono throughout
- **Hierarchy**: h1 for main title, h2 for section headers
- **Philosophy Headers**: Gold accent spans with `.philosophy-header` class
- **Line Height**: 1.8 for body text, 1.5 for headers

### Layout
- **Max Width**: 600px centered container
- **Block Spacing**: 80px between sections
- **Button Spacing**: 2px between action buttons
- **Accordion Animation**: 0.3s ease transitions

## Development Workflow

### Local Development
1. Work in `/website/` directory
2. Test locally via `index.html` or local server
3. Use accordion interface to test service selection
4. Verify cloud background system functionality

### Deployment Process
1. **Make changes** in `/website/` directory
2. **Copy to root** using deployment commands above  
3. **Commit both** locations to git
4. **Push to main** branch for automatic Cloudflare Pages deployment

**Hosting Details:**
- **Production URL**: https://tukugroup.com
- **Preview URL**: https://tuku-group-landing.pages.dev
- **Legacy URL**: https://vibekween.github.io/tuku-group-landing/ (deprecated)
- **Platform**: Cloudflare Pages (migrated from GitHub Pages)
- **DNS**: Managed through Cloudflare with nameservers at GoDaddy

### Security Guidelines
- **NEVER commit** real Stripe API keys
- **Use placeholders** like `pk_test_REPLACE_WITH_YOUR_KEY`
- **Environment variables** for production credentials
- **Private portal** only accessible via direct `/fewer-better-slower/` link

## Content Strategy

### Brand Voice
- **Manifesto-style**: Direct statements without explanation
- **Philosophy-driven**: Each section communicates single concept
- **Intentional brevity**: Every word serves purpose
- **Professional tone**: Without corporate jargon

### Navigation Strategy
- **Public access**: Homepage and portfolio approach page
- **Private access**: Payment portal shared selectively
- **No public pricing**: Pricing only visible to qualified leads
- **Contact-first**: Emphasizes conversation before commerce

## File Structure

```
/
├── index.html                 # Production homepage
├── portfolio-approach.html    # Production portfolio page
├── fewer-better-slower/       # Production payment portal
├── css/                      # Production styles
├── images/                   # Production assets
├── website/                  # Development directory
│   ├── index.html            # Dev homepage
│   ├── portfolio-approach.html # Dev portfolio page
│   ├── fewer-better-slower/  # Dev payment portal
│   └── css/                  # Dev styles
└── CLAUDE.md                 # This file
```

## Key Integrations

### Cloud Background System
- **File**: `cloud-system-static.js`
- **Purpose**: Animated cloud background matching homepage
- **Control**: "what do you see?" refresh link

### Stripe Payment System
- **Files**: `payment.js`, API endpoints in `/api/`
- **Security**: PCI-compliant, no card data stored
- **Testing**: Use placeholder keys for development

### Accordion Interface
- **Behavior**: Single service expandable at a time
- **Content**: Detailed service descriptions on click
- **Animation**: Smooth height transitions with padding

## Enhanced Hero Image System (Nov 2024)

### Development Guidelines for IDEAS Pages

All IDEAS case study pages (`/ideas/*`) use an enhanced hero image system with p5.js generative art that maintains perfect cross-device reliability.

**Core Implementation Pattern:**
```css
/* Hero Container - Enhanced for Mobile */
.hero {
    position: relative;
    width: 100vw;
    height: 100vh;
    min-height: 100svh; /* Safe viewport height for iOS */
    display: flex;
    align-items: center;
    justify-content: center;
    overflow: hidden;
    contain: layout style paint; /* Performance optimization */
}

/* Canvas Performance Enhancement */
#hero-art canvas {
    width: 100% !important;
    height: 100% !important;
    object-fit: cover;
    display: block;
    transform: translateZ(0); /* GPU acceleration */
}
```

**Key Requirements When Modifying Hero Areas:**
1. **Always include** `min-height: 100svh` for iOS Safari compatibility
2. **Always use** `object-fit: cover` on canvas elements
3. **Always apply** `transform: translateZ(0)` for GPU acceleration
4. **Never use** `background-attachment: fixed` (causes mobile issues)
5. **Always test** on mobile devices after changes

**Environment Sync for IDEAS Pages:**
```bash
# After modifying any /ideas/ page:
cp -r website/ideas .
```

**Benefits of Enhanced System:**
- ✅ Eliminates mobile disappearing issues
- ✅ Consistent viewport coverage across devices
- ✅ Improved performance with CSS containment
- ✅ Maintained generative art functionality
- ✅ GPU acceleration for smooth rendering

## 🚨 CRITICAL: OG Images for iMessage/Social Previews (Jan 2026)

### Requirements for Working iMessage Link Previews

Apple's iMessage link preview system (LinkPresentation) is extremely strict about OG images. Follow these requirements to ensure previews work:

**File Size Requirements:**
- **MUST be under 500KB** - Apple's soft limit for iMessage OG images
- Recommended: 200-400KB for reliable performance
- Use `sips` to optimize: `sips -s format png -s formatOptions best --resampleWidth 1200 input.png --out output.png`

**Dimension Requirements:**
- **1200x630** (standard OG size) - recommended
- **2400x1260** (2x retina) - also works but larger file size
- Must match `og:image:width` and `og:image:height` meta tag values exactly

**Format Requirements:**
- PNG or JPEG both work
- PNG recommended for generative art with transparency
- JPEG for photos or when file size is critical

**Meta Tag Structure (Required):**
```html
<meta property="og:image" content="https://tukugroup.com/images/[filename].png">
<meta property="og:image:width" content="1200">
<meta property="og:image:height" content="630">
<meta property="og:image:alt" content="Description of image">
<meta name="twitter:image" content="https://tukugroup.com/images/[filename].png">
```

### ⚠️ Known Issues with p5.js saveCanvas

The p5.js `saveCanvas()` function can produce PNG files that Apple's iMessage system rejects, even when they appear identical to working images.

**Symptoms:**
- Image shows in browser but not in iMessage preview
- Apple shows generic fallback image instead
- Other case study OG images work fine

**Solution - Use Alternative Export Methods:**
1. **Native canvas export** (preferred):
   ```javascript
   const canvas = document.querySelector('canvas');
   canvas.toBlob((blob) => {
       const url = URL.createObjectURL(blob);
       const a = document.createElement('a');
       a.href = url;
       a.download = 'og-image.png';
       a.click();
   }, 'image/png');
   ```

2. **macOS screenshot** (Cmd+Shift+4) of the canvas area

3. **Use a different source image** - images from other generative art captures or design tools work reliably

### Debugging OG Image Issues

**Step 1: Test with known-working image**
```bash
# Copy a working OG image (e.g., redacted-og.png) with new filename
cp images/redacted-og.png images/test-og.png
# Update meta tags to use test-og.png
# If this works, issue is the image content itself
```

**Step 2: Check image properties**
```bash
sips -g all images/your-og-image.png
# Verify: pixelWidth, pixelHeight, format, hasAlpha, space
```

**Step 3: Check HTTP response**
```bash
curl -sI "https://tukugroup.com/images/your-og-image.png" | head -10
# Verify: HTTP/2 200, content-type: image/png
```

**Step 4: Force Apple CDN refresh**
- Use a completely new filename (timestamp-based)
- Apple caches aggressively; same URL may serve old/cached data

### OG Image Capture Tools

Located in `/images/og-capture/`:
- `voyj-og.html` - VOYJ case study (uses native canvas.toBlob)
- `redacted-og.html` - REDACTED case study
- `ideas-og.html` - IDEAS hub page
- `of-the-culture-og.html` - OF THE CULTURE case study
- `invisible-scaffolding-og.html` - INVISIBLE SCAFFOLDING case study

**Usage:**
1. Open HTML file in browser
2. Wait for animation to look good
3. Press 'S' for PNG or 'J' for JPEG
4. Optimize with sips if over 500KB
5. Update meta tags in page HTML
6. Sync to root and deploy

### Quick OG Image Checklist

- [ ] File size under 500KB
- [ ] Dimensions match meta tag values
- [ ] `og:image` uses absolute HTTPS URL
- [ ] `twitter:image` matches `og:image`
- [ ] Fresh filename if replacing existing image
- [ ] Synced to both `/website/images/` and `/images/`
- [ ] Tested in iMessage after Cloudflare propagation (~15-30 seconds)

## Important Notes

- **No frameworks**: Pure HTML/CSS/JS maintains simplicity
- **Mobile-first**: Responsive design with breakpoints
- **SEO optimized**: Structured data and meta tags
- **Brand consistency**: All pages follow TUKU design principles
- **Private pricing**: Payment portal not linked from public pages

This architecture supports TUKU's philosophy of intentional craft while providing a secure, professional payment experience for qualified leads.
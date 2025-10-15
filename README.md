# 01-LANDING-PAGE - Tuku Group

Main TUKU GROUP landing page with integrated private payment portal. Dual directory structure for development and production deployment.

## Live Architecture

### Public Pages
- **Homepage** (`/`) - Main manifesto-style landing page
- **Approach** (`/approach.html`) - Methodology and philosophy page
- **Studio** (`/studio.html`) - Public work engagement page

### Private Payment Portal
- **Location**: `/fewer-better-slower/` - Private payment portal with Stripe integration
- **Public Access**: `/studio/` - Public engagement page (mirrors fewer-better-slower without payment)
- **Purpose**: Private portal shared selectively, public studio page for general access
- **Features**: Accordion-style service selection

## Folder Structure

### Root Directory (Production)
- `index.html` - Main landing page
- `approach.html` - Philosophy and methodology page
- `studio.html` - Public engagement page (mirrors fewer-better-slower without payment)
- `css/` - Production styling
- `images/` - Production assets and favicon
- `cloud-system-static.js` - Cloud background system
- `payment.css` - TUKU blue styling for studio/payment pages
- `payment.js` - Accordion functionality (non-payment version)
- `CNAME` - Custom domain configuration (legacy from GitHub Pages)

### Private Portal
- `/fewer-better-slower/` - Private payment portal with Stripe integration
- Accessible only via direct link sharing to qualified leads
- Full service breakdown with secure payment processing

### Public Studio Page
- `/studio.html` - Public engagement page accessible at tukugroup.com/studio
- Mirrors `/fewer-better-slower/` functionality without payment processing
- Uses same accordion interface and TUKU blue styling

### Development Environment
- `/website/` - Development mirror of root directory
- Changes made here must be copied to root for production deployment

### Business Operations
- `/operations/` - Business documents and templates
- `/docs/` - Project documentation and session archives
- `BRAND-GUIDELINES.txt` - Complete visual identity standards
- `PROJECT-INSTRUCTIONS-COMPLETE.txt` - TUKU brand voice guidelines
- `TUKU-PRICING-2025.txt` - Official pricing structure
- `CLAUDE.md` - Development guidance and deployment process

## Deployment Process

**CRITICAL: Dual Directory Requirements**
1. Make changes in `/website/` directory
2. Copy changes to root directory for production
3. Commit both locations to prevent discrepancies

**Hosting**: Cloudflare Pages
- **Production URL**: https://tukugroup.com
- **Preview URL**: https://tuku-group-landing.pages.dev
- **Legacy URL**: https://vibekween.github.io/tuku-group-landing/ (deprecated)
- **Deployment**: Automatic from main branch via Cloudflare Pages
- **DNS**: Managed through Cloudflare with nameservers at GoDaddy

Quick deployment commands:
```bash
cp website/index.html .
cp website/approach.html .
cp -r website/css .
cp website/cloud-system-static.js .
```

## Quick Access

- **Live Site**: https://tukugroup.com
- **Development**: Work in `/website/` then deploy to root
- **Private Portal**: https://tukugroup.com/fewer-better-slower/
- **Studio Page**: https://tukugroup.com/studio
- **Brand Reference**: See brand guidelines and voice standards files

## Key Features

- **Ultra-minimal Design**: Manifesto-style content following "craft over noise"
- **Cloud Background System**: Subtle animated cloud elements
- **Split-Flap Display**: Terminal-style project ticker
- **Private Pricing**: Payment portal only accessible via direct link
- **Mobile-First**: Responsive design with single breakpoint at 768px
- **Pure Implementation**: No frameworks, optimal for performance
# DEVELOPMENT WORKFLOW GUIDE - TUKU GROUP Landing Page

## 🎯 Current Project Status

✅ **Main Homepage**: `index.html` (production ready)
✅ **Payment Portal**: `/fewer-better-slower/` (production ready) 
✅ **All files properly synced between `/website/` and root directories**

## 🔧 Development Workflow Best Practices

### CRITICAL: Dual Directory Structure

This project uses a **dual directory architecture** for GitHub Pages deployment:

```
01-LANDING-PAGE/
├── website/                 # 🔧 DEVELOPMENT WORKSPACE
│   ├── index.html          # Work here for main homepage
│   ├── css/main.css        # Styling changes here
│   ├── fewer-better-slower/ # Payment portal development
│   └── ...
├── index.html              # 🚀 PRODUCTION (GitHub Pages root)
├── css/main.css            # Production CSS
├── fewer-better-slower/    # 🚀 PRODUCTION payment portal
└── ...
```

### 📋 Local Development Process

#### For Payment Portal Updates (`/fewer-better-slower/`)
```bash
# 1. ALWAYS work in the development directory first
cd /website/fewer-better-slower/

# 2. Start local server for testing
npx http-server . -p 9000

# 3. Make your changes to:
- index.html (main content)
- payment.css (styling)  
- payment.js (functionality)

# 4. Test thoroughly at http://localhost:9000/

# 5. When satisfied, copy to production root:
cp -r website/fewer-better-slower/* fewer-better-slower/

# 6. Commit both locations:
git add website/fewer-better-slower/ fewer-better-slower/
git commit -m "Your update message"
git push origin main
```

#### For Main Homepage Updates
```bash
# 1. Work in website directory
edit website/index.html
edit website/css/main.css

# 2. Test locally:
open website/index.html
# OR use live server

# 3. Copy to production root:
cp website/index.html .
cp -r website/css .

# 4. Commit both:
git add website/ index.html css/
git commit -m "Your update message"
git push origin main
```

### 🚨 CRITICAL DEPLOYMENT REMINDERS

**NEVER work directly in root files** - Always start in `/website/` directory

**ALWAYS copy files to root** before committing for production

**MANDATORY file sync locations:**
- `website/index.html` → `index.html`
- `website/css/` → `css/`
- `website/fewer-better-slower/` → `fewer-better-slower/`

### 🔍 Pre-Push Checklist

Before any `git push`:

- [ ] Changes tested locally in `/website/` directory
- [ ] Files copied from `/website/` to root production location
- [ ] Both directories added to git staging
- [ ] Clean commit message with comprehensive description
- [ ] No sensitive data or API keys committed

### 📁 Current File Sync Status

**Homepage Files** ✅ 
- `website/index.html` ↔ `index.html` (synced)
- `website/css/main.css` ↔ `css/main.css` (synced)

**Payment Portal** ✅
- `website/fewer-better-slower/` ↔ `fewer-better-slower/` (synced)
- All payment files current and live

**External Dependencies** ✅
- Cloud system, fonts, favicon all properly referenced

### 🛠 Quick Commands

**Start local development server:**
```bash
npx http-server website -p 8000  # For main site
npx http-server . -p 9000        # For testing production structure
```

**Sync files for deployment:**
```bash
# Homepage sync
cp website/index.html .
cp -r website/css .

# Payment portal sync  
cp -r website/fewer-better-slower/* fewer-better-slower/

# Full sync (if needed)
rsync -av website/ . --exclude=node_modules
```

**Safe deployment:**
```bash
git add website/ index.html css/ fewer-better-slower/ 
git commit -m "Description of changes"
git push origin main
```

### 🎯 Service Configuration (Current)

**Payment Portal Services:**
- Initial Consultation: $1,200
- Sprint Build: $4,500  
- Retainer Engagement: $1,500/mo

**Portal URL:** `https://tukugroup.com/fewer-better-slower/`

### 📝 Notes for Future Development

1. **Payment Portal**: Fully functional with Stripe integration (requires API keys for live payments)
2. **Design System**: TUKU blue colors, JetBrains Mono typography, cloud backgrounds
3. **Responsive**: Mobile-first design, tested across devices
4. **Performance**: Sub-2 second load times maintained
5. **Security**: No sensitive data in repository, environment variables required for payment processing

### 🚀 Production URLs

- **Main Site**: https://tukugroup.com
- **Payment Portal**: https://tukugroup.com/fewer-better-slower/
- **Repository**: github.com/VibeKween/tuku-group-landing (private)

---

**Last Updated**: October 6, 2025  
**Status**: Production Ready ✅
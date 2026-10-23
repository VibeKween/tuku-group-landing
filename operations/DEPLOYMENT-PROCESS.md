# TUKU GROUP DEPLOYMENT PROCESS

## Critical Understanding: Dual Directory Structure

This repository has a **dual directory structure** that can cause deployment discrepancies:

```
01-LANDING-PAGE/
├── website/           # Development files (where we work)
│   ├── index.html
│   ├── css/main.css
│   ├── cloud-system-static.js
│   ├── favicon.ico
│   ├── images/favicon.png
│   └── CNAME
└── [ROOT]/            # Deployment files (what Cloudflare Pages serves)
    ├── index.html     # Must match website/index.html
    ├── css/main.css   # Must match website/css/main.css
    ├── cloud-system-static.js
    ├── favicon.ico
    ├── images/favicon.png
    └── CNAME
```

## 🚨 CRITICAL DEPLOYMENT RULE

**Every change to `/website/` files must be copied to root level for deployment.**

Cloudflare Pages deploys from the **root directory**, not the `/website/` directory.

## 🔒 Private Files: Everything Committed Is Public

Cloudflare Pages serves **every tracked file in the repo**, not only the site pages. A doc, script, or internal note committed anywhere in this repo can be opened at `https://tukugroup.com/<path>`.

`_redirects` at root sends private paths to the homepage. It is the one list of what stays private.

**Before committing any new internal folder or file:**
1. Add its path to `website/_redirects`
2. Copy it to root: `cp website/_redirects .`
3. After deploy, confirm the path redirects (see Verification Steps)

Pages applies `_redirects` before serving files, so a listed path redirects even though the file exists. Paths with spaces are written with `%20`.

The lasting fix is to deploy only a public folder. See Future Improvements.

## Mandatory Deployment Checklist

### ✅ Before Making Changes:
1. Always work in `/website/` directory first
2. Test changes locally using the website directory
3. Verify functionality works as expected

### ✅ After Making Changes:
1. **Copy changed files to root:**
   ```bash
   # For HTML changes
   cp website/index.html .
   
   # For CSS changes  
   cp -r website/css .
   
   # For JavaScript changes
   cp website/cloud-system-static.js .
   
   # For favicon changes
   cp website/favicon.ico .
   cp website/images/favicon.png images/
   
   # For domain configuration
   cp website/CNAME .

   # For private path rules
   cp website/_redirects .
   ```

2. **Stage deployment files:**
   ```bash
   git add index.html css/ cloud-system-static.js favicon.ico images/favicon.png CNAME _redirects
   ```

3. **Commit with descriptive message:**
   ```bash
   git commit -m "🔧 Deploy [feature] fix to production
   
   - Brief description of changes
   - Note: Updated both website/ and root deployment files
   
   🤖 Generated with [Claude Code](https://claude.ai/code)
   
   Co-Authored-By: Claude <noreply@anthropic.com>"
   ```

4. **Push to production:**
   ```bash
   git push origin main
   ```

## Issues We've Resolved

### 1. Cloud System Not Loading (October 2024)
- **Problem:** `cloud-system-static.js` existed in `/website/` but not at root
- **Symptom:** Live site had scroll-based animation issues, local worked perfectly
- **Solution:** Copied `website/cloud-system-static.js` to root

### 2. Favicon Not Displaying (October 2024)
- **Problem:** Favicon files existed in `/website/` but not at root
- **Symptom:** 404 errors for favicon requests on live site
- **Solution:** Copied `website/favicon.ico` and `website/images/favicon.png` to root

### 3. Button Positioning Issues (October 2024)
- **Problem:** CSS/HTML changes in `/website/` not reflected on live site
- **Symptom:** "what do you see?" button had different behavior locally vs live
- **Solution:** Copied updated `website/index.html` and `website/css/main.css` to root

### 4. Internal Files Served Publicly (October 2026)
- **Problem:** Cloudflare Pages serves the whole repo root, so internal files were public
- **Symptom:** Internal pricing, a client invoice, an unredacted case study, `CLAUDE.md`, `operations/`, `docs/`, and the payment server code all loaded on tukugroup.com
- **Solution:** Added `_redirects` to send private paths to the homepage (see Private Files)

## Local Development vs Production

### Local Development:
- Server: `npx http-server . -p 3000` (serves from root)
- URL: `http://localhost:3000/website/`
- Files: Uses `/website/` directory

### Production Deployment:
- Platform: Cloudflare Pages (migrated from GitHub Pages)
- Production URL: `https://tukugroup.com`
- Preview URL: `https://tuku-group-landing.pages.dev`
- Legacy URL: `https://vibekween.github.io/tuku-group-landing/` (deprecated)
- Files: Uses **root directory only**

## File Synchronization Commands

Create this alias for easy deployment:

```bash
# Add to your shell profile (.zshrc, .bashrc, etc.)
alias deploy-tuku="cp website/index.html . && cp -r website/css . && cp website/cloud-system-static.js . && cp website/favicon.ico . && mkdir -p images && cp website/images/favicon.png images/ && cp website/CNAME . && cp website/_redirects . && echo '✅ Files synchronized for deployment'"
```

## Verification Steps

After deployment, verify these URLs return 200 (not 404):
- https://tukugroup.com/favicon.ico
- https://tukugroup.com/images/favicon.png  
- https://tukugroup.com/css/main.css
- https://tukugroup.com/cloud-system-static.js

These private paths must return a 302 to `/`:

```bash
for p in CLAUDE.md docs/TECHNICAL-SPECS.md operations/DEPLOYMENT-PROCESS.md payment/ TUKU-PRICING-2025.txt; do
  curl -s -o /dev/null -w "%{http_code} $p\n" "https://tukugroup.com/$p"
done
```

## Emergency Rollback

If deployment breaks the site:

```bash
# Revert to last working commit
git revert HEAD
git push origin main

# Or reset to specific commit
git reset --hard [commit-hash]
git push origin main --force-with-lease
```

## Future Improvements

Consider consolidating to single directory structure:
- Move all development to root level, OR
- Configure Cloudflare Pages to deploy from `/website/` directory
- Update local development server accordingly

Deploying from one public folder also retires the `_redirects` list. Only files in that folder would be served, so internal files would be private by default.

---

**Last Updated:** October 2026  
**Next Review:** Before any major feature additions
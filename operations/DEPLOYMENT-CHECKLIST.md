# DEPLOYMENT CHECKLIST

## 🚨 CRITICAL: File Synchronization Required

Every time you modify files in `/website/`, you **MUST** copy them to root for deployment.

## Quick Deployment Commands

```bash
# 1. Copy all modified files to root
cp website/index.html .
cp -r website/css .
cp website/cloud-system-static.js .
cp website/favicon.ico .
mkdir -p images && cp website/images/favicon.png images/
cp website/CNAME .

# 2. Stage for deployment
git add index.html css/ cloud-system-static.js favicon.ico images/favicon.png CNAME

# 3. Commit
git commit -m "🔧 Deploy [feature] to production

- Brief description of changes
- Updated both website/ and root deployment files

🤖 Generated with [Claude Code](https://claude.ai/code)

Co-Authored-By: Claude <noreply@anthropic.com>"

# 4. Deploy
git push origin main
```

## ✅ Pre-Deployment Checklist

- [ ] Changes tested locally in `/website/` directory
- [ ] All modified `/website/` files copied to root
- [ ] `git status` shows root files staged for commit
- [ ] Commit message describes changes clearly
- [ ] Ready to deploy to live site (tukugroup.com)

## ✅ Post-Deployment Verification

Wait ~30 seconds after push, then verify:
- [ ] https://tukugroup.com loads correctly
- [ ] No 404 errors in browser console
- [ ] Favicon displays in browser tab
- [ ] All functionality works as expected
- [ ] Mobile behavior matches local testing

## 🆘 Common Issues

**Problem:** "It works locally but not on live site"
**Solution:** Check if you copied files from `/website/` to root

**Problem:** "Favicon not showing on live site"  
**Solution:** Verify `favicon.ico` and `images/favicon.png` exist at root

**Problem:** "JavaScript not loading on live site"
**Solution:** Verify `cloud-system-static.js` exists at root

**Problem:** "CSS changes not appearing on live site"
**Solution:** Verify `css/main.css` copied from `/website/css/main.css`
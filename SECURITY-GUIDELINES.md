# 🔐 SECURITY GUIDELINES - TUKU GROUP

## 🚨 CRITICAL: NEVER COMMIT PRIVATE INFORMATION

**Fundamental Rule**: No private information, credentials, or keys should EVER be committed to version control.

## ⚠️ What NEVER Goes in Git

### API Keys & Credentials
- ❌ Stripe keys (live or test)
- ❌ Database passwords
- ❌ Webhook secrets
- ❌ Third-party API tokens
- ❌ Email service credentials
- ❌ Cloud service keys (AWS, Google Cloud, etc.)

### Environment Files
- ❌ `.env` files
- ❌ `.env.local`, `.env.production`, etc.
- ❌ Any file containing secrets or credentials

### Configuration Files
- ❌ Production config files with real credentials
- ❌ Database connection strings
- ❌ Service account files

## ✅ Security Best Practices

### 1. Environment Variables Only
```javascript
// ✅ CORRECT: Use placeholder
const STRIPE_PUBLISHABLE_KEY = 'pk_test_REPLACE_WITH_YOUR_KEY';

// ❌ WRONG: Never hardcode real keys
const STRIPE_PUBLISHABLE_KEY = 'pk_test_51SFKEmL...';
```

### 2. .gitignore Rules
Always ensure comprehensive .gitignore coverage:
```gitignore
# Environment variables - CRITICAL SECURITY
.env
.env.*
.env.local
.env.development
.env.production

# API Keys and Secrets - NEVER COMMIT
**/*secret*
**/*key*.json
**/*credential*
stripe_*
webhook_secrets*
```

### 3. Template Files Only
- ✅ Commit `.env.example` with placeholder values
- ✅ Document required environment variables
- ✅ Provide setup instructions for developers

### 4. Documentation Security
- ✅ Keep setup instructions public
- ✅ Use placeholders in examples
- ✅ Never include real credentials in docs

## 🛠️ Development Workflow

### Local Development
1. Copy `.env.example` to `.env`
2. Add real credentials to `.env` (never committed)
3. Test with real keys locally
4. Deploy with environment variable injection

### Production Deployment
1. Set environment variables in hosting platform
2. Never commit production credentials
3. Use platform-specific secret management
4. Rotate keys regularly

## 🚧 Platform-Specific Guidelines

### Vercel
- Use Environment Variables in dashboard
- Set different values for Preview vs Production
- Enable environment variable protection

### Railway/Heroku
- Set config vars in platform dashboard
- Use different environments for staging/production
- Never commit platform-specific config files

### GitHub Pages
- Use only frontend assets
- No backend credentials needed
- Static sites only

## 🔍 Security Audit Checklist

Before any commit:
- [ ] No `.env` files included
- [ ] No hardcoded API keys in code
- [ ] No real credentials in documentation
- [ ] .gitignore rules comprehensive
- [ ] Only placeholder values in templates

### Regular Security Checks
```bash
# Check for potential credential leaks
find . -name "*.env*" -not -path "./node_modules/*"
grep -r "pk_live\|sk_live\|whsec_" . --exclude-dir=node_modules
git log --grep="password\|secret\|key" --oneline
```

## 🆘 If Credentials Are Leaked

### Immediate Actions (in order)
1. **Revoke/Rotate**: Immediately invalidate exposed credentials
2. **Remove**: Delete credentials from codebase
3. **Git History**: Remove from git history if committed
4. **Update**: Generate new credentials
5. **Audit**: Check all systems for unauthorized access

### Git History Cleanup
```bash
# Remove sensitive file from git history
git filter-branch --force --index-filter \
'git rm --cached --ignore-unmatch path/to/sensitive/file' \
--prune-empty --tag-name-filter cat -- --all

# Force push (be very careful)
git push origin --force --all
```

## 📋 Environment Variable Naming

### Standard Prefixes
- `STRIPE_` - All Stripe-related credentials
- `DB_` - Database connections
- `EMAIL_` - Email service credentials
- `API_` - Third-party API keys
- `WEBHOOK_` - Webhook secrets

### Examples
```env
# Stripe
STRIPE_PUBLISHABLE_KEY=pk_live_...
STRIPE_SECRET_KEY=sk_live_...
STRIPE_WEBHOOK_SECRET=whsec_...

# Database
DB_HOST=localhost
DB_PASSWORD=...
DB_CONNECTION_STRING=...

# Email
EMAIL_API_KEY=...
EMAIL_WEBHOOK_SECRET=...
```

## 🎯 TUKU Group Standards

### All Projects Must
- ✅ Use comprehensive .gitignore rules
- ✅ Include `.env.example` with placeholders
- ✅ Document environment setup clearly
- ✅ Never commit real credentials
- ✅ Use platform environment variable injection

### Code Review Requirements
- Check for any hardcoded credentials
- Verify .gitignore completeness
- Confirm only placeholder values in templates
- Validate environment variable documentation

## 📞 Security Contact

If you discover security issues:
- **Immediate**: Remove credentials from codebase
- **Contact**: Development team for credential rotation
- **Document**: Update security procedures if needed

---

**Remember**: Security is not optional. Protecting credentials protects the business, customers, and reputation.

**Last Updated**: October 6, 2025
**Version**: 1.0 - Initial security guidelines
# Privacy & Security Documentation

## Private Information Management

### What's Kept Private
This project maintains a clear separation between public and private information:

**Public Repository Contains:**
- Source code and assets
- Generic documentation and guides
- Templated placeholders for sensitive data
- Brand voice and design decisions
- Technical implementation details

**Private Documentation Location:**
- **Path**: `/Users/[username]/Desktop/PRIVATE-TUKU-DOCS/`
- **Contents**: Personal email addresses, SSH keys, GitHub usernames, authentication details
- **Format**: `PRIVATE-SESSION-YYYYMMDD.md`

### Security Measures

#### Git Ignore Protection
The `.gitignore` file prevents accidental commits of:
- Files starting with `PRIVATE-`
- Files ending with `-PRIVATE`
- `docs/private/` folder contents
- `private-docs/` folder contents

#### Template System
Public documentation uses placeholders:
- `[GitHub Repository URL]` instead of actual URLs
- `[GitHub Pages URL]` instead of live site URLs
- `project email` instead of personal email addresses
- Generic references instead of usernames

### Best Practices

#### For Future Sessions
1. **Always maintain private documentation** alongside public docs
2. **Use placeholders** in public files for sensitive information
3. **Store authentication details** only in private documentation
4. **Review commits** before pushing to ensure no sensitive data included

#### Emergency Procedures
If sensitive information is accidentally committed:
1. **Immediately rotate** any exposed credentials
2. **Force push** to remove from git history (if caught quickly)
3. **Update private documentation** with new credentials
4. **Review and strengthen** privacy procedures

### Contact Information Policy

#### Public Facing
- **Business Email**: contact@tukugroup.com
- **Generic References**: "project email", "repository", "live site"

#### Private Documentation
- **Personal Email**: [Stored in private docs only]
- **GitHub Username**: [Stored in private docs only]
- **SSH Keys**: [Stored in private docs only]

---

## Documentation Workflow

### Creating New Session Archives
1. **Copy template** to new session file
2. **Fill public information** in session archive
3. **Create private supplement** with sensitive details
4. **Commit only public documentation** to repository

### Updating Existing Documentation
1. **Check for sensitive information** before editing
2. **Use placeholders** for any new sensitive data
3. **Update private documentation** separately
4. **Verify .gitignore protection** is working

---

*Privacy documentation for Tuku Group project - maintaining professional security standards*
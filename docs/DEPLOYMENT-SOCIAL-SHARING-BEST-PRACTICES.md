# DEPLOYMENT & SOCIAL SHARING BEST PRACTICES
## TUKU GROUP - Critical Standards for All Projects

*Generated from October 7, 2025 deployment session*

---

## 🎯 **OVERVIEW**

This document establishes critical deployment and social sharing standards for all TUKU GROUP projects, derived from solving complex GitHub Pages deployment issues and iPhone sharing failures.

**Applies to:** All TUKU projects (landing pages, ecommerce sites, client work)

---

## 🚨 **CRITICAL: GITHUB PAGES DEPLOYMENT RULES**

### **Rule 1: Static Hosting Compatibility**
**❌ NEVER include on GitHub Pages:**
- Stripe payment processing code
- Server-side API calls (`/api/` endpoints)
- Node.js/Express server dependencies
- Webhook handlers
- Any server-side JavaScript execution

**✅ ALWAYS use instead:**
- Pure static HTML/CSS/JS
- Email-based contact forms (`mailto:` links)
- Client-side analytics only
- External service integrations (if compatible)

### **Rule 2: Dual Directory Synchronization (01-LANDING-PAGE specific)**
**MANDATORY process for 01-LANDING-PAGE:**
```bash
# Every deployment MUST follow this pattern:
1. Edit files in /website/ directory first
2. Copy to root: cp website/filename.html .
3. Commit both locations
4. Verify sync before deployment
```

**Failure consequences:** Selective 404 errors, deployment failures

### **Rule 3: Domain Architecture Consistency**
**CNAME Configuration:**
- Set CNAME to match primary domain usage
- If accessing `domain.com` → CNAME should be `domain.com`
- If accessing `www.domain.com` → CNAME should be `www.domain.com`
- **Never mix:** www vs non-www causes CSS/JS loading failures

**URL Pattern Standards:**
- **Homepage**: `domain.com/` (index.html automatic)
- **Other pages**: `domain.com/pagename.html` (include .html extension)
- **Canonical URLs**: Must match actual file structure
- **Open Graph URLs**: Must match canonical URLs exactly

---

## 📱 **SOCIAL SHARING REQUIREMENTS**

### **iPhone Sharing Critical Meta Tags**
**ALL pages MUST include:**
```html
<!-- iOS/Safari specific -->
<meta name="apple-mobile-web-app-capable" content="yes">
<meta name="apple-mobile-web-app-status-bar-style" content="black">
<meta name="apple-mobile-web-app-title" content="[BRAND] [Page Name]">
```

**Without these:** iPhone Messages sharing fails completely

### **Complete Social Media Meta Tag Template**
```html
<!-- Canonical URL -->
<link rel="canonical" href="https://domain.com/pagename.html">

<!-- Open Graph -->
<meta property="og:type" content="website">
<meta property="og:url" content="https://domain.com/pagename.html">
<meta property="og:title" content="[Page Title] - [Brand Name]">
<meta property="og:description" content="[Page description for social preview]">
<meta property="og:image" content="https://domain.com/images/brand-og.png">
<meta property="og:image:secure_url" content="https://domain.com/images/brand-og.png">
<meta property="og:image:type" content="image/png">
<meta property="og:image:width" content="1200">
<meta property="og:image:height" content="630">
<meta property="og:image:alt" content="[Alt text for image]">
<meta property="og:site_name" content="[Brand Name]">
<meta property="og:locale" content="en_US">

<!-- Twitter -->
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:site" content="@brandhandle">
<meta name="twitter:creator" content="@brandhandle">
<meta name="twitter:title" content="[Page Title] - [Brand Name]">
<meta name="twitter:description" content="[Page description for social preview]">
<meta name="twitter:image" content="https://domain.com/images/brand-og.png">
<meta name="twitter:image:alt" content="[Alt text for image]">

<!-- iOS/Safari specific -->
<meta name="apple-mobile-web-app-capable" content="yes">
<meta name="apple-mobile-web-app-status-bar-style" content="black">
<meta name="apple-mobile-web-app-title" content="[BRAND] [Page Name]">
```

### **Social Image Requirements**
- **Dimensions:** 1200x630px (Facebook/Twitter standard)
- **Format:** PNG (better compression for graphics)
- **Content:** Brand wordmark + minimal design
- **File name:** `brand-og.png` (consistent naming)
- **Alt text:** Descriptive for accessibility

---

## 🎨 **CSS & ASSET MANAGEMENT**

### **CSS Loading Best Practices**
```html
<!-- Correct pattern for cache-busting -->
<link rel="stylesheet" href="css/main.css?v=1.9">

<!-- Font loading optimization -->
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@300;400;500;600&display=swap" rel="stylesheet">
```

**Rules:**
- Always use version parameters for cache-busting
- Preconnect to external font services
- Load CSS before JavaScript
- Use consistent file structure across pages

### **File Structure Standards**
```
project-root/
├── css/
│   └── main.css (primary stylesheet)
├── images/
│   ├── favicon.png
│   └── brand-og.png (social sharing image)
├── js/ (if needed)
├── index.html (homepage)
├── pagename.html (other pages)
├── CNAME (GitHub Pages domain config)
└── README.md
```

---

## 📊 **ANALYTICS INTEGRATION**

### **Google Analytics 4 Standard Setup**
```html
<!-- Google Analytics 4 -->
<script async src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXX"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'G-XXXXXXXXX');
</script>
```

### **Custom Event Tracking Template**
```javascript
// Contact link tracking
const contactLinks = document.querySelectorAll('a[href^="mailto:"]');
contactLinks.forEach(link => {
  link.addEventListener('click', function() {
    gtag('event', 'contact_click', {
      'event_category': 'engagement',
      'event_label': 'page_contact',
      'page_location': window.location.href
    });
  });
});

// Scroll depth tracking
let scrollDepthTracked = [];
window.addEventListener('scroll', function() {
  const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
  const docHeight = document.documentElement.scrollHeight - window.innerHeight;
  const scrollPercent = Math.round((scrollTop / docHeight) * 100);
  
  [25, 50, 75, 100].forEach(milestone => {
    if (scrollPercent >= milestone && !scrollDepthTracked.includes(milestone)) {
      scrollDepthTracked.push(milestone);
      gtag('event', 'scroll_depth', {
        'event_category': 'engagement',
        'event_label': `${milestone}_percent`,
        'value': milestone,
        'page_location': window.location.href
      });
    }
  });
});
```

---

## 🔍 **DEBUGGING & TROUBLESHOOTING**

### **Common Issues & Solutions**

#### **1. Page Loads but Styling Broken**
- **Cause:** CSS path incorrect or cache issues
- **Fix:** Check CSS path, add version parameter, verify file exists
- **Test:** Inspect DevTools Network tab for 404 errors

#### **2. iPhone Sharing Fails**
- **Cause:** Missing iOS meta tags or URL mismatch
- **Fix:** Add apple-mobile-web-app-* tags, ensure URL consistency
- **Test:** Share in iPhone Messages, check preview loads

#### **3. Social Previews Don't Update**
- **Cause:** Social media crawler cache
- **Fix:** Update og:image URL or use Facebook Debugger to refresh
- **Test:** Use Facebook/Twitter sharing debugger tools

#### **4. GitHub Pages 404 Errors**
- **Cause:** Server-side code, dual directory sync issues, domain conflicts
- **Fix:** Remove server dependencies, sync directories, check CNAME
- **Test:** Wait 10-15 minutes for deployment, clear browser cache

### **Deployment Testing Checklist**
```bash
# After every deployment:
1. ✅ Wait 10-15 minutes for GitHub Pages propagation
2. ✅ Test desktop + mobile browser access
3. ✅ Test iPhone link sharing (Messages app)
4. ✅ Verify CSS/JS files load correctly (DevTools)
5. ✅ Check analytics tracking fires
6. ✅ Test contact links work
7. ✅ Validate social media previews
```

---

## 🎯 **PROJECT-SPECIFIC ADAPTATIONS**

### **Landing Pages (Static Sites)**
- Use this template exactly as documented
- Focus on social sharing optimization
- Minimal JavaScript for maximum compatibility

### **Ecommerce Sites**
- **GitHub Pages:** Use email-based contact only
- **Server Hosting:** Can implement full payment systems
- **Hybrid:** Static showcase + external checkout

### **Client Projects**
- Adapt social image to client branding
- Update analytics ID to client's GA4 property
- Customize meta descriptions for client messaging
- Maintain technical structure for reliability

---

## 📋 **IMPLEMENTATION CHECKLIST**

### **New Project Setup**
- [ ] Copy social media meta tag template
- [ ] Create brand-og.png image (1200x630px)
- [ ] Set up CSS with version parameter
- [ ] Configure GA4 with custom events
- [ ] Add iOS-specific meta tags
- [ ] Test iPhone sharing before launch
- [ ] Verify CNAME matches domain usage
- [ ] Document any project-specific deviations

### **Existing Project Audit**
- [ ] Check all pages have iOS meta tags
- [ ] Verify URL consistency in meta tags
- [ ] Test iPhone sharing on all pages
- [ ] Confirm CSS loading with version parameters
- [ ] Validate social media previews
- [ ] Review analytics tracking setup
- [ ] Test deployment process
- [ ] Update documentation

---

## 🎨 **TUKU DESIGN STANDARDS INTEGRATION**

This technical framework supports TUKU's design philosophy:

**"Fewer, Better, Slower"** = **Clean code, reliable deployment, thoughtful social sharing**

- **Fewer:** Minimal dependencies, essential features only
- **Better:** Professional social presence, reliable performance  
- **Slower:** Thorough testing, proper documentation, sustainable architecture

---

*This document should be referenced for all TUKU GROUP projects and updated as new patterns emerge.*

**Last Updated:** October 7, 2025  
**Next Review:** January 2026
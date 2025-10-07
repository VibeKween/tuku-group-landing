# TUKU GROUP Payment Page

Ultra-minimal payment page for tukugroup.com services, built with vanilla JavaScript, HTML, and CSS. Features the complete TUKU design system including static clouds, blue accents, and sophisticated form validation.

## ✨ Features

- **Pure vanilla stack**: No frameworks, no build tools
- **Complete TUKU aesthetic**: Perfect design system alignment with homepage
- **Static cloud system**: Hand-drawn cloud background matching homepage
- **Secure payments**: Stripe integration with PCI compliance
- **Three service tiers**: Consultation ($500), Sprint ($5,000), Retainer ($8,000)
- **Responsive design**: Mobile-first approach with TUKU spacing
- **Light theme**: Consistent with TUKU brand (white bg, black text, blue accents)
- **Advanced email validation**: Whitelist-based domain validation with typo detection
- **Real-time form validation**: Elegant error messaging with TUKU styling
- **Smooth interactions**: Hover animations, gentle lifts, shimmer effects

## Services

| Service | Price | Description |
|---------|--------|-------------|
| Initial Consultation | $500 | A conversation, then a plan. |
| Two-Week Sprint | $5,000 | Scope something small. Ship it well. |
| Monthly Retainer | $8,000 | Ongoing guidance. Thoughtful execution. |

## Setup

### 1. Install Dependencies
```bash
npm install
```

### 2. Environment Configuration
Copy `.env.example` to `.env` and add your Stripe keys:
```bash
cp .env.example .env
```

Edit `.env`:
```
STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
PORT=3000
NODE_ENV=development
```

### 3. Update Frontend Configuration
Edit `payment.js` to set your Stripe publishable key:
```javascript
const STRIPE_PUBLISHABLE_KEY = 'pk_test_...'; // Your actual key
```

### 4. Run Development Server
```bash
npm run dev
```

Visit: `http://localhost:3000/payment`

## Testing

Use Stripe test cards:
- **Success**: 4242 4242 4242 4242
- **Decline**: 4000 0000 0000 0002
- **3D Secure**: 4000 0025 0000 3155

## File Structure

```
/payment
  index.html              # Main payment page
  payment.css             # TUKU-style minimal CSS
  payment.js              # Vanilla JS payment flow
  server.js               # Express server
  package.json            # Dependencies
  /api
    create-payment-intent.js  # Stripe payment setup
    webhook.js                # Stripe webhook handler
  /config
    services.json             # Service definitions
  .env.example              # Environment template
  .gitignore               # Git ignore rules
```

## 🎨 Complete TUKU Design System

### Brand Colors (Updated)
```css
/* Core TUKU Colors */
--color-black: #000000;
--color-white: #FFFFFF;
--color-gold: #C19A4B;

/* TUKU Blue Palette (from Cloud System) */
--color-blue-light: #f0f9ff;    /* Light sky blue */
--color-blue-medium: #e0f2fe;   /* Medium sky blue */
--color-blue-accent: #5691c8;   /* Accent blue (links, buttons) */
--color-blue-deep: #4a7ba7;     /* Deep blue (hover states) */
```

### Design Enhancements
- **Cloud Background**: Ethereal gradient with hand-drawn static clouds
- **Service Cards**: Calming blue selection states (no harsh black overlays)
- **Form Validation**: Gold error messages with elegant copy
- **Button Interactions**: Shimmer effects, gentle lifts, cloud-like glows
- **Typography Hierarchy**: Italic service descriptions for refinement

### Typography (Updated)
- **Font**: JetBrains Mono (matching homepage)
- **Weight**: 300-600 (light to semibold)
- **Line height**: 1.5-1.8
- **Letter spacing**: -0.02em (headers), 0 (body)
- **Service descriptions**: Italic for elegant hierarchy

## 🔐 Advanced Email Validation

### Whitelist-Based Domain Validation
- **Accepts**: 50+ major email providers (Gmail, Yahoo, Outlook, etc.)
- **Business domains**: Any .com/.org/.net/.co/.io/.biz/.info
- **International**: Country-specific domains (.co.uk, .com.au, etc.)
- **Educational**: .edu, .ac.uk, etc.

### Typo Detection
- **Catches all typos** automatically (not in whitelist)
- **Error message**: "Please check the email domain spelling."
- **Examples caught**: gamil.com, gmmail.com, yahooo.com, hotmial.com

### Validation Messages (Human-Friendly)
- Name: "A name for the conversation."
- Email: "An email address helps us connect."
- Typos: "Please check the email domain spelling."

### Layout
- **Max width**: 600px centered
- **Spacing**: 3rem+ generous whitespace
- **Borders**: 1px #222 (subtle)
- **Single column**: Vertical flow
- **No shadows**: Pure minimal aesthetic

## Production Deployment

### 🚀 Quick Deploy to Production

**Recommended Platform: Vercel**
- Zero-config deployment with automatic HTTPS
- Perfect for TUKU's minimal architecture
- Environment variable management built-in

### 1. Repository Setup
```bash
git init
git add .
git commit -m "🎉 TUKU Payment System - Production Ready"
git remote add origin [your-repository-url]
git push -u origin main
```

### 2. Platform Deployment
**Vercel (Recommended):**
1. Connect GitHub repository to Vercel
2. Add environment variables in Vercel dashboard
3. Deploy automatically from main branch

**Alternative - Railway:**
1. Connect GitHub repository to Railway
2. Configure environment variables
3. Deploy with zero configuration

### 3. Domain Configuration
**Option A - Subdomain (Recommended):**
- Set up `payment.tukugroup.com`
- Add CNAME record pointing to deployment platform

**Option B - Subdirectory:**
- Configure `tukugroup.com/payment`
- Requires additional routing setup

### 4. Environment Setup (Production)
```env
STRIPE_PUBLISHABLE_KEY=pk_live_...
STRIPE_SECRET_KEY=sk_live_...
STRIPE_WEBHOOK_SECRET=whsec_...
NODE_ENV=production
PORT=3000
```

### 5. Stripe Webhook Configuration
- **Production URL**: `https://payment.tukugroup.com/api/webhook`
- **Events**: `payment_intent.succeeded`, `payment_intent.payment_failed`
- **Security**: Webhook signature verification enabled

### 6. Go-Live Testing
- Test with real payment ($1-5)
- Verify webhook delivery
- Confirm email receipts
- Check mobile responsiveness
- Validate SSL certificate

### 7. Launch Checklist
- [ ] All tests passing in production environment
- [ ] Stripe webhooks receiving events
- [ ] Payment confirmations working
- [ ] Email delivery verified
- [ ] Mobile experience optimized
- [ ] Performance < 2 second load times

**See `PRODUCTION-DEPLOYMENT-PLAN.md` for comprehensive deployment guide**

## Security Notes

- Card data never touches your servers (Stripe.js handles this)
- Webhook signature verification prevents tampering
- HTTPS required for production
- Environment variables keep keys secure

## Customization

### Service Configuration
Edit services in `payment.js` and `api/create-payment-intent.js`:
```javascript
const SERVICES = {
  newService: {
    id: 'newService',
    name: 'Custom Service',
    price: 100000, // $1000 in cents
    description: 'Your service description.'
  }
};
```

### Styling
All styles in `payment.css` follow TUKU's minimal approach:
- No shadows or gradients
- Subtle hover states
- Generous whitespace
- Text-based hierarchy

## Support

Questions about implementation:
- Check Stripe documentation
- Review error logs in browser console
- Verify webhook endpoints in Stripe Dashboard

For TUKU-specific questions:
contact@tukugroup.com
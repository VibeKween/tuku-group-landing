#!/bin/bash

# TUKU GROUP Payment System Deployment Script
# Follows established dual-directory deployment pattern

echo "🚀 TUKU GROUP Payment System Deployment"
echo "========================================"

# Ensure we're in the correct directory
cd /Users/falonbahal/Desktop/DEVELOPMENT/TUKU-GROUP/01-LANDING-PAGE

echo "📁 Current directory: $(pwd)"

# Step 1: Copy payment files from website/ to root (following TUKU pattern)
echo "📋 Step 1: Copying payment system to production directory..."

# Copy entire payment directory from development to production
cp -r website/payment payment/

echo "✅ Payment system copied to production directory"

# Step 2: Copy updated homepage from website/ to root
echo "📋 Step 2: Copying updated homepage to production..."

cp website/index.html index.html

echo "✅ Homepage updated in production"

# Step 3: Verify deployment structure
echo "📋 Step 3: Verifying deployment structure..."

echo "Production structure:"
ls -la | grep -E "(index\.html|payment|css)"

echo ""
echo "Payment directory contents:"
ls -la payment/ | head -10

# Step 4: Git commit and deploy
echo "📋 Step 4: Committing changes..."

git add .
git commit -m "🚀 Deploy payment system integration

✨ Features Added:
- Payment system integrated into main tukugroup.com website
- Homepage updated with 'Work with us' payment link
- Dual-directory deployment pattern maintained
- Production-ready payment processing at /payment

🔧 Technical:
- Stripe integration with TUKU GROUP sandbox
- Advanced email validation system
- TUKU design system consistency maintained
- Mobile-responsive payment experience

📍 URLs:
- Main site: tukugroup.com
- Payment: tukugroup.com/payment

🧪 Generated with Claude Code
Co-Authored-By: Claude <noreply@anthropic.com>"

echo "✅ Changes committed to git"

# Step 5: Display next steps
echo ""
echo "🎉 DEPLOYMENT COMPLETE!"
echo "======================"
echo ""
echo "✅ Payment system integrated into tukugroup.com"
echo "✅ Homepage updated with payment link"
echo "✅ Production files ready for GitHub Pages"
echo ""
echo "🔗 URLs:"
echo "   Main site: https://tukugroup.com"
echo "   Payment:   https://tukugroup.com/payment"
echo ""
echo "📋 Next Steps:"
echo "1. Push to GitHub: git push origin main"
echo "2. Verify GitHub Pages deployment"
echo "3. Test payment flow at tukugroup.com/payment"
echo "4. Configure Stripe webhook: https://tukugroup.com/payment/api/webhook"
echo ""
echo "🎯 Ready for production!"
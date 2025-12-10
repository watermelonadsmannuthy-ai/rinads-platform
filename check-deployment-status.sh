#!/bin/bash

echo "🚀 Triggering Vercel Deployment via Git Push"
echo "=============================================="
echo ""

# Check current status
echo "📊 Current Git Status:"
git status --short
echo ""

# Show latest commits
echo "📝 Latest Commits:"
git log --oneline -3
echo ""

# Check if we're up to date with remote
echo "🔄 Checking remote status..."
git fetch origin main
BEHIND=$(git rev-list HEAD..origin/main --count)
AHEAD=$(git rev-list origin/main..HEAD --count)

if [ "$BEHIND" -gt 0 ]; then
    echo "⚠️  Local branch is $BEHIND commits behind origin/main"
    echo "Run: git pull origin main"
elif [ "$AHEAD" -gt 0 ]; then
    echo "✅ Local branch is $AHEAD commits ahead of origin/main"
    echo "Latest changes are already pushed!"
else
    echo "✅ Local branch is up to date with origin/main"
fi
echo ""

# Check Vercel deployment
echo "🔍 Checking Vercel Deployment..."
echo "Latest commit pushed: $(git log origin/main -1 --oneline)"
echo ""

echo "=============================================="
echo "📋 NEXT STEPS:"
echo "=============================================="
echo ""
echo "Since your code is already pushed to GitHub:"
echo ""
echo "1️⃣ Vercel should auto-deploy (if enabled)"
echo "   - Check: https://vercel.com/watermelons-projects-844cccfc/rinads-platform"
echo ""
echo "2️⃣ OR manually trigger deployment:"
echo "   - Go to Vercel dashboard"
echo "   - Click the ••• menu on latest deployment"
echo "   - Click 'Redeploy'"
echo ""
echo "3️⃣ Verify deployment:"
echo "   - Run: ./verify-deployment.sh"
echo "   - Or visit: https://www.rinads.com"
echo ""
echo "4️⃣ Check environment variables:"
echo "   - Go to Vercel Settings → Environment Variables"
echo "   - Verify OPENAI_API_KEY is set"
echo "   - See VERCEL_ENV_VARIABLES.txt for all required vars"
echo ""
echo "🎉 Your code is ready for deployment!"

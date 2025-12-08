#!/bin/bash
# Deployment readiness check script

echo "🔍 Checking deployment readiness..."
echo ""

# Check environment variables
echo "📋 Checking environment variables..."
if [ -f .env.local ]; then
    echo "✅ .env.local file exists"
    
    # Check required vars
    if grep -q "NEXT_PUBLIC_SUPABASE_URL" .env.local; then
        echo "✅ NEXT_PUBLIC_SUPABASE_URL is set"
    else
        echo "❌ NEXT_PUBLIC_SUPABASE_URL is missing"
    fi
    
    if grep -q "SUPABASE_SERVICE_ROLE_KEY" .env.local; then
        echo "✅ SUPABASE_SERVICE_ROLE_KEY is set"
    else
        echo "❌ SUPABASE_SERVICE_ROLE_KEY is missing"
    fi
    
    if grep -q "RAZORPAY_KEY_ID" .env.local && ! grep -q "your_key_id" .env.local; then
        echo "✅ RAZORPAY_KEY_ID is set"
    else
        echo "⚠️  RAZORPAY_KEY_ID not configured (optional for testing)"
    fi
else
    echo "❌ .env.local file not found"
fi

echo ""
echo "📦 Checking build..."
if npm run build > /dev/null 2>&1; then
    echo "✅ Build succeeds"
else
    echo "❌ Build fails - fix errors before deploying"
fi

echo ""
echo "📊 Summary:"
echo "  - Run support schema in Supabase (supabase/support-schema.sql)"
echo "  - Set environment variables in Vercel"
echo "  - Configure Razorpay webhook"
echo "  - Deploy to Vercel"
echo ""
echo "See DEPLOY_TO_PRODUCTION.md for complete guide"


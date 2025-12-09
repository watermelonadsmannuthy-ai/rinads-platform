#!/bin/bash

# Vercel Deployment Script
# This script helps deploy to Vercel via CLI

echo "🚀 Vercel Deployment Script"
echo "==========================="
echo ""

# Check if Vercel CLI is installed
if ! command -v vercel &> /dev/null; then
    echo "❌ Vercel CLI not found"
    echo "   Install with: npm i -g vercel"
    exit 1
fi

echo "✅ Vercel CLI found"
echo ""

# Check if logged in
if ! vercel whoami &> /dev/null; then
    echo "🔐 Not logged in. Logging in..."
    vercel login
fi

echo "✅ Logged in to Vercel"
echo ""

# Check for .env.local
if [ ! -f .env.local ]; then
    echo "⚠️  .env.local not found"
    echo "   Run: ./scripts/deploy-setup.sh first"
    exit 1
fi

echo "📋 Environment variables found"
echo ""

# Ask if user wants to add env vars
read -p "Add environment variables to Vercel? (y/n) " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    echo ""
    echo "Adding environment variables..."
    echo "Press Enter for each variable, paste value when prompted"
    echo ""
    
    # Read .env.local and add each variable
    while IFS='=' read -r key value; do
        # Skip comments and empty lines
        [[ "$key" =~ ^#.*$ ]] && continue
        [[ -z "$key" ]] && continue
        
        # Remove quotes from value
        value=$(echo "$value" | sed 's/^"\(.*\)"$/\1/')
        
        # Skip placeholder values
        [[ "$value" == "your-key-here" ]] && continue
        [[ "$value" == "CHANGE_THIS_TO_RANDOM_SECRET" ]] && continue
        [[ "$value" == "your-app.vercel.app" ]] && continue
        
        echo "Adding: $key"
        echo "$value" | vercel env add "$key" production
    done < .env.local
    
    echo ""
    echo "✅ Environment variables added"
fi

echo ""
echo "🚀 Deploying to Vercel..."
echo ""

# Deploy
vercel --prod

echo ""
echo "✅ Deployment complete!"
echo ""
echo "📋 Next steps:"
echo "1. Update NEXT_PUBLIC_APP_URL with your Vercel URL"
echo "2. Verify cron jobs in Vercel Dashboard → Settings → Cron Jobs"
echo "3. Test your app at the deployment URL"


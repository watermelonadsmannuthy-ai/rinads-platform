#!/bin/bash

# RINADS BusinessOS Deployment Script
# This script helps you deploy to Vercel and connect your domain

echo "🚀 RINADS BusinessOS Deployment Helper"
echo "========================================"
echo ""

# Check if git is initialized
if [ ! -d ".git" ]; then
    echo "⚠️  Git not initialized. Initializing..."
    git init
    git branch -M main
fi

# Check for uncommitted changes
if [ -n "$(git status --porcelain)" ]; then
    echo "📝 Found uncommitted changes."
    read -p "Do you want to commit them now? (y/n) " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        git add .
        git commit -m "Deploy BusinessOS structure"
        echo "✅ Changes committed"
    fi
fi

echo ""
echo "Choose deployment method:"
echo "1. Deploy via Vercel CLI (recommended)"
echo "2. Deploy via Vercel Dashboard (GitHub)"
echo "3. Just show me the instructions"
read -p "Enter choice (1-3): " choice

case $choice in
    1)
        echo ""
        echo "📦 Installing Vercel CLI..."
        npm install -g vercel
        
        echo ""
        echo "🚀 Deploying to Vercel..."
        vercel
        
        echo ""
        echo "✅ Deployment started!"
        echo "Next steps:"
        echo "1. Go to Vercel Dashboard: https://vercel.com/dashboard"
        echo "2. Select your project → Settings → Domains"
        echo "3. Add domain: rinads.com"
        echo "4. Follow DNS instructions shown in Vercel"
        ;;
    2)
        echo ""
        echo "📋 Steps to deploy via Vercel Dashboard:"
        echo ""
        echo "1. Push to GitHub (if not already):"
        echo "   git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO.git"
        echo "   git push -u origin main"
        echo ""
        echo "2. Go to https://vercel.com"
        echo "3. Click 'Add New Project'"
        echo "4. Import your GitHub repository"
        echo "5. Click 'Deploy' (settings are auto-detected)"
        echo ""
        echo "6. After deployment:"
        echo "   - Go to Settings → Domains"
        echo "   - Add: rinads.com and www.rinads.com"
        echo "   - Add DNS records shown in Vercel to your domain registrar"
        ;;
    3)
        echo ""
        echo "📖 See DEPLOYMENT.md for detailed instructions"
        ;;
    *)
        echo "Invalid choice"
        ;;
esac

echo ""
echo "🌐 Domain Configuration:"
echo "After deployment, add these DNS records in your domain registrar:"
echo ""
echo "For rinads.com (apex domain):"
echo "  Type: A"
echo "  Name: @"
echo "  Value: [Check Vercel dashboard for current IP]"
echo ""
echo "OR use CNAME:"
echo "  Type: CNAME"
echo "  Name: @"
echo "  Value: cname.vercel-dns.com"
echo ""
echo "For www.rinads.com:"
echo "  Type: CNAME"
echo "  Name: www"
echo "  Value: cname.vercel-dns.com"
echo ""
echo "⏱️  DNS changes can take 24-48 hours to propagate"
echo ""






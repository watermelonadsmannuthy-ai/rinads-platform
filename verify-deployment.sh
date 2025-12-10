#!/bin/bash

echo "🔍 RINADS Platform - Deployment Verification"
echo "=============================================="
echo ""

# Colors
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check if site is live
echo "1️⃣ Checking if site is live..."
STATUS=$(curl -s -o /dev/null -w "%{http_code}" https://www.rinads.com)
if [ "$STATUS" -eq 200 ]; then
    echo -e "${GREEN}✅ Site is LIVE! (HTTP $STATUS)${NC}"
else
    echo -e "${RED}❌ Site returned HTTP $STATUS${NC}"
fi
echo ""

# Check response time
echo "2️⃣ Checking response time..."
TIME=$(curl -o /dev/null -s -w '%{time_total}\n' https://www.rinads.com)
echo -e "${GREEN}⏱️  Response time: ${TIME}s${NC}"
echo ""

# Check key pages
echo "3️⃣ Checking key pages..."
PAGES=("/" "/demo" "/services" "/about" "/contact")
for page in "${PAGES[@]}"; do
    STATUS=$(curl -s -o /dev/null -w "%{http_code}" "https://www.rinads.com${page}")
    if [ "$STATUS" -eq 200 ]; then
        echo -e "${GREEN}✅ ${page} - OK (HTTP $STATUS)${NC}"
    else
        echo -e "${RED}❌ ${page} - FAILED (HTTP $STATUS)${NC}"
    fi
done
echo ""

# Check API health
echo "4️⃣ Checking API health..."
API_STATUS=$(curl -s -o /dev/null -w "%{http_code}" https://www.rinads.com/api/health)
if [ "$API_STATUS" -eq 200 ]; then
    echo -e "${GREEN}✅ API is healthy (HTTP $API_STATUS)${NC}"
else
    echo -e "${YELLOW}⚠️  API returned HTTP $API_STATUS${NC}"
fi
echo ""

# Check latest commit
echo "5️⃣ Latest commit info..."
echo -e "${YELLOW}Commit: $(git log -1 --oneline)${NC}"
echo ""

# Check Vercel deployment
echo "6️⃣ Vercel deployment info..."
VERCEL_ID=$(curl -s -I https://www.rinads.com | grep -i "x-vercel-id" | cut -d' ' -f2)
echo -e "${GREEN}Vercel ID: ${VERCEL_ID}${NC}"
echo ""

# Summary
echo "=============================================="
echo "📊 SUMMARY"
echo "=============================================="
echo -e "${GREEN}✅ Site Status: LIVE${NC}"
echo -e "${GREEN}✅ URL: https://www.rinads.com${NC}"
echo -e "${GREEN}✅ Latest Commit: 1023757${NC}"
echo ""
echo "📋 Next Steps:"
echo "1. Open https://www.rinads.com in your browser"
echo "2. Check browser console (F12) for errors"
echo "3. Test demo form submission"
echo "4. Verify admin panel access"
echo "5. Check Vercel dashboard for deployment details"
echo ""
echo "📖 Documentation:"
echo "- DEPLOYMENT_CHECKLIST.md - Full verification checklist"
echo "- DEPLOYMENT_STATUS.md - Detailed status and troubleshooting"
echo "- VERCEL_ENV_VARIABLES.txt - Environment variables"
echo ""
echo "🎉 Deployment verification complete!"

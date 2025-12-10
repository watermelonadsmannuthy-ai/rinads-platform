#!/bin/bash

# RINADS Platform - Production Monitoring Dashboard
# Run this to check the health of your production deployment

echo "🏥 RINADS Platform - Health Check Dashboard"
echo "==========================================="
echo ""

# Colors
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Production URL
PROD_URL="https://www.rinads.com"
HEALTH_ENDPOINT="$PROD_URL/api/health"

echo -e "${BLUE}🌐 Production URL: $PROD_URL${NC}"
echo ""

# Check if site is reachable
echo "1️⃣ Checking site availability..."
STATUS_CODE=$(curl -s -o /dev/null -w "%{http_code}" "$PROD_URL")
if [ "$STATUS_CODE" -eq 200 ]; then
    echo -e "${GREEN}✅ Site is reachable (HTTP $STATUS_CODE)${NC}"
else
    echo -e "${RED}❌ Site returned HTTP $STATUS_CODE${NC}"
fi
echo ""

# Check health endpoint
echo "2️⃣ Checking health endpoint..."
HEALTH_RESPONSE=$(curl -s "$HEALTH_ENDPOINT")

if [ $? -eq 0 ]; then
    echo -e "${GREEN}✅ Health endpoint is responding${NC}"
    echo ""
    
    # Parse health response
    echo "📊 Health Check Results:"
    echo "------------------------"
    echo "$HEALTH_RESPONSE" | jq '.'
    echo ""
    
    # Extract key metrics
    OVERALL_STATUS=$(echo "$HEALTH_RESPONSE" | jq -r '.status')
    DB_STATUS=$(echo "$HEALTH_RESPONSE" | jq -r '.checks.database.status')
    DB_RESPONSE_TIME=$(echo "$HEALTH_RESPONSE" | jq -r '.checks.database.responseTime')
    ENV_STATUS=$(echo "$HEALTH_RESPONSE" | jq -r '.checks.environment.status')
    MISSING_VARS=$(echo "$HEALTH_RESPONSE" | jq -r '.checks.environment.missingVars | join(", ")')
    
    echo "📈 Summary:"
    echo "------------------------"
    
    if [ "$OVERALL_STATUS" == "healthy" ]; then
        echo -e "${GREEN}✅ Overall Status: HEALTHY${NC}"
    else
        echo -e "${YELLOW}⚠️  Overall Status: $OVERALL_STATUS${NC}"
    fi
    
    if [ "$DB_STATUS" == "healthy" ]; then
        echo -e "${GREEN}✅ Database: HEALTHY (${DB_RESPONSE_TIME}ms)${NC}"
    else
        echo -e "${RED}❌ Database: $DB_STATUS${NC}"
    fi
    
    if [ "$ENV_STATUS" == "healthy" ]; then
        echo -e "${GREEN}✅ Environment: ALL VARIABLES SET${NC}"
    else
        echo -e "${YELLOW}⚠️  Environment: Missing variables: $MISSING_VARS${NC}"
    fi
    
else
    echo -e "${RED}❌ Health endpoint is not responding${NC}"
fi
echo ""

# Check response time
echo "3️⃣ Checking response time..."
RESPONSE_TIME=$(curl -o /dev/null -s -w '%{time_total}\n' "$PROD_URL")
echo -e "${BLUE}⏱️  Response time: ${RESPONSE_TIME}s${NC}"

if (( $(echo "$RESPONSE_TIME < 1.0" | bc -l) )); then
    echo -e "${GREEN}✅ Response time is excellent${NC}"
elif (( $(echo "$RESPONSE_TIME < 3.0" | bc -l) )); then
    echo -e "${YELLOW}⚠️  Response time is acceptable${NC}"
else
    echo -e "${RED}❌ Response time is slow${NC}"
fi
echo ""

# Check SSL certificate
echo "4️⃣ Checking SSL certificate..."
SSL_EXPIRY=$(echo | openssl s_client -servername www.rinads.com -connect www.rinads.com:443 2>/dev/null | openssl x509 -noout -enddate 2>/dev/null | cut -d= -f2)
if [ -n "$SSL_EXPIRY" ]; then
    echo -e "${GREEN}✅ SSL Certificate valid until: $SSL_EXPIRY${NC}"
else
    echo -e "${YELLOW}⚠️  Could not verify SSL certificate${NC}"
fi
echo ""

# Check key pages
echo "5️⃣ Checking key pages..."
PAGES=("/" "/demo" "/services" "/pricing" "/features" "/login")
for page in "${PAGES[@]}"; do
    PAGE_STATUS=$(curl -s -o /dev/null -w "%{http_code}" "$PROD_URL$page")
    if [ "$PAGE_STATUS" -eq 200 ]; then
        echo -e "${GREEN}✅ $page - OK${NC}"
    elif [ "$PAGE_STATUS" -eq 404 ]; then
        echo -e "${YELLOW}⚠️  $page - Not Found (may not exist yet)${NC}"
    else
        echo -e "${RED}❌ $page - HTTP $PAGE_STATUS${NC}"
    fi
done
echo ""

# Check API endpoints
echo "6️⃣ Checking API endpoints..."
API_ENDPOINTS=("/api/health")
for endpoint in "${API_ENDPOINTS[@]}"; do
    API_STATUS=$(curl -s -o /dev/null -w "%{http_code}" "$PROD_URL$endpoint")
    if [ "$API_STATUS" -eq 200 ] || [ "$API_STATUS" -eq 503 ]; then
        echo -e "${GREEN}✅ $endpoint - Responding${NC}"
    else
        echo -e "${RED}❌ $endpoint - HTTP $API_STATUS${NC}"
    fi
done
echo ""

# Check Vercel deployment info
echo "7️⃣ Checking Vercel deployment..."
VERCEL_ID=$(curl -s -I "$PROD_URL" | grep -i "x-vercel-id" | cut -d' ' -f2 | tr -d '\r')
VERCEL_CACHE=$(curl -s -I "$PROD_URL" | grep -i "x-vercel-cache" | cut -d' ' -f2 | tr -d '\r')

if [ -n "$VERCEL_ID" ]; then
    echo -e "${BLUE}📦 Vercel ID: $VERCEL_ID${NC}"
fi

if [ -n "$VERCEL_CACHE" ]; then
    echo -e "${BLUE}💾 Cache Status: $VERCEL_CACHE${NC}"
fi
echo ""

# Summary
echo "==========================================="
echo "📊 MONITORING SUMMARY"
echo "==========================================="
echo ""
echo -e "${BLUE}🌐 Site URL:${NC} $PROD_URL"
echo -e "${BLUE}📅 Check Time:${NC} $(date)"
echo -e "${BLUE}⏱️  Response Time:${NC} ${RESPONSE_TIME}s"
echo ""

if [ "$STATUS_CODE" -eq 200 ] && [ "$OVERALL_STATUS" == "healthy" ]; then
    echo -e "${GREEN}✅ ALL SYSTEMS OPERATIONAL${NC}"
elif [ "$STATUS_CODE" -eq 200 ]; then
    echo -e "${YELLOW}⚠️  SITE IS UP BUT SOME CHECKS FAILED${NC}"
    echo -e "${YELLOW}   Check the details above for issues${NC}"
else
    echo -e "${RED}❌ SITE IS DOWN OR UNREACHABLE${NC}"
    echo -e "${RED}   Immediate action required!${NC}"
fi
echo ""

echo "📋 Next Steps:"
echo "- Review any warnings or errors above"
echo "- Check Vercel dashboard for deployment details"
echo "- Monitor error logs for issues"
echo "- Run this script regularly to track health"
echo ""
echo "🔗 Quick Links:"
echo "- Vercel: https://vercel.com/watermelons-projects-844cccfc/rinads-platform"
echo "- Supabase: https://supabase.com/dashboard/project/zqeamdmbkvcojriwmoqc"
echo ""
echo "✨ Monitoring complete!"

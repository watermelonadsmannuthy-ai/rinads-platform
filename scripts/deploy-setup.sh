#!/bin/bash

# RINADS Deployment Setup Script
# This script helps prepare everything for Vercel deployment

echo "🚀 RINADS Deployment Setup"
echo "=========================="
echo ""

# Check if .env.local exists
if [ ! -f .env.local ]; then
    echo "📝 Creating .env.local template..."
    cat > .env.local << 'EOF'
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://zqeamdmbkvcojriwmoqc.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpxZWFtZG1ia3Zjb2pyaXdtb3FjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjUyMTc3MDIsImV4cCI6MjA4MDc5MzcwMn0.ekaXGm1aCSXK4PryBUvvml0sUvf85Ty_lC5_o9oxpBI
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpxZWFtZG1ia3Zjb2pyaXdtb3FjIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2NTIxNzcwMiwiZXhwIjoyMDgwNzkzNzAyfQ.Q3GTiVoBPRvaKfI0fQNea4mQCEoHEc5e0eipFPTF9SQ

# OpenAI (For AI Features)
OPENAI_API_KEY=sk-your-key-here
OPENAI_MODEL=gpt-4-turbo-preview

# Email Notifications
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
SMTP_FROM=noreply@rinads.com

# Cron Jobs (Generate with: openssl rand -base64 32)
CRON_SECRET=CHANGE_THIS_TO_RANDOM_SECRET

# App URL (Update after deployment)
NEXT_PUBLIC_APP_URL=https://your-app.vercel.app

# Razorpay (Optional)
RAZORPAY_KEY_ID=your_key_id
RAZORPAY_KEY_SECRET=your_key_secret
RAZORPAY_WEBHOOK_SECRET=your_webhook_secret
EOF
    echo "✅ Created .env.local template"
else
    echo "✅ .env.local already exists"
fi

# Generate CRON_SECRET if not set
if ! grep -q "CRON_SECRET=.*[A-Za-z0-9]" .env.local 2>/dev/null || grep -q "CRON_SECRET=CHANGE_THIS" .env.local 2>/dev/null; then
    echo ""
    echo "🔐 Generating CRON_SECRET..."
    CRON_SECRET=$(openssl rand -base64 32 | tr -d '\n')
    if [[ "$OSTYPE" == "darwin"* ]]; then
        # macOS
        sed -i '' "s/CRON_SECRET=.*/CRON_SECRET=$CRON_SECRET/" .env.local
    else
        # Linux
        sed -i "s/CRON_SECRET=.*/CRON_SECRET=$CRON_SECRET/" .env.local
    fi
    echo "✅ Generated CRON_SECRET: $CRON_SECRET"
    echo "   (Save this for Vercel environment variables)"
fi

echo ""
echo "📋 Next Steps:"
echo "=============="
echo ""
echo "1. Review and update .env.local with your actual values"
echo "2. Run database schemas in Supabase:"
echo "   - supabase/schema.sql"
echo "   - supabase/support-schema.sql"
echo "   - supabase/erp-agency-schema.sql"
echo ""
echo "3. Deploy to Vercel:"
echo "   - Go to: https://vercel.com/new"
echo "   - Import: watermelonadsmannuthy-ai/rinads-platform"
echo "   - Add environment variables from .env.local"
echo ""
echo "4. After deployment, update NEXT_PUBLIC_APP_URL with your Vercel URL"
echo ""
echo "✅ Setup complete!"


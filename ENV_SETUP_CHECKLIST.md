# Environment Variables Setup Checklist

Your `.env.local` file already has email configuration. Add these required variables:

## Required Variables (Add to .env.local)

```env
# Supabase (REQUIRED)
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here

# Razorpay (REQUIRED for billing features)
RAZORPAY_KEY_ID=your_razorpay_key_id
RAZORPAY_KEY_SECRET=your_razorpay_key_secret
RAZORPAY_WEBHOOK_SECRET=your_razorpay_webhook_secret
```

## Optional Variables

```env
# OpenAI (for AI features)
NEXT_PUBLIC_OPENAI_KEY=your_openai_key

# Sentry (for error tracking)
SENTRY_DSN=your_sentry_dsn
```

## How to Get Supabase Credentials

1. Go to https://supabase.com/dashboard
2. Select your project (or create a new one)
3. Go to **Settings** → **API**
4. Copy:
   - **Project URL** → `NEXT_PUBLIC_SUPABASE_URL`
   - **anon public** key → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - **service_role** key → `SUPABASE_SERVICE_ROLE_KEY`

## How to Get Razorpay Credentials

1. Go to https://dashboard.razorpay.com
2. Go to **Settings** → **API Keys**
3. Generate test/live keys
4. Copy:
   - **Key ID** → `RAZORPAY_KEY_ID`
   - **Key Secret** → `RAZORPAY_KEY_SECRET`
5. For webhook secret:
   - Go to **Settings** → **Webhooks**
   - Create webhook URL: `https://your-domain.com/api/razorpay/webhook`
   - Copy the webhook secret → `RAZORPAY_WEBHOOK_SECRET`

## Quick Test

After adding Supabase variables, test with:
```bash
npm run seed
```

If it works, you'll see:
```
🌱 Starting seed...
✅ Feature flags initialized
✅ Created tenant: Trendy Cuts
🎉 Seed completed successfully!
```


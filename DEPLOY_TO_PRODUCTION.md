# Deploy to Production - Complete Guide

## 🚀 Pre-Deployment Checklist

### 1. Database Setup ✅
- [x] Main schema run (`supabase/schema.sql`)
- [ ] Support schema run (`supabase/support-schema.sql`) - **DO THIS NOW**
- [x] Feature flags initialized (`npm run seed`)
- [x] Sample data created

### 2. Environment Variables

**Required for Production:**
```env
# Supabase (Already configured ✅)
NEXT_PUBLIC_SUPABASE_URL=https://zqeamdmbkvcojriwmoqc.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

# Razorpay (Configure for payments)
RAZORPAY_KEY_ID=your_live_key_id
RAZORPAY_KEY_SECRET=your_live_key_secret
RAZORPAY_WEBHOOK_SECRET=your_webhook_secret

# Optional
SUPPORT_DESK_WEBHOOK_URL=https://your-intercom-webhook.com
SENTRY_DSN=your_sentry_dsn
NEXT_PUBLIC_OPENAI_KEY=your_openai_key
```

### 3. Run Support Schema (IMPORTANT!)

**In Supabase SQL Editor:**
1. Open `supabase/support-schema.sql`
2. Copy entire contents
3. Paste in Supabase SQL Editor
4. Click "Run"

This creates:
- `error_logs` table
- `support_tickets` table
- `incidents` table
- `sla_tracking` table
- `get_sla_for_plan()` function

### 4. Configure Razorpay

1. **Create Plans in Razorpay:**
   - Solo plan
   - Studio plan
   - Pro plan
   - Enterprise plan

2. **Update Plan IDs in Code:**
   - Edit `lib/razorpay.ts` (line ~85)
   - Replace placeholder plan IDs with actual Razorpay plan IDs

3. **Set Up Webhook:**
   - Go to Razorpay Dashboard → Settings → Webhooks
   - Add webhook URL: `https://your-domain.com/api/razorpay/webhook`
   - Select events: `subscription.activated`, `subscription.cancelled`, `subscription.charged`
   - Copy webhook secret to `RAZORPAY_WEBHOOK_SECRET`

### 5. Deploy to Vercel

**Option A: GitHub Integration (Recommended)**
```bash
# 1. Initialize git (if not done)
git init
git add .
git commit -m "Initial commit - RINADS Salon ERP"

# 2. Push to GitHub
git remote add origin https://github.com/your-username/rinads-salon-erp.git
git push -u origin main

# 3. Import to Vercel
# - Go to vercel.com
# - Click "New Project"
# - Import from GitHub
# - Vercel auto-detects Next.js
```

**Option B: Vercel CLI**
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel

# Follow prompts
# - Link to existing project or create new
# - Add environment variables
```

### 6. Environment Variables in Vercel

**Add all environment variables in Vercel Dashboard:**
1. Go to Project Settings → Environment Variables
2. Add each variable:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY`
   - `RAZORPAY_KEY_ID`
   - `RAZORPAY_KEY_SECRET`
   - `RAZORPAY_WEBHOOK_SECRET`
   - `SUPPORT_DESK_WEBHOOK_URL` (optional)
   - `SENTRY_DSN` (optional)

### 7. Post-Deployment Steps

**After deployment:**
1. ✅ Test homepage: `https://your-domain.vercel.app`
2. ✅ Test admin dashboard: `https://your-domain.vercel.app/admin/tenants`
3. ✅ Test onboarding: `https://your-domain.vercel.app/onboarding`
4. ✅ Test Razorpay webhook (use Razorpay test mode first)
5. ✅ Verify feature flags working
6. ✅ Check error logging

## 🔒 Security Checklist

- [ ] `SUPABASE_SERVICE_ROLE_KEY` is NOT exposed to client
- [ ] `RAZORPAY_KEY_SECRET` is secure
- [ ] Webhook secret is configured
- [ ] RLS policies are enabled in Supabase
- [ ] Admin routes are protected (add auth middleware)
- [ ] Environment variables are set in Vercel (not in code)

## 📊 Monitoring Setup

### Sentry (Error Tracking)
1. Create Sentry account
2. Create Next.js project
3. Get DSN
4. Add to `.env.local` and Vercel
5. Uncomment Sentry code in `lib/observability.ts`

### Support Desk (Optional)
1. Set up Intercom/Freshdesk
2. Get webhook URL
3. Add `SUPPORT_DESK_WEBHOOK_URL` to Vercel

## 🧪 Testing After Deployment

```bash
# Test feature flags
npm run test:flags

# Test error handling
npm run test:errors

# Test plan resync (requires Razorpay)
npm run test:resync
```

## 🚨 Common Issues

### Tickets Not Showing
- **Fix:** Run `supabase/support-schema.sql` in Supabase

### Webhook Not Working
- **Fix:** Verify webhook URL in Razorpay matches production URL
- **Fix:** Check webhook secret matches

### Feature Flags Not Working
- **Fix:** Run `npm run seed` again
- **Fix:** Check `plan_features` table has data

### Build Errors
- **Fix:** Check all environment variables are set in Vercel
- **Fix:** Verify TypeScript compiles: `npm run build`

## 📝 Quick Deploy Commands

```bash
# 1. Build locally to test
npm run build

# 2. If build succeeds, deploy
vercel --prod

# Or push to GitHub (if using GitHub integration)
git push origin main
```

## ✅ Production Readiness Checklist

- [ ] Support schema run in Supabase
- [ ] All environment variables set in Vercel
- [ ] Razorpay configured with live keys
- [ ] Webhook URL configured in Razorpay
- [ ] Plan IDs updated in code
- [ ] Build succeeds (`npm run build`)
- [ ] Admin routes protected
- [ ] Error tracking configured (Sentry)
- [ ] Support desk configured (optional)
- [ ] Domain configured (optional)

## 🎯 You're Ready to Go Live!

Once all checkboxes are complete, your system is production-ready!


# 🚀 Go Live Checklist

## Critical Steps (Do These First!)

### 1. ✅ Run Support Schema in Supabase
**Status:** ⏳ TODO

**Action:**
1. Go to: https://supabase.com/dashboard/project/zqeamdmbkvcojriwmoqc/sql/new
2. Open `supabase/support-schema.sql` from this project
3. Copy entire file
4. Paste in SQL Editor
5. Click "Run"

**Why:** Creates tables for error tracking and support tickets

---

### 2. ✅ Configure Razorpay (For Payments)

**Status:** ⏳ TODO

**Actions:**
1. **Get Razorpay Credentials:**
   - Go to: https://dashboard.razorpay.com
   - Settings → API Keys
   - Generate/copy Live keys

2. **Create Plans:**
   - Plans → Create Plan
   - Create 4 plans: Solo, Studio, Pro, Enterprise
   - Copy Plan IDs

3. **Update Code:**
   - Edit `lib/razorpay.ts` (line ~85)
   - Replace placeholder plan IDs with actual Razorpay plan IDs

4. **Set Up Webhook:**
   - Settings → Webhooks
   - Add URL: `https://your-domain.vercel.app/api/razorpay/webhook`
   - Select events: `subscription.activated`, `subscription.cancelled`, `subscription.charged`
   - Copy webhook secret

5. **Add to Environment:**
   ```env
   RAZORPAY_KEY_ID=your_live_key_id
   RAZORPAY_KEY_SECRET=your_live_key_secret
   RAZORPAY_WEBHOOK_SECRET=your_webhook_secret
   ```

---

### 3. ✅ Deploy to Vercel

**Status:** ⏳ TODO

**Option A: GitHub Integration (Recommended)**
```bash
# 1. Initialize git
git init
git add .
git commit -m "RINADS Salon ERP - Production Ready"

# 2. Create GitHub repo and push
git remote add origin https://github.com/your-username/rinads-salon-erp.git
git push -u origin main

# 3. Import to Vercel
# - Go to vercel.com
# - New Project → Import from GitHub
# - Select your repo
# - Vercel auto-detects Next.js
```

**Option B: Vercel CLI**
```bash
npm i -g vercel
vercel
# Follow prompts
vercel --prod  # Deploy to production
```

---

### 4. ✅ Set Environment Variables in Vercel

**Status:** ⏳ TODO

**In Vercel Dashboard:**
1. Project Settings → Environment Variables
2. Add each variable:

**Required:**
- `NEXT_PUBLIC_SUPABASE_URL` = `https://zqeamdmbkvcojriwmoqc.supabase.co`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` = (your anon key)
- `SUPABASE_SERVICE_ROLE_KEY` = (your service role key)
- `RAZORPAY_KEY_ID` = (your live key)
- `RAZORPAY_KEY_SECRET` = (your live secret)
- `RAZORPAY_WEBHOOK_SECRET` = (your webhook secret)

**Optional:**
- `SUPPORT_DESK_WEBHOOK_URL` = (Intercom/Freshdesk webhook)
- `SENTRY_DSN` = (Sentry error tracking)
- `NEXT_PUBLIC_OPENAI_KEY` = (for AI features)

---

### 5. ✅ Test Production Deployment

**After deployment, test:**
- [ ] Homepage loads: `https://your-domain.vercel.app`
- [ ] Admin dashboard: `https://your-domain.vercel.app/admin/tenants`
- [ ] Support tickets: `https://your-domain.vercel.app/admin/support`
- [ ] Onboarding: `https://your-domain.vercel.app/onboarding`
- [ ] Feature flags working
- [ ] Error handling working

---

## Optional Enhancements

### 6. Configure Custom Domain
- [ ] Add domain in Vercel
- [ ] Update DNS records
- [ ] Update Razorpay webhook URL

### 7. Set Up Monitoring
- [ ] Configure Sentry for error tracking
- [ ] Set up uptime monitoring
- [ ] Configure alerts

### 8. Set Up Support Desk
- [ ] Configure Intercom/Freshdesk
- [ ] Add webhook URL
- [ ] Test ticket creation

---

## Quick Commands

```bash
# Check deployment readiness
./scripts/deploy-check.sh

# Build locally to test
npm run build

# Deploy to Vercel
vercel --prod
```

---

## 🎯 Current Status

✅ **Completed:**
- Database schema (main)
- Feature flags system
- Error handling
- Admin dashboard
- Support ticket system
- Seed script
- All tests passing

⏳ **To Do:**
- Run support schema
- Configure Razorpay
- Deploy to Vercel
- Set environment variables
- Test production

---

## 📞 Support

If you encounter issues:
1. Check `DEPLOY_TO_PRODUCTION.md` for detailed guide
2. Review error logs in Supabase
3. Check Vercel deployment logs
4. Verify all environment variables are set

**You're almost there! 🚀**


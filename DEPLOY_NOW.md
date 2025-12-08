# 🚀 Deploy Now - Quick Steps

## ✅ Pre-Deployment Status

- ✅ Build successful
- ✅ All tests passing
- ✅ Code ready for production

## Step 1: Run Support Schema (5 min)

**In Supabase SQL Editor:**
1. Open: https://supabase.com/dashboard/project/zqeamdmbkvcojriwmoqc/sql/new
2. Copy entire `supabase/support-schema.sql` file
3. Paste and click "Run"

**✅ This creates support tables for error tracking**

---

## Step 2: Deploy to Vercel (10 min)

### Option A: Vercel CLI (Fastest)

```bash
# Install Vercel CLI
npm i -g vercel

# Login
vercel login

# Deploy
vercel

# Deploy to production
vercel --prod
```

### Option B: GitHub + Vercel (Recommended)

```bash
# 1. Initialize git
git init
git add .
git commit -m "RINADS Salon ERP - Production Ready"

# 2. Create GitHub repo (go to github.com/new)
# 3. Push to GitHub
git remote add origin https://github.com/your-username/rinads-salon-erp.git
git push -u origin main

# 4. Import to Vercel
# - Go to vercel.com/new
# - Import from GitHub
# - Select your repo
# - Click Deploy
```

---

## Step 3: Set Environment Variables

**In Vercel Dashboard → Project Settings → Environment Variables:**

Add these (copy from your `.env.local`):

```
NEXT_PUBLIC_SUPABASE_URL=https://zqeamdmbkvcojriwmoqc.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Then redeploy** (or push a new commit)

---

## Step 4: Test Production

Visit your Vercel URL:
- `https://your-project.vercel.app`
- `https://your-project.vercel.app/admin/tenants`
- `https://your-project.vercel.app/admin/support`

---

## 🎉 You're Live!

Your RINADS Salon ERP is now deployed and ready for customers!

**Next (when ready):**
- Configure Razorpay for payments
- Set up custom domain
- Configure monitoring (Sentry)

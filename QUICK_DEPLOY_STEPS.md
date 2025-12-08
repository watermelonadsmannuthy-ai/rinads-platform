# Quick Deploy Steps

## Step 1: Run Support Schema (5 min)

### In Supabase:
1. **Open SQL Editor:**
   https://supabase.com/dashboard/project/zqeamdmbkvcojriwmoqc/sql/new

2. **Copy Support Schema:**
   - Open `supabase/support-schema.sql` in your editor
   - Select all (Cmd/Ctrl + A)
   - Copy (Cmd/Ctrl + C)

3. **Paste and Run:**
   - Paste in Supabase SQL Editor
   - Click "Run" button (or Cmd/Ctrl + Enter)
   - Wait for "Success" message

**✅ Done!** Support tables are now created.

---

## Step 2: Deploy to Vercel (10 min)

### Option A: Vercel CLI (Fastest)

```bash
# 1. Install Vercel CLI (if not installed)
npm i -g vercel

# 2. Login to Vercel
vercel login

# 3. Deploy
vercel

# Follow prompts:
# - Set up and deploy? Y
# - Which scope? (select your account)
# - Link to existing project? N (first time) or Y (if exists)
# - Project name? rinads-salon-erp (or your choice)
# - Directory? ./
# - Override settings? N

# 4. Deploy to production
vercel --prod
```

### Option B: GitHub + Vercel (Recommended for CI/CD)

```bash
# 1. Initialize git (if not done)
git init
git add .
git commit -m "RINADS Salon ERP - Production Ready"

# 2. Create GitHub repo
# Go to: https://github.com/new
# Create new repository (e.g., "rinads-salon-erp")
# Don't initialize with README

# 3. Push to GitHub
git remote add origin https://github.com/your-username/rinads-salon-erp.git
git branch -M main
git push -u origin main

# 4. Import to Vercel
# - Go to: https://vercel.com/new
# - Click "Import Git Repository"
# - Select your GitHub repo
# - Vercel auto-detects Next.js
# - Click "Deploy"
```

---

## Step 3: Set Environment Variables in Vercel

**After first deployment:**

1. Go to Vercel Dashboard → Your Project → Settings → Environment Variables

2. Add each variable (click "Add" for each):

   **Required:**
   ```
   NEXT_PUBLIC_SUPABASE_URL
   Value: https://zqeamdmbkvcojriwmoqc.supabase.co
   
   NEXT_PUBLIC_SUPABASE_ANON_KEY
   Value: (your anon key from Supabase)
   
   SUPABASE_SERVICE_ROLE_KEY
   Value: (your service role key from Supabase)
   ```

   **For Payments (when ready):**
   ```
   RAZORPAY_KEY_ID
   Value: (your Razorpay key ID)
   
   RAZORPAY_KEY_SECRET
   Value: (your Razorpay key secret)
   
   RAZORPAY_WEBHOOK_SECRET
   Value: (your Razorpay webhook secret)
   ```

   **Optional:**
   ```
   SUPPORT_DESK_WEBHOOK_URL
   SENTRY_DSN
   NEXT_PUBLIC_OPENAI_KEY
   ```

3. **Redeploy:**
   - Go to Deployments tab
   - Click "..." on latest deployment
   - Click "Redeploy"
   - Or push a new commit to trigger auto-deploy

---

## Step 4: Test Production

After deployment, test these URLs:

- **Homepage:** `https://your-project.vercel.app`
- **Admin:** `https://your-project.vercel.app/admin/tenants`
- **Support:** `https://your-project.vercel.app/admin/support`
- **Onboarding:** `https://your-project.vercel.app/onboarding`

---

## Step 5: Configure Razorpay Webhook

1. **Get Production URL:**
   Your Vercel URL: `https://your-project.vercel.app`

2. **In Razorpay Dashboard:**
   - Settings → Webhooks
   - Add Webhook URL: `https://your-project.vercel.app/api/razorpay/webhook`
   - Select Events:
     - `subscription.activated`
     - `subscription.cancelled`
     - `subscription.charged`
     - `subscription.payment_failed`
   - Copy Webhook Secret
   - Add to Vercel as `RAZORPAY_WEBHOOK_SECRET`

---

## ✅ You're Live!

Your RINADS Salon ERP is now deployed and ready for customers!

**Next:**
- Test all features
- Monitor error logs
- Set up custom domain (optional)
- Configure monitoring (Sentry, etc.)


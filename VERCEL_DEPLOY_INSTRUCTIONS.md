# 🚀 Vercel Deployment - Copy & Paste Instructions

## ⚡ Quick Deploy (5 Minutes)

### Step 1: Go to Vercel
👉 **Click here**: https://vercel.com/new

### Step 2: Import Repository
1. Click **"Import Git Repository"**
2. Search for: `rinads-platform`
3. Select: `watermelonadsmannuthy-ai/rinads-platform`
4. Click **"Import"**

### Step 3: Configure Project
- **Framework**: Next.js (auto-detected) ✅
- **Root Directory**: `./` ✅
- **Build Command**: `npm run build` ✅
- **Output Directory**: `.next` ✅

**Click "Deploy"** (or add env vars first - see Step 4)

### Step 4: Add Environment Variables

**Before clicking "Deploy"**, click **"Environment Variables"** and add these:

#### Copy-Paste These Variables:

```
NEXT_PUBLIC_SUPABASE_URL=https://zqeamdmbkvcojriwmoqc.supabase.co
```

```
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpxZWFtZG1ia3Zjb2pyaXdtb3FjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjUyMTc3MDIsImV4cCI6MjA4MDc5MzcwMn0.ekaXGm1aCSXK4PryBUvvml0sUvf85Ty_lC5_o9oxpBI
```

```
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpxZWFtZG1ia3Zjb2pyaXdtb3FjIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2NTIxNzcwMiwiZXhwIjoyMDgwNzkzNzAyfQ.Q3GTiVoBPRvaKfI0fQNea4mQCEoHEc5e0eipFPTF9SQ
```

```
CRON_SECRET=O3JJyQQ8HQ2v3Bl1vBHeDy3/ZxJJ5SBUs77FkALwLrU=
```

**For each variable:**
1. Click **"Add"** or **"Add Another"**
2. Paste the **Name** (left side)
3. Paste the **Value** (right side)
4. Select **"Production"** environment
5. Click **"Save"**

### Step 5: Deploy
1. Click **"Deploy"**
2. Wait 2-3 minutes
3. ✅ Your app is live!

### Step 6: After Deployment

#### A. Get Your URL
Your app will be at: `https://your-project-name.vercel.app`

#### B. Update App URL
1. Go to **Project Settings** → **Environment Variables**
2. Add: `NEXT_PUBLIC_APP_URL`
3. Value: `https://your-project-name.vercel.app`
4. Redeploy

#### C. Verify Cron Jobs
1. Go to **Settings** → **Cron Jobs**
2. You should see 3 cron jobs:
   - ✅ Daily Tasks (9 AM)
   - ✅ End of Day (6 PM)
   - ✅ Content Reminders (Every 6 hours)

## 📋 Optional Variables (Add Later)

### For AI Features:
```
OPENAI_API_KEY=sk-your-key-here
OPENAI_MODEL=gpt-4-turbo-preview
```

### For Email Notifications:
```
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
SMTP_FROM=noreply@rinads.com
```

## ⚠️ CRITICAL: Database Setup

**Before using the app**, run these SQL scripts in Supabase:

👉 **Go to**: https://supabase.com/dashboard/project/zqeamdmbkvcojriwmoqc/sql/new

**Run in order:**
1. Copy contents of `supabase/schema.sql` → Run
2. Copy contents of `supabase/support-schema.sql` → Run
3. Copy contents of `supabase/erp-agency-schema.sql` → Run ⚠️ **NEW**

## ✅ Test Your Deployment

After deployment, test these URLs:

- **Demo**: `https://your-app.vercel.app/demo`
- **Services**: `https://your-app.vercel.app/services`
- **Admin**: `https://your-app.vercel.app/admin`

## 🎉 Done!

Your RINADS platform is now live!

---

**Need help?** Check `DEPLOYMENT_AUTOMATION.md` for detailed instructions.


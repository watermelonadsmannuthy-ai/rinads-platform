# Deploy via GitHub + Vercel

## ✅ Repository Status

**Your repository is already set up!**
- ✅ Repository: `watermelonadsmannuthy-ai/rinads-platform`
- ✅ All code pushed to GitHub
- ✅ Ready for Vercel deployment

## Step-by-Step Guide

### Step 1: Verify Repository (Already Done ✅)

Your repository is already initialized and connected:
```bash
# Check status (should show "up to date")
git status

# View remote (should show your GitHub repo)
git remote -v
```

**Current Repository:** `watermelonadsmannuthy-ai/rinads-platform`

### Step 2: Database Setup (CRITICAL - Do First!)

Before deploying, run these SQL scripts in Supabase:

👉 **Go to**: https://supabase.com/dashboard/project/zqeamdmbkvcojriwmoqc/sql/new

**Run in order:**
1. Copy contents of `supabase/schema.sql` → Paste → Run
2. Copy contents of `supabase/support-schema.sql` → Paste → Run
3. Copy contents of `supabase/erp-agency-schema.sql` → Paste → Run ⚠️ **NEW - REQUIRED**

### Step 3: Import to Vercel

1. **Go to Vercel:**
   - Visit: https://vercel.com/new
   - Or click "Add New..." → "Project"

2. **Import Repository:**
   - Click "Import Git Repository"
   - Select your GitHub account
   - **Search for:** `rinads-platform`
   - **Select:** `watermelonadsmannuthy-ai/rinads-platform`
   - Click "Import"

3. **Configure Project:**
   - **Project Name:** rinads-platform (or your choice)
   - **Framework Preset:** Next.js (auto-detected) ✅
   - **Root Directory:** `./` (default) ✅
   - **Build Command:** `npm run build` (default) ✅
   - **Output Directory:** `.next` (default) ✅

4. **Environment Variables (REQUIRED):**
   - Click "Environment Variables"
   - **Add these 4 required variables:**
     ```
     NEXT_PUBLIC_SUPABASE_URL=https://zqeamdmbkvcojriwmoqc.supabase.co
     NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpxZWFtZG1ia3Zjb2pyaXdtb3FjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjUyMTc3MDIsImV4cCI6MjA4MDc5MzcwMn0.ekaXGm1aCSXK4PryBUvvml0sUvf85Ty_lC5_o9oxpBI
     SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpxZWFtZG1ia3Zjb2pyaXdtb3FjIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2NTIxNzcwMiwiZXhwIjoyMDgwNzkzNzAyfQ.Q3GTiVoBPRvaKfI0fQNea4mQCEoHEc5e0eipFPTF9SQ
     CRON_SECRET=O3JJyQQ8HQ2v3Bl1vBHeDy3/ZxJJ5SBUs77FkALwLrU=
     ```
   - **Or copy from:** `vercel-env.md` file in your repo
   - Select **"Production"** environment for each
   - Click "Save"

5. **Optional Variables (Add Later):**
   ```
   OPENAI_API_KEY=sk-your-key-here (for AI features)
   SMTP_HOST=smtp.gmail.com (for email notifications)
   SMTP_USER=your-email@gmail.com
   SMTP_PASS=your-app-password
   RAZORPAY_KEY_ID=your_key_id (for payments)
   RAZORPAY_KEY_SECRET=your_key_secret
   RAZORPAY_WEBHOOK_SECRET=your_webhook_secret
   ```

6. **Deploy:**
   - Click "Deploy"
   - Wait for build to complete (~2-3 minutes)
   - ✅ Your app is live!

### Step 4: Post-Deployment Setup

After deployment completes:

1. **Get Your URL:**
   - Vercel will show: `https://your-project-name.vercel.app`
   - Copy this URL

2. **Add App URL Variable:**
   - Go to Vercel → Project Settings → Environment Variables
   - Add: `NEXT_PUBLIC_APP_URL`
   - Value: `https://your-project-name.vercel.app`
   - Redeploy

3. **Verify Cron Jobs:**
   - Go to Vercel → Settings → Cron Jobs
   - Should see 3 cron jobs:
     - ✅ Daily Tasks (9 AM daily)
     - ✅ End of Day (6 PM daily)
     - ✅ Content Reminders (Every 6 hours)

4. **Test These URLs:**
   - Demo: `https://your-project.vercel.app/demo`
   - Services: `https://your-project.vercel.app/services`
   - Admin: `https://your-project.vercel.app/admin`
   - Staff: `https://your-project.vercel.app/dashboard/staff`
   - Client: `https://your-project.vercel.app/dashboard/client`

### Step 5: Auto-Deploy Setup

**Already configured!** Vercel automatically:
- ✅ Deploys on every push to `main` branch
- ✅ Creates preview deployments for pull requests
- ✅ Shows deployment status in GitHub
- ✅ Cron jobs configured in `vercel.json`

**To trigger new deployment:**
```bash
# Make changes
git add .
git commit -m "Update feature"
git push origin main

# Vercel automatically deploys!
```

## 🔒 Security Notes

**Important:** Never commit these files:
- `.env.local` (already in .gitignore ✅)
- `.env` (already in .gitignore ✅)
- `SUPABASE_SERVICE_ROLE_KEY` (keep secret!)
- `RAZORPAY_KEY_SECRET` (keep secret!)

**Always set secrets in Vercel Dashboard, not in code!**

## 📝 Quick Commands

```bash
# Check git status
git status

# Add all changes
git add .

# Commit
git commit -m "Your commit message"

# Push to GitHub (triggers Vercel deploy)
git push origin main
```

## 🎯 You're Live!

Once deployed, your app is live at:
`https://your-project.vercel.app`

## 📋 Quick Reference

### Environment Variables File
- `vercel-env.md` - Copy-paste format for Vercel Dashboard
- `vercel-env.txt` - Vercel CLI format

### Documentation
- `READY_TO_DEPLOY.md` - Quick start guide
- `VERCEL_DEPLOY_INSTRUCTIONS.md` - Step-by-step instructions
- `DEPLOYMENT_AUTOMATION.md` - Complete automation guide

### Generated CRON_SECRET
Your secure cron secret: `O3JJyQQ8HQ2v3Bl1vBHeDy3/ZxJJ5SBUs77FkALwLrU=`

**Next Steps:**
- ✅ Configure custom domain (optional)
- ✅ Set up Razorpay webhook with production URL
- ✅ Monitor deployments in Vercel dashboard
- ✅ Test all dashboards and features


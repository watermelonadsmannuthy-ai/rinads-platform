# 🚀 Vercel Deployment Guide - Step by Step

## Current Status
✅ Build verified and working
✅ GitHub repository connected: `watermelonadsmannuthy-ai/rinads-platform`
✅ Ready to deploy!

## Step 1: Authorize GitHub

1. Go to: https://vercel.com/new
2. Click **"Continue with GitHub"**
3. In the popup, click **"Authorize Vercel"**
4. You may need to sign in to GitHub if prompted

## Step 2: Import Repository

1. After authorization, you'll see your GitHub repositories
2. Find: **`watermelonadsmannuthy-ai/rinads-platform`**
3. Click the **"Import"** button next to it

## Step 3: Configure Project Settings

Vercel will auto-detect Next.js. Keep these defaults:
- **Framework Preset**: Next.js
- **Root Directory**: `./`
- **Build Command**: `npm run build`
- **Output Directory**: `.next`

## Step 4: Add Environment Variables (CRITICAL!)

Click on **"Environment Variables"** and add these one by one:

### Required Variables:

```
NEXT_PUBLIC_SUPABASE_URL
Value: https://zqeamdmbkvcojriwmoqc.supabase.co

NEXT_PUBLIC_SUPABASE_ANON_KEY
Value: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpxZWFtZG1ia3Zjb2pyaXdtb3FjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjUyMTc3MDIsImV4cCI6MjA4MDc5MzcwMn0.ekaXGm1aCSXK4PryBUvvml0sUvf85Ty_lC5_o9oxpBI

SUPABASE_SERVICE_ROLE_KEY
Value: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpxZWFtZG1ia3Zjb2pyaXdtb3FjIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2NTIxNzcwMiwiZXhwIjoyMDgwNzkzNzAyfQ.Q3GTiVoBPRvaKfI0fQNea4mQCEoHEc5e0eipFPTF9SQ

OPENAI_API_KEY
Value: [Your OpenAI API key - get from https://platform.openai.com/api-keys]

OPENAI_MODEL
Value: gpt-4-turbo-preview

CRON_SECRET
Value: [Generate a random string - e.g., use: openssl rand -base64 32]

NEXT_PUBLIC_APP_URL
Value: [Leave blank for now - will be your-app.vercel.app after deployment]
```

### Optional (but recommended):

```
SMTP_HOST
Value: smtp.gmail.com

SMTP_PORT
Value: 587

SMTP_USER
Value: [Your Gmail address]

SMTP_PASS
Value: [Your Gmail App Password - see below]

SMTP_FROM
Value: noreply@rinads.com

DEMO_RECIPIENT_EMAIL
Value: [Email where demo requests should go]

NEXT_PUBLIC_GEMINI_API_KEY
Value: [Your Gemini API key if you have one]
```

### How to Get Gmail App Password:
1. Go to: https://myaccount.google.com/apppasswords
2. Create a new app password for "Vercel/RINADS"
3. Copy the 16-character password
4. Use this as SMTP_PASS

### How to Generate CRON_SECRET:
Run this in your terminal:
```bash
openssl rand -base64 32
```

## Step 5: Deploy!

1. After adding all environment variables, click **"Deploy"**
2. Wait 2-3 minutes for the build to complete
3. You'll get a URL like: `https://rinads-platform-xxx.vercel.app`

## Step 6: Update NEXT_PUBLIC_APP_URL

1. After deployment, go to your Vercel project dashboard
2. Go to **Settings** → **Environment Variables**
3. Find `NEXT_PUBLIC_APP_URL` and update it with your actual Vercel URL
4. Redeploy (Vercel will prompt you)

## Step 7: Verify Deployment

Visit these URLs to test:
- **Homepage**: `https://your-app.vercel.app`
- **Demo Page**: `https://your-app.vercel.app/demo`
- **Services**: `https://your-app.vercel.app/services`
- **Admin**: `https://your-app.vercel.app/admin`

## Step 8: Set Up Database (If Not Done)

Go to Supabase and run these SQL scripts in order:
1. `supabase/schema.sql`
2. `supabase/support-schema.sql`
3. `supabase/erp-agency-schema.sql`

URL: https://supabase.com/dashboard/project/zqeamdmbkvcojriwmoqc/sql/new

## Troubleshooting

### Build Fails
- Check Vercel build logs
- Verify all environment variables are set
- Make sure OPENAI_API_KEY is set (even if you don't use AI features yet)

### Database Errors
- Verify Supabase credentials are correct
- Check that all SQL schemas have been run
- Verify RLS policies are enabled

### Cron Jobs Not Working
- Verify CRON_SECRET is set
- Check Vercel Dashboard → Cron Jobs
- They should auto-configure from vercel.json

## Next Steps After Deployment

1. **Custom Domain** (Optional): Add your domain in Vercel Settings → Domains
2. **Analytics**: Enable Vercel Analytics
3. **Monitoring**: Set up error tracking
4. **Backup**: Configure Supabase backups

---

## Quick Reference

**Your Repository**: https://github.com/watermelonadsmannuthy-ai/rinads-platform
**Vercel Dashboard**: https://vercel.com/dashboard
**Supabase Dashboard**: https://supabase.com/dashboard/project/zqeamdmbkvcojriwmoqc

**Need Help?**
- Check the build logs in Vercel
- Review the deployment docs in the repo
- All environment variables are documented above

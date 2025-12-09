# 🚀 Deploy to Production - Quick Guide

## ✅ Code Pushed to GitHub

All changes have been committed and pushed to: `watermelonadsmannuthy-ai/rinads-platform`

## 📋 Pre-Deployment Checklist

### 1. Database Setup (CRITICAL - Do First!)

Run these SQL scripts in Supabase in order:

1. **Main Schema**: `supabase/schema.sql`
2. **Support Schema**: `supabase/support-schema.sql`
3. **ERP Agency Schema**: `supabase/erp-agency-schema.sql`

**Go to**: https://supabase.com/dashboard/project/zqeamdmbkvcojriwmoqc/sql/new

### 2. Deploy to Vercel

#### Option A: GitHub Integration (Recommended)

1. **Go to Vercel**: https://vercel.com/new
2. **Import Git Repository**
   - Select: `watermelonadsmannuthy-ai/rinads-platform`
   - Click "Import"

3. **Configure Project**
   - Framework: Next.js (auto-detected)
   - Root Directory: `./`
   - Build Command: `npm run build` (default)
   - Output Directory: `.next` (default)

4. **Add Environment Variables**

   Click "Environment Variables" and add:

   ```env
   # Supabase (REQUIRED)
   NEXT_PUBLIC_SUPABASE_URL=https://zqeamdmbkvcojriwmoqc.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpxZWFtZG1ia3Zjb2pyaXdtb3FjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjUyMTc3MDIsImV4cCI6MjA4MDc5MzcwMn0.ekaXGm1aCSXK4PryBUvvml0sUvf85Ty_lC5_o9oxpBI
   SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpxZWFtZG1ia3Zjb2pyaXdtb3FjIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2NTIxNzcwMiwiZXhwIjoyMDgwNzkzNzAyfQ.Q3GTiVoBPRvaKfI0fQNea4mQCEoHEc5e0eipFPTF9SQ

   # OpenAI (For AI Features)
   OPENAI_API_KEY=sk-your-key-here
   OPENAI_MODEL=gpt-4-turbo-preview

   # Email Notifications (Optional but Recommended)
   SMTP_HOST=smtp.gmail.com
   SMTP_PORT=587
   SMTP_USER=your-email@gmail.com
   SMTP_PASS=your-app-password
   SMTP_FROM=noreply@rinads.com

   # Cron Jobs (REQUIRED for Automation)
   CRON_SECRET=generate-a-random-secret-key-here

   # App URL (REQUIRED)
   NEXT_PUBLIC_APP_URL=https://your-app-name.vercel.app
   ```

5. **Deploy**
   - Click "Deploy"
   - Wait 2-3 minutes for build

6. **Verify Cron Jobs**
   - Go to Vercel Dashboard → Settings → Cron Jobs
   - Should see 3 cron jobs configured:
     - Daily Tasks (9 AM)
     - End of Day (6 PM)
     - Content Reminders (Every 6 hours)

#### Option B: Vercel CLI

```bash
# Install Vercel CLI
npm i -g vercel

# Login
vercel login

# Deploy
vercel --prod

# Add environment variables
vercel env add NEXT_PUBLIC_SUPABASE_URL
vercel env add SUPABASE_SERVICE_ROLE_KEY
# ... add all other variables
```

### 3. Post-Deployment Steps

#### A. Update Cron Secret in External Services (if using)

If you're using an external cron service instead of Vercel Cron:

1. Set up cron jobs pointing to:
   - `https://your-app.vercel.app/api/cron/daily-tasks`
   - `https://your-app.vercel.app/api/cron/end-of-day`
   - `https://your-app.vercel.app/api/cron/content-reminders`

2. Add header: `Authorization: Bearer YOUR_CRON_SECRET`

#### B. Configure Razorpay Webhook

1. Go to Razorpay Dashboard → Webhooks
2. Add webhook URL: `https://your-app.vercel.app/api/razorpay/webhook`
3. Select events:
   - `payment.authorized`
   - `subscription.activated`
   - `subscription.charged`
   - `payment.failed`
4. Copy webhook secret to environment variables:
   - `RAZORPAY_WEBHOOK_SECRET=your-secret`

#### C. Test the Application

1. **Visit your app**: `https://your-app.vercel.app`
2. **Test Demo**: `https://your-app.vercel.app/demo`
3. **Test Services**: `https://your-app.vercel.app/services`
4. **Check Admin**: `https://your-app.vercel.app/admin`

#### D. Run Seed Script (Optional)

To populate initial data:

```bash
# In local environment
npm run seed
```

Or create a one-time API endpoint to run seed in production.

## 🔍 Verification Checklist

- [ ] Database schemas run successfully
- [ ] Environment variables added to Vercel
- [ ] Build completes without errors
- [ ] App loads at production URL
- [ ] Cron jobs configured in Vercel
- [ ] Demo page works
- [ ] Services pages load
- [ ] API endpoints respond (check `/api/tasks`)

## 🐛 Troubleshooting

### Build Fails

1. Check Vercel build logs
2. Verify all environment variables are set
3. Check for TypeScript errors: `npm run build` locally

### Cron Jobs Not Running

1. Verify `CRON_SECRET` is set
2. Check Vercel Dashboard → Cron Jobs
3. Test manually: `curl -H "Authorization: Bearer YOUR_SECRET" https://your-app.vercel.app/api/cron/daily-tasks`

### Database Errors

1. Verify all schemas are run
2. Check Supabase logs
3. Verify RLS policies are enabled

### API Errors

1. Check Vercel function logs
2. Verify `x-tenant-id` header is being sent
3. Check Supabase connection

## 📊 Monitoring

### Vercel Dashboard
- View deployments
- Check function logs
- Monitor cron jobs
- View analytics

### Supabase Dashboard
- Database logs
- API usage
- Auth logs
- Storage usage

## 🎉 Success!

Once deployed, your app will be live at:
- **Production URL**: `https://your-app-name.vercel.app`
- **Demo**: `https://your-app-name.vercel.app/demo`
- **Services**: `https://your-app-name.vercel.app/services`
- **Admin**: `https://your-app-name.vercel.app/admin`

## 📞 Next Steps

1. **Custom Domain** (Optional): Add custom domain in Vercel
2. **Analytics**: Add Google Analytics or Vercel Analytics
3. **Monitoring**: Set up Sentry for error tracking
4. **Backup**: Set up database backups in Supabase

---

**Ready to deploy!** 🚀

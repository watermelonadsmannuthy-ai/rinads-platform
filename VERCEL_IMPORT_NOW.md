# 🚀 Import to Vercel - Right Now!

## Option 1: Vercel Dashboard (Easiest - 2 Minutes)

### Step 1: Go to Vercel
👉 **Click here**: https://vercel.com/new

### Step 2: Import Repository
1. Click **"Import Git Repository"**
2. If prompted, **authorize GitHub** access
3. **Search for**: `rinads-platform`
4. **Select**: `watermelonadsmannuthy-ai/rinads-platform`
5. Click **"Import"**

### Step 3: Configure (Auto-Detected)
- Framework: **Next.js** ✅
- Root Directory: `./` ✅
- Build Command: `npm run build` ✅
- Output Directory: `.next` ✅

### Step 4: Add Environment Variables
**Click "Environment Variables"** and add these 4:

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

**For each:**
- Click "Add" or "Add Another"
- Paste Name (left)
- Paste Value (right)
- Select "Production"
- Click "Save"

### Step 5: Deploy
1. Click **"Deploy"**
2. Wait 2-3 minutes
3. ✅ **Done!**

---

## Option 2: Vercel CLI (Command Line)

### Install Vercel CLI
```bash
npm i -g vercel
```

### Login
```bash
vercel login
```

### Import Project
```bash
# Navigate to project
cd /Users/andrinotd/Movies/wcs

# Import to Vercel
vercel

# Follow prompts:
# - Link to existing project? No
# - Project name: rinads-platform
# - Directory: ./
# - Override settings? No
```

### Add Environment Variables
```bash
# Add each variable (paste value when prompted)
vercel env add NEXT_PUBLIC_SUPABASE_URL production
vercel env add NEXT_PUBLIC_SUPABASE_ANON_KEY production
vercel env add SUPABASE_SERVICE_ROLE_KEY production
vercel env add CRON_SECRET production
```

### Deploy to Production
```bash
vercel --prod
```

---

## ⚠️ IMPORTANT: Database Setup First!

**Before deploying**, run these in Supabase:

👉 https://supabase.com/dashboard/project/zqeamdmbkvcojriwmoqc/sql/new

1. `supabase/schema.sql`
2. `supabase/support-schema.sql`
3. `supabase/erp-agency-schema.sql` ⚠️ **NEW**

---

## ✅ After Deployment

1. **Get your URL**: `https://your-project.vercel.app`
2. **Add one more variable**: `NEXT_PUBLIC_APP_URL` = your URL
3. **Verify cron jobs**: Settings → Cron Jobs (should see 3)

---

**Ready?** Go to: https://vercel.com/new 🚀


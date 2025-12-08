# Deploy via GitHub + Vercel

## Step-by-Step Guide

### Step 1: Initialize Git Repository

```bash
# Initialize git (if not already done)
git init

# Add all files
git add .

# Create initial commit
git commit -m "RINADS Salon ERP - Production Ready"
```

### Step 2: Create GitHub Repository

1. **Go to GitHub:**
   - Visit: https://github.com/new
   - Or click "+" → "New repository"

2. **Repository Settings:**
   - **Repository name:** `rinads-salon-erp` (or your choice)
   - **Description:** "Multi-tenant Salon ERP with feature flags and billing"
   - **Visibility:** Private (recommended) or Public
   - **DO NOT** initialize with README, .gitignore, or license
   - Click "Create repository"

### Step 3: Push to GitHub

```bash
# Add remote (replace YOUR_USERNAME with your GitHub username)
git remote add origin https://github.com/YOUR_USERNAME/rinads-salon-erp.git

# Rename branch to main (if needed)
git branch -M main

# Push to GitHub
git push -u origin main
```

**If you get authentication errors:**
- Use GitHub Personal Access Token instead of password
- Or set up SSH keys

### Step 4: Import to Vercel

1. **Go to Vercel:**
   - Visit: https://vercel.com/new
   - Or click "Add New..." → "Project"

2. **Import Repository:**
   - Click "Import Git Repository"
   - Select your GitHub account
   - Find and select `rinads-salon-erp` repository
   - Click "Import"

3. **Configure Project:**
   - **Project Name:** rinads-salon-erp (or your choice)
   - **Framework Preset:** Next.js (auto-detected)
   - **Root Directory:** `./` (default)
   - **Build Command:** `npm run build` (default)
   - **Output Directory:** `.next` (default)

4. **Environment Variables:**
   - Click "Environment Variables"
   - Add each variable:
     ```
     NEXT_PUBLIC_SUPABASE_URL
     NEXT_PUBLIC_SUPABASE_ANON_KEY
     SUPABASE_SERVICE_ROLE_KEY
     RAZORPAY_KEY_ID (when ready)
     RAZORPAY_KEY_SECRET (when ready)
     RAZORPAY_WEBHOOK_SECRET (when ready)
     ```
   - Copy values from your `.env.local`

5. **Deploy:**
   - Click "Deploy"
   - Wait for build to complete (~2-3 minutes)

### Step 5: Verify Deployment

After deployment completes:

1. **Get Your URL:**
   - Vercel will show: `https://rinads-salon-erp.vercel.app`
   - Or your custom domain if configured

2. **Test These URLs:**
   - Homepage: `https://your-project.vercel.app`
   - Admin: `https://your-project.vercel.app/admin/tenants`
   - Support: `https://your-project.vercel.app/admin/support`
   - Onboarding: `https://your-project.vercel.app/onboarding`

### Step 6: Auto-Deploy Setup

**Already configured!** Vercel automatically:
- Deploys on every push to `main` branch
- Creates preview deployments for pull requests
- Shows deployment status in GitHub

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

**Next:**
- Configure custom domain (optional)
- Set up Razorpay webhook with production URL
- Monitor deployments in Vercel dashboard


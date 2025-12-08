# 🚀 Quick Deploy to rinads.com

## Option 1: Deploy via Vercel Dashboard (Easiest)

### Step 1: Push to GitHub
```bash
git push origin main
```

### Step 2: Deploy on Vercel
1. Go to **https://vercel.com** and sign in
2. Click **"Add New Project"**
3. Import your repository: `watermelonadsmannuthy-ai/rinads-platform`
4. Vercel will auto-detect Next.js settings
5. Click **"Deploy"** (takes ~2 minutes)

### Step 3: Connect Domain (rinads.com)
1. In Vercel Dashboard → Your Project → **Settings** → **Domains**
2. Click **"Add Domain"**
3. Enter: `rinads.com`
4. Enter: `www.rinads.com`
5. Vercel will show you DNS records to add

### Step 4: Update DNS at Your Domain Registrar
Go to your domain registrar (where you bought rinads.com) and add:

**For rinads.com:**
- **Type:** `A` or `CNAME`
- **Name:** `@` (or leave blank)
- **Value:** 
  - If A record: `76.76.21.21` (check Vercel dashboard for current IP)
  - If CNAME: `cname.vercel-dns.com`

**For www.rinads.com:**
- **Type:** `CNAME`
- **Name:** `www`
- **Value:** `cname.vercel-dns.com`

### Step 5: Wait for DNS Propagation
- DNS changes take 24-48 hours to propagate
- Vercel will automatically provision SSL certificate
- You'll get an email when domain is connected

---

## Option 2: Deploy via Vercel CLI

```bash
# Install Vercel CLI
npm install -g vercel

# Deploy
vercel

# Follow prompts:
# - Login to Vercel
# - Link to existing project or create new
# - Accept default settings
```

Then follow Steps 3-5 above to connect your domain.

---

## Verify Deployment

After DNS propagates (24-48 hours):
- ✅ Visit: `https://rinads.com`
- ✅ Visit: `https://www.rinads.com`
- ✅ Check SSL: Should show green padlock
- ✅ Test routes: `/verticals`, `/modules`, `/pricing`

---

## Environment Variables (if needed)

If you have any environment variables (like `NEXT_PUBLIC_GEMINI_API_KEY`):

1. Vercel Dashboard → Project → Settings → Environment Variables
2. Add each variable
3. Redeploy

---

## Need Help?

- **Vercel Docs:** https://vercel.com/docs
- **Domain Setup:** https://vercel.com/docs/concepts/projects/domains
- **Support:** Check Vercel dashboard for live chat

---

## Current Status

✅ Code is ready to deploy
✅ GitHub repository: `watermelonadsmannuthy-ai/rinads-platform`
✅ Domain configured in code: `rinads.com`
⏳ Next: Deploy to Vercel and connect domain






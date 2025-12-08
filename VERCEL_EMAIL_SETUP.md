# 📧 Add Email Alerts to Your Vercel Deployment

## Quick Setup (5 minutes)

### Step 1: Go to Vercel Dashboard
1. Visit: https://vercel.com/dashboard
2. Sign in to your account
3. Find your project: `rinads-platform` (or your project name)
4. Click on the project

### Step 2: Add Environment Variables
1. Go to: **Settings** → **Environment Variables**
2. Click **"Add New"** for each variable below

### Step 3: Add These Variables

Add each variable one by one:

#### 1. SMTP Host
- **Name:** `SMTP_HOST`
- **Value:** `smtp.gmail.com`
- **Environment:** Select all (Production, Preview, Development)
- Click **"Save"**

#### 2. SMTP Port
- **Name:** `SMTP_PORT`
- **Value:** `587`
- **Environment:** Select all
- Click **"Save"**

#### 3. SMTP Secure
- **Name:** `SMTP_SECURE`
- **Value:** `false`
- **Environment:** Select all
- Click **"Save"**

#### 4. SMTP User (Your Gmail)
- **Name:** `SMTP_USER`
- **Value:** `dm.rinads@gmail.com`
- **Environment:** Select all
- Click **"Save"**

#### 5. SMTP Password (App Password)
- **Name:** `SMTP_PASS`
- **Value:** `nbdvmsywaprsxguw`
- **Environment:** Select all
- Click **"Save"**
- ⚠️ **Important:** This is sensitive - make sure it's correct

#### 6. Demo Recipient Email
- **Name:** `DEMO_RECIPIENT_EMAIL`
- **Value:** `mail@rinads.com`
- **Environment:** Select all
- Click **"Save"**

### Step 4: Redeploy
After adding all variables:
1. Go to: **Deployments** tab
2. Click the **"..."** menu on the latest deployment
3. Click **"Redeploy"**
4. Or trigger a new deployment by pushing to GitHub

### Step 5: Verify
1. Visit your live site: `https://rinads.com/book-demo`
2. Submit a test demo request
3. Check `mail@rinads.com` inbox
4. You should receive the email!

## Environment Variables Summary

```
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=dm.rinads@gmail.com
SMTP_PASS=nbdvmsywaprsxguw
DEMO_RECIPIENT_EMAIL=mail@rinads.com
```

## Troubleshooting

**Email not sending after deployment?**
- Verify all 6 variables are added
- Check that variables are set for **Production** environment
- Redeploy after adding variables
- Check Vercel function logs for errors

**How to check Vercel logs:**
1. Go to: **Deployments** → Click on a deployment
2. Click **"Functions"** tab
3. Look for `/api/book-demo` function
4. Check logs for any errors

**Still not working?**
- Verify Gmail app password is correct
- Check that 2-Step Verification is enabled on Gmail
- Test email locally first (it's working locally)

## Security Notes

- ✅ Environment variables are encrypted in Vercel
- ✅ Never commit `.env.local` to Git (already in `.gitignore`)
- ✅ App passwords are safer than regular passwords
- ✅ Each environment (Production/Preview/Dev) can have different values

## Quick Copy-Paste for Vercel

When adding variables in Vercel, you can copy these:

**Variable 1:**
```
SMTP_HOST
smtp.gmail.com
```

**Variable 2:**
```
SMTP_PORT
587
```

**Variable 3:**
```
SMTP_SECURE
false
```

**Variable 4:**
```
SMTP_USER
dm.rinads@gmail.com
```

**Variable 5:**
```
SMTP_PASS
nbdvmsywaprsxguw
```

**Variable 6:**
```
DEMO_RECIPIENT_EMAIL
mail@rinads.com
```

---

## ✅ Checklist

- [ ] All 6 environment variables added to Vercel
- [ ] Variables set for Production, Preview, and Development
- [ ] Redeployed after adding variables
- [ ] Tested demo form on live site
- [ ] Received email at mail@rinads.com

Once complete, email alerts will work on your live site! 🎉






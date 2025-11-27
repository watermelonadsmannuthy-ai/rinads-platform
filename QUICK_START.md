# Quick Start Guide

## 🚀 Local Development

The dev server should now be running. Open your browser:

- **Platform Interface (Homepage)**: http://localhost:3000
- **Marketing Archive**: http://localhost:3000/marketing-archive
- **Resources**: http://localhost:3000/resources
- **Case Studies**: 
  - http://localhost:3000/case-studies/dtc-beverage-launch
  - http://localhost:3000/case-studies/edtech-subscription
  - http://localhost:3000/case-studies/fashion-marketplace

## 🔑 Enable AI Features (Optional)

Create `.env.local` in the project root:

```bash
NEXT_PUBLIC_GEMINI_API_KEY=your_api_key_here
```

Get your API key from: https://makersuite.google.com/app/apikey

**AI Features Enabled:**
- Academy: Custom syllabus generator
- Connect: Live influencer search
- Studio: AI content creation tools

## 📧 Configure Contact Form (Optional)

Add to `.env.local`:

```bash
SMTP_HOST=smtp.gmail.com
SMTP_PORT=465
SMTP_SECURE=true
SMTP_USER=your_email@gmail.com
SMTP_PASS=your_app_password
CONTACT_RECIPIENT_EMAIL=you@your-agency.com
```

## 🚢 Deploy to Vercel

1. **Push to GitHub:**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin your-repo-url
   git push -u origin main
   ```

2. **Import to Vercel:**
   - Go to https://vercel.com
   - Click "New Project"
   - Import your GitHub repository
   - Vercel will auto-detect Next.js

3. **Add Environment Variables:**
   - In Vercel dashboard → Project Settings → Environment Variables
   - Add `NEXT_PUBLIC_GEMINI_API_KEY` (if using AI features)
   - Add SMTP variables (if using contact form)

4. **Deploy:**
   - Vercel will automatically deploy on push
   - You'll get a production URL like `your-project.vercel.app`

## 🎨 Customize

### Colors
Edit `tailwind.config.ts` - update the `wm-*` color palette

### Content
- Marketing site: Edit components in `components/`
- Platform (homepage): Edit `app/page.tsx` and components in `components/platform/`
- Case studies: Edit `app/case-studies/[slug]/page.tsx`
- Resources: Edit `app/resources/page.tsx`

### Images
- Replace placeholder images in `public/`
- Update image URLs in components (currently using `picsum.photos`)

## 📝 Project Structure

```
/app
  /              → Platform interface (homepage)
  /marketing-archive → Archived marketing site
  /resources     → Blog/playbook page
  /case-studies  → Dynamic case study pages
  /api/contact   → Contact form API endpoint

/components
  /platform      → Platform-specific components
  (others)       → Marketing site components

/lib
  gemini.ts      → AI API helper
```

## ✅ Status

- ✅ Build successful
- ✅ All routes working
- ✅ No linter errors
- ✅ TypeScript configured
- ✅ Responsive design
- ✅ Scroll animations

Happy coding! 🎉


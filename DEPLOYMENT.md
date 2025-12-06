# Deploying RINADS BusinessOS to Your Domain

## Quick Deploy to Vercel (Recommended)

Vercel is the easiest way to deploy Next.js apps with automatic SSL and domain configuration.

### Step 1: Prepare Your Project

1. **Ensure your code is committed to Git:**
   ```bash
   git init  # if not already initialized
   git add .
   git commit -m "Initial BusinessOS structure"
   ```

2. **Push to GitHub:**
   ```bash
   # Create a new repository on GitHub, then:
   git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO.git
   git push -u origin main
   ```

### Step 2: Deploy to Vercel

1. **Install Vercel CLI (optional but recommended):**
   ```bash
   npm i -g vercel
   ```

2. **Deploy via CLI:**
   ```bash
   vercel
   ```
   - Follow the prompts
   - Login with your Vercel account
   - Accept default settings

3. **Or deploy via Vercel Dashboard:**
   - Go to https://vercel.com
   - Click "Add New Project"
   - Import your GitHub repository
   - Vercel will auto-detect Next.js settings
   - Click "Deploy"

### Step 3: Connect Your Domain (rinads.com)

1. **In Vercel Dashboard:**
   - Go to your project → Settings → Domains
   - Click "Add Domain"
   - Enter: `rinads.com` and `www.rinads.com`

2. **Update DNS Records:**
   Vercel will show you the DNS records to add. Typically:
   
   **For apex domain (rinads.com):**
   - Type: `A`
   - Name: `@`
   - Value: `76.76.21.21` (Vercel's IP - check dashboard for current value)
   
   **OR use CNAME (recommended):**
   - Type: `CNAME`
   - Name: `@`
   - Value: `cname.vercel-dns.com`
   
   **For www subdomain:**
   - Type: `CNAME`
   - Name: `www`
   - Value: `cname.vercel-dns.com`

3. **Add DNS records in your domain registrar:**
   - Go to your domain registrar (GoDaddy, Namecheap, etc.)
   - Navigate to DNS Management
   - Add the records shown in Vercel dashboard
   - Wait 24-48 hours for DNS propagation

### Step 4: Environment Variables (if needed)

If you have environment variables (like `NEXT_PUBLIC_GEMINI_API_KEY`):

1. In Vercel Dashboard → Settings → Environment Variables
2. Add each variable:
   - Name: `NEXT_PUBLIC_GEMINI_API_KEY`
   - Value: `your_api_key_here`
   - Environment: Production, Preview, Development
3. Redeploy after adding variables

### Step 5: Verify Deployment

1. Visit your domain: `https://rinads.com`
2. Check SSL: Should automatically have HTTPS
3. Test all routes:
   - `/verticals`
   - `/modules`
   - `/pricing`
   - `/book-demo`

## Alternative: Deploy to Other Platforms

### Netlify

1. Install Netlify CLI: `npm i -g netlify-cli`
2. Build: `npm run build`
3. Deploy: `netlify deploy --prod`
4. Add domain in Netlify dashboard

### Railway

1. Connect GitHub repo to Railway
2. Railway auto-detects Next.js
3. Add domain in Railway settings

### Self-Hosted (VPS)

1. Build: `npm run build`
2. Start: `npm start`
3. Use PM2 or systemd to keep it running
4. Configure Nginx as reverse proxy
5. Set up SSL with Let's Encrypt

## Post-Deployment Checklist

- [ ] Domain is accessible at `https://rinads.com`
- [ ] SSL certificate is active (HTTPS)
- [ ] All routes are working
- [ ] Environment variables are set (if any)
- [ ] Analytics/tracking is configured (if needed)
- [ ] Contact form API endpoint is working
- [ ] Mobile responsiveness verified

## Troubleshooting

**Domain not resolving:**
- Wait 24-48 hours for DNS propagation
- Check DNS records are correct
- Use `dig rinads.com` or `nslookup rinads.com` to verify

**SSL not working:**
- Vercel automatically provisions SSL, wait a few minutes
- Ensure DNS is pointing to Vercel

**Build errors:**
- Check Vercel build logs
- Ensure all dependencies are in `package.json`
- Verify Node.js version compatibility

## Need Help?

- Vercel Docs: https://vercel.com/docs
- Next.js Deployment: https://nextjs.org/docs/deployment
- Domain Configuration: https://vercel.com/docs/concepts/projects/domains


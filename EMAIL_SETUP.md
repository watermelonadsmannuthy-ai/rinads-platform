# 📧 Email Setup for Demo Requests

When someone submits a demo request, you'll receive an email alert with all their details.

## Quick Setup (Gmail - Recommended)

### Step 1: Enable 2-Factor Authentication
1. Go to your Google Account: https://myaccount.google.com/security
2. Enable 2-Step Verification if not already enabled

### Step 2: Generate App Password
1. Go to: https://myaccount.google.com/apppasswords
2. Select "Mail" and "Other (Custom name)"
3. Enter "RINADS BusinessOS" as the name
4. Click "Generate"
5. Copy the 16-character password (you'll use this as `SMTP_PASS`)

### Step 3: Create `.env.local` File
Create a file named `.env.local` in the root of your project with:

```env
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-16-character-app-password
DEMO_RECIPIENT_EMAIL=your-email@rinads.com
```

**Important:** 
- Replace `your-email@gmail.com` with your actual Gmail address
- Replace `your-16-character-app-password` with the app password from Step 2
- Replace `your-email@rinads.com` with the email where you want to receive demo requests

### Step 4: Restart Dev Server
```bash
# Stop the current server (Ctrl+C)
npm run dev
```

## Test Email Setup

1. Visit: `http://localhost:3000/book-demo`
2. Fill out the form and submit
3. Check your email inbox (and spam folder)
4. You should receive a beautifully formatted email with all the demo request details

## Email Format

You'll receive an email with:
- ✅ Professional HTML formatting
- ✅ All form fields (name, email, phone, company, vertical, date, time, notes)
- ✅ Reply-to set to the requester's email (click Reply to respond directly)
- ✅ Formatted date and time
- ✅ Timestamp of submission

## Other Email Providers

### Outlook/Hotmail
```env
SMTP_HOST=smtp-mail.outlook.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=your-email@outlook.com
SMTP_PASS=your-password
```

### SendGrid (Recommended for Production)
1. Sign up at: https://sendgrid.com
2. Create an API key
3. Use these settings:
```env
SMTP_HOST=smtp.sendgrid.net
SMTP_PORT=587
SMTP_USER=apikey
SMTP_PASS=your_sendgrid_api_key
```

### Mailgun
```env
SMTP_HOST=smtp.mailgun.org
SMTP_PORT=587
SMTP_USER=your_mailgun_username
SMTP_PASS=your_mailgun_password
```

## Troubleshooting

**Email not sending?**
- Check that `.env.local` exists in the project root
- Verify all SMTP variables are set correctly
- Restart the dev server after changing `.env.local`
- Check server console for error messages
- For Gmail: Make sure you're using an App Password, not your regular password

**Email going to spam?**
- Check your spam/junk folder
- Add the sender email to your contacts
- For production, set up SPF/DKIM records (SendGrid/Mailgun handle this automatically)

**Getting errors?**
- Check the terminal/console for error messages
- Verify SMTP credentials are correct
- Test with a different email provider if issues persist

## Production Deployment

When deploying to Vercel (or other platforms):

1. Go to your project settings
2. Add environment variables:
   - `SMTP_HOST`
   - `SMTP_PORT`
   - `SMTP_SECURE`
   - `SMTP_USER`
   - `SMTP_PASS`
   - `DEMO_RECIPIENT_EMAIL`
3. Redeploy after adding variables

**Note:** Never commit `.env.local` to Git - it's already in `.gitignore`


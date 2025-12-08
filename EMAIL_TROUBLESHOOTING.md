# Email Troubleshooting Guide

## Current Issue: Gmail Authentication Failed

**Error:** `535-5.7.8 Username and Password not accepted`

This means Gmail is rejecting the app password.

## Quick Fix Steps

### Step 1: Verify 2-Step Verification is Enabled
1. Go to: https://myaccount.google.com/security
2. Make sure "2-Step Verification" is **ON**
3. If not enabled, enable it first

### Step 2: Generate a New App Password
1. Go to: https://myaccount.google.com/apppasswords
2. Select:
   - **App:** Mail
   - **Device:** Other (Custom name)
   - **Name:** RINADS BusinessOS
3. Click **Generate**
4. Copy the **16-character password** (it will look like: `abcd efgh ijkl mnop`)
5. **Remove all spaces** - use it as: `abcdefghijklmnop`

### Step 3: Update .env.local
Open `.env.local` and update the password:

```env
SMTP_PASS=your-new-16-character-password-no-spaces
```

### Step 4: Restart Dev Server
```bash
# Stop server (Ctrl+C)
npm run dev
```

### Step 5: Test Again
Submit a demo request at `http://localhost:3000/book-demo`

## Common Issues

### Issue: "Invalid login" or "Bad credentials"
- **Fix:** Regenerate app password
- **Note:** App passwords expire if 2-Step Verification is disabled

### Issue: "Less secure app access"
- **Fix:** Use App Passwords (not regular password)
- **Note:** "Less secure apps" is deprecated - use App Passwords instead

### Issue: Email goes to spam
- **Fix:** Check spam folder
- **Fix:** Add sender to contacts
- **Fix:** For production, use SendGrid or Mailgun (better deliverability)

### Issue: Password has spaces
- **Fix:** Remove all spaces from app password
- **Example:** `abcd efgh ijkl mnop` → `abcdefghijklmnop`

## Testing Email

After updating the password, test with:

```bash
node test-email-simple.js
```

You should see:
```
✅ SMTP connection verified!
✅ Email sent!
```

## Alternative: Use SendGrid (Recommended for Production)

For better deliverability and reliability:

1. Sign up at: https://sendgrid.com
2. Create API key
3. Update `.env.local`:
```env
SMTP_HOST=smtp.sendgrid.net
SMTP_PORT=587
SMTP_USER=apikey
SMTP_PASS=your_sendgrid_api_key
```

## Need Help?

- Gmail App Passwords: https://support.google.com/accounts/answer/185833
- Gmail SMTP Settings: https://support.google.com/mail/answer/7126229






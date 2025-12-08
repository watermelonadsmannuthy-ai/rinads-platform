# Next Steps - Complete Setup Guide

## ✅ Completed Steps

1. ✅ Environment variables configured
2. ✅ Database schema run (main schema)
3. ✅ Seed script executed
4. ✅ Feature flags tested
5. ✅ Error handling tested

## 🔄 Remaining Steps

### Step 1: Run Support Schema (Important!)

The support tables need to be created for error tracking and ticket management.

**In Supabase SQL Editor:**
1. Go to your Supabase project
2. Open SQL Editor
3. Copy contents of `supabase/support-schema.sql`
4. Paste and run

This creates:
- `error_logs` table
- `support_tickets` table
- `incidents` table
- `sla_tracking` table

### Step 2: Start Development Server

```bash
npm run dev
```

Then visit:
- **Admin Dashboard**: http://localhost:3000/admin/tenants
- **Support Tickets**: http://localhost:3000/admin/support
- **Onboarding**: http://localhost:3000/onboarding

### Step 3: Test Admin Dashboard

1. **View Tenants:**
   - Go to `/admin/tenants`
   - See all 4 sample tenants
   - Click on a tenant to view details

2. **Manage Plans:**
   - Go to `/admin/tenants/[id]`
   - Change plan using dropdown
   - Toggle feature overrides
   - Test "Resync from Razorpay" (requires Razorpay setup)

3. **View Support Tickets:**
   - Go to `/admin/support`
   - See auto-created tickets from error tests
   - Filter by status/priority

### Step 4: Configure Razorpay (Optional)

For payment and subscription testing:

1. Get Razorpay credentials from dashboard
2. Add to `.env.local`:
   ```env
   RAZORPAY_KEY_ID=your_key_id
   RAZORPAY_KEY_SECRET=your_key_secret
   RAZORPAY_WEBHOOK_SECRET=your_webhook_secret
   ```

3. Create Razorpay plans:
   - Solo plan
   - Studio plan
   - Pro plan
   - Enterprise plan

4. Update plan IDs in `lib/razorpay.ts` (line ~85)

### Step 5: Configure Support Desk (Optional)

For external ticket management:

1. Set up Intercom/Freshdesk/Zendesk
2. Get webhook URL
3. Add to `.env.local`:
   ```env
   SUPPORT_DESK_WEBHOOK_URL=https://your-webhook-url.com
   ```

See `SUPPORT_DESK_SETUP.md` for detailed instructions.

### Step 6: Test Onboarding Flow

1. Visit `/onboarding`
2. Fill out form:
   - Business name
   - Subdomain
   - Owner details
3. Submit and verify:
   - Tenant created in database
   - Owner user created
   - Default plan assigned

### Step 7: Test Feature Flags in UI

Create a test page that uses feature flags:

```typescript
import { useFeatureFlags } from '@/hooks/useFeatureFlags';

function TestPage() {
  const { isEnabled } = useFeatureFlags(
    ['staff_module', 'ai_assistant'],
    { tenantId: 'your-tenant-id', planSlug: 'pro' }
  );

  return (
    <div>
      {isEnabled('staff_module') && <StaffModule />}
      {isEnabled('ai_assistant') && <AIAssistant />}
    </div>
  );
}
```

## 🚀 Quick Start Commands

```bash
# 1. Check environment
node scripts/check-env.js

# 2. Run seed (if not done)
npm run seed

# 3. Start dev server
npm run dev

# 4. Run tests
npm run test:all
```

## 📋 Checklist

- [ ] Run support schema in Supabase
- [ ] Start dev server (`npm run dev`)
- [ ] Test admin dashboard
- [ ] Test tenant management
- [ ] Test support tickets
- [ ] Test onboarding flow
- [ ] Configure Razorpay (optional)
- [ ] Configure support desk (optional)
- [ ] Test feature flags in UI
- [ ] Deploy to staging/production

## 🎯 Priority Actions

**High Priority:**
1. Run support schema
2. Start dev server
3. Test admin dashboard

**Medium Priority:**
4. Test onboarding flow
5. Test feature flags in UI

**Low Priority:**
6. Configure Razorpay
7. Configure support desk
8. Deploy to production

## 📚 Documentation

- `TEST_RESULTS.md` - Test results
- `TESTING_GUIDE.md` - Testing instructions
- `SUPPORT_DESK_SETUP.md` - Support desk setup
- `TIER_SYSTEM_GUIDE.md` - Tier system documentation
- `README.md` - Complete setup guide

## 🆘 Troubleshooting

**Dev server won't start:**
- Check if port 3000 is available
- Verify environment variables are set
- Check for TypeScript errors

**Admin dashboard shows errors:**
- Verify database schema is complete
- Check browser console for errors
- Verify Supabase connection

**Feature flags not working:**
- Run `npm run seed` again
- Check `plan_features` table has data
- Verify tenant has correct `plan_slug`

## ✨ You're Ready!

The system is fully functional. Start with:
1. Run support schema
2. Start dev server
3. Explore the admin dashboard

Happy coding! 🚀


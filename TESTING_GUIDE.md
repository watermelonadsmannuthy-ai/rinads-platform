# Testing Guide

## Prerequisites

Before running tests, ensure:

1. ✅ Supabase is set up and schema is run
2. ✅ Environment variables are configured in `.env.local`
3. ✅ Seed script has been run (`npm run seed`)

## Test Suite

### 1. Test Feature Flags

Tests that feature flags work correctly for each tier.

```bash
npm run test:flags
```

**What it tests:**
- Feature flag initialization
- Tier-based feature access (Solo, Studio, Pro, Enterprise)
- Feature flag caching
- Limits enforcement

**Expected output:**
```
🧪 Testing Feature Flags System...

📊 Testing Feature Flags by Tier:

🏢 Tenant: Solo Stylist (solo)
──────────────────────────────────────────────────
  ❌ staff_module              Disabled    ✓
  ❌ advanced_reports          Disabled    ✓
  ❌ ai_assistant              Disabled    ✓
  ❌ multi_branch              Disabled    ✓
  ❌ franchise_module          Disabled    ✓
  ✅ sms_marketing             Enabled     ✓

🏢 Tenant: Trendy Cuts (studio)
──────────────────────────────────────────────────
  ✅ staff_module              Enabled     ✓
  ❌ advanced_reports          Disabled    ✓
  ...
```

### 2. Test Error Handling

Tests error classification, ticket creation, and auto-remediation.

```bash
npm run test:errors
```

**What it tests:**
- Error code classification
- Auto-ticket creation
- Customer-facing messages
- Auto-remediation logic

**Expected output:**
```
🧪 Testing Error Handling System...

📋 Testing Error Classification:

🔴 Error Code: AUTH_MAGIC_FAIL
   Message: Failed to send magic link
   Customer Message: Unable to send login link. Please try again or contact support.
   ✅ Error handled successfully

🔴 Error Code: PAY_SUB_FAIL
   Message: Subscription payment failed
   Customer Message: Payment failed. Please update your payment method.
   ✅ Error handled successfully
   ...
```

**Check results:**
- Go to Supabase → `support_tickets` table
- Verify tickets were auto-created
- Check error logs in `error_logs` table

### 3. Test Plan Resync

Tests plan synchronization with Razorpay.

```bash
npm run test:resync
```

**What it tests:**
- Subscription lookup
- Plan mapping
- Resync functionality

**Note:** Requires Razorpay configuration and active subscription.

### 4. Run All Tests

```bash
npm run test:all
```

## Manual Testing

### Test Feature Flags in UI

1. Start dev server: `npm run dev`
2. Visit: `http://localhost:3000/admin/tenants`
3. Click on a tenant
4. Check feature overrides section
5. Toggle features and verify behavior

### Test Error Handling

1. Trigger a test error:
   ```typescript
   import { handleError, ExtendedErrorCode } from '@/lib/error-handling';
   
   await handleError(
     new Error('Test error'),
     ExtendedErrorCode.AUTH_MAGIC_FAIL,
     { tenantId: 'your-tenant-id' }
   );
   ```

2. Check Supabase:
   - `error_logs` table for error record
   - `support_tickets` table for auto-created ticket

### Test Plan Resync

1. Go to: `http://localhost:3000/admin/tenants/[tenant-id]`
2. Click "Resync from Razorpay"
3. Verify plan updates in database
4. Check feature flags reflect new plan

### Test Support Desk

1. Visit: `http://localhost:3000/admin/support`
2. View all tickets
3. Filter by status/priority
4. Check SLA tracking

## Integration Testing

### Test Webhook Flow

1. **Simulate Razorpay Webhook:**
   ```bash
   curl -X POST http://localhost:3000/api/razorpay/webhook \
     -H "Content-Type: application/json" \
     -H "x-razorpay-signature: test-signature" \
     -d '{
       "event": "subscription.activated",
       "payload": {
         "subscription": {
           "entity": {
             "id": "sub_test",
             "plan_id": "plan_pro_123",
             "notes": { "tenant_id": "your-tenant-id" }
           }
         }
       }
     }'
   ```

2. **Verify:**
   - Webhook processed in `webhook_events` table
   - Tenant plan updated
   - Feature flags reflect new plan

### Test Onboarding Flow

1. Visit: `http://localhost:3000/onboarding`
2. Fill out form:
   - Business name
   - Subdomain
   - Owner details
3. Submit
4. Verify:
   - Tenant created
   - Owner user created
   - Default plan assigned (solo)

## Performance Testing

### Test Feature Flag Caching

1. Make multiple requests to same feature flag
2. Verify cache hit (should be fast after first request)
3. Wait 15 seconds, verify cache expires

### Test Database Performance

1. Check query performance in Supabase dashboard
2. Verify indexes are being used
3. Monitor RLS policy performance

## Troubleshooting

### Tests Fail with "Missing Supabase variables"

**Solution:**
1. Check `.env.local` exists
2. Verify all three Supabase variables are set
3. Run `node scripts/check-env.js` to verify

### Feature Flags Not Working

**Solution:**
1. Run `npm run seed` again
2. Check `feature_flags` table has data
3. Check `plan_features` table has mappings
4. Verify tenant has correct `plan_slug`

### Error Handling Not Creating Tickets

**Solution:**
1. Check `support_tickets` table exists (run support-schema.sql)
2. Verify error handling code is being called
3. Check Supabase connection
4. Review error logs

### Plan Resync Fails

**Solution:**
1. Verify Razorpay credentials are set
2. Check subscription exists in database
3. Verify Razorpay subscription ID is correct
4. Check webhook secret matches

## Next Steps

After testing:

1. ✅ Verify all tests pass
2. ✅ Check database tables have correct data
3. ✅ Test in browser UI
4. ✅ Configure production environment variables
5. ✅ Set up monitoring (Sentry, etc.)
6. ✅ Configure support desk webhook

## Support

If tests fail:
1. Check error messages
2. Verify database schema is complete
3. Ensure environment variables are set
4. Review logs in Supabase dashboard


# Support Desk Configuration Guide

## Overview

The system supports integration with external support desk platforms (Intercom, Freshdesk, Zendesk) via webhooks.

## Configuration

### 1. Add Environment Variable

Add to your `.env.local`:

```env
SUPPORT_DESK_WEBHOOK_URL=https://your-support-desk-webhook-url.com
```

### 2. Support Desk Options

#### Option A: Intercom

1. Go to Intercom Settings → Developers → Webhooks
2. Create new webhook
3. URL: `https://your-domain.com/api/webhooks/intercom`
4. Events: Select "Conversation created", "Conversation updated"
5. Copy webhook URL to `SUPPORT_DESK_WEBHOOK_URL`

**Intercom Webhook Format:**
```json
{
  "errorCode": "PAY_SUB_FAIL",
  "message": "Subscription payment failed",
  "priority": "critical",
  "sla": "1h",
  "category": "Payment",
  "customerMessage": "Payment failed. Please update your payment method.",
  "tenantId": "tenant-123",
  "userId": "user-456",
  "metadata": {}
}
```

#### Option B: Freshdesk

1. Go to Freshdesk Admin → Webhooks
2. Create new webhook
3. URL: `https://your-domain.com/api/webhooks/freshdesk`
4. Events: Select "Ticket created", "Ticket updated"
5. Copy webhook URL to `SUPPORT_DESK_WEBHOOK_URL`

**Freshdesk Webhook Format:**
```json
{
  "subject": "[PAY_SUB_FAIL] Subscription payment failed",
  "description": "Subscription payment failed for tenant tenant-123",
  "priority": 4,
  "status": 2,
  "tags": ["payment", "critical"],
  "custom_fields": {
    "error_code": "PAY_SUB_FAIL",
    "tenant_id": "tenant-123",
    "sla": "1h"
  }
}
```

#### Option C: Zendesk

1. Go to Zendesk Admin → Apps and integrations → Webhooks
2. Create new webhook
3. URL: `https://your-domain.com/api/webhooks/zendesk`
4. Events: Select "Ticket created"
5. Copy webhook URL to `SUPPORT_DESK_WEBHOOK_URL`

**Zendesk Webhook Format:**
```json
{
  "ticket": {
    "subject": "[PAY_SUB_FAIL] Subscription payment failed",
    "comment": {
      "body": "Subscription payment failed for tenant tenant-123"
    },
    "priority": "urgent",
    "tags": ["payment", "critical"],
    "custom_fields": [
      {
        "id": 123456,
        "value": "PAY_SUB_FAIL"
      }
    ]
  }
}
```

### 3. Fallback: Database Storage

If `SUPPORT_DESK_WEBHOOK_URL` is not set, tickets are automatically stored in the `support_tickets` table in Supabase. You can:

1. View tickets in admin dashboard: `/admin/support`
2. Manually export and import to your support desk
3. Set up a cron job to sync tickets

### 4. Test Webhook Integration

```bash
# Test webhook manually
curl -X POST https://your-support-desk-webhook-url.com \
  -H "Content-Type: application/json" \
  -d '{
    "errorCode": "TEST_ERROR",
    "message": "Test ticket creation",
    "priority": "low",
    "sla": "24h",
    "category": "Test",
    "tenantId": "test-tenant"
  }'
```

### 5. Verify Integration

1. Trigger a test error:
   ```typescript
   import { handleError, ExtendedErrorCode } from '@/lib/error-handling';
   
   await handleError(
     new Error('Test error'),
     ExtendedErrorCode.AUTH_MAGIC_FAIL,
     { tenantId: 'test-tenant' }
   );
   ```

2. Check your support desk for new ticket
3. Verify ticket has correct priority and SLA

## SLA Configuration

SLA is automatically calculated based on plan tier:

- **Solo**: 48h response, 72h resolution
- **Studio**: 24h response, 48h resolution
- **Pro**: 8h response, 24h resolution
- **Enterprise**: 2h response, 8h resolution

## Priority Mapping

Error codes map to priorities:

- **Critical**: PAY_SUB_FAIL, SEC_SUS_LOGIN, TENANT_DATA_BLEED
- **High**: AUTH_MAGIC_FAIL, PAY_WEBHOOK_SIG, PERF_502
- **Medium**: RLS_DENY, BILL_GST_ERR, AI_RATE_EXCEEDED
- **Low**: FEATURE_MISMATCH, DATA_DUPLICATE_RECORD

## Customization

To customize webhook format, edit:
- `lib/error-handling.ts` → `createSupportTicket()` function
- Modify the JSON payload to match your support desk format

## Monitoring

Check ticket creation:
1. Supabase → `support_tickets` table
2. Admin dashboard → `/admin/support`
3. Your support desk platform

## Troubleshooting

### Webhook Not Sending

1. Check `SUPPORT_DESK_WEBHOOK_URL` is set
2. Verify webhook URL is correct
3. Check network connectivity
4. Review error logs in Supabase

### Tickets Not Appearing in Support Desk

1. Verify webhook format matches your platform
2. Check webhook authentication (if required)
3. Review support desk webhook logs
4. Check Supabase `support_tickets` table as fallback

### SLA Not Correct

1. Verify tenant has correct `plan_slug`
2. Check `get_sla_for_plan()` function in database
3. Review SLA calculation in `createSupportTicket()`


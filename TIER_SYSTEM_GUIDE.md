# Tier System Implementation Guide

## Overview

This system implements a **single codebase, multi-tier SaaS** architecture using feature flags. No code duplication - each salon gets a tier configuration profile.

## Tier Configuration Matrix

| Feature Flag | Solo | Studio | Pro | Enterprise |
|-------------|------|--------|-----|------------|
| Staff Module | ❌ | ✔ | ✔ | ✔ |
| Advanced Reports | ❌ | ❌ | ✔ | ✔ |
| AI Assistant | ❌ | ❌ | ✔ | ✔ |
| Multi-Branch | ❌ | ❌ | ❌ | ✔ |
| Franchise Module | ❌ | ❌ | ❌ | ✔ |
| SMS Automation | ✔ | ✔ | ✔ | ✔ |

## How It Works

### 1. Feature Flags System (The Brain)

- **Location**: `lib/feature-flags.ts`
- **Database**: `feature_flags` and `plan_features` tables
- **Caching**: 15-second TTL for performance

When a salon logs in:
1. System reads their `plan_slug` (solo/studio/pro/enterprise)
2. Queries `plan_features` table for enabled features
3. Checks `tenant_feature_overrides` for custom access
4. Returns feature availability with limits

### 2. Multi-Tenant Architecture

- **Tenant Isolation**: All data scoped by `tenant_id`
- **RLS Policies**: Database-level security
- **Per-Tenant Configuration**: Custom logos, themes, domains

### 3. Automatic Tier Switching

**On Payment Success:**
1. Razorpay webhook → `subscription.activated`
2. Backend updates `tenants.plan_slug`
3. Feature flags automatically reflect new tier
4. User sees new features on next page load

**On Payment Failure:**
1. Razorpay webhook → `subscription.payment_failed`
2. Grace period set (7 days)
3. Auto-downgrade after grace period expires

### 4. Admin Dashboard Controls

**Manual Tier Management:**
- Change customer tier instantly
- Enable/disable specific features
- Add enterprise customizations
- Monitor active subscriptions

**Plan Resync:**
- One-click resync from Razorpay
- Reconciles plan discrepancies
- Updates feature access automatically

## Implementation Details

### Feature Flag Check

```typescript
import { getFeatureFlag } from '@/lib/feature-flags';

const result = await getFeatureFlag('staff_module', {
  tenantId: 'tenant-123',
  planSlug: 'pro',
  userId: 'user-456',
});

if (result.enabled) {
  // Show staff module
} else {
  // Show upgrade prompt
}
```

### React Hook Usage

```typescript
import { useFeatureFlags } from '@/hooks/useFeatureFlags';

const { isEnabled, getLimits } = useFeatureFlags(
  ['staff_module', 'ai_assistant'],
  {
    tenantId: 'tenant-123',
    planSlug: 'pro',
  }
);

if (isEnabled('staff_module')) {
  // Render staff module
}
```

### UI Component Example

```typescript
function StaffModule() {
  const { isEnabled } = useFeatureFlags(['staff_module'], context);
  
  if (!isEnabled('staff_module')) {
    return <UpgradePrompt feature="Staff Module" requiredPlan="studio" />;
  }
  
  return <StaffManagement />;
}
```

## Tier Limits

### Solo
- Max Staff: 0
- Max Branches: 1
- Max Appointments/Month: 100
- Features: SMS Automation only

### Studio
- Max Staff: 10
- Max Branches: 1
- Max Appointments/Month: 500
- Features: Staff Module + SMS Automation

### Pro
- Max Staff: 50
- Max Branches: 5
- Max Appointments/Month: Unlimited
- Features: Staff + Reports + AI + SMS

### Enterprise
- Max Staff: Unlimited
- Max Branches: Unlimited
- Max Appointments/Month: Unlimited
- Features: ALL features + Custom workflows

## Error Handling

All tier-related errors are automatically:
1. Logged with context (tenant_id, user_id, plan_slug)
2. Classified by priority and SLA
3. Auto-create support tickets
4. Attempted auto-remediation

## Support Desk Integration

- **Auto-ticket creation** from errors
- **SLA tracking** based on plan tier
- **Priority routing** (critical → enterprise, low → solo)
- **Webhook integration** with Intercom/Freshdesk

## Monitoring

- **Feature usage tracking** per tenant
- **Error rate monitoring** by tier
- **Performance metrics** (95th/99th percentile)
- **Uptime monitoring** for critical endpoints

## Best Practices

1. **Always check feature flags** before rendering features
2. **Show upgrade prompts** for disabled features
3. **Respect tier limits** (max_staff, max_branches)
4. **Cache feature flags** (15-second TTL)
5. **Monitor feature usage** for analytics

## Troubleshooting

### Feature not showing
- Check `plan_features` table
- Verify `tenant_feature_overrides` (may be disabled)
- Clear feature flag cache
- Run plan resync

### Plan not updating
- Check Razorpay webhook logs
- Verify webhook signature
- Run manual plan resync
- Check subscription status

### Performance issues
- Feature flag cache is working (15s TTL)
- Check database indexes
- Monitor query performance
- Consider increasing cache TTL for high-traffic features


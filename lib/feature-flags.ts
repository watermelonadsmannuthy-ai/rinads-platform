// Feature Flags System - Toggle Router with Caching
import { supabaseAdmin } from './supabase/server';
import { FeatureFlag, PlanFeature, TenantFeatureOverride, FeatureFlagContext, FeatureFlagResult } from './types';

// In-memory cache with TTL (10-30 seconds)
const cache = new Map<string, { data: any; expiresAt: number }>();
const CACHE_TTL = 15 * 1000; // 15 seconds

// Feature flags catalog - matches the tier configuration table
export const FEATURE_FLAGS = {
  STAFF_MODULE: 'staff_module',
  ADVANCED_REPORTS: 'advanced_reports',
  AI_ASSISTANT: 'ai_assistant',
  MULTI_BRANCH: 'multi_branch',
  FRANCHISE_MODULE: 'franchise_module',
  SMS_MARKETING: 'sms_marketing', // SMS Automation
  INVENTORY_MANAGEMENT: 'inventory_management',
  CLIENT_PORTAL: 'client_portal',
  AUTOMATED_REMINDERS: 'automated_reminders',
  CUSTOM_BRANDING: 'custom_branding',
} as const;

// Tier configuration matrix (for reference and UI display)
export const TIER_FEATURE_MATRIX = {
  solo: {
    [FEATURE_FLAGS.STAFF_MODULE]: false,
    [FEATURE_FLAGS.ADVANCED_REPORTS]: false,
    [FEATURE_FLAGS.AI_ASSISTANT]: false,
    [FEATURE_FLAGS.MULTI_BRANCH]: false,
    [FEATURE_FLAGS.FRANCHISE_MODULE]: false,
    [FEATURE_FLAGS.SMS_MARKETING]: true,
  },
  studio: {
    [FEATURE_FLAGS.STAFF_MODULE]: true,
    [FEATURE_FLAGS.ADVANCED_REPORTS]: false,
    [FEATURE_FLAGS.AI_ASSISTANT]: false,
    [FEATURE_FLAGS.MULTI_BRANCH]: false,
    [FEATURE_FLAGS.FRANCHISE_MODULE]: false,
    [FEATURE_FLAGS.SMS_MARKETING]: true,
  },
  pro: {
    [FEATURE_FLAGS.STAFF_MODULE]: true,
    [FEATURE_FLAGS.ADVANCED_REPORTS]: true,
    [FEATURE_FLAGS.AI_ASSISTANT]: true,
    [FEATURE_FLAGS.MULTI_BRANCH]: false,
    [FEATURE_FLAGS.FRANCHISE_MODULE]: false,
    [FEATURE_FLAGS.SMS_MARKETING]: true,
  },
  enterprise: {
    [FEATURE_FLAGS.STAFF_MODULE]: true,
    [FEATURE_FLAGS.ADVANCED_REPORTS]: true,
    [FEATURE_FLAGS.AI_ASSISTANT]: true,
    [FEATURE_FLAGS.MULTI_BRANCH]: true,
    [FEATURE_FLAGS.FRANCHISE_MODULE]: true,
    [FEATURE_FLAGS.SMS_MARKETING]: true,
  },
} as const;

/**
 * Get feature flag state for a tenant with caching
 */
export async function getFeatureFlag(
  flagKey: string,
  context: FeatureFlagContext
): Promise<FeatureFlagResult> {
  const cacheKey = `feature:${flagKey}:${context.tenantId}`;
  
  // Check cache first
  const cached = cache.get(cacheKey);
  if (cached && cached.expiresAt > Date.now()) {
    return cached.data;
  }

  try {
    // Fetch feature flag definition
    const { data: flag, error: flagError } = await supabaseAdmin
      .from('feature_flags')
      .select('*')
      .eq('flag_key', flagKey)
      .eq('is_active', true)
      .single();

    if (flagError || !flag) {
      return { enabled: false, reason: 'Feature flag not found or inactive' };
    }

    // Check tenant-specific override first
    const { data: override } = await supabaseAdmin
      .from('tenant_feature_overrides')
      .select('*')
      .eq('tenant_id', context.tenantId)
      .eq('feature_flag_id', flag.id)
      .single();

    if (override) {
      // Check if override has expired
      if (override.expires_at && new Date(override.expires_at) < new Date()) {
        // Override expired, fall through to plan-based check
      } else {
        const result: FeatureFlagResult = {
          enabled: override.is_enabled,
          reason: override.is_enabled ? 'Tenant override enabled' : 'Tenant override disabled',
        };
        cache.set(cacheKey, { data: result, expiresAt: Date.now() + CACHE_TTL });
        return result;
      }
    }

    // Check plan-based feature access
    const { data: planFeature } = await supabaseAdmin
      .from('plan_features')
      .select('*')
      .eq('plan_slug', context.planSlug)
      .eq('feature_flag_id', flag.id)
      .single();

    if (!planFeature) {
      const result: FeatureFlagResult = { enabled: false, reason: 'Not included in plan' };
      cache.set(cacheKey, { data: result, expiresAt: Date.now() + CACHE_TTL });
      return result;
    }

    const result: FeatureFlagResult = {
      enabled: planFeature.is_enabled,
      reason: `Enabled for ${context.planSlug} plan`,
      limits: planFeature.limits || {},
    };

    // Cache the result
    cache.set(cacheKey, { data: result, expiresAt: Date.now() + CACHE_TTL });
    return result;
  } catch (error) {
    console.error('Error checking feature flag:', error);
    // Fallback: deny access on error
    return { enabled: false, reason: 'Error checking feature flag' };
  }
}

/**
 * Check multiple feature flags at once
 */
export async function getFeatureFlags(
  flagKeys: string[],
  context: FeatureFlagContext
): Promise<Record<string, FeatureFlagResult>> {
  const results: Record<string, FeatureFlagResult> = {};
  
  await Promise.all(
    flagKeys.map(async (key) => {
      results[key] = await getFeatureFlag(key, context);
    })
  );

  return results;
}

/**
 * Clear cache for a specific tenant (useful after plan changes)
 */
export function clearFeatureFlagCache(tenantId: string, flagKey?: string) {
  if (flagKey) {
    cache.delete(`feature:${flagKey}:${tenantId}`);
  } else {
    // Clear all flags for this tenant
    for (const key of cache.keys()) {
      if (key.includes(`:${tenantId}`)) {
        cache.delete(key);
      }
    }
  }
}

/**
 * Initialize feature flags catalog (run once on setup)
 */
export async function initializeFeatureFlags() {
  const flags = [
    { flag_key: FEATURE_FLAGS.STAFF_MODULE, flag_name: 'Staff Module', description: 'Manage staff members and schedules' },
    { flag_key: FEATURE_FLAGS.ADVANCED_REPORTS, flag_name: 'Advanced Reports', description: 'Advanced analytics and reporting' },
    { flag_key: FEATURE_FLAGS.AI_ASSISTANT, flag_name: 'AI Assistant', description: 'AI-powered upsells and recommendations' },
    { flag_key: FEATURE_FLAGS.MULTI_BRANCH, flag_name: 'Multi-Branch', description: 'Manage multiple salon locations' },
    { flag_key: FEATURE_FLAGS.FRANCHISE_MODULE, flag_name: 'Franchise Module', description: 'Franchise management features' },
    { flag_key: FEATURE_FLAGS.SMS_MARKETING, flag_name: 'SMS Marketing', description: 'Send SMS campaigns to clients' },
    { flag_key: FEATURE_FLAGS.INVENTORY_MANAGEMENT, flag_name: 'Inventory Management', description: 'Track and manage inventory' },
    { flag_key: FEATURE_FLAGS.CLIENT_PORTAL, flag_name: 'Client Portal', description: 'Client self-service portal' },
    { flag_key: FEATURE_FLAGS.AUTOMATED_REMINDERS, flag_name: 'Automated Reminders', description: 'Automated appointment reminders' },
    { flag_key: FEATURE_FLAGS.CUSTOM_BRANDING, flag_name: 'Custom Branding', description: 'Customize branding and colors' },
  ];

  for (const flag of flags) {
    const { error } = await supabaseAdmin
      .from('feature_flags')
      .upsert(flag, { onConflict: 'flag_key' });
    
    if (error) {
      console.error(`Error initializing feature flag ${flag.flag_key}:`, error);
    }
  }
}

/**
 * Initialize plan features mapping
 * Matches the exact tier configuration:
 * Solo: SMS Automation only
 * Studio: Staff Module + SMS Automation
 * Pro: Staff Module + Advanced Reports + AI Assistant + SMS Automation
 * Enterprise: All features (Staff, Reports, AI, Multi-Branch, Franchise, SMS)
 */
export async function initializePlanFeatures() {
  // Get all feature flags
  const { data: flags } = await supabaseAdmin
    .from('feature_flags')
    .select('id, flag_key');

  if (!flags) return;

  // Create a map for quick lookup
  const flagMap = new Map(flags.map(f => [f.flag_key, f.id]));

  const planFeatures = [
    // Solo plan - SMS Automation only
    { 
      plan_slug: 'solo' as const, 
      features: [FEATURE_FLAGS.SMS_MARKETING],
      limits: { max_staff: 0, max_branches: 1, max_appointments_per_month: 100 }
    },
    
    // Studio plan - Staff Module + SMS Automation
    { 
      plan_slug: 'studio' as const, 
      features: [
        FEATURE_FLAGS.STAFF_MODULE,
        FEATURE_FLAGS.SMS_MARKETING,
      ],
      limits: { max_staff: 10, max_branches: 1, max_appointments_per_month: 500 }
    },
    
    // Pro plan - Staff + Advanced Reports + AI Assistant + SMS
    { 
      plan_slug: 'pro' as const, 
      features: [
        FEATURE_FLAGS.STAFF_MODULE,
        FEATURE_FLAGS.ADVANCED_REPORTS,
        FEATURE_FLAGS.AI_ASSISTANT,
        FEATURE_FLAGS.SMS_MARKETING,
      ],
      limits: { max_staff: 50, max_branches: 5, max_appointments_per_month: -1 } // unlimited
    },
    
    // Enterprise plan - ALL features
    { 
      plan_slug: 'enterprise' as const, 
      features: [
        FEATURE_FLAGS.STAFF_MODULE,
        FEATURE_FLAGS.ADVANCED_REPORTS,
        FEATURE_FLAGS.AI_ASSISTANT,
        FEATURE_FLAGS.MULTI_BRANCH,
        FEATURE_FLAGS.FRANCHISE_MODULE,
        FEATURE_FLAGS.SMS_MARKETING,
        FEATURE_FLAGS.INVENTORY_MANAGEMENT,
        FEATURE_FLAGS.CLIENT_PORTAL,
        FEATURE_FLAGS.AUTOMATED_REMINDERS,
        FEATURE_FLAGS.CUSTOM_BRANDING,
      ],
      limits: { max_staff: -1, max_branches: -1, max_appointments_per_month: -1 } // unlimited
    },
  ];

  for (const plan of planFeatures) {
    for (const featureKey of plan.features) {
      const flagId = flagMap.get(featureKey);
      if (!flagId) {
        console.warn(`Feature flag ${featureKey} not found, skipping...`);
        continue;
      }

      const { error } = await supabaseAdmin
        .from('plan_features')
        .upsert({
          plan_slug: plan.plan_slug,
          feature_flag_id: flagId,
          is_enabled: true,
          limits: plan.limits || {},
        }, { onConflict: 'plan_slug,feature_flag_id' });

      if (error) {
        console.error(`Error setting plan feature ${featureKey} for ${plan.plan_slug}:`, error);
      }
    }

    // Explicitly disable features NOT in the plan
    const allFeatureKeys = Object.values(FEATURE_FLAGS) as string[];
    const disabledFeatures = allFeatureKeys.filter(key => !plan.features.includes(key as any));
    
    for (const featureKey of disabledFeatures) {
      const flagId = flagMap.get(featureKey);
      if (!flagId) continue;

      // Ensure disabled features are marked as disabled
      await supabaseAdmin
        .from('plan_features')
        .upsert({
          plan_slug: plan.plan_slug,
          feature_flag_id: flagId,
          is_enabled: false,
          limits: {},
        }, { onConflict: 'plan_slug,feature_flag_id' });
    }
  }
}


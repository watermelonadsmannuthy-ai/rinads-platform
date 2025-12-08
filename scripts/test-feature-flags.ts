// Test Feature Flags System
import { supabaseAdmin } from '../lib/supabase/server';
import { getFeatureFlag, FEATURE_FLAGS, TIER_FEATURE_MATRIX } from '../lib/feature-flags';

async function testFeatureFlags() {
  console.log('🧪 Testing Feature Flags System...\n');

  // Get a test tenant (or create one)
  const { data: tenants } = await supabaseAdmin
    .from('tenants')
    .select('id, name, plan_slug')
    .limit(4);

  if (!tenants || tenants.length === 0) {
    console.log('❌ No tenants found. Run npm run seed first.');
    return;
  }

  console.log('📊 Testing Feature Flags by Tier:\n');

  for (const tenant of tenants) {
    console.log(`\n🏢 Tenant: ${tenant.name} (${tenant.plan_slug})`);
    console.log('─'.repeat(50));

    const context = {
      tenantId: tenant.id,
      planSlug: tenant.plan_slug as any,
    };

    // Test all feature flags
    const features = [
      FEATURE_FLAGS.STAFF_MODULE,
      FEATURE_FLAGS.ADVANCED_REPORTS,
      FEATURE_FLAGS.AI_ASSISTANT,
      FEATURE_FLAGS.MULTI_BRANCH,
      FEATURE_FLAGS.FRANCHISE_MODULE,
      FEATURE_FLAGS.SMS_MARKETING,
    ];

    for (const feature of features) {
      const result = await getFeatureFlag(feature, context);
      const expected = TIER_FEATURE_MATRIX[tenant.plan_slug as keyof typeof TIER_FEATURE_MATRIX]?.[feature];
      const status = result.enabled ? '✅' : '❌';
      const match = result.enabled === expected ? '✓' : '✗';
      
      console.log(`  ${status} ${feature.padEnd(25)} ${result.enabled ? 'Enabled' : 'Disabled'.padEnd(10)} ${match}`);
      
      if (result.limits && Object.keys(result.limits).length > 0) {
        console.log(`     Limits: ${JSON.stringify(result.limits)}`);
      }
    }
  }

  console.log('\n✅ Feature Flags Test Complete!\n');
}

testFeatureFlags().catch(console.error);


// Test Plan Resync Functionality
import { supabaseAdmin } from '../lib/supabase/server';

async function testPlanResync() {
  console.log('🧪 Testing Plan Resync...\n');

  // Get a tenant with a subscription
  const { data: tenants } = await supabaseAdmin
    .from('tenants')
    .select('id, name, plan_slug')
    .limit(1)
    .single();

  if (!tenants) {
    console.log('❌ No tenants found. Run npm run seed first.');
    return;
  }

  const tenant = tenants;
  console.log(`🏢 Testing with tenant: ${tenant.name} (${tenant.plan_slug})\n`);

  // Check if tenant has subscription
  const { data: subscription } = await supabaseAdmin
    .from('subscriptions')
    .select('*')
    .eq('tenant_id', tenant.id)
    .order('created_at', { ascending: false })
    .limit(1)
    .single();

  if (!subscription) {
    console.log('⚠️  No subscription found for this tenant.');
    console.log('   Plan resync requires an active Razorpay subscription.');
    console.log('   This test will work once Razorpay is configured.\n');
    return;
  }

  console.log('📋 Subscription Details:');
  console.log(`   Razorpay Subscription ID: ${subscription.razorpay_subscription_id}`);
  console.log(`   Current Plan: ${subscription.plan_slug}`);
  console.log(`   Status: ${subscription.status}\n`);

  console.log('🔄 To test plan resync:');
  console.log('   1. Go to /admin/tenants/[tenant-id]');
  console.log('   2. Click "Resync from Razorpay"');
  console.log('   3. Check if plan updates correctly\n');

  console.log('✅ Plan Resync Test Setup Complete!\n');
}

testPlanResync().catch(console.error);


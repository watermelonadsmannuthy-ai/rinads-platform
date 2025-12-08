// Test Error Handling System
import { handleError, ExtendedErrorCode, getCustomerMessage } from '../lib/error-handling';

async function testErrorHandling() {
  console.log('🧪 Testing Error Handling System...\n');

  const testErrors = [
    {
      code: ExtendedErrorCode.AUTH_MAGIC_FAIL,
      error: new Error('Failed to send magic link'),
      context: { tenantId: 'test-tenant-123', userId: 'test-user-456' },
    },
    {
      code: ExtendedErrorCode.PAY_SUB_FAIL,
      error: new Error('Subscription payment failed'),
      context: { tenantId: 'test-tenant-123', metadata: { subscriptionId: 'sub_xyz' } },
    },
    {
      code: ExtendedErrorCode.RLS_DENY,
      error: new Error('Row-level security denied access'),
      context: { tenantId: 'test-tenant-123', userId: 'test-user-456' },
    },
    {
      code: ExtendedErrorCode.FEATURE_MISMATCH,
      error: new Error('Feature not available in plan'),
      context: { tenantId: 'test-tenant-123', metadata: { feature: 'staff_module', plan: 'solo' } },
    },
    {
      code: ExtendedErrorCode.PERF_502,
      error: new Error('Gateway timeout'),
      context: { tenantId: 'test-tenant-123' },
    },
  ];

  console.log('📋 Testing Error Classification:\n');

  for (const test of testErrors) {
    console.log(`\n🔴 Error Code: ${test.code}`);
    console.log(`   Message: ${test.error.message}`);
    console.log(`   Customer Message: ${getCustomerMessage(test.code)}`);
    
    // Handle error (will create ticket in database)
    try {
      await handleError(test.error, test.code, test.context);
      console.log(`   ✅ Error handled successfully`);
    } catch (err) {
      console.log(`   ⚠️  Error handling failed: ${err}`);
    }
  }

  console.log('\n✅ Error Handling Test Complete!');
  console.log('\n📝 Check support_tickets table in Supabase to see auto-created tickets.\n');
}

testErrorHandling().catch(console.error);


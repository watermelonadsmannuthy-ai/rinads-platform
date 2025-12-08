// Admin API - Resync tenant plan from Razorpay
import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase/server';
import { razorpay } from '@/lib/razorpay';
import { mapRazorpayPlanToSlug } from '@/lib/razorpay';
import { updateTenantPlan } from '@/lib/tenant';
import { clearFeatureFlagCache } from '@/lib/feature-flags';
import { handleError, ExtendedErrorCode } from '@/lib/error-handling';

export async function POST(request: NextRequest) {
  try {
    const { tenantId } = await request.json();

    if (!tenantId) {
      return NextResponse.json(
        { error: 'Missing tenantId' },
        { status: 400 }
      );
    }

    // Get tenant's subscription
    const { data: subscription, error: subError } = await supabaseAdmin
      .from('subscriptions')
      .select('*')
      .eq('tenant_id', tenantId)
      .eq('status', 'active')
      .order('created_at', { ascending: false })
      .limit(1)
      .single();

    if (subError || !subscription) {
      return NextResponse.json(
        { error: 'No active subscription found' },
        { status: 404 }
      );
    }

    // Fetch current subscription status from Razorpay
    if (!razorpay || !subscription.razorpay_subscription_id) {
      return NextResponse.json(
        { error: 'Razorpay not configured or subscription ID missing' },
        { status: 500 }
      );
    }

    try {
      const razorpaySubscription = await razorpay.subscriptions.fetch(
        subscription.razorpay_subscription_id
      );

      // Map Razorpay plan to internal plan slug
      const planSlug = mapRazorpayPlanToSlug(razorpaySubscription.plan_id);

      // Get current tenant plan
      const { data: tenant } = await supabaseAdmin
        .from('tenants')
        .select('plan_slug')
        .eq('id', tenantId)
        .single();

      if (!tenant) {
        return NextResponse.json(
          { error: 'Tenant not found' },
          { status: 404 }
        );
      }

      // Update if plan changed
      if (tenant.plan_slug !== planSlug) {
        const success = await updateTenantPlan(tenantId, planSlug);
        
        if (!success) {
          await handleError(
            new Error('Failed to update tenant plan'),
            ExtendedErrorCode.PLAN_NOT_UPDATED,
            { tenantId }
          );
          return NextResponse.json(
            { error: 'Failed to update plan' },
            { status: 500 }
          );
        }

        // Clear feature flag cache
        clearFeatureFlagCache(tenantId);

        // Update subscription record
        await supabaseAdmin
          .from('subscriptions')
          .update({
            plan_slug: planSlug,
            status: razorpaySubscription.status,
            current_period_start: razorpaySubscription.current_start 
              ? new Date(razorpaySubscription.current_start * 1000).toISOString()
              : null,
            current_period_end: razorpaySubscription.current_end
              ? new Date(razorpaySubscription.current_end * 1000).toISOString()
              : null,
            updated_at: new Date().toISOString(),
          })
          .eq('id', subscription.id);

        return NextResponse.json({
          success: true,
          message: `Plan updated from ${tenant.plan_slug} to ${planSlug}`,
          oldPlan: tenant.plan_slug,
          newPlan: planSlug,
        });
      }

      // Update subscription status even if plan didn't change
      await supabaseAdmin
        .from('subscriptions')
        .update({
          status: razorpaySubscription.status,
          current_period_start: razorpaySubscription.current_start
            ? new Date(razorpaySubscription.current_start * 1000).toISOString()
            : null,
          current_period_end: razorpaySubscription.current_end
            ? new Date(razorpaySubscription.current_end * 1000).toISOString()
            : null,
          updated_at: new Date().toISOString(),
        })
        .eq('id', subscription.id);

      return NextResponse.json({
        success: true,
        message: 'Subscription synced (no plan change)',
        plan: tenant.plan_slug,
        status: razorpaySubscription.status,
      });
    } catch (razorpayError: any) {
      await handleError(
        razorpayError,
        ExtendedErrorCode.PAY_PLAN_MAPPING_ERROR,
        { tenantId, metadata: { subscriptionId: subscription.razorpay_subscription_id } }
      );
      
      return NextResponse.json(
        { error: `Razorpay error: ${razorpayError.message}` },
        { status: 500 }
      );
    }
  } catch (error: any) {
    console.error('Error in plan resync:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to resync plan' },
      { status: 500 }
    );
  }
}


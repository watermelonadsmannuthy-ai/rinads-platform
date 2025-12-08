// API route to create Razorpay subscription
import { NextRequest, NextResponse } from 'next/server';
import { createRazorpaySubscription } from '@/lib/razorpay';
import { supabaseAdmin } from '@/lib/supabase/server';

export async function POST(request: NextRequest) {
  try {
    const { tenantId, planId } = await request.json();

    if (!tenantId || !planId) {
      return NextResponse.json(
        { error: 'Missing tenantId or planId' },
        { status: 400 }
      );
    }

    // Verify tenant exists
    const { data: tenant } = await supabaseAdmin
      .from('tenants')
      .select('*')
      .eq('id', tenantId)
      .single();

    if (!tenant) {
      return NextResponse.json(
        { error: 'Tenant not found' },
        { status: 404 }
      );
    }

    // Create Razorpay subscription
    const subscription = await createRazorpaySubscription(tenantId, planId);

    return NextResponse.json({
      success: true,
      subscription: {
        id: subscription.id,
        status: subscription.status,
        plan_id: subscription.plan_id,
      },
    });
  } catch (error: any) {
    console.error('Error creating subscription:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to create subscription' },
      { status: 500 }
    );
  }
}


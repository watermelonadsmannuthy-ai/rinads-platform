// Admin API - Update tenant plan
import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase/server';
import { updateTenantPlan } from '@/lib/tenant';
import { clearFeatureFlagCache } from '@/lib/feature-flags';

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { plan_slug } = await request.json();

    if (!plan_slug || !['solo', 'studio', 'pro', 'enterprise'].includes(plan_slug)) {
      return NextResponse.json(
        { error: 'Invalid plan_slug' },
        { status: 400 }
      );
    }

    const success = await updateTenantPlan(params.id, plan_slug);
    
    if (!success) {
      return NextResponse.json(
        { error: 'Failed to update plan' },
        { status: 500 }
      );
    }

    // Clear feature flag cache for this tenant
    clearFeatureFlagCache(params.id);

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Error updating tenant plan:', error);
    return NextResponse.json(
      { error: 'Failed to update plan' },
      { status: 500 }
    );
  }
}


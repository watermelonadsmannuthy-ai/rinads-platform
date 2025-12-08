// Admin API - Get/Set tenant feature overrides
import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase/server';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { data: overrides, error } = await supabaseAdmin
      .from('tenant_feature_overrides')
      .select(`
        *,
        feature_flags (
          flag_key,
          flag_name
        )
      `)
      .eq('tenant_id', params.id);

    if (error) {
      throw error;
    }

    const formatted = overrides?.map((o: any) => ({
      id: o.id,
      feature_flag_id: o.feature_flag_id,
      flag_key: o.feature_flags?.flag_key,
      flag_name: o.feature_flags?.flag_name,
      is_enabled: o.is_enabled,
    }));

    return NextResponse.json({ overrides: formatted });
  } catch (error: any) {
    console.error('Error fetching feature overrides:', error);
    return NextResponse.json(
      { error: 'Failed to fetch feature overrides' },
      { status: 500 }
    );
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { feature_flag_id, is_enabled } = await request.json();

    if (!feature_flag_id || typeof is_enabled !== 'boolean') {
      return NextResponse.json(
        { error: 'Invalid request' },
        { status: 400 }
      );
    }

    const { error } = await supabaseAdmin
      .from('tenant_feature_overrides')
      .upsert({
        tenant_id: params.id,
        feature_flag_id,
        is_enabled,
      }, { onConflict: 'tenant_id,feature_flag_id' });

    if (error) {
      throw error;
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Error updating feature override:', error);
    return NextResponse.json(
      { error: 'Failed to update feature override' },
      { status: 500 }
    );
  }
}


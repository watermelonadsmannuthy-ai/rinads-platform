// Get today's attendance
import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase/server';

export async function GET(request: NextRequest) {
  try {
    const tenantId = request.headers.get('x-tenant-id') || '';
    const userId = request.headers.get('x-user-id') || request.nextUrl.searchParams.get('user_id') || '';

    if (!tenantId) {
      return NextResponse.json({ error: 'Tenant ID is required' }, { status: 400 });
    }

    const today = new Date().toISOString().split('T')[0];

    const { data, error } = await supabaseAdmin
      .from('attendance')
      .select('*')
      .eq('tenant_id', tenantId)
      .eq('date', today)
      .eq('staff_id', userId)
      .single();

    if (error && error.code !== 'PGRST116') {
      // PGRST116 = no rows returned, which is fine
      throw error;
    }

    return NextResponse.json({ attendance: data || null });
  } catch (error: any) {
    console.error('Attendance API error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch attendance', message: error.message },
      { status: 500 }
    );
  }
}


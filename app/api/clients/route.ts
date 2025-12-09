// Clients API
import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase/server';

export async function GET(request: NextRequest) {
  try {
    const tenantId = request.headers.get('x-tenant-id') || '';
    const searchParams = request.nextUrl.searchParams;
    const status = searchParams.get('status');

    if (!tenantId) {
      return NextResponse.json({ error: 'Tenant ID is required' }, { status: 400 });
    }

    let query = supabaseAdmin
      .from('clients')
      .select('*, assigned_staff:staff(*)')
      .eq('tenant_id', tenantId)
      .order('created_at', { ascending: false });

    if (status) {
      query = query.eq('status', status);
    }

    const { data, error } = await query;

    if (error) throw error;

    return NextResponse.json({ clients: data || [] });
  } catch (error: any) {
    console.error('Clients API error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch clients', message: error.message },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const tenantId = request.headers.get('x-tenant-id') || '';

    if (!tenantId) {
      return NextResponse.json({ error: 'Tenant ID is required' }, { status: 400 });
    }

    const { data, error } = await supabaseAdmin
      .from('clients')
      .insert({
        ...body,
        tenant_id: tenantId,
      })
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json({ client: data });
  } catch (error: any) {
    console.error('Clients API error:', error);
    return NextResponse.json(
      { error: 'Failed to create client', message: error.message },
      { status: 500 }
    );
  }
}


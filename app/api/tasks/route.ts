// Tasks API
import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase/server';
import { allocateDailyTasks, endOfDayCarryOver, createRecurringTasks } from '@/lib/automation';

export async function GET(request: NextRequest) {
  try {
    const tenantId = request.headers.get('x-tenant-id') || '';
    const searchParams = request.nextUrl.searchParams;
    const status = searchParams.get('status');
    const clientId = searchParams.get('client_id');
    const staffId = searchParams.get('staff_id');

    if (!tenantId) {
      return NextResponse.json({ error: 'Tenant ID is required' }, { status: 400 });
    }

    let query = supabaseAdmin
      .from('tasks')
      .select('*, client:clients(*), staff:staff(*)')
      .eq('tenant_id', tenantId)
      .order('due_date', { ascending: true })
      .order('priority', { ascending: false });

    if (status) {
      query = query.eq('status', status);
    }
    if (clientId) {
      query = query.eq('client_id', clientId);
    }
    if (staffId) {
      query = query.eq('staff_id', staffId);
    }

    const { data, error } = await query;

    if (error) throw error;

    return NextResponse.json({ tasks: data || [] });
  } catch (error: any) {
    console.error('Tasks API error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch tasks', message: error.message },
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
      .from('tasks')
      .insert({
        ...body,
        tenant_id: tenantId,
      })
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json({ task: data });
  } catch (error: any) {
    console.error('Tasks API error:', error);
    return NextResponse.json(
      { error: 'Failed to create task', message: error.message },
      { status: 500 }
    );
  }
}

// Automation endpoints
export async function PUT(request: NextRequest) {
  try {
    const { action } = await request.json();
    const tenantId = request.headers.get('x-tenant-id') || '';

    if (!tenantId) {
      return NextResponse.json({ error: 'Tenant ID is required' }, { status: 400 });
    }

    let result;

    switch (action) {
      case 'allocate_daily':
        result = await allocateDailyTasks(tenantId);
        break;
      case 'carry_over':
        result = await endOfDayCarryOver(tenantId);
        break;
      case 'create_recurring':
        result = await createRecurringTasks(tenantId);
        break;
      default:
        return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
    }

    return NextResponse.json(result);
  } catch (error: any) {
    console.error('Tasks automation error:', error);
    return NextResponse.json(
      { error: 'Failed to run automation', message: error.message },
      { status: 500 }
    );
  }
}


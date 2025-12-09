// Leads API
import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase/server';
import { qualifyLead } from '@/lib/ai-chatbot';

export async function GET(request: NextRequest) {
  try {
    const tenantId = request.headers.get('x-tenant-id') || '';
    const searchParams = request.nextUrl.searchParams;
    const status = searchParams.get('status');
    const priority = searchParams.get('priority');

    if (!tenantId) {
      return NextResponse.json({ error: 'Tenant ID is required' }, { status: 400 });
    }

    let query = supabaseAdmin
      .from('leads')
      .select('*, assigned_staff:staff(*)')
      .eq('tenant_id', tenantId)
      .order('created_at', { ascending: false });

    if (status) {
      query = query.eq('status', status);
    }
    if (priority) {
      query = query.eq('priority', priority);
    }

    const { data, error } = await query;

    if (error) throw error;

    return NextResponse.json({ leads: data || [] });
  } catch (error: any) {
    console.error('Leads API error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch leads', message: error.message },
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
      .from('leads')
      .insert({
        ...body,
        tenant_id: tenantId,
      })
      .select()
      .single();

    if (error) throw error;

    // Auto-qualify lead if AI is enabled
    if (process.env.ENABLE_AI_LEAD_QUALIFICATION === 'true') {
      qualifyLead(tenantId, data.id).catch(console.error);
    }

    // Auto-create follow-up task
    if (body.auto_create_task) {
      await createFollowUpTask(tenantId, data.id);
    }

    return NextResponse.json({ lead: data });
  } catch (error: any) {
    console.error('Leads API error:', error);
    return NextResponse.json(
      { error: 'Failed to create lead', message: error.message },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const { id, action, ...updates } = await request.json();
    const tenantId = request.headers.get('x-tenant-id') || '';

    if (!tenantId || !id) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    if (action === 'qualify') {
      // AI qualify lead
      const result = await qualifyLead(tenantId, id);
      return NextResponse.json(result);
    }

    // Regular update
    const { data, error } = await supabaseAdmin
      .from('leads')
      .update(updates)
      .eq('id', id)
      .eq('tenant_id', tenantId)
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json({ lead: data });
  } catch (error: any) {
    console.error('Leads API error:', error);
    return NextResponse.json(
      { error: 'Failed to update lead', message: error.message },
      { status: 500 }
    );
  }
}

// Helper: Create follow-up task for lead
async function createFollowUpTask(tenantId: string, leadId: string) {
  try {
    const { data: lead } = await supabaseAdmin
      .from('leads')
      .select('*')
      .eq('id', leadId)
      .eq('tenant_id', tenantId)
      .single();

    if (!lead) return;

    const dueDate = new Date();
    dueDate.setDate(dueDate.getDate() + 1); // Follow up tomorrow

    await supabaseAdmin.from('tasks').insert({
      tenant_id: tenantId,
      title: `Follow up with ${lead.name}`,
      description: `Lead from ${lead.source || 'unknown source'}. ${lead.notes || ''}`,
      due_date: dueDate.toISOString(),
      priority: lead.priority || 'medium',
      status: 'pending',
      metadata: { lead_id: leadId },
    });
  } catch (error) {
    console.error('Error creating follow-up task:', error);
  }
}


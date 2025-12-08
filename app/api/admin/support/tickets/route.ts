// Admin API - Support Tickets
import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase/server';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const priority = searchParams.get('priority');
    const tenantId = searchParams.get('tenant_id');
    const limit = parseInt(searchParams.get('limit') || '50');

    let query = supabaseAdmin
      .from('support_tickets')
      .select(`
        *,
        tenants (
          name,
          subdomain,
          plan_slug
        ),
        app_users!support_tickets_user_id (
          email,
          full_name
        )
      `)
      .order('created_at', { ascending: false })
      .limit(limit);

    if (status) {
      query = query.eq('status', status);
    }
    if (priority) {
      query = query.eq('priority', priority);
    }
    if (tenantId) {
      query = query.eq('tenant_id', tenantId);
    }

    const { data: tickets, error } = await query;

    if (error) {
      throw error;
    }

    return NextResponse.json({ tickets });
  } catch (error: any) {
    console.error('Error fetching support tickets:', error);
    return NextResponse.json(
      { error: 'Failed to fetch tickets' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const { title, description, priority, tenantId, userId, errorCode, metadata } = await request.json();

    if (!title) {
      return NextResponse.json(
        { error: 'Title is required' },
        { status: 400 }
      );
    }

    // Get tenant plan for SLA calculation
    let planSlug = 'solo';
    if (tenantId) {
      const { data: tenant } = await supabaseAdmin
        .from('tenants')
        .select('plan_slug')
        .eq('id', tenantId)
        .single();
      
      if (tenant) {
        planSlug = tenant.plan_slug;
      }
    }

    // Calculate SLA based on plan
    const { data: slaResult } = await supabaseAdmin
      .rpc('get_sla_for_plan', {
        plan_slug: planSlug,
        sla_type: 'response',
      });

    const sla = slaResult || '24h';

    const { data: ticket, error } = await supabaseAdmin
      .from('support_tickets')
      .insert({
        title,
        description,
        priority: priority || 'medium',
        sla,
        error_code: errorCode,
        tenant_id: tenantId,
        user_id: userId,
        metadata: metadata || {},
        status: 'open',
      })
      .select()
      .single();

    if (error) {
      throw error;
    }

    // Create SLA tracking entry
    await supabaseAdmin
      .from('sla_tracking')
      .insert({
        ticket_id: ticket.id,
        tenant_id: tenantId,
        plan_slug: planSlug,
        sla_type: 'response',
        sla_target: sla,
        sla_start: new Date().toISOString(),
        status: 'pending',
      });

    return NextResponse.json({ ticket });
  } catch (error: any) {
    console.error('Error creating support ticket:', error);
    return NextResponse.json(
      { error: 'Failed to create ticket' },
      { status: 500 }
    );
  }
}


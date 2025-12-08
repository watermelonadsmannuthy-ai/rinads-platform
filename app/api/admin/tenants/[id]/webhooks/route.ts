// Admin API - Get webhook events for tenant
import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase/server';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Get webhook events that reference this tenant
    // Note: This is a simplified version - in production, you'd want to extract tenant_id from payload
    const { data: events, error } = await supabaseAdmin
      .from('webhook_events')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(100);

    if (error) {
      throw error;
    }

    // Filter events that might be related to this tenant
    // In production, you'd store tenant_id in webhook_events table
    const filteredEvents = events?.filter((event) => {
      const payload = event.payload as any;
      const tenantId = payload?.subscription?.entity?.notes?.tenant_id ||
                       payload?.notes?.tenant_id;
      return tenantId === params.id;
    }) || [];

    return NextResponse.json({ events: filteredEvents });
  } catch (error: any) {
    console.error('Error fetching webhook events:', error);
    return NextResponse.json(
      { error: 'Failed to fetch webhook events' },
      { status: 500 }
    );
  }
}


// Notifications API
import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase/server';
import { createInAppNotification } from '@/lib/notifications';

export async function GET(request: NextRequest) {
  try {
    const tenantId = request.headers.get('x-tenant-id') || '';
    const userId = request.headers.get('x-user-id') || '';
    const searchParams = request.nextUrl.searchParams;
    const unreadOnly = searchParams.get('unread_only') === 'true';

    if (!tenantId || !userId) {
      return NextResponse.json({ error: 'Tenant ID and User ID required' }, { status: 400 });
    }

    let query = supabaseAdmin
      .from('notifications')
      .select('*')
      .eq('tenant_id', tenantId)
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(50);

    if (unreadOnly) {
      query = query.eq('read', false);
    }

    const { data, error } = await query;

    if (error) throw error;

    return NextResponse.json({ notifications: data || [] });
  } catch (error: any) {
    console.error('Notifications API error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch notifications', message: error.message },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const { title, message, type, link, metadata, user_ids } = await request.json();
    const tenantId = request.headers.get('x-tenant-id') || '';
    const userId = request.headers.get('x-user-id') || '';

    if (!tenantId || !title || !message) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const recipients = user_ids || [userId];

    const result = await createInAppNotification(
      tenantId,
      recipients,
      title,
      message,
      type,
      link,
      metadata
    );

    if (!result.success) {
      return NextResponse.json({ error: result.error }, { status: 500 });
    }

    return NextResponse.json({ success: true, notificationId: result.notificationId });
  } catch (error: any) {
    console.error('Notifications API error:', error);
    return NextResponse.json(
      { error: 'Failed to create notification', message: error.message },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const { notification_id, read } = await request.json();
    const tenantId = request.headers.get('x-tenant-id') || '';
    const userId = request.headers.get('x-user-id') || '';

    if (!tenantId || !userId || !notification_id) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const { data, error } = await supabaseAdmin
      .from('notifications')
      .update({ read: read !== undefined ? read : true })
      .eq('id', notification_id)
      .eq('tenant_id', tenantId)
      .eq('user_id', userId)
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json({ notification: data });
  } catch (error: any) {
    console.error('Notifications API error:', error);
    return NextResponse.json(
      { error: 'Failed to update notification', message: error.message },
      { status: 500 }
    );
  }
}


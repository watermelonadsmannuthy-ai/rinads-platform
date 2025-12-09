// Content Calendar API
import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase/server';
import { generateContentCaption } from '@/lib/ai-chatbot';

export async function GET(request: NextRequest) {
  try {
    const tenantId = request.headers.get('x-tenant-id') || '';
    const searchParams = request.nextUrl.searchParams;
    const startDate = searchParams.get('start_date');
    const endDate = searchParams.get('end_date');
    const platform = searchParams.get('platform');
    const clientId = searchParams.get('client_id');

    if (!tenantId) {
      return NextResponse.json({ error: 'Tenant ID is required' }, { status: 400 });
    }

    let query = supabaseAdmin
      .from('content_calendar')
      .select('*, client:clients(*)')
      .eq('tenant_id', tenantId)
      .order('scheduled_date', { ascending: true });

    if (startDate) {
      query = query.gte('scheduled_date', startDate);
    }
    if (endDate) {
      query = query.lte('scheduled_date', endDate);
    }
    if (platform) {
      query = query.eq('platform', platform);
    }
    if (clientId) {
      query = query.eq('client_id', clientId);
    }

    const { data, error } = await query;

    if (error) throw error;

    return NextResponse.json({ content: data || [] });
  } catch (error: any) {
    console.error('Content Calendar API error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch content calendar', message: error.message },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const tenantId = request.headers.get('x-tenant-id') || '';
    const userId = request.headers.get('x-user-id') || null;

    if (!tenantId) {
      return NextResponse.json({ error: 'Tenant ID is required' }, { status: 400 });
    }

    const { data, error } = await supabaseAdmin
      .from('content_calendar')
      .insert({
        ...body,
        tenant_id: tenantId,
        created_by: userId,
      })
      .select()
      .single();

    if (error) throw error;

    // Auto-create tasks for content prep and publishing
    if (body.auto_create_tasks) {
      await createContentTasks(tenantId, data.id, body.scheduled_date);
    }

    return NextResponse.json({ content: data });
  } catch (error: any) {
    console.error('Content Calendar API error:', error);
    return NextResponse.json(
      { error: 'Failed to create content', message: error.message },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const { id, ...updates } = await request.json();
    const tenantId = request.headers.get('x-tenant-id') || '';

    if (!tenantId || !id) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const { data, error } = await supabaseAdmin
      .from('content_calendar')
      .update(updates)
      .eq('id', id)
      .eq('tenant_id', tenantId)
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json({ content: data });
  } catch (error: any) {
    console.error('Content Calendar API error:', error);
    return NextResponse.json(
      { error: 'Failed to update content', message: error.message },
      { status: 500 }
    );
  }
}

// Generate AI caption
export async function PATCH(request: NextRequest) {
  try {
    const { id, action } = await request.json();
    const tenantId = request.headers.get('x-tenant-id') || '';

    if (!tenantId || !id) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    if (action === 'generate_caption') {
      // Get content
      const { data: content } = await supabaseAdmin
        .from('content_calendar')
        .select('*')
        .eq('id', id)
        .eq('tenant_id', tenantId)
        .single();

      if (!content) {
        return NextResponse.json({ error: 'Content not found' }, { status: 404 });
      }

      // Generate caption
      const { caption, hashtags } = await generateContentCaption(
        tenantId,
        content.title,
        content.platform,
        content.notes
      );

      // Update content
      const { data, error } = await supabaseAdmin
        .from('content_calendar')
        .update({
          caption,
          hashtags,
          ai_generated: true,
        })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;

      return NextResponse.json({ content: data });
    }

    return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
  } catch (error: any) {
    console.error('Content Calendar API error:', error);
    return NextResponse.json(
      { error: 'Failed to process request', message: error.message },
      { status: 500 }
    );
  }
}

// Helper: Create tasks for content
async function createContentTasks(tenantId: string, contentId: string, scheduledDate: string) {
  try {
    const scheduled = new Date(scheduledDate);
    const prepDate = new Date(scheduled);
    prepDate.setDate(prepDate.getDate() - 1); // Prep task 1 day before

    const tasks = [
      {
        tenant_id: tenantId,
        title: 'Prepare content',
        description: 'Prepare content for scheduled post',
        due_date: prepDate.toISOString(),
        priority: 'medium',
        status: 'pending',
        metadata: { content_calendar_id: contentId },
      },
      {
        tenant_id: tenantId,
        title: 'Publish content',
        description: 'Publish scheduled content',
        due_date: scheduledDate,
        priority: 'high',
        status: 'pending',
        metadata: { content_calendar_id: contentId },
      },
    ];

    await supabaseAdmin.from('tasks').insert(tasks);
  } catch (error) {
    console.error('Error creating content tasks:', error);
  }
}


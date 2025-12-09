// Content Reminder Cron Job
import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase/server';
import { notifyContentReminder } from '@/lib/notifications';

export async function GET(request: NextRequest) {
  try {
    // Verify cron secret
    const authHeader = request.headers.get('authorization');
    if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get content scheduled for next 24 hours
    const now = new Date();
    const tomorrow = new Date(now);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const { data: upcomingContent, error } = await supabaseAdmin
      .from('content_calendar')
      .select('*, tenant:tenants(id)')
      .eq('status', 'scheduled')
      .gte('scheduled_date', now.toISOString())
      .lte('scheduled_date', tomorrow.toISOString());

    if (error) throw error;

    const results = [];

    for (const content of upcomingContent || []) {
      try {
        // Get staff assigned to this client or tenant
        const { data: staff } = await supabaseAdmin
          .from('staff')
          .select('id')
          .eq('tenant_id', content.tenant_id)
          .eq('is_active', true)
          .limit(5); // Notify up to 5 staff members

        if (staff && staff.length > 0) {
          const staffIds = staff.map((s) => s.id);
          await notifyContentReminder(content.tenant_id, content, staffIds);
        }

        results.push({
          content_id: content.id,
          title: content.title,
          scheduled_date: content.scheduled_date,
          notified_staff: staff?.length || 0,
        });
      } catch (error: any) {
        console.error(`Error processing content ${content.id}:`, error);
        results.push({
          content_id: content.id,
          error: error.message,
        });
      }
    }

    return NextResponse.json({
      success: true,
      processed: results.length,
      results,
      timestamp: new Date().toISOString(),
    });
  } catch (error: any) {
    console.error('Content reminders cron error:', error);
    return NextResponse.json(
      { error: 'Cron job failed', message: error.message },
      { status: 500 }
    );
  }
}

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';


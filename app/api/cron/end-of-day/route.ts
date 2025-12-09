// End of Day Carry-Over Cron Job
import { NextRequest, NextResponse } from 'next/server';
import { endOfDayCarryOver, createDailyTodoDoc } from '@/lib/automation';
import { supabaseAdmin } from '@/lib/supabase/server';
import { sendEmailNotification, createInAppNotification } from '@/lib/notifications';

export async function GET(request: NextRequest) {
  try {
    // Verify cron secret
    const authHeader = request.headers.get('authorization');
    if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get all active tenants
    const { data: tenants, error: tenantsError } = await supabaseAdmin
      .from('tenants')
      .select('id, name')
      .eq('is_active', true);

    if (tenantsError) throw tenantsError;

    const results = [];
    const today = new Date();

    for (const tenant of tenants || []) {
      try {
        // Carry over incomplete tasks
        const carryOverResult = await endOfDayCarryOver(tenant.id, today);

        // Create daily todo doc for admin
        const dailyDoc = await createDailyTodoDoc(tenant.id, today);

        // Send daily summary to admin
        const { data: adminUsers } = await supabaseAdmin
          .from('app_users')
          .select('id, email, role')
          .eq('tenant_id', tenant.id)
          .eq('role', 'admin')
          .limit(1);

        if (adminUsers && adminUsers.length > 0) {
          const admin = adminUsers[0];

          // Email summary
          if (admin.email && dailyDoc) {
            await sendEmailNotification(
              admin.email,
              `Daily Summary - ${today.toLocaleDateString()}`,
              `
                <div style="font-family: Arial, sans-serif; max-width: 600px;">
                  <h2>Daily Summary for ${tenant.name}</h2>
                  <h3>Tasks</h3>
                  <ul>
                    <li>Due Today: ${dailyDoc.summary.tasks_due_today}</li>
                    <li>Overdue: ${dailyDoc.summary.tasks_overdue}</li>
                  </ul>
                  <h3>Leads</h3>
                  <p>New Leads: ${dailyDoc.summary.new_leads}</p>
                  <h3>Invoices</h3>
                  <p>Pending: ${dailyDoc.summary.pending_invoices} (₹${dailyDoc.summary.total_pending_amount.toLocaleString()})</p>
                  <h3>Attendance</h3>
                  <p>Staff Present: ${dailyDoc.summary.staff_present}</p>
                  ${carryOverResult.carriedOver > 0 ? `<p><strong>${carryOverResult.carriedOver} tasks carried over to tomorrow</strong></p>` : ''}
                </div>
              `
            );
          }

          // In-app notification
          await createInAppNotification(
            tenant.id,
            admin.id,
            'Daily Summary',
            `${carryOverResult.carriedOver || 0} tasks carried over. ${dailyDoc?.summary.tasks_overdue || 0} overdue tasks.`,
            'info',
            '/dashboard/admin'
          );
        }

        results.push({
          tenant_id: tenant.id,
          tasks_carried_over: carryOverResult.carriedOver || 0,
          daily_doc_created: !!dailyDoc,
        });
      } catch (error: any) {
        console.error(`Error processing tenant ${tenant.id}:`, error);
        results.push({
          tenant_id: tenant.id,
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
    console.error('End of day cron error:', error);
    return NextResponse.json(
      { error: 'Cron job failed', message: error.message },
      { status: 500 }
    );
  }
}

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';


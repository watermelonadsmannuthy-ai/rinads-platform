// Daily Task Automation Cron Job
// This endpoint should be called by Vercel Cron or external cron service
import { NextRequest, NextResponse } from 'next/server';
import { allocateDailyTasks, createRecurringTasks } from '@/lib/automation';
import { supabaseAdmin } from '@/lib/supabase/server';
import { notifyTaskAssignment } from '@/lib/notifications';

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
      .select('id')
      .eq('is_active', true);

    if (tenantsError) throw tenantsError;

    const results = [];

    for (const tenant of tenants || []) {
      try {
        // Create recurring tasks
        const recurringResult = await createRecurringTasks(tenant.id);
        
        // Allocate daily tasks
        const allocationResult = await allocateDailyTasks(tenant.id);

        // Notify staff about new assignments
        if (allocationResult.updates) {
          for (const update of allocationResult.updates) {
            if (update.staff_id) {
              const { data: task } = await supabaseAdmin
                .from('tasks')
                .select('*')
                .eq('id', update.id)
                .single();

              if (task) {
                await notifyTaskAssignment(tenant.id, update.staff_id, task);
              }
            }
          }
        }

        results.push({
          tenant_id: tenant.id,
          recurring_created: recurringResult.created || 0,
          tasks_allocated: allocationResult.allocated || 0,
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
    console.error('Daily tasks cron error:', error);
    return NextResponse.json(
      { error: 'Cron job failed', message: error.message },
      { status: 500 }
    );
  }
}

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';


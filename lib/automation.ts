// Automation Engine - Daily Tasks, Carry-Over, AI Allocator
import { supabaseAdmin } from './supabase/server';
import { Task, TaskStatus, TaskPriority } from './types-extended';
import { logInfo, handleError, ExtendedErrorCode } from './error-handling';

/**
 * Create recurring tasks based on patterns
 */
export async function createRecurringTasks(tenantId: string) {
  try {
    // Get all active recurring tasks
    const { data: recurringTasks, error } = await supabaseAdmin
      .from('tasks')
      .select('*')
      .eq('tenant_id', tenantId)
      .not('recurring', 'is', null)
      .eq('status', 'completed')
      .or('status.eq.pending,status.eq.in_progress');

    if (error) throw error;
    if (!recurringTasks) return;

    const today = new Date();
    const newTasks: any[] = [];

    for (const task of recurringTasks) {
      const lastCompleted = task.completed_at ? new Date(task.completed_at) : null;
      const shouldCreate = shouldCreateRecurringTask(task, today, lastCompleted);

      if (shouldCreate) {
        newTasks.push({
          tenant_id: tenantId,
          client_id: task.client_id,
          staff_id: task.staff_id,
          title: task.title,
          description: task.description,
          due_date: calculateNextDueDate(task, today),
          priority: task.priority,
          recurring: task.recurring,
          recurring_pattern: task.recurring_pattern,
          status: 'pending',
        });
      }
    }

    if (newTasks.length > 0) {
      const { error: insertError } = await supabaseAdmin
        .from('tasks')
        .insert(newTasks);

      if (insertError) throw insertError;

      logInfo(`Created ${newTasks.length} recurring tasks for tenant ${tenantId}`, {
        tenantId,
        metadata: { taskCount: newTasks.length },
      });
    }

    return { created: newTasks.length };
  } catch (error: any) {
    await handleError(error, ExtendedErrorCode.FEATURE_FLAG_ERROR, { tenantId });
    throw error;
  }
}

function shouldCreateRecurringTask(task: any, today: Date, lastCompleted: Date | null): boolean {
  if (!task.recurring) return false;

  switch (task.recurring) {
    case 'daily':
      return !lastCompleted || lastCompleted.toDateString() !== today.toDateString();
    case 'weekly':
      const weekAgo = new Date(today);
      weekAgo.setDate(weekAgo.getDate() - 7);
      return !lastCompleted || lastCompleted < weekAgo;
    case 'monthly':
      const monthAgo = new Date(today);
      monthAgo.setMonth(monthAgo.getMonth() - 1);
      return !lastCompleted || lastCompleted < monthAgo;
    default:
      return false;
  }
}

function calculateNextDueDate(task: any, today: Date): string {
  const nextDate = new Date(today);

  switch (task.recurring) {
    case 'daily':
      nextDate.setDate(nextDate.getDate() + 1);
      break;
    case 'weekly':
      nextDate.setDate(nextDate.getDate() + 7);
      break;
    case 'monthly':
      nextDate.setMonth(nextDate.getMonth() + 1);
      break;
  }

  return nextDate.toISOString();
}

/**
 * AI-powered task allocator
 * Distributes tasks for the day based on workload, priority, and deadlines
 */
export async function allocateDailyTasks(tenantId: string, targetDate: Date = new Date()) {
  try {
    // Get pending tasks
    const { data: pendingTasks, error: tasksError } = await supabaseAdmin
      .from('tasks')
      .select('*')
      .eq('tenant_id', tenantId)
      .eq('status', 'pending')
      .lte('due_date', targetDate.toISOString())
      .order('priority', { ascending: false })
      .order('due_date', { ascending: true });

    if (tasksError) throw tasksError;
    if (!pendingTasks || pendingTasks.length === 0) {
      return { allocated: 0 };
    }

    // Get active staff with their current workload
    const { data: staff, error: staffError } = await supabaseAdmin
      .from('staff')
      .select('id, name')
      .eq('tenant_id', tenantId)
      .eq('is_active', true);

    if (staffError) throw staffError;
    if (!staff || staff.length === 0) {
      return { allocated: 0, message: 'No active staff found' };
    }

    // Get current day's tasks for each staff
    const startOfDay = new Date(targetDate);
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date(targetDate);
    endOfDay.setHours(23, 59, 59, 999);

    const { data: todayTasks } = await supabaseAdmin
      .from('tasks')
      .select('staff_id, status')
      .eq('tenant_id', tenantId)
      .gte('allocated_date', startOfDay.toISOString())
      .lte('allocated_date', endOfDay.toISOString())
      .in('status', ['pending', 'in_progress']);

    // Calculate workload for each staff
    const workload: Record<string, number> = {};
    staff.forEach((s) => {
      workload[s.id] = todayTasks?.filter((t) => t.staff_id === s.id).length || 0;
    });

    // Allocate tasks using round-robin with priority consideration
    let allocated = 0;
    const updates: any[] = [];

    for (const task of pendingTasks) {
      // Find staff with least workload
      const staffId = findBestStaffForTask(task, staff, workload);

      if (staffId) {
        updates.push({
          id: task.id,
          staff_id: staffId,
          allocated_date: targetDate.toISOString(),
          status: 'pending' as TaskStatus,
        });

        workload[staffId] = (workload[staffId] || 0) + 1;
        allocated++;
      }
    }

    // Batch update tasks
    if (updates.length > 0) {
      for (const update of updates) {
        await supabaseAdmin
          .from('tasks')
          .update({
            staff_id: update.staff_id,
            allocated_date: update.allocated_date,
          })
          .eq('id', update.id);
      }
    }

    logInfo(`Allocated ${allocated} tasks for tenant ${tenantId}`, {
      tenantId,
      metadata: { allocated, date: targetDate.toISOString() },
    });

    return { allocated, updates: updates.map(u => ({ id: u.id, staff_id: u.staff_id })) };
  } catch (error: any) {
    await handleError(error, ExtendedErrorCode.FEATURE_FLAG_ERROR, { tenantId });
    throw error;
  }
}

function findBestStaffForTask(task: any, staff: any[], workload: Record<string, number>): string | null {
  if (staff.length === 0) return null;

  // If task already has assigned staff, prefer them if they're not overloaded
  if (task.staff_id) {
    const assignedStaff = staff.find((s) => s.id === task.staff_id);
    if (assignedStaff && (workload[task.staff_id] || 0) < 10) {
      return task.staff_id;
    }
  }

  // Find staff with least workload
  const sortedStaff = [...staff].sort((a, b) => {
    const loadA = workload[a.id] || 0;
    const loadB = workload[b.id] || 0;
    return loadA - loadB;
  });

  return sortedStaff[0]?.id || null;
}

/**
 * End of day carry-over: Move incomplete tasks to next day
 */
export async function endOfDayCarryOver(tenantId: string, date: Date = new Date()) {
  try {
    const startOfDay = new Date(date);
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date(date);
    endOfDay.setHours(23, 59, 59, 999);

    // Get incomplete tasks for the day
    const { data: incompleteTasks, error } = await supabaseAdmin
      .from('tasks')
      .select('*')
      .eq('tenant_id', tenantId)
      .gte('allocated_date', startOfDay.toISOString())
      .lte('allocated_date', endOfDay.toISOString())
      .in('status', ['pending', 'in_progress']);

    if (error) throw error;
    if (!incompleteTasks || incompleteTasks.length === 0) {
      return { carriedOver: 0 };
    }

    // Move to next day
    const nextDay = new Date(date);
    nextDay.setDate(nextDay.getDate() + 1);

    const updates = incompleteTasks.map((task) => ({
      id: task.id,
      allocated_date: nextDay.toISOString(),
      status: (task.due_date && new Date(task.due_date) < date) ? 'overdue' : 'pending',
    }));

    for (const update of updates) {
      await supabaseAdmin
        .from('tasks')
        .update({
          allocated_date: update.allocated_date,
          status: update.status,
        })
        .eq('id', update.id);
    }

    // Log activity
    logInfo(`Carried over ${updates.length} tasks to next day for tenant ${tenantId}`, {
      tenantId,
      metadata: { carriedOver: updates.length, date: date.toISOString() },
    });

    // Notify staff (placeholder - implement notification system)
    // await notifyStaffAboutCarryOver(tenantId, updates);

    return { carriedOver: updates.length, tasks: updates };
  } catch (error: any) {
    await handleError(error, ExtendedErrorCode.FEATURE_FLAG_ERROR, { tenantId });
    throw error;
  }
}

/**
 * Create daily todo document for admin
 */
export async function createDailyTodoDoc(tenantId: string, date: Date = new Date()) {
  try {
    const startOfDay = new Date(date);
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date(date);
    endOfDay.setHours(23, 59, 59, 999);

    // Get all relevant data
    const [tasks, attendance, leads, invoices] = await Promise.all([
      supabaseAdmin
        .from('tasks')
        .select('*')
        .eq('tenant_id', tenantId)
        .gte('due_date', startOfDay.toISOString())
        .lte('due_date', endOfDay.toISOString()),
      supabaseAdmin
        .from('attendance')
        .select('*')
        .eq('tenant_id', tenantId)
        .eq('date', date.toISOString().split('T')[0]),
      supabaseAdmin
        .from('leads')
        .select('*')
        .eq('tenant_id', tenantId)
        .eq('status', 'new')
        .gte('created_at', startOfDay.toISOString()),
      supabaseAdmin
        .from('invoices')
        .select('*')
        .eq('tenant_id', tenantId)
        .eq('payment_status', 'pending')
        .lte('due_date', endOfDay.toISOString()),
    ]);

    const doc = {
      date: date.toISOString().split('T')[0],
      tenant_id: tenantId,
      summary: {
        tasks_due_today: tasks.data?.length || 0,
        tasks_overdue: tasks.data?.filter((t) => t.status === 'overdue').length || 0,
        staff_present: attendance.data?.length || 0,
        new_leads: leads.data?.length || 0,
        pending_invoices: invoices.data?.length || 0,
        total_pending_amount: invoices.data?.reduce((sum, inv) => sum + (inv.total || 0), 0) || 0,
      },
      tasks: tasks.data || [],
      attendance: attendance.data || [],
      leads: leads.data || [],
      invoices: invoices.data || [],
      created_at: new Date().toISOString(),
    };

    // Store in system_config or return
    return doc;
  } catch (error: any) {
    await handleError(error, ExtendedErrorCode.FEATURE_FLAG_ERROR, { tenantId });
    throw error;
  }
}


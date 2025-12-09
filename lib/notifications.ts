// Notification System - Email, SMS, In-App
import { supabaseAdmin } from './supabase/server';
import nodemailer from 'nodemailer';

// Email Configuration
const emailTransporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'smtp.gmail.com',
  port: parseInt(process.env.SMTP_PORT || '587'),
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

/**
 * Send email notification
 */
export async function sendEmailNotification(
  to: string | string[],
  subject: string,
  html: string,
  text?: string
): Promise<{ success: boolean; messageId?: string; error?: string }> {
  try {
    if (!process.env.SMTP_USER || !process.env.SMTP_PASS) {
      console.warn('SMTP not configured, skipping email');
      return { success: false, error: 'SMTP not configured' };
    }

    const recipients = Array.isArray(to) ? to : [to];

    const result = await emailTransporter.sendMail({
      from: process.env.SMTP_FROM || process.env.SMTP_USER,
      to: recipients.join(', '),
      subject,
      text: text || html.replace(/<[^>]*>/g, ''),
      html,
    });

    // Log notification
    await logNotification('email', recipients, subject, { messageId: result.messageId });

    return { success: true, messageId: result.messageId };
  } catch (error: any) {
    console.error('Error sending email:', error);
    await logNotification('email', Array.isArray(to) ? to : [to], subject, { error: error.message });
    return { success: false, error: error.message };
  }
}

/**
 * Send SMS notification (placeholder - integrate with SMS provider)
 */
export async function sendSMSNotification(
  to: string | string[],
  message: string
): Promise<{ success: boolean; messageId?: string; error?: string }> {
  try {
    // TODO: Integrate with SMS provider (Twilio, AWS SNS, etc.)
    const smsProvider = process.env.SMS_PROVIDER || 'twilio';
    const apiKey = process.env.SMS_API_KEY;

    if (!apiKey) {
      console.warn('SMS not configured, skipping SMS');
      return { success: false, error: 'SMS not configured' };
    }

    const recipients = Array.isArray(to) ? to : [to];

    // Placeholder for SMS API call
    // const result = await smsProvider.send({ to: recipients, message });

    // Log notification
    await logNotification('sms', recipients, message);

    return { success: true };
  } catch (error: any) {
    console.error('Error sending SMS:', error);
    await logNotification('sms', Array.isArray(to) ? to : [to], message, { error: error.message });
    return { success: false, error: error.message };
  }
}

/**
 * Create in-app notification
 */
export async function createInAppNotification(
  tenantId: string,
  userId: string | string[],
  title: string,
  message: string,
  type: 'info' | 'success' | 'warning' | 'error' = 'info',
  link?: string,
  metadata?: Record<string, any>
): Promise<{ success: boolean; notificationId?: string; error?: string }> {
  try {
    const userIds = Array.isArray(userId) ? userId : [userId];

    const notifications = userIds.map((uid) => ({
      tenant_id: tenantId,
      user_id: uid,
      title,
      message,
      type,
      link,
      metadata: metadata || {},
      read: false,
      created_at: new Date().toISOString(),
    }));

    // Store in notifications table (create if doesn't exist)
    const { data, error } = await supabaseAdmin
      .from('notifications')
      .insert(notifications)
      .select();

    if (error) {
      // Table might not exist, create it
      if (error.code === '42P01') {
        await createNotificationsTable();
        const retry = await supabaseAdmin
          .from('notifications')
          .insert(notifications)
          .select();
        if (retry.error) throw retry.error;
        return { success: true, notificationId: retry.data?.[0]?.id };
      }
      throw error;
    }

    return { success: true, notificationId: data?.[0]?.id };
  } catch (error: any) {
    console.error('Error creating in-app notification:', error);
    return { success: false, error: error.message };
  }
}

/**
 * Notification templates
 */
export const NotificationTemplates = {
  taskAssigned: (taskTitle: string, dueDate?: string) => ({
    title: 'New Task Assigned',
    message: `You have been assigned a new task: "${taskTitle}"${dueDate ? ` (Due: ${new Date(dueDate).toLocaleDateString()})` : ''}`,
    type: 'info' as const,
  }),

  taskDue: (taskTitle: string, hoursUntilDue: number) => ({
    title: 'Task Due Soon',
    message: `Task "${taskTitle}" is due in ${hoursUntilDue} hours`,
    type: 'warning' as const,
  }),

  taskOverdue: (taskTitle: string) => ({
    title: 'Task Overdue',
    message: `Task "${taskTitle}" is now overdue`,
    type: 'error' as const,
  }),

  contentScheduled: (contentTitle: string, platform: string, scheduledDate: string) => ({
    title: 'Content Scheduled',
    message: `"${contentTitle}" is scheduled for ${platform} on ${new Date(scheduledDate).toLocaleDateString()}`,
    type: 'info' as const,
  }),

  invoiceCreated: (invoiceNumber: string, amount: number) => ({
    title: 'New Invoice',
    message: `Invoice ${invoiceNumber} for ₹${amount.toLocaleString()} has been created`,
    type: 'info' as const,
  }),

  invoiceDue: (invoiceNumber: string, daysUntilDue: number) => ({
    title: 'Invoice Due Soon',
    message: `Invoice ${invoiceNumber} is due in ${daysUntilDue} days`,
    type: 'warning' as const,
  }),

  invoicePaid: (invoiceNumber: string) => ({
    title: 'Invoice Paid',
    message: `Invoice ${invoiceNumber} has been paid`,
    type: 'success' as const,
  }),

  leadAssigned: (leadName: string) => ({
    title: 'New Lead Assigned',
    message: `Lead "${leadName}" has been assigned to you`,
    type: 'info' as const,
  }),

  attendanceReminder: () => ({
    title: 'Attendance Reminder',
    message: 'Don\'t forget to check in for today',
    type: 'info' as const,
  }),
};

/**
 * Send task assignment notification
 */
export async function notifyTaskAssignment(
  tenantId: string,
  staffId: string,
  task: { title: string; due_date?: string; priority: string }
) {
  // Get staff email
  const { data: staff } = await supabaseAdmin
    .from('staff')
    .select('email, name')
    .eq('id', staffId)
    .eq('tenant_id', tenantId)
    .single();

  if (!staff) return;

  const template = NotificationTemplates.taskAssigned(task.title, task.due_date);

  // In-app notification
  await createInAppNotification(
    tenantId,
    staffId,
    template.title,
    template.message,
    template.type,
    `/dashboard/staff/tasks`
  );

  // Email notification
  if (staff.email) {
    await sendEmailNotification(
      staff.email,
      template.title,
      `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2>${template.title}</h2>
          <p>${template.message}</p>
          <p><a href="${process.env.NEXT_PUBLIC_APP_URL}/dashboard/staff/tasks">View Task</a></p>
        </div>
      `
    );
  }
}

/**
 * Send content reminder notification
 */
export async function notifyContentReminder(
  tenantId: string,
  content: { title: string; platform: string; scheduled_date: string },
  staffIds: string[]
) {
  const template = NotificationTemplates.contentScheduled(
    content.title,
    content.platform,
    content.scheduled_date
  );

  for (const staffId of staffIds) {
    await createInAppNotification(
      tenantId,
      staffId,
      template.title,
      template.message,
      template.type,
      `/dashboard/staff/content`
    );
  }
}

/**
 * Log notification for tracking
 */
async function logNotification(
  type: 'email' | 'sms' | 'in_app',
  recipients: string[],
  content: string,
  metadata?: Record<string, any>
) {
  try {
    await supabaseAdmin.from('system_logs').insert({
      action_type: 'notification',
      entity_type: type,
      description: `Sent ${type} notification to ${recipients.length} recipient(s)`,
      metadata: {
        type,
        recipients: recipients.length,
        content: content.substring(0, 100),
        ...metadata,
      },
    });
  } catch (error) {
    console.error('Error logging notification:', error);
  }
}

/**
 * Create notifications table if it doesn't exist
 */
async function createNotificationsTable() {
  // This would typically be in a migration, but we can create it programmatically
  const { error } = await supabaseAdmin.rpc('exec_sql', {
    sql: `
      CREATE TABLE IF NOT EXISTS notifications (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
        user_id UUID REFERENCES app_users(id) ON DELETE CASCADE,
        title TEXT NOT NULL,
        message TEXT NOT NULL,
        type TEXT NOT NULL DEFAULT 'info',
        link TEXT,
        metadata JSONB DEFAULT '{}'::jsonb,
        read BOOLEAN NOT NULL DEFAULT false,
        created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
      );

      CREATE INDEX IF NOT EXISTS idx_notifications_tenant_user ON notifications(tenant_id, user_id);
      CREATE INDEX IF NOT EXISTS idx_notifications_read ON notifications(read);
    `,
  });

  if (error) {
    console.error('Error creating notifications table:', error);
  }
}


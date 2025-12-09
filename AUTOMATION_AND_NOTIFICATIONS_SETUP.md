# Automation & Notifications Setup Guide

## 🚀 Automation Scheduling

### Vercel Cron Jobs

The platform uses Vercel Cron Jobs for scheduled automation. Configuration is in `vercel.json`:

1. **Daily Task Allocation** - Runs at 9 AM daily
   - Creates recurring tasks
   - Allocates tasks to staff
   - Sends notifications for new assignments

2. **End of Day Carry-Over** - Runs at 6 PM daily
   - Moves incomplete tasks to next day
   - Creates daily summary for admin
   - Sends email summary

3. **Content Reminders** - Runs every 6 hours
   - Sends reminders for content scheduled in next 24 hours

### Setup Steps

1. **Add Cron Secret to Environment Variables**

   ```env
   CRON_SECRET=your-secret-key-here
   ```

2. **Deploy to Vercel**

   Vercel will automatically detect and set up the cron jobs from `vercel.json`.

3. **Manual Testing**

   Test cron endpoints manually:

   ```bash
   curl -X GET "https://your-app.vercel.app/api/cron/daily-tasks" \
     -H "Authorization: Bearer your-cron-secret"
   ```

### Alternative: External Cron Service

If not using Vercel, use an external cron service (e.g., cron-job.org, EasyCron):

- **Daily Tasks**: `GET /api/cron/daily-tasks` at 9 AM
- **End of Day**: `GET /api/cron/end-of-day` at 6 PM
- **Content Reminders**: `GET /api/cron/content-reminders` every 6 hours

Include header: `Authorization: Bearer YOUR_CRON_SECRET`

## 📧 Email Notifications

### Configuration

Add to `.env.local`:

```env
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
SMTP_FROM=noreply@rinads.com
```

### Gmail Setup

1. Enable 2-Factor Authentication
2. Generate App Password: https://myaccount.google.com/apppasswords
3. Use app password as `SMTP_PASS`

### Usage

```typescript
import { sendEmailNotification } from '@/lib/notifications';

await sendEmailNotification(
  'user@example.com',
  'Task Assigned',
  '<h1>You have a new task</h1><p>Task details...</p>'
);
```

## 📱 SMS Notifications

### Configuration

Add to `.env.local`:

```env
SMS_PROVIDER=twilio
SMS_API_KEY=your-api-key
SMS_API_SECRET=your-api-secret
SMS_FROM_NUMBER=+1234567890
```

### Twilio Setup

1. Sign up at https://www.twilio.com
2. Get API credentials
3. Purchase phone number
4. Add credentials to environment variables

### Usage

```typescript
import { sendSMSNotification } from '@/lib/notifications';

await sendSMSNotification(
  '+1234567890',
  'Your task is due in 2 hours'
);
```

## 🔔 In-App Notifications

### Database Setup

The notifications table is created automatically, but you can also run:

```sql
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
```

### Usage

```typescript
import { createInAppNotification } from '@/lib/notifications';

await createInAppNotification(
  tenantId,
  userId,
  'New Task Assigned',
  'You have been assigned a new task',
  'info',
  '/dashboard/staff/tasks'
);
```

### Fetch Notifications

```typescript
const response = await fetch('/api/notifications?unread_only=true', {
  headers: {
    'x-tenant-id': tenantId,
    'x-user-id': userId,
  },
});
const { notifications } = await response.json();
```

## 📋 Notification Templates

Pre-built templates available:

```typescript
import { NotificationTemplates } from '@/lib/notifications';

// Task assigned
const taskTemplate = NotificationTemplates.taskAssigned('Complete project', '2024-12-31');

// Task due soon
const dueTemplate = NotificationTemplates.taskDue('Complete project', 2);

// Invoice created
const invoiceTemplate = NotificationTemplates.invoiceCreated('INV-2024-001', 5000);
```

## 🔄 Integration with Automation

Notifications are automatically sent when:

1. **Task Assigned** - Staff receives email + in-app notification
2. **Task Due Soon** - Reminder 2 hours before due date
3. **Task Overdue** - Alert when task passes due date
4. **Content Scheduled** - Reminder 24 hours before publishing
5. **Invoice Created** - Client receives email notification
6. **Invoice Due** - Reminder 3 days before due date
7. **Lead Assigned** - Staff receives notification
8. **Daily Summary** - Admin receives email at end of day

## 🧪 Testing

### Test Email

```bash
curl -X POST http://localhost:3000/api/test/email \
  -H "Content-Type: application/json" \
  -d '{"to": "test@example.com", "subject": "Test", "message": "Test email"}'
```

### Test In-App Notification

```bash
curl -X POST http://localhost:3000/api/notifications \
  -H "Content-Type: application/json" \
  -H "x-tenant-id: YOUR_TENANT_ID" \
  -H "x-user-id: YOUR_USER_ID" \
  -d '{
    "title": "Test Notification",
    "message": "This is a test",
    "type": "info"
  }'
```

## 📊 Monitoring

All notifications are logged in `system_logs` table:

```sql
SELECT * FROM system_logs 
WHERE action_type = 'notification' 
ORDER BY created_at DESC 
LIMIT 100;
```

## 🔐 Security

- Cron endpoints require `CRON_SECRET` in Authorization header
- Email/SMS credentials stored in environment variables
- In-app notifications scoped by tenant_id and user_id

## 🚨 Troubleshooting

### Cron Jobs Not Running

1. Check Vercel dashboard → Settings → Cron Jobs
2. Verify `CRON_SECRET` is set
3. Check logs in Vercel dashboard

### Email Not Sending

1. Verify SMTP credentials
2. Check spam folder
3. Review email logs in `system_logs`
4. Test with manual API call

### SMS Not Sending

1. Verify SMS provider credentials
2. Check account balance (Twilio)
3. Review SMS logs in `system_logs`

### In-App Notifications Not Showing

1. Verify notifications table exists
2. Check tenant_id and user_id are correct
3. Verify API endpoint is accessible
4. Check browser console for errors


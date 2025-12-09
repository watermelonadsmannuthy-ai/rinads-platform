# RINADS ERP + Agency Automation - Quick Start

## 🚀 Setup Steps

### 1. Run Database Schema

```bash
# Go to Supabase SQL Editor
# Run: supabase/erp-agency-schema.sql
```

### 2. Install Dependencies (if needed)

```bash
npm install
```

### 3. Environment Variables

Add to `.env.local`:

```env
# OpenAI (Required for AI features)
OPENAI_API_KEY=sk-your-key-here
OPENAI_MODEL=gpt-4-turbo-preview

# Enable AI Lead Qualification
ENABLE_AI_LEAD_QUALIFICATION=true
```

### 4. Test the System

```bash
# Test automation
npm run test:automation

# Test AI chatbot
curl -X POST http://localhost:3000/api/ai/chat \
  -H "Content-Type: application/json" \
  -H "x-tenant-id: YOUR_TENANT_ID" \
  -d '{"message": "What are my pending tasks?"}'
```

## 📋 Core Features

### ✅ Implemented

1. **Database Schema** - All tables created
2. **API Endpoints** - Full REST API for all entities
3. **Task Automation** - Daily allocation, carry-over, recurring
4. **AI Chatbot** - Database-aware assistant
5. **QR Attendance** - Generate and scan QR codes
6. **Content Calendar** - Schedule with AI caption generation
7. **Invoice Engine** - Create, send, track invoices
8. **Lead Management** - Auto-qualification with AI
9. **Admin Dashboard** - Basic dashboard structure

### 🚧 In Progress

1. **Role-Based Dashboards** - Staff, Client, Visitor
2. **UI Components** - Full-featured pages
3. **Service Pages** - Digital marketing, video production
4. **Demo Mode** - Visitor trial interface

## 🎯 Next Development Tasks

### Priority 1: Complete Dashboards

1. **Staff Dashboard** (`/dashboard/staff`)
   - Tasks assigned to them
   - QR attendance scanner
   - Content calendar view
   - Client assignments

2. **Client Dashboard** (`/dashboard/client`)
   - Their projects
   - Invoices and payments
   - Content preview
   - Messaging

3. **Visitor Demo** (`/demo`)
   - Limited preview
   - AI chatbot
   - Signup CTA

### Priority 2: UI Components

1. **Task Management**
   - Create/edit tasks
   - Drag & drop prioritization
   - Recurring task setup

2. **Content Calendar**
   - Monthly/weekly view
   - Drag & drop scheduling
   - AI caption generation UI
   - Platform filters

3. **Invoice Creation**
   - Itemized invoice builder
   - PDF preview
   - Email sending

4. **Lead Management**
   - Lead form (public)
   - Lead qualification display
   - Follow-up task creation

### Priority 3: Services Integration

1. **Digital Marketing Services**
   - Service pages
   - Pricing display
   - Purchase flow
   - Auto-onboarding

2. **Video Production Services**
   - Service pages
   - Project workflow
   - Asset management

### Priority 4: Automation

1. **Cron Jobs**
   - Daily task allocation (9 AM)
   - End-of-day carry-over (6 PM)
   - Weekly reports (Monday)

2. **Notifications**
   - Email for new tasks
   - SMS for content reminders
   - In-app notifications

## 📱 Mobile Features

### QR Attendance Scanner

Create a mobile-friendly scanner:

```tsx
// app/dashboard/staff/attendance/page.tsx
'use client';

import { useState } from 'react';

export default function AttendanceScanner() {
  const [scanning, setScanning] = useState(false);

  async function handleScan(qrToken: string) {
    const tenantId = localStorage.getItem('tenant_id');
    const response = await fetch('/api/attendance/qr', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-tenant-id': tenantId || '',
        'x-scan-action': 'check_in',
      },
      body: JSON.stringify({ action: 'scan', qr_token: qrToken }),
    });

    const result = await response.json();
    if (result.success) {
      alert('Checked in successfully!');
    }
  }

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Attendance Scanner</h1>
      <button
        onClick={() => setScanning(true)}
        className="w-full bg-blue-600 text-white py-3 rounded-lg"
      >
        Scan QR Code
      </button>
      {scanning && (
        <div className="mt-4">
          {/* Integrate QR scanner library (e.g., react-qr-reader) */}
        </div>
      )}
    </div>
  );
}
```

## 🔗 API Usage Examples

### Create Task

```typescript
const response = await fetch('/api/tasks', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'x-tenant-id': tenantId,
  },
  body: JSON.stringify({
    title: 'Complete project proposal',
    client_id: clientId,
    due_date: '2024-12-31T23:59:59Z',
    priority: 'high',
    recurring: 'weekly',
  }),
});
```

### Schedule Content

```typescript
const response = await fetch('/api/content-calendar', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'x-tenant-id': tenantId,
  },
  body: JSON.stringify({
    title: 'Product Launch Post',
    client_id: clientId,
    scheduled_date: '2024-12-25T10:00:00Z',
    platform: 'instagram',
    auto_create_tasks: true,
  }),
});

// Generate AI caption
const captionResponse = await fetch('/api/content-calendar', {
  method: 'PATCH',
  headers: {
    'Content-Type': 'application/json',
    'x-tenant-id': tenantId,
  },
  body: JSON.stringify({
    id: contentId,
    action: 'generate_caption',
  }),
});
```

### Create Invoice

```typescript
const response = await fetch('/api/invoices', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'x-tenant-id': tenantId,
  },
  body: JSON.stringify({
    client_id: clientId,
    items: [
      { name: 'Social Media Management', quantity: 1, price: 5000 },
      { name: 'Content Creation', quantity: 10, price: 500 },
    ],
    tax_rate: 0.18,
    due_date: '2024-12-31T23:59:59Z',
  }),
});
```

## 🎨 UI Design Guidelines

- **Color Scheme**: Modern SaaS (clean, professional)
- **Layout**: Card-based dashboard
- **Navigation**: Left sidebar for modules
- **Responsive**: Mobile-first design
- **Icons**: Lucide React (already installed)

## 📊 Dashboard Widgets

Each dashboard should include:

1. **Stats Cards** - Key metrics
2. **Recent Activity** - Latest items
3. **Quick Actions** - Common tasks
4. **Charts** - Analytics (optional)
5. **AI Suggestions** - AI-powered insights

## 🚀 Deployment

Follow the existing deployment guide:
- [Deployment Guide](./DEPLOY_TO_PRODUCTION.md)

Add new environment variables to Vercel:
- `OPENAI_API_KEY`
- `ENABLE_AI_LEAD_QUALIFICATION`

## 📝 Notes

- All APIs require `x-tenant-id` header
- Multi-tenant isolation via RLS policies
- AI features require OpenAI API key
- QR codes expire after 1 year
- Invoices auto-generate PDF (async)

## 🆘 Support

For issues or questions:
1. Check [Implementation Guide](./ERP_AGENCY_IMPLEMENTATION.md)
2. Review API documentation
3. Check Supabase logs
4. Review error handling logs


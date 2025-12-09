-- RINADS ERP + Agency Automation Suite - Extended Schema
-- Run this after main schema.sql and support-schema.sql

-- ============================================================================
-- CLIENTS (Agency Clients)
-- ============================================================================

CREATE TABLE IF NOT EXISTS clients (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  company TEXT,
  plan TEXT, -- subscription plan
  status TEXT NOT NULL DEFAULT 'active', -- active, inactive, trial, cancelled
  notes TEXT,
  onboarding_status TEXT NOT NULL DEFAULT 'pending', -- pending, in_progress, completed
  onboarding_data JSONB DEFAULT '{}'::jsonb,
  assigned_staff_id UUID REFERENCES staff(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================================
-- TASKS (Project Management)
-- ============================================================================

CREATE TABLE IF NOT EXISTS tasks (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  client_id UUID REFERENCES clients(id) ON DELETE SET NULL,
  staff_id UUID REFERENCES staff(id) ON DELETE SET NULL,
  title TEXT NOT NULL,
  description TEXT,
  due_date TIMESTAMPTZ,
  allocated_date TIMESTAMPTZ,
  status TEXT NOT NULL DEFAULT 'pending', -- pending, in_progress, completed, cancelled, overdue
  priority TEXT NOT NULL DEFAULT 'medium', -- low, medium, high, urgent
  recurring TEXT, -- daily, weekly, monthly, null for one-time
  recurring_pattern JSONB, -- e.g., {"frequency": "weekly", "day_of_week": 1}
  notes TEXT,
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  completed_at TIMESTAMPTZ
);

-- ============================================================================
-- ATTENDANCE (QR-Based)
-- ============================================================================

CREATE TABLE IF NOT EXISTS attendance (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  staff_id UUID NOT NULL REFERENCES staff(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  time_in TIMESTAMPTZ,
  time_out TIMESTAMPTZ,
  duration_minutes INTEGER,
  device TEXT, -- mobile, web, qr_scanner
  qr_verification_token TEXT,
  verified BOOLEAN NOT NULL DEFAULT false,
  location JSONB, -- GPS coordinates if available
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(tenant_id, staff_id, date)
);

-- ============================================================================
-- CONTENT CALENDAR
-- ============================================================================

CREATE TABLE IF NOT EXISTS content_calendar (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  client_id UUID REFERENCES clients(id) ON DELETE SET NULL,
  title TEXT NOT NULL,
  scheduled_date TIMESTAMPTZ NOT NULL,
  platform TEXT NOT NULL, -- instagram, facebook, youtube, reels, linkedin, twitter
  caption TEXT,
  hashtags TEXT[],
  assets JSONB DEFAULT '[]'::jsonb, -- URLs to images/videos
  status TEXT NOT NULL DEFAULT 'scheduled', -- scheduled, published, cancelled
  ai_generated BOOLEAN NOT NULL DEFAULT false,
  notes TEXT,
  created_by UUID REFERENCES app_users(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================================
-- INVOICES
-- ============================================================================

CREATE TABLE IF NOT EXISTS invoices (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  client_id UUID NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
  invoice_number TEXT UNIQUE NOT NULL,
  items JSONB NOT NULL DEFAULT '[]'::jsonb, -- [{"name": "Service", "quantity": 1, "price": 1000}]
  subtotal DECIMAL(10, 2) NOT NULL,
  tax DECIMAL(10, 2) DEFAULT 0,
  total DECIMAL(10, 2) NOT NULL,
  pdf_url TEXT,
  payment_status TEXT NOT NULL DEFAULT 'pending', -- pending, paid, overdue, cancelled
  payment_method TEXT,
  payment_date TIMESTAMPTZ,
  due_date TIMESTAMPTZ,
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================================
-- LEADS
-- ============================================================================

CREATE TABLE IF NOT EXISTS leads (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  email TEXT,
  phone TEXT,
  company TEXT,
  source TEXT, -- website, referral, social, ad, etc.
  service_interest TEXT[], -- array of services they're interested in
  status TEXT NOT NULL DEFAULT 'new', -- new, contacted, qualified, converted, lost
  priority TEXT NOT NULL DEFAULT 'medium', -- low, medium, high (AI-scored)
  ai_score INTEGER, -- 0-100 lead quality score
  assigned_staff_id UUID REFERENCES staff(id) ON DELETE SET NULL,
  notes TEXT,
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================================
-- SYSTEM LOGS & ACTIVITY
-- ============================================================================

CREATE TABLE IF NOT EXISTS system_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  tenant_id UUID REFERENCES tenants(id) ON DELETE SET NULL,
  user_id UUID REFERENCES app_users(id) ON DELETE SET NULL,
  action_type TEXT NOT NULL, -- login, create, update, delete, automation, error
  entity_type TEXT, -- task, client, invoice, etc.
  entity_id UUID,
  description TEXT,
  metadata JSONB DEFAULT '{}'::jsonb,
  ip_address TEXT,
  user_agent TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================================
-- CONFIG / SETTINGS
-- ============================================================================

CREATE TABLE IF NOT EXISTS system_config (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  tenant_id UUID REFERENCES tenants(id) ON DELETE CASCADE,
  config_key TEXT NOT NULL,
  config_value JSONB NOT NULL,
  description TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(tenant_id, config_key)
);

-- ============================================================================
-- AI CHATBOT CONVERSATIONS
-- ============================================================================

CREATE TABLE IF NOT EXISTS ai_conversations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  user_id UUID REFERENCES app_users(id) ON DELETE SET NULL,
  role TEXT NOT NULL, -- admin, staff, client
  messages JSONB NOT NULL DEFAULT '[]'::jsonb, -- array of {role: 'user'|'assistant', content: string}
  context JSONB DEFAULT '{}'::jsonb, -- additional context for AI
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================================
-- AUTOMATION JOBS
-- ============================================================================

CREATE TABLE IF NOT EXISTS automation_jobs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  job_type TEXT NOT NULL, -- daily_tasks, carry_over, invoice_reminder, content_reminder
  status TEXT NOT NULL DEFAULT 'pending', -- pending, running, completed, failed
  scheduled_at TIMESTAMPTZ NOT NULL,
  started_at TIMESTAMPTZ,
  completed_at TIMESTAMPTZ,
  result JSONB DEFAULT '{}'::jsonb,
  error_message TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================================
-- STAFF QR CODES
-- ============================================================================

CREATE TABLE IF NOT EXISTS staff_qr_codes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  staff_id UUID NOT NULL REFERENCES staff(id) ON DELETE CASCADE,
  qr_token TEXT UNIQUE NOT NULL,
  qr_code_url TEXT, -- URL to QR code image
  expires_at TIMESTAMPTZ,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================================
-- INDEXES
-- ============================================================================

CREATE INDEX IF NOT EXISTS idx_clients_tenant_id ON clients(tenant_id);
CREATE INDEX IF NOT EXISTS idx_clients_status ON clients(status);
CREATE INDEX IF NOT EXISTS idx_tasks_tenant_id ON tasks(tenant_id);
CREATE INDEX IF NOT EXISTS idx_tasks_client_id ON tasks(client_id);
CREATE INDEX IF NOT EXISTS idx_tasks_staff_id ON tasks(staff_id);
CREATE INDEX IF NOT EXISTS idx_tasks_status ON tasks(status);
CREATE INDEX IF NOT EXISTS idx_tasks_due_date ON tasks(due_date);
CREATE INDEX IF NOT EXISTS idx_attendance_tenant_id ON attendance(tenant_id);
CREATE INDEX IF NOT EXISTS idx_attendance_staff_id ON attendance(staff_id);
CREATE INDEX IF NOT EXISTS idx_attendance_date ON attendance(date);
CREATE INDEX IF NOT EXISTS idx_content_calendar_tenant_id ON content_calendar(tenant_id);
CREATE INDEX IF NOT EXISTS idx_content_calendar_scheduled_date ON content_calendar(scheduled_date);
CREATE INDEX IF NOT EXISTS idx_invoices_tenant_id ON invoices(tenant_id);
CREATE INDEX IF NOT EXISTS idx_invoices_client_id ON invoices(client_id);
CREATE INDEX IF NOT EXISTS idx_invoices_payment_status ON invoices(payment_status);
CREATE INDEX IF NOT EXISTS idx_leads_tenant_id ON leads(tenant_id);
CREATE INDEX IF NOT EXISTS idx_leads_status ON leads(status);
CREATE INDEX IF NOT EXISTS idx_leads_priority ON leads(priority);
CREATE INDEX IF NOT EXISTS idx_system_logs_tenant_id ON system_logs(tenant_id);
CREATE INDEX IF NOT EXISTS idx_system_logs_user_id ON system_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_system_logs_created_at ON system_logs(created_at);
CREATE INDEX IF NOT EXISTS idx_ai_conversations_tenant_id ON ai_conversations(tenant_id);
CREATE INDEX IF NOT EXISTS idx_ai_conversations_user_id ON ai_conversations(user_id);
CREATE INDEX IF NOT EXISTS idx_automation_jobs_tenant_id ON automation_jobs(tenant_id);
CREATE INDEX IF NOT EXISTS idx_automation_jobs_status ON automation_jobs(status);
CREATE INDEX IF NOT EXISTS idx_automation_jobs_scheduled_at ON automation_jobs(scheduled_at);

-- ============================================================================
-- RLS POLICIES
-- ============================================================================

-- Enable RLS
ALTER TABLE clients ENABLE ROW LEVEL SECURITY;
ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE attendance ENABLE ROW LEVEL SECURITY;
ALTER TABLE content_calendar ENABLE ROW LEVEL SECURITY;
ALTER TABLE invoices ENABLE ROW LEVEL SECURITY;
ALTER TABLE leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE system_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE system_config ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE automation_jobs ENABLE ROW LEVEL SECURITY;
ALTER TABLE staff_qr_codes ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Users can view their tenant clients" ON clients;
DROP POLICY IF EXISTS "Users can view their tenant tasks" ON tasks;
DROP POLICY IF EXISTS "Users can view their tenant attendance" ON attendance;
DROP POLICY IF EXISTS "Users can view their tenant content" ON content_calendar;
DROP POLICY IF EXISTS "Users can view their tenant invoices" ON invoices;
DROP POLICY IF EXISTS "Users can view their tenant leads" ON leads;
DROP POLICY IF EXISTS "Users can view their tenant logs" ON system_logs;
DROP POLICY IF EXISTS "Users can view their tenant config" ON system_config;
DROP POLICY IF EXISTS "Users can view their tenant ai conversations" ON ai_conversations;
DROP POLICY IF EXISTS "Users can view their tenant automation jobs" ON automation_jobs;
DROP POLICY IF EXISTS "Users can view their tenant qr codes" ON staff_qr_codes;

-- Create RLS policies
CREATE POLICY "Users can view their tenant clients" ON clients
  FOR SELECT USING (
    tenant_id IN (SELECT tenant_id FROM app_users WHERE id = auth.uid())
  );

CREATE POLICY "Users can view their tenant tasks" ON tasks
  FOR SELECT USING (
    tenant_id IN (SELECT tenant_id FROM app_users WHERE id = auth.uid())
  );

CREATE POLICY "Users can view their tenant attendance" ON attendance
  FOR SELECT USING (
    tenant_id IN (SELECT tenant_id FROM app_users WHERE id = auth.uid())
  );

CREATE POLICY "Users can view their tenant content" ON content_calendar
  FOR SELECT USING (
    tenant_id IN (SELECT tenant_id FROM app_users WHERE id = auth.uid())
  );

CREATE POLICY "Users can view their tenant invoices" ON invoices
  FOR SELECT USING (
    tenant_id IN (SELECT tenant_id FROM app_users WHERE id = auth.uid())
  );

CREATE POLICY "Users can view their tenant leads" ON leads
  FOR SELECT USING (
    tenant_id IN (SELECT tenant_id FROM app_users WHERE id = auth.uid())
  );

CREATE POLICY "Users can view their tenant logs" ON system_logs
  FOR SELECT USING (
    tenant_id IN (SELECT tenant_id FROM app_users WHERE id = auth.uid())
  );

CREATE POLICY "Users can view their tenant config" ON system_config
  FOR SELECT USING (
    tenant_id IN (SELECT tenant_id FROM app_users WHERE id = auth.uid())
  );

CREATE POLICY "Users can view their tenant ai conversations" ON ai_conversations
  FOR SELECT USING (
    tenant_id IN (SELECT tenant_id FROM app_users WHERE id = auth.uid())
  );

CREATE POLICY "Users can view their tenant automation jobs" ON automation_jobs
  FOR SELECT USING (
    tenant_id IN (SELECT tenant_id FROM app_users WHERE id = auth.uid())
  );

CREATE POLICY "Users can view their tenant qr codes" ON staff_qr_codes
  FOR SELECT USING (
    tenant_id IN (SELECT tenant_id FROM app_users WHERE id = auth.uid())
  );

-- ============================================================================
-- TRIGGERS
-- ============================================================================

CREATE TRIGGER update_clients_updated_at BEFORE UPDATE ON clients
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_tasks_updated_at BEFORE UPDATE ON tasks
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_attendance_updated_at BEFORE UPDATE ON attendance
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_content_calendar_updated_at BEFORE UPDATE ON content_calendar
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_invoices_updated_at BEFORE UPDATE ON invoices
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_leads_updated_at BEFORE UPDATE ON leads
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_system_config_updated_at BEFORE UPDATE ON system_config
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_ai_conversations_updated_at BEFORE UPDATE ON ai_conversations
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();


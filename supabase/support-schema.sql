-- Support Desk & Error Tracking Tables
-- Run this after the main schema.sql

-- Error logs table
CREATE TABLE IF NOT EXISTS error_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  error_code TEXT NOT NULL,
  error_message TEXT NOT NULL,
  priority TEXT NOT NULL, -- critical, high, medium, low
  category TEXT NOT NULL,
  tenant_id UUID REFERENCES tenants(id) ON DELETE SET NULL,
  user_id UUID REFERENCES app_users(id) ON DELETE SET NULL,
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Support tickets table
CREATE TABLE IF NOT EXISTS support_tickets (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  ticket_number TEXT UNIQUE NOT NULL DEFAULT 'TKT-' || to_char(now(), 'YYYYMMDD') || '-' || substr(md5(random()::text), 1, 6),
  error_code TEXT,
  title TEXT NOT NULL,
  description TEXT,
  priority TEXT NOT NULL DEFAULT 'medium', -- critical, high, medium, low
  sla TEXT NOT NULL, -- e.g., '1h', '2h', '4h', '24h'
  status TEXT NOT NULL DEFAULT 'open', -- open, in_progress, resolved, closed
  tenant_id UUID REFERENCES tenants(id) ON DELETE SET NULL,
  user_id UUID REFERENCES app_users(id) ON DELETE SET NULL,
  assigned_to UUID REFERENCES app_users(id) ON DELETE SET NULL,
  metadata JSONB DEFAULT '{}'::jsonb,
  resolved_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Incident response log
CREATE TABLE IF NOT EXISTS incidents (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  incident_number TEXT UNIQUE NOT NULL DEFAULT 'INC-' || to_char(now(), 'YYYYMMDD') || '-' || substr(md5(random()::text), 1, 6),
  title TEXT NOT NULL,
  description TEXT,
  severity TEXT NOT NULL, -- critical, high, medium, low
  status TEXT NOT NULL DEFAULT 'detected', -- detected, triaged, contained, mitigated, resolved
  affected_tenants UUID[],
  root_cause TEXT,
  resolution TEXT,
  post_mortem TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  resolved_at TIMESTAMPTZ,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- SLA tracking
CREATE TABLE IF NOT EXISTS sla_tracking (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  ticket_id UUID REFERENCES support_tickets(id) ON DELETE CASCADE,
  tenant_id UUID REFERENCES tenants(id) ON DELETE CASCADE,
  plan_slug TEXT NOT NULL,
  sla_type TEXT NOT NULL, -- response, resolution
  sla_target TEXT NOT NULL, -- e.g., '2h', '24h'
  sla_start TIMESTAMPTZ NOT NULL,
  sla_end TIMESTAMPTZ,
  status TEXT NOT NULL DEFAULT 'pending', -- pending, met, breached
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_error_logs_tenant_id ON error_logs(tenant_id);
CREATE INDEX IF NOT EXISTS idx_error_logs_error_code ON error_logs(error_code);
CREATE INDEX IF NOT EXISTS idx_error_logs_created_at ON error_logs(created_at);
CREATE INDEX IF NOT EXISTS idx_support_tickets_tenant_id ON support_tickets(tenant_id);
CREATE INDEX IF NOT EXISTS idx_support_tickets_status ON support_tickets(status);
CREATE INDEX IF NOT EXISTS idx_support_tickets_priority ON support_tickets(priority);
CREATE INDEX IF NOT EXISTS idx_incidents_status ON incidents(status);
CREATE INDEX IF NOT EXISTS idx_sla_tracking_ticket_id ON sla_tracking(ticket_id);

-- Triggers
CREATE TRIGGER update_support_tickets_updated_at BEFORE UPDATE ON support_tickets
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_incidents_updated_at BEFORE UPDATE ON incidents
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Function to get SLA based on plan
CREATE OR REPLACE FUNCTION get_sla_for_plan(plan_slug TEXT, sla_type TEXT)
RETURNS TEXT AS $$
BEGIN
  CASE plan_slug
    WHEN 'solo' THEN
      RETURN CASE sla_type WHEN 'response' THEN '48h' WHEN 'resolution' THEN '72h' ELSE '48h' END;
    WHEN 'studio' THEN
      RETURN CASE sla_type WHEN 'response' THEN '24h' WHEN 'resolution' THEN '48h' ELSE '24h' END;
    WHEN 'pro' THEN
      RETURN CASE sla_type WHEN 'response' THEN '8h' WHEN 'resolution' THEN '24h' ELSE '8h' END;
    WHEN 'enterprise' THEN
      RETURN CASE sla_type WHEN 'response' THEN '2h' WHEN 'resolution' THEN '8h' ELSE '2h' END;
    ELSE
      RETURN '24h';
  END CASE;
END;
$$ LANGUAGE plpgsql;


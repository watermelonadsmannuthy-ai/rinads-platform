-- RINADS Salon ERP - Database Schema
-- Multi-tenant architecture with Row-Level Security (RLS)

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Enable Row-Level Security
-- Note: This line may fail in Supabase (they manage JWT secrets automatically)
-- It's safe to ignore this error if it occurs - RLS will still work
-- ALTER DATABASE postgres SET "app.jwt_secret" TO 'your-jwt-secret-here';

-- ============================================================================
-- TENANT MANAGEMENT
-- ============================================================================

-- Tenants table
CREATE TABLE IF NOT EXISTS tenants (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  subdomain TEXT UNIQUE NOT NULL,
  plan_slug TEXT NOT NULL DEFAULT 'solo', -- solo, studio, pro, enterprise
  status TEXT NOT NULL DEFAULT 'active', -- active, suspended, cancelled
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  metadata JSONB DEFAULT '{}'::jsonb
);

-- Tenant settings
CREATE TABLE IF NOT EXISTS tenant_settings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  setting_key TEXT NOT NULL,
  setting_value JSONB NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(tenant_id, setting_key)
);

-- ============================================================================
-- USER MANAGEMENT
-- ============================================================================

-- App users (linked to Supabase auth.users)
CREATE TABLE IF NOT EXISTS app_users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  full_name TEXT,
  role TEXT NOT NULL DEFAULT 'staff', -- owner, admin, staff, client
  phone TEXT,
  avatar_url TEXT,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================================
-- FEATURE FLAGS & PLAN MANAGEMENT
-- ============================================================================

-- Feature flags catalog
CREATE TABLE IF NOT EXISTS feature_flags (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  flag_key TEXT UNIQUE NOT NULL, -- e.g., 'staff_module', 'advanced_reports', 'ai_assistant'
  flag_name TEXT NOT NULL,
  description TEXT,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Plan features mapping
CREATE TABLE IF NOT EXISTS plan_features (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  plan_slug TEXT NOT NULL, -- solo, studio, pro, enterprise
  feature_flag_id UUID NOT NULL REFERENCES feature_flags(id) ON DELETE CASCADE,
  is_enabled BOOLEAN NOT NULL DEFAULT true,
  limits JSONB DEFAULT '{}'::jsonb, -- e.g., {"max_staff": 5, "max_branches": 1}
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(plan_slug, feature_flag_id)
);

-- Tenant feature overrides (for custom feature access)
CREATE TABLE IF NOT EXISTS tenant_feature_overrides (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  feature_flag_id UUID NOT NULL REFERENCES feature_flags(id) ON DELETE CASCADE,
  is_enabled BOOLEAN NOT NULL,
  expires_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(tenant_id, feature_flag_id)
);

-- Feature usage tracking
CREATE TABLE IF NOT EXISTS feature_usage (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  feature_flag_id UUID NOT NULL REFERENCES feature_flags(id) ON DELETE CASCADE,
  user_id UUID REFERENCES app_users(id) ON DELETE SET NULL,
  usage_data JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================================
-- SUBSCRIPTIONS & BILLING
-- ============================================================================

-- Subscriptions
CREATE TABLE IF NOT EXISTS subscriptions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  razorpay_subscription_id TEXT UNIQUE,
  razorpay_plan_id TEXT NOT NULL,
  plan_slug TEXT NOT NULL,
  status TEXT NOT NULL, -- active, cancelled, expired, past_due
  current_period_start TIMESTAMPTZ,
  current_period_end TIMESTAMPTZ,
  cancel_at_period_end BOOLEAN NOT NULL DEFAULT false,
  grace_period_ends_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================================
-- SALON OPERATIONS
-- ============================================================================

-- Services
CREATE TABLE IF NOT EXISTS services (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  duration_minutes INTEGER NOT NULL DEFAULT 60,
  price DECIMAL(10, 2) NOT NULL,
  category TEXT,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Staff
CREATE TABLE IF NOT EXISTS staff (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  user_id UUID REFERENCES app_users(id) ON DELETE SET NULL,
  name TEXT NOT NULL,
  email TEXT,
  phone TEXT,
  specialization TEXT,
  commission_rate DECIMAL(5, 2),
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Appointments
CREATE TABLE IF NOT EXISTS appointments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  client_name TEXT NOT NULL,
  client_email TEXT,
  client_phone TEXT,
  service_id UUID REFERENCES services(id) ON DELETE SET NULL,
  staff_id UUID REFERENCES staff(id) ON DELETE SET NULL,
  scheduled_at TIMESTAMPTZ NOT NULL,
  duration_minutes INTEGER NOT NULL DEFAULT 60,
  status TEXT NOT NULL DEFAULT 'scheduled', -- scheduled, confirmed, completed, cancelled, no_show
  notes TEXT,
  total_amount DECIMAL(10, 2),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Inventory
CREATE TABLE IF NOT EXISTS inventory (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  sku TEXT,
  category TEXT,
  quantity INTEGER NOT NULL DEFAULT 0,
  unit_price DECIMAL(10, 2),
  reorder_level INTEGER DEFAULT 10,
  supplier TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================================
-- WEBHOOK MANAGEMENT
-- ============================================================================

-- Webhook events (for idempotency)
CREATE TABLE IF NOT EXISTS webhook_events (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  event_id TEXT UNIQUE NOT NULL, -- Razorpay event ID
  event_type TEXT NOT NULL,
  payload JSONB NOT NULL,
  processed BOOLEAN NOT NULL DEFAULT false,
  processing_error TEXT,
  retry_count INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  processed_at TIMESTAMPTZ
);

-- ============================================================================
-- INDEXES
-- ============================================================================

CREATE INDEX IF NOT EXISTS idx_app_users_tenant_id ON app_users(tenant_id);
CREATE INDEX IF NOT EXISTS idx_app_users_email ON app_users(email);
CREATE INDEX IF NOT EXISTS idx_services_tenant_id ON services(tenant_id);
CREATE INDEX IF NOT EXISTS idx_staff_tenant_id ON staff(tenant_id);
CREATE INDEX IF NOT EXISTS idx_appointments_tenant_id ON appointments(tenant_id);
CREATE INDEX IF NOT EXISTS idx_appointments_scheduled_at ON appointments(scheduled_at);
CREATE INDEX IF NOT EXISTS idx_inventory_tenant_id ON inventory(tenant_id);
CREATE INDEX IF NOT EXISTS idx_subscriptions_tenant_id ON subscriptions(tenant_id);
CREATE INDEX IF NOT EXISTS idx_subscriptions_razorpay_subscription_id ON subscriptions(razorpay_subscription_id);
CREATE INDEX IF NOT EXISTS idx_tenant_feature_overrides_tenant_id ON tenant_feature_overrides(tenant_id);
CREATE INDEX IF NOT EXISTS idx_feature_usage_tenant_id ON feature_usage(tenant_id);
CREATE INDEX IF NOT EXISTS idx_webhook_events_event_id ON webhook_events(event_id);
CREATE INDEX IF NOT EXISTS idx_webhook_events_processed ON webhook_events(processed);

-- ============================================================================
-- ROW-LEVEL SECURITY (RLS) POLICIES
-- ============================================================================

-- Enable RLS on all tables
ALTER TABLE tenants ENABLE ROW LEVEL SECURITY;
ALTER TABLE tenant_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE app_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE services ENABLE ROW LEVEL SECURITY;
ALTER TABLE staff ENABLE ROW LEVEL SECURITY;
ALTER TABLE appointments ENABLE ROW LEVEL SECURITY;
ALTER TABLE inventory ENABLE ROW LEVEL SECURITY;
ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE tenant_feature_overrides ENABLE ROW LEVEL SECURITY;
ALTER TABLE feature_usage ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist (allows re-running schema)
DROP POLICY IF EXISTS "Users can view their tenant data" ON app_users;
DROP POLICY IF EXISTS "Users can view their tenant" ON tenants;
DROP POLICY IF EXISTS "Users can view their tenant settings" ON tenant_settings;
DROP POLICY IF EXISTS "Users can view their tenant services" ON services;
DROP POLICY IF EXISTS "Users can view their tenant staff" ON staff;
DROP POLICY IF EXISTS "Users can view their tenant appointments" ON appointments;
DROP POLICY IF EXISTS "Users can view their tenant inventory" ON inventory;
DROP POLICY IF EXISTS "Users can view their tenant subscriptions" ON subscriptions;
DROP POLICY IF EXISTS "Authenticated users can view feature flags" ON feature_flags;
DROP POLICY IF EXISTS "Authenticated users can view plan features" ON plan_features;
DROP POLICY IF EXISTS "Users can view their tenant feature overrides" ON tenant_feature_overrides;

-- App users can only see their own tenant's data
CREATE POLICY "Users can view their tenant data" ON app_users
  FOR SELECT USING (id = auth.uid());

CREATE POLICY "Users can view their tenant" ON tenants
  FOR SELECT USING (
    id IN (SELECT tenant_id FROM app_users WHERE id = auth.uid())
  );

CREATE POLICY "Users can view their tenant settings" ON tenant_settings
  FOR SELECT USING (
    tenant_id IN (SELECT tenant_id FROM app_users WHERE id = auth.uid())
  );

CREATE POLICY "Users can view their tenant services" ON services
  FOR SELECT USING (
    tenant_id IN (SELECT tenant_id FROM app_users WHERE id = auth.uid())
  );

CREATE POLICY "Users can view their tenant staff" ON staff
  FOR SELECT USING (
    tenant_id IN (SELECT tenant_id FROM app_users WHERE id = auth.uid())
  );

CREATE POLICY "Users can view their tenant appointments" ON appointments
  FOR SELECT USING (
    tenant_id IN (SELECT tenant_id FROM app_users WHERE id = auth.uid())
  );

CREATE POLICY "Users can view their tenant inventory" ON inventory
  FOR SELECT USING (
    tenant_id IN (SELECT tenant_id FROM app_users WHERE id = auth.uid())
  );

CREATE POLICY "Users can view their tenant subscriptions" ON subscriptions
  FOR SELECT USING (
    tenant_id IN (SELECT tenant_id FROM app_users WHERE id = auth.uid())
  );

-- Feature flags and plan features are readable by all authenticated users
CREATE POLICY "Authenticated users can view feature flags" ON feature_flags
  FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can view plan features" ON plan_features
  FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Users can view their tenant feature overrides" ON tenant_feature_overrides
  FOR SELECT USING (
    tenant_id IN (SELECT tenant_id FROM app_users WHERE id = auth.uid())
  );

-- ============================================================================
-- FUNCTIONS & TRIGGERS
-- ============================================================================

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Drop existing triggers if they exist (allows re-running schema)
DROP TRIGGER IF EXISTS update_tenants_updated_at ON tenants;
DROP TRIGGER IF EXISTS update_tenant_settings_updated_at ON tenant_settings;
DROP TRIGGER IF EXISTS update_app_users_updated_at ON app_users;
DROP TRIGGER IF EXISTS update_services_updated_at ON services;
DROP TRIGGER IF EXISTS update_staff_updated_at ON staff;
DROP TRIGGER IF EXISTS update_appointments_updated_at ON appointments;
DROP TRIGGER IF EXISTS update_inventory_updated_at ON inventory;
DROP TRIGGER IF EXISTS update_subscriptions_updated_at ON subscriptions;

-- Apply updated_at triggers
CREATE TRIGGER update_tenants_updated_at BEFORE UPDATE ON tenants
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_tenant_settings_updated_at BEFORE UPDATE ON tenant_settings
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_app_users_updated_at BEFORE UPDATE ON app_users
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_services_updated_at BEFORE UPDATE ON services
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_staff_updated_at BEFORE UPDATE ON staff
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_appointments_updated_at BEFORE UPDATE ON appointments
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_inventory_updated_at BEFORE UPDATE ON inventory
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_subscriptions_updated_at BEFORE UPDATE ON subscriptions
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();


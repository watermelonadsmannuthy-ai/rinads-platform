// TypeScript types for RINADS Salon ERP

export type PlanSlug = 'solo' | 'studio' | 'pro' | 'enterprise';
export type TenantStatus = 'active' | 'suspended' | 'cancelled';
export type UserRole = 'owner' | 'admin' | 'staff' | 'client';
export type AppointmentStatus = 'scheduled' | 'confirmed' | 'completed' | 'cancelled' | 'no_show';
export type SubscriptionStatus = 'active' | 'cancelled' | 'expired' | 'past_due';

export interface Tenant {
  id: string;
  name: string;
  subdomain: string;
  plan_slug: PlanSlug;
  status: TenantStatus;
  created_at: string;
  updated_at: string;
  metadata?: Record<string, any>;
}

export interface AppUser {
  id: string;
  tenant_id: string;
  email: string;
  full_name?: string;
  role: UserRole;
  phone?: string;
  avatar_url?: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface FeatureFlag {
  id: string;
  flag_key: string;
  flag_name: string;
  description?: string;
  is_active: boolean;
  created_at: string;
}

export interface PlanFeature {
  id: string;
  plan_slug: PlanSlug;
  feature_flag_id: string;
  is_enabled: boolean;
  limits?: Record<string, any>;
  created_at: string;
}

export interface TenantFeatureOverride {
  id: string;
  tenant_id: string;
  feature_flag_id: string;
  is_enabled: boolean;
  expires_at?: string;
  created_at: string;
  updated_at: string;
}

export interface Subscription {
  id: string;
  tenant_id: string;
  razorpay_subscription_id?: string;
  razorpay_plan_id: string;
  plan_slug: PlanSlug;
  status: SubscriptionStatus;
  current_period_start?: string;
  current_period_end?: string;
  cancel_at_period_end: boolean;
  grace_period_ends_at?: string;
  created_at: string;
  updated_at: string;
}

export interface Service {
  id: string;
  tenant_id: string;
  name: string;
  description?: string;
  duration_minutes: number;
  price: number;
  category?: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface Staff {
  id: string;
  tenant_id: string;
  user_id?: string;
  name: string;
  email?: string;
  phone?: string;
  specialization?: string;
  commission_rate?: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface Appointment {
  id: string;
  tenant_id: string;
  client_name: string;
  client_email?: string;
  client_phone?: string;
  service_id?: string;
  staff_id?: string;
  scheduled_at: string;
  duration_minutes: number;
  status: AppointmentStatus;
  notes?: string;
  total_amount?: number;
  created_at: string;
  updated_at: string;
}

export interface Inventory {
  id: string;
  tenant_id: string;
  name: string;
  sku?: string;
  category?: string;
  quantity: number;
  unit_price?: number;
  reorder_level?: number;
  supplier?: string;
  created_at: string;
  updated_at: string;
}

export interface WebhookEvent {
  id: string;
  event_id: string;
  event_type: string;
  payload: Record<string, any>;
  processed: boolean;
  processing_error?: string;
  retry_count: number;
  created_at: string;
  processed_at?: string;
}

export interface FeatureFlagContext {
  tenantId: string;
  userId?: string;
  userRole?: UserRole;
  planSlug: PlanSlug;
}

export interface FeatureFlagResult {
  enabled: boolean;
  reason?: string;
  limits?: Record<string, any>;
}


// Multi-tenant utilities
import { supabaseAdmin } from './supabase/server';
import { Tenant, AppUser } from './types';

/**
 * Get tenant by subdomain
 */
export async function getTenantBySubdomain(subdomain: string): Promise<Tenant | null> {
  const { data, error } = await supabaseAdmin
    .from('tenants')
    .select('*')
    .eq('subdomain', subdomain)
    .eq('status', 'active')
    .single();

  if (error || !data) {
    return null;
  }

  return data as Tenant;
}

/**
 * Get tenant by ID
 */
export async function getTenantById(tenantId: string): Promise<Tenant | null> {
  const { data, error } = await supabaseAdmin
    .from('tenants')
    .select('*')
    .eq('id', tenantId)
    .single();

  if (error || !data) {
    return null;
  }

  return data as Tenant;
}

/**
 * Get user's tenant
 */
export async function getTenantForUser(userId: string): Promise<Tenant | null> {
  const { data: user } = await supabaseAdmin
    .from('app_users')
    .select('tenant_id')
    .eq('id', userId)
    .single();

  if (!user) {
    return null;
  }

  return getTenantById(user.tenant_id);
}

/**
 * Create a new tenant
 */
export async function createTenant(
  name: string,
  subdomain: string,
  planSlug: string = 'solo',
  ownerEmail: string,
  ownerName: string
): Promise<{ tenant: Tenant; owner: AppUser } | null> {
  try {
    // Create tenant
    const { data: tenant, error: tenantError } = await supabaseAdmin
      .from('tenants')
      .insert({
        name,
        subdomain,
        plan_slug: planSlug,
        status: 'active',
      })
      .select()
      .single();

    if (tenantError || !tenant) {
      console.error('Error creating tenant:', tenantError);
      return null;
    }

    // Note: In a real implementation, you would create the auth user first
    // using Supabase Auth, then create the app_user record
    // For now, we'll create a placeholder that needs to be linked to auth.users
    
    return {
      tenant: tenant as Tenant,
      owner: {} as AppUser, // Will be created after auth user is created
    };
  } catch (error) {
    console.error('Error in createTenant:', error);
    return null;
  }
}

/**
 * Update tenant plan
 */
export async function updateTenantPlan(
  tenantId: string,
  planSlug: string
): Promise<boolean> {
  const { error } = await supabaseAdmin
    .from('tenants')
    .update({ plan_slug: planSlug })
    .eq('id', tenantId);

  if (error) {
    console.error('Error updating tenant plan:', error);
    return false;
  }

  return true;
}


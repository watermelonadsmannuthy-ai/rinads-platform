// Onboarding API - Create tenant and owner
import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase/server';
import { createTenant } from '@/lib/tenant';

export async function POST(request: NextRequest) {
  try {
    const { tenantName, subdomain, ownerName, ownerEmail, ownerPassword } = await request.json();

    if (!tenantName || !subdomain || !ownerName || !ownerEmail || !ownerPassword) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Check if subdomain is available
    const { data: existing } = await supabaseAdmin
      .from('tenants')
      .select('id')
      .eq('subdomain', subdomain)
      .single();

    if (existing) {
      return NextResponse.json(
        { error: 'Subdomain already taken' },
        { status: 400 }
      );
    }

    // Create auth user first
    const { data: authUser, error: authError } = await supabaseAdmin.auth.admin.createUser({
      email: ownerEmail,
      password: ownerPassword,
      email_confirm: true,
    });

    if (authError || !authUser.user) {
      console.error('Error creating auth user:', authError);
      return NextResponse.json(
        { error: 'Failed to create user account' },
        { status: 500 }
      );
    }

    // Create tenant
    const { data: tenant, error: tenantError } = await supabaseAdmin
      .from('tenants')
      .insert({
        name: tenantName,
        subdomain,
        plan_slug: 'solo',
        status: 'active',
      })
      .select()
      .single();

    if (tenantError || !tenant) {
      // Rollback: delete auth user if tenant creation fails
      await supabaseAdmin.auth.admin.deleteUser(authUser.user.id);
      return NextResponse.json(
        { error: 'Failed to create tenant' },
        { status: 500 }
      );
    }

    // Create app_user record
    const { error: userError } = await supabaseAdmin
      .from('app_users')
      .insert({
        id: authUser.user.id,
        tenant_id: tenant.id,
        email: ownerEmail,
        full_name: ownerName,
        role: 'owner',
        is_active: true,
      });

    if (userError) {
      console.error('Error creating app_user:', userError);
      // Note: In production, you might want to rollback tenant and auth user
    }

    return NextResponse.json({
      success: true,
      tenantId: tenant.id,
      userId: authUser.user.id,
    });
  } catch (error: any) {
    console.error('Error in onboarding:', error);
    return NextResponse.json(
      { error: error.message || 'Onboarding failed' },
      { status: 500 }
    );
  }
}


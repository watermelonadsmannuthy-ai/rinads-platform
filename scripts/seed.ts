// Seed script - Create sample tenants and data
// Load environment variables from .env.local FIRST (before any imports)
import { readFileSync } from 'fs';
import { resolve } from 'path';

// Load .env.local file manually BEFORE any other imports
try {
  const envPath = resolve(process.cwd(), '.env.local');
  const envFile = readFileSync(envPath, 'utf8');
  envFile.split('\n').forEach(line => {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) return;
    const match = trimmed.match(/^([^=:#]+)=(.*)$/);
    if (match) {
      const key = match[1].trim();
      let value = match[2].trim();
      // Remove quotes if present
      if ((value.startsWith('"') && value.endsWith('"')) || 
          (value.startsWith("'") && value.endsWith("'"))) {
        value = value.slice(1, -1);
      }
      if (key && value) {
        process.env[key] = value;
      }
    }
  });
  console.log('✅ Loaded environment variables from .env.local');
} catch (err) {
  console.warn('⚠️  Could not load .env.local file:', err);
}

// Now import modules that need environment variables
import { supabaseAdmin } from '../lib/supabase/server';
import { initializeFeatureFlags, initializePlanFeatures } from '../lib/feature-flags';

async function seed() {
  console.log('🌱 Starting seed...');

  try {
    // Initialize feature flags and plan features
    console.log('📋 Initializing feature flags...');
    await initializeFeatureFlags();
    await initializePlanFeatures();
    console.log('✅ Feature flags initialized');

    // Sample tenants
    const sampleTenants = [
      {
        name: 'Trendy Cuts',
        subdomain: 'trendy-cuts',
        plan_slug: 'studio' as const,
        status: 'active' as const,
      },
      {
        name: 'Glow Salon',
        subdomain: 'glow-salon',
        plan_slug: 'pro' as const,
        status: 'active' as const,
      },
      {
        name: 'Mannuthy Spa',
        subdomain: 'mannuthy-spa',
        plan_slug: 'enterprise' as const,
        status: 'active' as const,
      },
      {
        name: 'Solo Stylist',
        subdomain: 'solo-stylist',
        plan_slug: 'solo' as const,
        status: 'active' as const,
      },
    ];

    console.log('🏢 Creating sample tenants...');
    for (const tenantData of sampleTenants) {
      // Check if tenant already exists
      const { data: existing } = await supabaseAdmin
        .from('tenants')
        .select('id')
        .eq('subdomain', tenantData.subdomain)
        .single();

      if (existing) {
        console.log(`⏭️  Tenant ${tenantData.subdomain} already exists, skipping...`);
        continue;
      }

      const { data: tenant, error: tenantError } = await supabaseAdmin
        .from('tenants')
        .insert(tenantData)
        .select()
        .single();

      if (tenantError || !tenant) {
        console.error(`❌ Error creating tenant ${tenantData.subdomain}:`, tenantError);
        continue;
      }

      console.log(`✅ Created tenant: ${tenant.name}`);

      // Create sample services
      const services = [
        { name: 'Haircut', duration_minutes: 30, price: 500, category: 'Hair' },
        { name: 'Hair Color', duration_minutes: 120, price: 2500, category: 'Hair' },
        { name: 'Manicure', duration_minutes: 45, price: 800, category: 'Nails' },
        { name: 'Facial', duration_minutes: 60, price: 1500, category: 'Skincare' },
      ];

      for (const service of services) {
        await supabaseAdmin
          .from('services')
          .insert({
            tenant_id: tenant.id,
            ...service,
            is_active: true,
          });
      }

      // Create sample staff (if not solo plan)
      if (tenantData.plan_slug !== 'solo') {
        const staffMembers = [
          { name: 'Sarah Johnson', email: 'sarah@example.com', phone: '+1234567890', specialization: 'Hair Stylist' },
          { name: 'Mike Chen', email: 'mike@example.com', phone: '+1234567891', specialization: 'Color Specialist' },
        ];

        for (const staff of staffMembers) {
          await supabaseAdmin
            .from('staff')
            .insert({
              tenant_id: tenant.id,
              ...staff,
              is_active: true,
            });
        }
      }

      // Create sample inventory items
      const inventoryItems = [
        { name: 'Shampoo', sku: 'SH-001', category: 'Hair Care', quantity: 50, unit_price: 200, reorder_level: 10 },
        { name: 'Conditioner', sku: 'CN-001', category: 'Hair Care', quantity: 45, unit_price: 180, reorder_level: 10 },
        { name: 'Nail Polish', sku: 'NP-001', category: 'Nails', quantity: 30, unit_price: 150, reorder_level: 5 },
      ];

      for (const item of inventoryItems) {
        await supabaseAdmin
          .from('inventory')
          .insert({
            tenant_id: tenant.id,
            ...item,
          });
      }

      console.log(`✅ Added sample data for ${tenant.name}`);
    }

    console.log('🎉 Seed completed successfully!');
  } catch (error) {
    console.error('❌ Error during seed:', error);
    process.exit(1);
  }
}

// Run seed
seed();

# Supabase Setup Guide

## Step-by-Step Instructions

### Step 1: Create Supabase Project

1. Go to https://supabase.com
2. Sign in or create an account
3. Click **"New Project"**
4. Fill in:
   - **Name**: RINADS Salon ERP (or any name you prefer)
   - **Database Password**: Create a strong password (save it!)
   - **Region**: Choose closest to your users
   - **Pricing Plan**: Free tier is fine for development
5. Click **"Create new project"**
6. Wait 2-3 minutes for project to initialize

### Step 2: Get Your Credentials

Once the project is ready:

1. In the Supabase dashboard, go to **Settings** (gear icon) → **API**
2. You'll see three important values:

   **Project URL**
   ```
   https://xxxxxxxxxxxxx.supabase.co
   ```
   → Copy this to `NEXT_PUBLIC_SUPABASE_URL` in `.env.local`

   **anon public key**
   ```
   eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
   ```
   → Copy this to `NEXT_PUBLIC_SUPABASE_ANON_KEY` in `.env.local`

   **service_role key** (⚠️ Keep this secret!)
   ```
   eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
   ```
   → Copy this to `SUPABASE_SERVICE_ROLE_KEY` in `.env.local`

### Step 3: Run the Database Schema

1. In Supabase dashboard, click **SQL Editor** in the left sidebar
2. Click **"New query"**
3. Open the file `supabase/schema.sql` from this project
4. **Copy the entire contents** of the schema file
5. **Paste it into the SQL Editor**
6. Click **"Run"** (or press Cmd/Ctrl + Enter)

You should see:
- ✅ Success message
- All tables created in the **Table Editor**

### Step 4: Verify Tables Created

1. Go to **Table Editor** in the left sidebar
2. You should see these tables:
   - ✅ `tenants`
   - ✅ `tenant_settings`
   - ✅ `app_users`
   - ✅ `feature_flags`
   - ✅ `plan_features`
   - ✅ `tenant_feature_overrides`
   - ✅ `feature_usage`
   - ✅ `subscriptions`
   - ✅ `services`
   - ✅ `staff`
   - ✅ `appointments`
   - ✅ `inventory`
   - ✅ `webhook_events`

### Step 5: Verify RLS Policies

1. Go to **Authentication** → **Policies**
2. You should see RLS policies enabled on all tables
3. Each table should have policies like:
   - "Users can view their tenant data"
   - "Users can view their tenant"

### Step 6: Update .env.local

Add these three lines to your `.env.local` file:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here
```

### Step 7: Test Connection

Run the environment check:

```bash
node scripts/check-env.js
```

If all variables show as ✅, you're ready to seed!

### Step 8: Run Seed Script

```bash
npm run seed
```

This will:
- Initialize feature flags
- Set up plan features (Solo, Studio, Pro, Enterprise)
- Create 4 sample tenants with sample data

## Troubleshooting

### Schema fails to run
- Make sure you copied the **entire** schema.sql file
- Check for any error messages in the SQL Editor
- Try running sections one at a time if needed

### RLS policies not working
- Verify policies were created in Authentication → Policies
- Check that `app_users` table exists
- Ensure `auth.users` table exists (created automatically by Supabase)

### Connection errors
- Double-check your credentials in `.env.local`
- Make sure there are no extra spaces or quotes
- Verify the project URL is correct (should end with `.supabase.co`)

## What the Schema Creates

### Core Tables
- **tenants**: Multi-tenant organization data
- **app_users**: Users linked to Supabase auth
- **tenant_settings**: Per-tenant configuration

### Feature Flags
- **feature_flags**: Available features catalog
- **plan_features**: Plan-to-feature mapping
- **tenant_feature_overrides**: Custom feature access
- **feature_usage**: Usage tracking

### Billing
- **subscriptions**: Razorpay subscription data
- **webhook_events**: Webhook idempotency tracking

### Salon Operations
- **services**: Salon services catalog
- **staff**: Staff members
- **appointments**: Booking system
- **inventory**: Inventory management

### Security
- Row-Level Security (RLS) policies on all tables
- Indexes for performance
- Triggers for automatic timestamps

## Next Steps

After successful setup:
1. ✅ Run `npm run seed` to initialize data
2. ✅ Run `npm run dev` to start development
3. ✅ Visit http://localhost:3000
4. ✅ Test the onboarding flow at http://localhost:3000/onboarding
5. ✅ Check admin dashboard at http://localhost:3000/admin/tenants


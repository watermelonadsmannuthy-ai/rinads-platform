# Quick Setup Guide

Follow these steps to get RINADS Salon ERP running:

## Step 1: ✅ Install Dependencies (Already Done)
```bash
npm install
```

## Step 2: Set Up Supabase

### 2.1 Create Supabase Project
1. Go to https://supabase.com and sign in
2. Click "New Project"
3. Fill in project details and wait for setup to complete

### 2.2 Run Database Schema
1. In your Supabase dashboard, go to **SQL Editor**
2. Click "New Query"
3. Open `supabase/schema.sql` from this project
4. Copy the entire contents and paste into the SQL Editor
5. Click "Run" to execute the schema

This creates:
- All required tables
- Row-Level Security policies
- Indexes and triggers
- Functions

### 2.3 Get Supabase Credentials
1. Go to **Settings** → **API**
2. Copy the following:
   - **Project URL** → `NEXT_PUBLIC_SUPABASE_URL`
   - **anon public** key → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - **service_role** key → `SUPABASE_SERVICE_ROLE_KEY` (⚠️ Keep this secret!)

## Step 3: Configure Environment Variables

1. Open `.env.local` in the project root
2. Add your Supabase credentials:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
   SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
   ```

3. For Razorpay (can be added later):
   ```env
   RAZORPAY_KEY_ID=your_key_id
   RAZORPAY_KEY_SECRET=your_key_secret
   RAZORPAY_WEBHOOK_SECRET=your_webhook_secret
   ```

## Step 4: Initialize Database

Run the seed script to:
- Initialize feature flags
- Set up plan features
- Create sample tenants

```bash
npm run seed
```

Expected output:
```
🌱 Starting seed...
📋 Initializing feature flags...
✅ Feature flags initialized
🏢 Creating sample tenants...
✅ Created tenant: Trendy Cuts
✅ Created tenant: Glow Salon
✅ Created tenant: Mannuthy Spa
✅ Created tenant: Solo Stylist
🎉 Seed completed successfully!
```

## Step 5: Start Development Server

```bash
npm run dev
```

Visit http://localhost:3000 to see the application!

## Troubleshooting

### Seed script fails
- Make sure Supabase credentials are correct in `.env.local`
- Verify the schema was run successfully in Supabase
- Check Supabase dashboard for any errors

### Feature flags not working
- Run `npm run seed` again to initialize flags
- Check that `feature_flags` and `plan_features` tables exist

### RLS errors
- Verify RLS policies were created (check Supabase dashboard)
- Ensure `app_users` table has correct `id` matching `auth.users`

## Next Steps

- Set up Razorpay for billing (see README.md)
- Configure Sentry for error tracking
- Deploy to Vercel (see README.md)


# RINADS Salon ERP

A complete, production-ready, multi-tenant SaaS application for salon management with feature flags, billing integration, and comprehensive admin tools.

## 🚀 Features

- **Multi-tenant Architecture**: Single codebase with tenant-scoped data isolation
- **Feature Flags**: Tier-based feature access (Solo, Studio, Pro, Enterprise)
- **Billing Integration**: Razorpay subscription management with webhook automation
- **Admin Dashboard**: Tenant management, plan overrides, webhook monitoring
- **Onboarding Flow**: Automated tenant and user creation
- **Row-Level Security**: Supabase RLS policies for data isolation
- **Observability**: Structured logging and error tracking (Sentry-ready)

## 📋 Prerequisites

- Node.js 18+ and npm
- Supabase account and project
- Razorpay account (for billing)
- Vercel account (for deployment)

## 🛠️ Setup

### 1. Install Dependencies

```bash
npm install
```

### 2. Environment Variables

Create a `.env.local` file in the root directory:

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key

# Razorpay
RAZORPAY_KEY_ID=your_razorpay_key_id
RAZORPAY_KEY_SECRET=your_razorpay_key_secret
RAZORPAY_WEBHOOK_SECRET=your_razorpay_webhook_secret

# OpenAI (optional, for AI features)
NEXT_PUBLIC_OPENAI_KEY=your_openai_api_key

# Sentry (optional, for error tracking)
SENTRY_DSN=your_sentry_dsn
```

### 3. Database Setup

1. Go to your Supabase project dashboard
2. Navigate to SQL Editor
3. Run the SQL schema from `supabase/schema.sql`

This will create all necessary tables, indexes, RLS policies, and triggers.

### 4. Initialize Feature Flags

Run the seed script to initialize feature flags and plan features:

```bash
npm run seed
```

This will also create sample tenants:
- Trendy Cuts (Studio plan)
- Glow Salon (Pro plan)
- Mannuthy Spa (Enterprise plan)
- Solo Stylist (Solo plan)

### 5. Run Development Server

```bash
npm run dev
```

Visit `http://localhost:3000` to see the application.

## 📁 Project Structure

```
├── app/
│   ├── admin/              # Admin dashboard pages
│   ├── api/                # API routes
│   │   ├── admin/          # Admin API endpoints
│   │   ├── feature-flags/  # Feature flag API
│   │   ├── onboarding/     # Onboarding API
│   │   └── razorpay/       # Razorpay webhooks
│   ├── onboarding/         # Onboarding/signup flow
│   └── ...
├── components/             # React components
├── hooks/                  # React hooks (useFeatureFlags)
├── lib/
│   ├── feature-flags.ts   # Feature flag system
│   ├── razorpay.ts        # Razorpay integration
│   ├── tenant.ts          # Tenant utilities
│   ├── observability.ts   # Error handling & logging
│   ├── supabase/          # Supabase clients
│   └── types.ts            # TypeScript types
├── scripts/
│   └── seed.ts            # Database seed script
└── supabase/
    └── schema.sql         # Database schema
```

## 🔑 Key Concepts

### Multi-Tenancy

All data is scoped by `tenant_id`. Row-Level Security (RLS) policies ensure users can only access their tenant's data.

### Feature Flags

Feature flags control access to features based on:
1. Plan tier (Solo, Studio, Pro, Enterprise)
2. Tenant-specific overrides
3. Expiration dates for overrides

Features are cached for 15 seconds to reduce database load.

### Billing

- Subscriptions are created via `/api/razorpay/subscribe`
- Webhooks are handled at `/api/razorpay/webhook`
- Webhook events are stored for idempotency and replay
- Grace period: 7 days before auto-downgrade

## 🧪 Testing

### Webhook Signature Verification

Test webhook signature verification:

```bash
# Use Razorpay's webhook testing tool or create a test script
```

### Feature Flags

Test feature flags by:
1. Creating a tenant with a specific plan
2. Checking feature access via `/api/feature-flags`
3. Using the `useFeatureFlags` hook in components

## 🚢 Deployment

### Vercel Deployment

1. Push your code to GitHub
2. Import project in Vercel
3. Add all environment variables in Vercel dashboard
4. Deploy

### Razorpay Webhook Setup

1. Go to Razorpay Dashboard → Settings → Webhooks
2. Add webhook URL: `https://your-domain.com/api/razorpay/webhook`
3. Select events: `subscription.activated`, `subscription.cancelled`, `subscription.charged`
4. Copy webhook secret to `RAZORPAY_WEBHOOK_SECRET`

### Supabase Setup

1. Create a new Supabase project
2. Run the schema SQL
3. Copy project URL and keys to environment variables
4. Configure RLS policies (already in schema)

## 📝 API Endpoints

### Public

- `POST /api/onboarding` - Create tenant and owner account
- `POST /api/feature-flags` - Get feature flag states
- `POST /api/razorpay/subscribe` - Create Razorpay subscription
- `POST /api/razorpay/webhook` - Razorpay webhook handler

### Admin (Protected)

- `GET /api/admin/tenants` - List all tenants
- `GET /api/admin/tenants/[id]` - Get tenant details
- `PUT /api/admin/tenants/[id]/plan` - Update tenant plan
- `GET /api/admin/tenants/[id]/feature-overrides` - Get feature overrides
- `POST /api/admin/tenants/[id]/feature-overrides` - Set feature override
- `GET /api/admin/tenants/[id]/webhooks` - Get webhook events
- `POST /api/admin/webhooks/replay` - Replay failed webhook

## 🔒 Security

- **RLS Policies**: All tables have Row-Level Security enabled
- **Service Role Key**: Never exposed to client, only used server-side
- **Webhook Verification**: All Razorpay webhooks are signature-verified
- **Idempotency**: Webhook events are stored to prevent duplicate processing

## 🐛 Troubleshooting

### Feature Flags Not Working

1. Check that feature flags are initialized: `npm run seed`
2. Verify tenant has correct `plan_slug`
3. Check cache expiration (15 seconds)

### Webhook Not Processing

1. Verify webhook signature secret matches Razorpay
2. Check webhook events table for errors
3. Use admin dashboard to replay failed webhooks

### RLS Denying Access

1. Verify user is linked to tenant in `app_users` table
2. Check that `auth.uid()` matches `app_users.id`
3. Review RLS policies in Supabase dashboard

## 📚 Additional Resources

- [Supabase Documentation](https://supabase.com/docs)
- [Razorpay Documentation](https://razorpay.com/docs)
- [Next.js Documentation](https://nextjs.org/docs)
- [Feature Flags Guide](./FEATURES_UPDATE_GUIDE.md)

## 🎯 TODO / Placeholders

- Replace placeholder Razorpay plan IDs in `lib/razorpay.ts`
- Configure Sentry DSN for production error tracking
- Set up Intercom/Freshdesk webhook integration
- Implement subdomain routing (tenant.subdomain.rinads.com)
- Add comprehensive test suite

## 📄 License

Private - All rights reserved

---

Built with ❤️ for RINADS

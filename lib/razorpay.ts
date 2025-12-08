// Razorpay integration utilities
import Razorpay from 'razorpay';
import crypto from 'crypto';
import { supabaseAdmin } from './supabase/server';

const razorpayKeyId = process.env.RAZORPAY_KEY_ID;
const razorpayKeySecret = process.env.RAZORPAY_KEY_SECRET;

if (!razorpayKeyId || !razorpayKeySecret) {
  console.warn('Razorpay credentials not configured');
}

export const razorpay = razorpayKeyId && razorpayKeySecret
  ? new Razorpay({
      key_id: razorpayKeyId,
      key_secret: razorpayKeySecret,
    })
  : null;

/**
 * Create a Razorpay subscription
 */
export async function createRazorpaySubscription(
  tenantId: string,
  planId: string, // Razorpay plan ID
  customerId?: string
) {
  if (!razorpay) {
    throw new Error('Razorpay not configured');
  }

  try {
    // Create subscription with tenant_id in notes
    const subscription = await razorpay.subscriptions.create({
      plan_id: planId,
      customer_notify: 1,
      total_count: 12, // 12 months
      notes: {
        tenant_id: tenantId,
      },
      ...(customerId && { customer_id: customerId }),
    });

    return subscription;
  } catch (error: any) {
    console.error('Error creating Razorpay subscription:', error);
    throw error;
  }
}

/**
 * Verify Razorpay webhook signature
 */
export function verifyRazorpayWebhookSignature(
  payload: string,
  signature: string
): boolean {
  const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET;
  
  if (!webhookSecret) {
    console.error('RAZORPAY_WEBHOOK_SECRET not configured');
    return false;
  }

  const expectedSignature = crypto
    .createHmac('sha256', webhookSecret)
    .update(payload)
    .digest('hex');

  return crypto.timingSafeEqual(
    Buffer.from(signature),
    Buffer.from(expectedSignature)
  );
}

/**
 * Map Razorpay plan ID to internal plan slug
 * TODO: Replace with actual Razorpay plan IDs
 */
export function mapRazorpayPlanToSlug(razorpayPlanId: string): string {
  // Placeholder mapping - replace with actual plan IDs from Razorpay dashboard
  const planMapping: Record<string, string> = {
    'plan_solo_123': 'solo',
    'plan_studio_123': 'studio',
    'plan_pro_123': 'pro',
    'plan_enterprise_123': 'enterprise',
  };

  return planMapping[razorpayPlanId] || 'solo';
}

/**
 * Process Razorpay webhook event
 */
export async function processRazorpayWebhook(event: any) {
  const eventId = event.id || event.entity?.id;
  if (!eventId) {
    throw new Error('Missing event ID');
  }

  // Check if event already processed (idempotency)
  const { data: existingEvent } = await supabaseAdmin
    .from('webhook_events')
    .select('*')
    .eq('event_id', eventId)
    .single();

  if (existingEvent?.processed) {
    console.log(`Webhook event ${eventId} already processed`);
    return { processed: true, skipped: true };
  }

  // Store webhook event
  const { error: storeError } = await supabaseAdmin
    .from('webhook_events')
    .insert({
      event_id: eventId,
      event_type: event.event || event.entity?.entity,
      payload: event,
      processed: false,
    });

  if (storeError) {
    console.error('Error storing webhook event:', storeError);
  }

  try {
    // Process based on event type
    const eventType = event.event || event.entity?.entity;
    const tenantId = event.payload?.subscription?.entity?.notes?.tenant_id ||
                     event.payload?.notes?.tenant_id;

    if (!tenantId) {
      throw new Error('Missing tenant_id in webhook payload');
    }

    switch (eventType) {
      case 'subscription.activated':
      case 'subscription.charged':
        await handleSubscriptionActivated(event, tenantId);
        break;
      
      case 'subscription.cancelled':
        await handleSubscriptionCancelled(event, tenantId);
        break;
      
      case 'subscription.paused':
        await handleSubscriptionPaused(event, tenantId);
        break;
      
      case 'subscription.resumed':
        await handleSubscriptionResumed(event, tenantId);
        break;
      
      default:
        console.log(`Unhandled webhook event type: ${eventType}`);
    }

    // Mark as processed
    await supabaseAdmin
      .from('webhook_events')
      .update({
        processed: true,
        processed_at: new Date().toISOString(),
      })
      .eq('event_id', eventId);

    return { processed: true, skipped: false };
  } catch (error: any) {
    // Mark as failed
    await supabaseAdmin
      .from('webhook_events')
      .update({
        processing_error: error.message,
        retry_count: (existingEvent?.retry_count || 0) + 1,
      })
      .eq('event_id', eventId);

    throw error;
  }
}

async function handleSubscriptionActivated(event: any, tenantId: string) {
  const subscription = event.payload?.subscription?.entity || event.payload;
  const planId = subscription.plan_id;
  const planSlug = mapRazorpayPlanToSlug(planId);

  // Update tenant plan
  await supabaseAdmin
    .from('tenants')
    .update({ plan_slug: planSlug })
    .eq('id', tenantId);

  // Upsert subscription record
  await supabaseAdmin
    .from('subscriptions')
    .upsert({
      tenant_id: tenantId,
      razorpay_subscription_id: subscription.id,
      razorpay_plan_id: planId,
      plan_slug: planSlug,
      status: 'active',
      current_period_start: new Date(subscription.current_start * 1000).toISOString(),
      current_period_end: new Date(subscription.current_end * 1000).toISOString(),
      cancel_at_period_end: false,
    }, { onConflict: 'razorpay_subscription_id' });
}

async function handleSubscriptionCancelled(event: any, tenantId: string) {
  const subscription = event.payload?.subscription?.entity || event.payload;

  // Update subscription status
  await supabaseAdmin
    .from('subscriptions')
    .update({
      status: 'cancelled',
      cancel_at_period_end: true,
      grace_period_ends_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 days grace
    })
    .eq('razorpay_subscription_id', subscription.id);
}

async function handleSubscriptionPaused(event: any, tenantId: string) {
  const subscription = event.payload?.subscription?.entity || event.payload;

  await supabaseAdmin
    .from('subscriptions')
    .update({ status: 'past_due' })
    .eq('razorpay_subscription_id', subscription.id);
}

async function handleSubscriptionResumed(event: any, tenantId: string) {
  const subscription = event.payload?.subscription?.entity || event.payload;

  await supabaseAdmin
    .from('subscriptions')
    .update({ status: 'active' })
    .eq('razorpay_subscription_id', subscription.id);
}


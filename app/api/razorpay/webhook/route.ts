// Razorpay webhook handler
import { NextRequest, NextResponse } from 'next/server';
import { verifyRazorpayWebhookSignature, processRazorpayWebhook } from '@/lib/razorpay';

// Disable body parsing for webhook route (we need raw body)
export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    // Get raw body for signature verification
    const body = await request.text();
    const signature = request.headers.get('x-razorpay-signature');

    if (!signature) {
      return NextResponse.json(
        { error: 'Missing signature' },
        { status: 401 }
      );
    }

    // Verify webhook signature
    const isValid = verifyRazorpayWebhookSignature(body, signature);
    if (!isValid) {
      return NextResponse.json(
        { error: 'Invalid signature' },
        { status: 401 }
      );
    }

    // Parse webhook payload
    const event = JSON.parse(body);

    // Process webhook event
    await processRazorpayWebhook(event);

    return NextResponse.json({ received: true });
  } catch (error: any) {
    console.error('Error processing webhook:', error);
    return NextResponse.json(
      { error: error.message || 'Webhook processing failed' },
      { status: 500 }
    );
  }
}


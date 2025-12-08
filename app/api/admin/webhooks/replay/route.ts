// Admin API - Replay webhook event
import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase/server';
import { processRazorpayWebhook } from '@/lib/razorpay';

export async function POST(request: NextRequest) {
  try {
    const { eventId } = await request.json();

    if (!eventId) {
      return NextResponse.json(
        { error: 'Missing eventId' },
        { status: 400 }
      );
    }

    // Get webhook event
    const { data: event, error: fetchError } = await supabaseAdmin
      .from('webhook_events')
      .select('*')
      .eq('event_id', eventId)
      .single();

    if (fetchError || !event) {
      return NextResponse.json(
        { error: 'Webhook event not found' },
        { status: 404 }
      );
    }

    // Reset processing status
    await supabaseAdmin
      .from('webhook_events')
      .update({
        processed: false,
        processing_error: null,
        retry_count: event.retry_count + 1,
      })
      .eq('event_id', eventId);

    // Replay webhook
    try {
      await processRazorpayWebhook(event.payload);
      return NextResponse.json({ success: true, message: 'Webhook replayed successfully' });
    } catch (error: any) {
      return NextResponse.json(
        { error: error.message || 'Failed to replay webhook' },
        { status: 500 }
      );
    }
  } catch (error: any) {
    console.error('Error replaying webhook:', error);
    return NextResponse.json(
      { error: 'Failed to replay webhook' },
      { status: 500 }
    );
  }
}


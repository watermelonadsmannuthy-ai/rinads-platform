// AI Chatbot API
import { NextRequest, NextResponse } from 'next/server';
import { getAIResponse } from '@/lib/ai-chatbot';
import { supabaseAdmin } from '@/lib/supabase/server';

export async function POST(request: NextRequest) {
  try {
    const { message, conversationId } = await request.json();
    const tenantId = request.headers.get('x-tenant-id') || '';
    const userId = request.headers.get('x-user-id') || null;

    if (!message) {
      return NextResponse.json({ error: 'Message is required' }, { status: 400 });
    }

    if (!tenantId) {
      return NextResponse.json({ error: 'Tenant ID is required' }, { status: 400 });
    }

    const result = await getAIResponse(tenantId, userId, message, conversationId);

    return NextResponse.json(result);
  } catch (error: any) {
    console.error('AI Chat API error:', error);
    return NextResponse.json(
      { error: 'Failed to get AI response', message: error.message },
      { status: 500 }
    );
  }
}


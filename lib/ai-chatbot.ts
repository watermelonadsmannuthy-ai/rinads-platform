// AI Chatbot - Internal Assistant with Database Insights
import { supabaseAdmin } from './supabase/server';
import { AIConversation, AIMessage } from './types-extended';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

/**
 * Get AI response with database context
 */
export async function getAIResponse(
  tenantId: string,
  userId: string | null,
  userMessage: string,
  conversationId?: string
): Promise<{ response: string; conversationId: string }> {
  try {
    // Get or create conversation
    let conversation: AIConversation | null = null;

    if (conversationId) {
      const { data } = await supabaseAdmin
        .from('ai_conversations')
        .select('*')
        .eq('id', conversationId)
        .eq('tenant_id', tenantId)
        .single();

      conversation = data as any;
    }

    if (!conversation) {
      const { data: newConv, error } = await supabaseAdmin
        .from('ai_conversations')
        .insert({
          tenant_id: tenantId,
          user_id: userId,
          role: 'admin', // TODO: determine from user
          messages: [],
          context: {},
        })
        .select()
        .single();

      if (error) throw error;
      conversation = newConv as any;
    }

    if (!conversation) {
      throw new Error('Failed to initialize conversation');
    }

    // Get database context for insights
    const context = await getDatabaseContext(tenantId);

    // Build messages with system context
    const messages: OpenAI.Chat.Completions.ChatCompletionMessageParam[] = [
      {
        role: 'system',
        content: `You are RINADS Assistant, an AI assistant for a SaaS platform that combines ERP features, digital marketing agency automation, and video production workflow management.

Your capabilities:
- Explain insights from the database (tasks, clients, revenue, attendance)
- Generate marketing ideas and content suggestions
- Create content captions and hashtags
- Suggest task allocation strategies
- Analyze client performance
- Provide financial summaries
- Help with workflow automation

Current database context:
${JSON.stringify(context, null, 2)}

Be helpful, concise, and actionable. Use the database context to provide specific insights when relevant.`,
      },
      ...(conversation?.messages as AIMessage[] || []).map((msg) => ({
        role: msg.role as 'user' | 'assistant',
        content: msg.content,
      })),
      {
        role: 'user',
        content: userMessage,
      },
    ];

    // Get AI response
    const completion = await openai.chat.completions.create({
      model: process.env.OPENAI_MODEL || 'gpt-4-turbo-preview',
      messages,
      temperature: 0.7,
      max_tokens: 1000,
    });

    const aiResponse = completion.choices[0]?.message?.content || 'I apologize, I could not generate a response.';

    // Update conversation
    const updatedMessages: AIMessage[] = [
      ...(conversation.messages || []),
      { role: 'user', content: userMessage, timestamp: new Date().toISOString() },
      { role: 'assistant', content: aiResponse, timestamp: new Date().toISOString() },
    ];

    await supabaseAdmin
      .from('ai_conversations')
      .update({
        messages: updatedMessages,
        context,
        updated_at: new Date().toISOString(),
      })
      .eq('id', conversation.id);

    return {
      response: aiResponse,
      conversationId: conversation.id,
    };
  } catch (error: any) {
    console.error('AI Chatbot error:', error);
    return {
      response: 'I encountered an error. Please try again or contact support.',
      conversationId: conversationId || '',
    };
  }
}

/**
 * Get database context for AI insights
 */
async function getDatabaseContext(tenantId: string) {
  try {
    const [tasks, clients, invoices, leads, attendance] = await Promise.all([
      supabaseAdmin
        .from('tasks')
        .select('id, status, priority, due_date')
        .eq('tenant_id', tenantId)
        .limit(50),
      supabaseAdmin
        .from('clients')
        .select('id, name, status')
        .eq('tenant_id', tenantId)
        .limit(20),
      supabaseAdmin
        .from('invoices')
        .select('id, total, payment_status, due_date')
        .eq('tenant_id', tenantId)
        .limit(20),
      supabaseAdmin
        .from('leads')
        .select('id, status, priority, source')
        .eq('tenant_id', tenantId)
        .limit(20),
      supabaseAdmin
        .from('attendance')
        .select('id, date, staff_id')
        .eq('tenant_id', tenantId)
        .gte('date', new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0])
        .limit(50),
    ]);

    return {
      tasks: {
        total: tasks.data?.length || 0,
        pending: tasks.data?.filter((t) => t.status === 'pending').length || 0,
        overdue: tasks.data?.filter((t) => t.status === 'overdue').length || 0,
        high_priority: tasks.data?.filter((t) => t.priority === 'high' || t.priority === 'urgent').length || 0,
      },
      clients: {
        total: clients.data?.length || 0,
        active: clients.data?.filter((c) => c.status === 'active').length || 0,
      },
      invoices: {
        total: invoices.data?.length || 0,
        pending: invoices.data?.filter((i) => i.payment_status === 'pending').length || 0,
        total_pending_amount: invoices.data?.reduce((sum, inv) => sum + (inv.total || 0), 0) || 0,
      },
      leads: {
        total: leads.data?.length || 0,
        new: leads.data?.filter((l) => l.status === 'new').length || 0,
        high_priority: leads.data?.filter((l) => l.priority === 'high').length || 0,
      },
      attendance: {
        recent_days: attendance.data?.length || 0,
      },
    };
  } catch (error) {
    console.error('Error getting database context:', error);
    return {};
  }
}

/**
 * Generate content caption using AI
 */
export async function generateContentCaption(
  tenantId: string,
  contentType: string,
  platform: string,
  context?: string
): Promise<{ caption: string; hashtags: string[] }> {
  try {
    const prompt = `Generate a ${contentType} caption for ${platform} platform.
${context ? `Context: ${context}` : ''}

Requirements:
- Engaging and professional
- Platform-appropriate tone
- Include relevant hashtags (5-10)
- Length appropriate for ${platform}

Return JSON with "caption" and "hashtags" array.`;

    const completion = await openai.chat.completions.create({
      model: process.env.OPENAI_MODEL || 'gpt-4-turbo-preview',
      messages: [
        {
          role: 'system',
          content: 'You are a social media content expert. Generate engaging captions and hashtags.',
        },
        {
          role: 'user',
          content: prompt,
        },
      ],
      temperature: 0.8,
      response_format: { type: 'json_object' },
    });

    const result = JSON.parse(completion.choices[0]?.message?.content || '{}');
    return {
      caption: result.caption || '',
      hashtags: result.hashtags || [],
    };
  } catch (error: any) {
    console.error('Error generating caption:', error);
    return {
      caption: '',
      hashtags: [],
    };
  }
}

/**
 * Generate proposal draft using AI
 */
export async function generateProposalDraft(
  tenantId: string,
  clientId: string,
  serviceType: string,
  requirements: string
): Promise<string> {
  try {
    // Get client info
    const { data: client } = await supabaseAdmin
      .from('clients')
      .select('name, company')
      .eq('id', clientId)
      .eq('tenant_id', tenantId)
      .single();

    const prompt = `Generate a professional proposal for ${client?.name || 'client'} (${client?.company || 'company'}).

Service Type: ${serviceType}
Requirements: ${requirements}

Include:
- Executive summary
- Scope of work
- Deliverables
- Timeline
- Pricing structure
- Terms and conditions

Make it professional, clear, and compelling.`;

    const completion = await openai.chat.completions.create({
      model: process.env.OPENAI_MODEL || 'gpt-4-turbo-preview',
      messages: [
        {
          role: 'system',
          content: 'You are a business proposal expert. Create professional, compelling proposals.',
        },
        {
          role: 'user',
          content: prompt,
        },
      ],
      temperature: 0.7,
      max_tokens: 2000,
    });

    return completion.choices[0]?.message?.content || '';
  } catch (error: any) {
    console.error('Error generating proposal:', error);
    return '';
  }
}

/**
 * AI Lead Qualifier - Score leads automatically
 */
export async function qualifyLead(tenantId: string, leadId: string): Promise<{ score: number; priority: string; reasoning: string }> {
  try {
    const { data: lead } = await supabaseAdmin
      .from('leads')
      .select('*')
      .eq('id', leadId)
      .eq('tenant_id', tenantId)
      .single();

    if (!lead) throw new Error('Lead not found');

    const prompt = `Analyze this lead and provide a quality score (0-100) and priority (low/medium/high).

Lead Information:
- Name: ${lead.name}
- Email: ${lead.email || 'N/A'}
- Phone: ${lead.phone || 'N/A'}
- Company: ${lead.company || 'N/A'}
- Source: ${lead.source || 'N/A'}
- Service Interest: ${lead.service_interest?.join(', ') || 'N/A'}
- Notes: ${lead.notes || 'N/A'}

Consider:
- Contact information completeness
- Company size indicators
- Service interest specificity
- Source quality
- Engagement signals

Return JSON with "score" (0-100), "priority" (low/medium/high), and "reasoning" (brief explanation).`;

    const completion = await openai.chat.completions.create({
      model: process.env.OPENAI_MODEL || 'gpt-4-turbo-preview',
      messages: [
        {
          role: 'system',
          content: 'You are a lead qualification expert. Analyze leads and provide scores.',
        },
        {
          role: 'user',
          content: prompt,
        },
      ],
      temperature: 0.3,
      response_format: { type: 'json_object' },
    });

    const result = JSON.parse(completion.choices[0]?.message?.content || '{}');

    // Update lead with AI score
    await supabaseAdmin
      .from('leads')
      .update({
        ai_score: result.score || 50,
        priority: result.priority || 'medium',
        metadata: {
          ...(lead.metadata || {}),
          ai_qualification: {
            score: result.score,
            priority: result.priority,
            reasoning: result.reasoning,
            qualified_at: new Date().toISOString(),
          },
        },
      })
      .eq('id', leadId);

    return {
      score: result.score || 50,
      priority: result.priority || 'medium',
      reasoning: result.reasoning || '',
    };
  } catch (error: any) {
    console.error('Error qualifying lead:', error);
    return {
      score: 50,
      priority: 'medium',
      reasoning: 'Unable to qualify lead automatically',
    };
  }
}


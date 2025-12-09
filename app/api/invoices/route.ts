// Invoices API
import { NextRequest, NextResponse } from 'next/server';
import { createInvoice, getInvoice, updateInvoicePayment, sendInvoiceEmail } from '@/lib/invoice-engine';
import { supabaseAdmin } from '@/lib/supabase/server';

export async function GET(request: NextRequest) {
  try {
    const tenantId = request.headers.get('x-tenant-id') || '';
    const searchParams = request.nextUrl.searchParams;
    const clientId = searchParams.get('client_id');
    const paymentStatus = searchParams.get('payment_status');
    const invoiceId = searchParams.get('id');

    if (!tenantId) {
      return NextResponse.json({ error: 'Tenant ID is required' }, { status: 400 });
    }

    if (invoiceId) {
      const invoice = await getInvoice(invoiceId);
      if (!invoice || invoice.tenant_id !== tenantId) {
        return NextResponse.json({ error: 'Invoice not found' }, { status: 404 });
      }
      return NextResponse.json({ invoice });
    }

    let query = supabaseAdmin
      .from('invoices')
      .select('*, client:clients(*)')
      .eq('tenant_id', tenantId)
      .order('created_at', { ascending: false });

    if (clientId) {
      query = query.eq('client_id', clientId);
    }
    if (paymentStatus) {
      query = query.eq('payment_status', paymentStatus);
    }

    const { data, error } = await query;

    if (error) throw error;

    return NextResponse.json({ invoices: data || [] });
  } catch (error: any) {
    console.error('Invoices API error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch invoices', message: error.message },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const { client_id, items, tax_rate, due_date } = await request.json();
    const tenantId = request.headers.get('x-tenant-id') || '';

    if (!tenantId || !client_id || !items) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const invoice = await createInvoice(
      tenantId,
      client_id,
      items,
      tax_rate,
      due_date ? new Date(due_date) : undefined
    );

    return NextResponse.json({ invoice });
  } catch (error: any) {
    console.error('Invoices API error:', error);
    return NextResponse.json(
      { error: 'Failed to create invoice', message: error.message },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const { invoice_id, action, ...updateData } = await request.json();
    const tenantId = request.headers.get('x-tenant-id') || '';

    if (!tenantId || !invoice_id) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    if (action === 'mark_paid') {
      const invoice = await updateInvoicePayment(
        invoice_id,
        'paid',
        updateData.payment_method,
        updateData.payment_date ? new Date(updateData.payment_date) : undefined
      );
      return NextResponse.json({ invoice });
    } else if (action === 'send_email') {
      const result = await sendInvoiceEmail(invoice_id);
      return NextResponse.json(result);
    } else {
      return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
    }
  } catch (error: any) {
    console.error('Invoices API error:', error);
    return NextResponse.json(
      { error: 'Failed to update invoice', message: error.message },
      { status: 500 }
    );
  }
}


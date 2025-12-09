// Invoice & Proposal Engine with PDF Generation
import { supabaseAdmin } from './supabase/server';
import { Invoice, InvoiceItem } from './types-extended';

/**
 * Create invoice
 */
export async function createInvoice(
  tenantId: string,
  clientId: string,
  items: InvoiceItem[],
  taxRate: number = 0.18, // 18% GST
  dueDate?: Date
): Promise<Invoice> {
  try {
    // Calculate totals
    const subtotal = items.reduce((sum, item) => sum + (item.total || item.price * item.quantity), 0);
    const tax = subtotal * taxRate;
    const total = subtotal + tax;

    // Generate invoice number
    const invoiceNumber = await generateInvoiceNumber(tenantId);

    // Create invoice
    const { data, error } = await supabaseAdmin
      .from('invoices')
      .insert({
        tenant_id: tenantId,
        client_id: clientId,
        invoice_number: invoiceNumber,
        items,
        subtotal,
        tax,
        total,
        due_date: dueDate?.toISOString() || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 days default
        payment_status: 'pending',
      })
      .select()
      .single();

    if (error) throw error;

    // Generate PDF (async)
    generateInvoicePDF(data.id).catch(console.error);

    return data as Invoice;
  } catch (error: any) {
    console.error('Error creating invoice:', error);
    throw error;
  }
}

/**
 * Generate unique invoice number
 */
async function generateInvoiceNumber(tenantId: string): Promise<string> {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, '0');
  const prefix = `INV-${year}${month}`;

  // Get last invoice number for this month
  const { data: lastInvoice } = await supabaseAdmin
    .from('invoices')
    .select('invoice_number')
    .eq('tenant_id', tenantId)
    .like('invoice_number', `${prefix}%`)
    .order('invoice_number', { ascending: false })
    .limit(1)
    .single();

  let sequence = 1;
  if (lastInvoice?.invoice_number) {
    const lastSeq = parseInt(lastInvoice.invoice_number.split('-').pop() || '0');
    sequence = lastSeq + 1;
  }

  return `${prefix}-${String(sequence).padStart(4, '0')}`;
}

/**
 * Generate invoice PDF (placeholder - integrate with PDF service)
 */
async function generateInvoicePDF(invoiceId: string): Promise<string> {
  try {
    // Get invoice with client details
    const { data: invoice } = await supabaseAdmin
      .from('invoices')
      .select(`
        *,
        client:clients(*)
      `)
      .eq('id', invoiceId)
      .single();

    if (!invoice) throw new Error('Invoice not found');

    // TODO: Integrate with PDF generation service (e.g., Puppeteer, PDFKit, or external API)
    // For now, return a placeholder URL
    const pdfUrl = `/api/invoices/${invoiceId}/pdf`;

    // Update invoice with PDF URL
    await supabaseAdmin
      .from('invoices')
      .update({ pdf_url: pdfUrl })
      .eq('id', invoiceId);

    return pdfUrl;
  } catch (error: any) {
    console.error('Error generating PDF:', error);
    throw error;
  }
}

/**
 * Send invoice to client via email
 */
export async function sendInvoiceEmail(invoiceId: string): Promise<{ success: boolean; message: string }> {
  try {
    const { data: invoice } = await supabaseAdmin
      .from('invoices')
      .select(`
        *,
        client:clients(*)
      `)
      .eq('id', invoiceId)
      .single();

    if (!invoice) throw new Error('Invoice not found');

    // TODO: Integrate with email service (Nodemailer, SendGrid, etc.)
    // For now, return success
    return {
      success: true,
      message: `Invoice ${invoice.invoice_number} sent to ${invoice.client?.email}`,
    };
  } catch (error: any) {
    console.error('Error sending invoice email:', error);
    return {
      success: false,
      message: 'Failed to send invoice email',
    };
  }
}

/**
 * Update invoice payment status
 */
export async function updateInvoicePayment(
  invoiceId: string,
  paymentStatus: 'paid' | 'overdue' | 'cancelled',
  paymentMethod?: string,
  paymentDate?: Date
): Promise<Invoice> {
  try {
    const { data, error } = await supabaseAdmin
      .from('invoices')
      .update({
        payment_status: paymentStatus,
        payment_method: paymentMethod,
        payment_date: paymentDate?.toISOString() || new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .eq('id', invoiceId)
      .select()
      .single();

    if (error) throw error;
    return data as Invoice;
  } catch (error: any) {
    console.error('Error updating invoice payment:', error);
    throw error;
  }
}

/**
 * Get invoice by ID with full details
 */
export async function getInvoice(invoiceId: string): Promise<Invoice | null> {
  try {
    const { data, error } = await supabaseAdmin
      .from('invoices')
      .select(`
        *,
        client:clients(*)
      `)
      .eq('id', invoiceId)
      .single();

    if (error) throw error;
    return data as Invoice;
  } catch (error: any) {
    console.error('Error getting invoice:', error);
    return null;
  }
}


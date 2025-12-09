// QR Attendance API
import { NextRequest, NextResponse } from 'next/server';
import { processQRScan, generateStaffQR } from '@/lib/qr-attendance';

export async function POST(request: NextRequest) {
  try {
    const { action, qr_token, staff_id, device, location } = await request.json();
    const tenantId = request.headers.get('x-tenant-id') || '';

    if (!tenantId) {
      return NextResponse.json({ error: 'Tenant ID is required' }, { status: 400 });
    }

    if (action === 'generate' && staff_id) {
      // Generate QR code
      const result = await generateStaffQR(tenantId, staff_id);
      return NextResponse.json(result);
    } else if (action === 'scan' && qr_token) {
      // Process QR scan
      const scanAction = request.headers.get('x-scan-action') || 'check_in';
      const result = await processQRScan(
        tenantId,
        qr_token,
        scanAction as 'check_in' | 'check_out',
        device,
        location
      );
      return NextResponse.json(result);
    } else {
      return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
    }
  } catch (error: any) {
    console.error('QR Attendance API error:', error);
    return NextResponse.json(
      { error: 'Failed to process QR attendance', message: error.message },
      { status: 500 }
    );
  }
}


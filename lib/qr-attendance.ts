// QR-Based Attendance System
import { supabaseAdmin } from './supabase/server';
import * as crypto from 'crypto';

/**
 * Generate QR code for staff member
 */
export async function generateStaffQR(tenantId: string, staffId: string): Promise<{ qr_token: string; qr_code_url: string }> {
  try {
    // Generate unique token
    const qr_token = crypto.randomBytes(32).toString('hex');
    const expiresAt = new Date();
    expiresAt.setFullYear(expiresAt.getFullYear() + 1); // Valid for 1 year

    // Create QR code data (can be used to generate QR image)
    const qrData = JSON.stringify({
      tenant_id: tenantId,
      staff_id: staffId,
      token: qr_token,
      type: 'attendance',
    });

    // Store in database
    const { data, error } = await supabaseAdmin
      .from('staff_qr_codes')
      .insert({
        tenant_id: tenantId,
        staff_id: staffId,
        qr_token,
        expires_at: expiresAt.toISOString(),
        is_active: true,
      })
      .select()
      .single();

    if (error) throw error;

    // Generate QR code URL (you can use a QR code generation service)
    // For now, return the data that can be used to generate QR
    const qr_code_url = `data:image/svg+xml;base64,${Buffer.from(qrData).toString('base64')}`;

    // Update with QR code URL
    await supabaseAdmin
      .from('staff_qr_codes')
      .update({ qr_code_url })
      .eq('id', data.id);

    return {
      qr_token,
      qr_code_url,
    };
  } catch (error: any) {
    console.error('Error generating QR code:', error);
    throw error;
  }
}

/**
 * Verify and process QR scan for attendance
 */
export async function processQRScan(
  tenantId: string,
  qrToken: string,
  action: 'check_in' | 'check_out',
  device?: string,
  location?: { lat: number; lng: number }
): Promise<{ success: boolean; attendance_id?: string; message: string }> {
  try {
    // Verify QR token
    const { data: qrCode, error: qrError } = await supabaseAdmin
      .from('staff_qr_codes')
      .select('*, staff:staff_id(*)')
      .eq('qr_token', qrToken)
      .eq('tenant_id', tenantId)
      .eq('is_active', true)
      .single();

    if (qrError || !qrCode) {
      return { success: false, message: 'Invalid QR code' };
    }

    // Check if expired
    if (qrCode.expires_at && new Date(qrCode.expires_at) < new Date()) {
      return { success: false, message: 'QR code expired' };
    }

    const staffId = qrCode.staff_id;
    const today = new Date().toISOString().split('T')[0];

    // Get or create today's attendance record
    const { data: existingAttendance } = await supabaseAdmin
      .from('attendance')
      .select('*')
      .eq('tenant_id', tenantId)
      .eq('staff_id', staffId)
      .eq('date', today)
      .single();

    const now = new Date();

    if (action === 'check_in') {
      if (existingAttendance && existingAttendance.time_in) {
        return { success: false, message: 'Already checked in today' };
      }

      // Create or update attendance
      if (existingAttendance) {
        const { data, error } = await supabaseAdmin
          .from('attendance')
          .update({
            time_in: now.toISOString(),
            qr_verification_token: qrToken,
            verified: true,
            device: device || 'mobile',
            location: location ? JSON.stringify(location) : null,
            updated_at: now.toISOString(),
          })
          .eq('id', existingAttendance.id)
          .select()
          .single();

        if (error) throw error;
        return { success: true, attendance_id: data.id, message: 'Checked in successfully' };
      } else {
        const { data, error } = await supabaseAdmin
          .from('attendance')
          .insert({
            tenant_id: tenantId,
            staff_id: staffId,
            date: today,
            time_in: now.toISOString(),
            qr_verification_token: qrToken,
            verified: true,
            device: device || 'mobile',
            location: location ? JSON.stringify(location) : null,
          })
          .select()
          .single();

        if (error) throw error;
        return { success: true, attendance_id: data.id, message: 'Checked in successfully' };
      }
    } else if (action === 'check_out') {
      if (!existingAttendance || !existingAttendance.time_in) {
        return { success: false, message: 'Please check in first' };
      }

      if (existingAttendance.time_out) {
        return { success: false, message: 'Already checked out today' };
      }

      // Calculate duration
      const timeIn = new Date(existingAttendance.time_in);
      const durationMinutes = Math.floor((now.getTime() - timeIn.getTime()) / (1000 * 60));

      const { data, error } = await supabaseAdmin
        .from('attendance')
        .update({
          time_out: now.toISOString(),
          duration_minutes: durationMinutes,
          updated_at: now.toISOString(),
        })
        .eq('id', existingAttendance.id)
        .select()
        .single();

      if (error) throw error;
      return { success: true, attendance_id: data.id, message: 'Checked out successfully' };
    }

    return { success: false, message: 'Invalid action' };
  } catch (error: any) {
    console.error('Error processing QR scan:', error);
    return { success: false, message: 'Error processing attendance' };
  }
}

/**
 * Get attendance summary for staff
 */
export async function getAttendanceSummary(tenantId: string, staffId: string, startDate: Date, endDate: Date) {
  try {
    const { data, error } = await supabaseAdmin
      .from('attendance')
      .select('*')
      .eq('tenant_id', tenantId)
      .eq('staff_id', staffId)
      .gte('date', startDate.toISOString().split('T')[0])
      .lte('date', endDate.toISOString().split('T')[0])
      .order('date', { ascending: false });

    if (error) throw error;

    const totalHours = data?.reduce((sum, record) => sum + (record.duration_minutes || 0), 0) / 60 || 0;
    const presentDays = data?.filter((r) => r.time_in).length || 0;

    return {
      records: data || [],
      summary: {
        total_hours: totalHours,
        present_days: presentDays,
        average_hours_per_day: presentDays > 0 ? totalHours / presentDays : 0,
      },
    };
  } catch (error: any) {
    console.error('Error getting attendance summary:', error);
    throw error;
  }
}


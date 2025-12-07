import { NextResponse } from "next/server";
import nodemailer from "nodemailer";

export async function POST(request: Request) {
  try {
    const {
      name,
      email,
      phone,
      company,
      vertical,
      date,
      time,
      notes,
    } = await request.json();

    // Validate required fields
    if (!name || !email || !phone || !company) {
      return NextResponse.json(
        { ok: false, error: "Name, email, phone, and company are required." },
        { status: 400 }
      );
    }

    // Get SMTP configuration from environment variables
    const smtpHost = process.env.SMTP_HOST;
    const smtpPort = process.env.SMTP_PORT || "587";
    const smtpSecure = process.env.SMTP_SECURE === "true";
    const smtpUser = process.env.SMTP_USER;
    const smtpPass = process.env.SMTP_PASS;
    const demoRecipientEmail = process.env.DEMO_RECIPIENT_EMAIL || process.env.SMTP_USER || "your-email@rinads.com";

    // Log the demo request (always log for debugging)
    console.log("📧 Demo request received:", {
      name,
      email,
      phone,
      company,
      vertical,
      date,
      time,
      notes,
    });

    // If SMTP is not configured, return error to prompt configuration
    if (!smtpHost || !smtpUser || !smtpPass) {
      console.error("❌ SMTP not configured. Please set up email in .env.local");
      return NextResponse.json(
        { 
          ok: false, 
          error: "Email service not configured. Please contact support." 
        },
        { status: 500 }
      );
    }

    // Create transporter with better error handling
    const transporter = nodemailer.createTransport({
      host: smtpHost,
      port: parseInt(smtpPort, 10),
      secure: smtpSecure,
      auth: {
        user: smtpUser,
        pass: smtpPass,
      },
      tls: {
        rejectUnauthorized: false, // Allow self-signed certificates
      },
      debug: process.env.NODE_ENV === "development", // Enable debug in development
    });

    // Verify connection before sending
    try {
      await transporter.verify();
      console.log("✅ SMTP connection verified");
    } catch (verifyError: any) {
      console.error("❌ SMTP verification failed:", verifyError?.message);
      throw new Error(`SMTP connection failed: ${verifyError?.message}`);
    }

    // Format date and time for display
    const formattedDate = date ? new Date(date).toLocaleDateString('en-US', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    }) : "Not specified";
    
    const formattedTime = time ? new Date(`2000-01-01T${time}`).toLocaleTimeString('en-US', { 
      hour: 'numeric', 
      minute: '2-digit',
      hour12: true 
    }) : "Not specified";

    // Send email with professional formatting
    await transporter.sendMail({
      from: `"RINADS BusinessOS" <${smtpUser}>`,
      to: demoRecipientEmail,
      replyTo: email, // Allow replying directly to the requester
      subject: `🚀 New Demo Request: ${name} from ${company}`,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #dc2626 0%, #ea580c 100%); color: white; padding: 20px; border-radius: 8px 8px 0 0; }
            .content { background: #f9fafb; padding: 30px; border: 1px solid #e5e7eb; }
            .field { margin-bottom: 15px; }
            .label { font-weight: bold; color: #1f2937; }
            .value { color: #4b5563; margin-top: 5px; }
            .highlight { background: #fef3c7; padding: 15px; border-left: 4px solid #f59e0b; margin: 20px 0; }
            .footer { background: #f3f4f6; padding: 15px; text-align: center; color: #6b7280; font-size: 12px; border-radius: 0 0 8px 8px; }
            .button { display: inline-block; background: #dc2626; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin-top: 20px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h2 style="margin: 0;">🚀 New Demo Request</h2>
              <p style="margin: 10px 0 0 0; opacity: 0.9;">RINADS BusinessOS</p>
            </div>
            <div class="content">
              <div class="field">
                <div class="label">👤 Name:</div>
                <div class="value">${name}</div>
              </div>
              <div class="field">
                <div class="label">📧 Email:</div>
                <div class="value"><a href="mailto:${email}">${email}</a></div>
              </div>
              <div class="field">
                <div class="label">📞 Phone:</div>
                <div class="value"><a href="tel:${phone}">${phone}</a></div>
              </div>
              <div class="field">
                <div class="label">🏢 Company:</div>
                <div class="value">${company}</div>
              </div>
              <div class="field">
                <div class="label">🎯 Interested Vertical:</div>
                <div class="value">${vertical || "Not specified"}</div>
              </div>
              <div class="highlight">
                <div class="label">📅 Preferred Date & Time:</div>
                <div class="value">
                  <strong>Date:</strong> ${formattedDate}<br>
                  <strong>Time:</strong> ${formattedTime}
                </div>
              </div>
              ${notes ? `
              <div class="field">
                <div class="label">📝 Additional Notes:</div>
                <div class="value" style="background: white; padding: 15px; border-radius: 4px; margin-top: 10px;">${notes.replace(/\n/g, '<br>')}</div>
              </div>
              ` : ""}
              <div style="margin-top: 30px; padding-top: 20px; border-top: 2px solid #e5e7eb;">
                <a href="mailto:${email}?subject=Re: Demo Request for ${company}" class="button">Reply to ${name}</a>
              </div>
            </div>
            <div class="footer">
              <p style="margin: 0;">This is an automated email from the RINADS BusinessOS demo booking form.</p>
              <p style="margin: 5px 0 0 0;">Submitted at: ${new Date().toLocaleString()}</p>
            </div>
          </div>
        </body>
        </html>
      `,
      text: `
New Demo Request - RINADS BusinessOS

Name: ${name}
Email: ${email}
Phone: ${phone}
Company: ${company}
Vertical: ${vertical || "Not specified"}

Preferred Date: ${formattedDate}
Preferred Time: ${formattedTime}

${notes ? `Additional Notes:\n${notes}\n` : ""}

---
This is an automated email from the RINADS BusinessOS demo booking form.
Submitted at: ${new Date().toLocaleString()}
      `.trim(),
    });

    console.log("✅ Demo request email sent successfully to:", demoRecipientEmail);

    return NextResponse.json({ ok: true, message: "Demo request submitted successfully" });
  } catch (error: any) {
    console.error("❌ Error processing demo request:", error);
    console.error("Error details:", {
      message: error?.message,
      code: error?.code,
      response: error?.response,
      command: error?.command,
    });
    
    // Return more detailed error for debugging
    return NextResponse.json(
      { 
        ok: false, 
        error: "Failed to process demo request.",
        details: process.env.NODE_ENV === "development" ? error?.message : undefined
      },
      { status: 500 }
    );
  }
}


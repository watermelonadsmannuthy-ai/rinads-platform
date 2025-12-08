// Quick email test script
// Run with: node test-email.js

require('dotenv').config({ path: '.env.local' });
const nodemailer = require('nodemailer');

const smtpHost = process.env.SMTP_HOST;
const smtpPort = process.env.SMTP_PORT || "587";
const smtpSecure = process.env.SMTP_SECURE === "true";
const smtpUser = process.env.SMTP_USER;
const smtpPass = process.env.SMTP_PASS;
const demoRecipientEmail = process.env.DEMO_RECIPIENT_EMAIL || smtpUser;

console.log("📧 Testing Email Configuration...");
console.log("SMTP Host:", smtpHost);
console.log("SMTP Port:", smtpPort);
console.log("SMTP User:", smtpUser);
console.log("Recipient:", demoRecipientEmail);
console.log("Password length:", smtpPass?.length || 0, "characters");
console.log("");

if (!smtpHost || !smtpUser || !smtpPass) {
  console.error("❌ Missing SMTP configuration!");
  process.exit(1);
}

const transporter = nodemailer.createTransport({
  host: smtpHost,
  port: parseInt(smtpPort, 10),
  secure: smtpSecure,
  auth: {
    user: smtpUser,
    pass: smtpPass,
  },
  tls: {
    rejectUnauthorized: false,
  },
});

async function testEmail() {
  try {
    console.log("🔍 Verifying SMTP connection...");
    await transporter.verify();
    console.log("✅ SMTP connection verified!");
    
    console.log("📤 Sending test email...");
    const info = await transporter.sendMail({
      from: `"RINADS BusinessOS" <${smtpUser}>`,
      to: demoRecipientEmail,
      subject: "Test Email from RINADS BusinessOS",
      text: "This is a test email to verify email configuration is working.",
      html: "<p>This is a <strong>test email</strong> to verify email configuration is working.</p>",
    });
    
    console.log("✅ Test email sent successfully!");
    console.log("Message ID:", info.messageId);
    console.log("Check your inbox at:", demoRecipientEmail);
  } catch (error) {
    console.error("❌ Error:", error.message);
    if (error.code) {
      console.error("Error code:", error.code);
    }
    if (error.response) {
      console.error("SMTP response:", error.response);
    }
    console.error("\n💡 Common fixes:");
    console.error("1. Verify Gmail app password is correct");
    console.error("2. Make sure 2-Step Verification is enabled");
    console.error("3. Regenerate app password if needed");
    console.error("4. Check if 'Less secure app access' is needed (older accounts)");
    process.exit(1);
  }
}

testEmail();






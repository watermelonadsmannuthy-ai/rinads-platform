import { NextResponse } from "next/server";
import nodemailer from "nodemailer";

type ContactPayload = {
  name: string;
  email: string;
  company?: string;
  budget?: string;
  message?: string;
};

function validatePayload(body: unknown): ContactPayload | null {
  if (!body || typeof body !== "object") return null;
  const { name, email, company, budget, message } = body as Record<
    string,
    unknown
  >;

  if (typeof name !== "string" || name.trim().length < 2) return null;
  if (typeof email !== "string" || !email.includes("@")) return null;

  return {
    name: name.trim(),
    email: email.trim(),
    company:
      typeof company === "string" && company.trim() ? company.trim() : undefined,
    budget:
      typeof budget === "string" && budget.trim() ? budget.trim() : undefined,
    message:
      typeof message === "string" && message.trim() ? message.trim() : undefined
  };
}

export async function POST(request: Request) {
  if (!process.env.SMTP_HOST || !process.env.SMTP_USER || !process.env.SMTP_PASS) {
    console.error("SMTP env vars are not fully configured");
    return NextResponse.json(
      { ok: false, error: "Email service is not configured." },
      { status: 500 }
    );
  }

  const recipient =
    process.env.CONTACT_RECIPIENT_EMAIL || process.env.SMTP_USER;

  let json: unknown;
  try {
    json = await request.json();
  } catch {
    return NextResponse.json(
      { ok: false, error: "Invalid JSON payload." },
      { status: 400 }
    );
  }

  const payload = validatePayload(json);
  if (!payload) {
    return NextResponse.json(
      { ok: false, error: "Invalid form data." },
      { status: 400 }
    );
  }

  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT || 587),
    secure: process.env.SMTP_SECURE === "true",
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS
    }
  });

  const subject = `New contact from ${payload.name} – Watermelon Ads & Academy`;

  const textLines = [
    `Name: ${payload.name}`,
    `Email: ${payload.email}`,
    payload.company ? `Company: ${payload.company}` : "",
    payload.budget ? `Budget: ${payload.budget}` : "",
    "",
    "Message:",
    payload.message || "(no message provided)"
  ].filter(Boolean);

  try {
    await transporter.sendMail({
      from: `"Watermelon Site" <${process.env.SMTP_USER}>`,
      to: recipient,
      replyTo: payload.email,
      subject,
      text: textLines.join("\n")
    });

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Error sending contact email:", error);
    return NextResponse.json(
      { ok: false, error: "Failed to send message." },
      { status: 500 }
    );
  }
}



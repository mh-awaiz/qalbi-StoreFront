import { NextResponse } from "next/server";
import nodemailer from "nodemailer";
import { rateLimit, rateLimitResponse } from "../../../lib/rateLimit";

export async function POST(request) {
  // ── Rate limit: 5 contact submissions / 60 s per IP (anti-spam) ───────────
  const { success, remaining, reset } = rateLimit(request, "contact", 5, 60);
  if (!success) return rateLimitResponse(reset);

  try {
    const body = await request.json();
    const { name, email, phone, subject, message } = body;

    // Basic validation
    if (!name?.trim() || !email?.trim() || !message?.trim()) {
      return NextResponse.json(
        { error: "Name, email and message are required." },
        { status: 400 }
      );
    }

    if (!/\S+@\S+\.\S+/.test(email)) {
      return NextResponse.json(
        { error: "Please provide a valid email address." },
        { status: 400 }
      );
    }

    // If email credentials are not configured, log and return success gracefully
    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
      console.warn(
        "EMAIL_USER / EMAIL_PASS not set — contact form submission logged only:",
        { name, email, phone, subject, message }
      );
      return NextResponse.json({ success: true });
    }

    const transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST || "smtp.gmail.com",
      port: parseInt(process.env.EMAIL_PORT || "587"),
      secure: process.env.EMAIL_PORT === "465",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    // ── Email to store owner ──────────────────────────────────────────────────
    const ownerHtml = `<!DOCTYPE html>
<html lang="en">
<head><meta charset="utf-8"/><meta name="viewport" content="width=device-width,initial-scale=1"/></head>
<body style="margin:0;padding:0;background:#faf3ec;font-family:'Segoe UI',Arial,sans-serif;">
<table width="100%" cellpadding="0" cellspacing="0" style="background:#faf3ec;padding:32px 16px;">
  <tr><td align="center">
  <table width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;">
    <tr>
      <td style="background:linear-gradient(135deg,#1a0a00 0%,#da3f3f 100%);border-radius:20px 20px 0 0;padding:28px 32px;text-align:center;">
        <p style="margin:0;font-size:11px;font-weight:700;letter-spacing:5px;color:rgba(255,255,255,0.55);text-transform:uppercase;">Qalbi Couture</p>
        <h1 style="margin:8px 0 0;font-size:22px;font-weight:800;color:#fff;">New Contact Message 📬</h1>
      </td>
    </tr>
    <tr>
      <td style="background:#fff;padding:28px 32px;border-left:1px solid #f0e0d0;border-right:1px solid #f0e0d0;">
        <table width="100%" cellpadding="0" cellspacing="0">
          ${[
            ["From", name],
            ["Email", email],
            ["Phone", phone || "—"],
            ["Subject", subject || "—"],
          ]
            .map(
              ([k, v]) => `
          <tr>
            <td style="padding:10px 0;border-bottom:1px solid #f5eee6;">
              <span style="font-size:11px;font-weight:700;letter-spacing:2px;color:#9b6e4f;text-transform:uppercase;">${k}</span><br/>
              <span style="font-size:14px;color:#1a0a00;font-weight:500;">${v}</span>
            </td>
          </tr>`
            )
            .join("")}
          <tr>
            <td style="padding:16px 0 0;">
              <span style="font-size:11px;font-weight:700;letter-spacing:2px;color:#9b6e4f;text-transform:uppercase;">Message</span>
              <div style="margin-top:8px;padding:16px;background:#faf3ec;border-radius:12px;border:1px solid #f0ddd0;font-size:14px;color:#1a0a00;line-height:1.7;white-space:pre-wrap;">${message}</div>
            </td>
          </tr>
        </table>
        <table cellpadding="0" cellspacing="0" style="margin-top:24px;">
          <tr>
            <td style="padding-right:10px;">
              <a href="mailto:${email}" style="display:inline-block;background:#da3f3f;color:#fff;text-decoration:none;font-size:12px;font-weight:700;padding:10px 22px;border-radius:50px;">Reply to ${name}</a>
            </td>
            ${phone ? `<td><a href="https://wa.me/91${phone.replace(/\D/g,"")}" style="display:inline-block;background:#25d366;color:#fff;text-decoration:none;font-size:12px;font-weight:700;padding:10px 22px;border-radius:50px;">WhatsApp</a></td>` : ""}
          </tr>
        </table>
      </td>
    </tr>
    <tr>
      <td style="background:#1a0a00;border-radius:0 0 20px 20px;padding:18px 32px;text-align:center;">
        <p style="margin:0;font-size:11px;color:rgba(255,255,255,0.4);">Qalbi Couture Contact Form — info@qalbicouture.com</p>
      </td>
    </tr>
  </table>
  </td></tr>
</table>
</body>
</html>`;

    // ── Auto-reply to customer ────────────────────────────────────────────────
    const autoReplyHtml = `<!DOCTYPE html>
<html lang="en">
<head><meta charset="utf-8"/><meta name="viewport" content="width=device-width,initial-scale=1"/></head>
<body style="margin:0;padding:0;background:#faf3ec;font-family:'Segoe UI',Arial,sans-serif;">
<table width="100%" cellpadding="0" cellspacing="0" style="background:#faf3ec;padding:32px 16px;">
  <tr><td align="center">
  <table width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;">
    <tr>
      <td style="background:linear-gradient(135deg,#1a0a00 0%,#da3f3f 100%);border-radius:20px 20px 0 0;padding:32px;text-align:center;">
        <p style="margin:0;font-size:11px;font-weight:700;letter-spacing:5px;color:rgba(255,255,255,0.55);text-transform:uppercase;">Qalbi Couture</p>
        <h1 style="margin:10px 0 0;font-size:24px;font-weight:800;color:#fff;">We've Received Your Message 🌸</h1>
        <p style="margin:10px 0 0;font-size:13px;color:rgba(255,255,255,0.7);">Thank you for reaching out, ${name}!</p>
      </td>
    </tr>
    <tr>
      <td style="background:#fff;padding:32px;border-left:1px solid #f0e0d0;border-right:1px solid #f0e0d0;">
        <p style="margin:0 0 16px;font-size:14px;color:#1a0a00;line-height:1.8;">
          We have received your message and our team will get back to you within <strong>24 hours</strong> (Mon–Sat, 10 AM – 7 PM IST).
        </p>
        <div style="background:#fff8f0;border:1.5px solid #f5d9bc;border-radius:12px;padding:16px 20px;margin:20px 0;">
          <p style="margin:0 0 6px;font-size:10px;font-weight:700;letter-spacing:3px;color:#9b6e4f;text-transform:uppercase;">Your Message</p>
          <p style="margin:0;font-size:13px;color:#1a0a00;line-height:1.7;white-space:pre-wrap;">${message}</p>
        </div>
        <p style="margin:20px 0 8px;font-size:14px;color:#1a0a00;">In the meantime, you can also reach us at:</p>
        <table cellpadding="0" cellspacing="0">
          <tr>
            <td style="padding:6px 12px 6px 0;font-size:13px;color:#9b6e4f;">📞 WhatsApp:</td>
            <td><a href="https://wa.me/918130421960" style="font-size:13px;color:#da3f3f;text-decoration:none;">+91 81304 21960</a></td>
          </tr>
          <tr>
            <td style="padding:6px 12px 6px 0;font-size:13px;color:#9b6e4f;">📧 Email:</td>
            <td><a href="mailto:info@qalbicouture.com" style="font-size:13px;color:#da3f3f;text-decoration:none;">info@qalbicouture.com</a></td>
          </tr>
        </table>
        <table cellpadding="0" cellspacing="0" style="margin-top:24px;">
          <tr>
            <td style="padding-right:10px;">
              <a href="https://www.qalbicouture.com/shop" style="display:inline-block;background:#da3f3f;color:#fff;text-decoration:none;font-size:12px;font-weight:700;padding:10px 22px;border-radius:50px;">Browse Our Collection</a>
            </td>
            <td>
              <a href="https://www.qalbicouture.com/track-order" style="display:inline-block;border:2px solid #da3f3f;color:#da3f3f;text-decoration:none;font-size:12px;font-weight:700;padding:8px 22px;border-radius:50px;">Track Order</a>
            </td>
          </tr>
        </table>
      </td>
    </tr>
    <tr>
      <td style="background:#1a0a00;border-radius:0 0 20px 20px;padding:20px 32px;text-align:center;">
        <p style="margin:0 0 6px;font-size:14px;font-weight:700;color:#f5d9bc;letter-spacing:3px;">QALBI COUTURE</p>
        <p style="margin:0;font-size:11px;color:rgba(255,255,255,0.35);">Crafted with love — Delivered with care</p>
      </td>
    </tr>
  </table>
  </td></tr>
</table>
</body>
</html>`;

    // Send both emails in parallel
    await Promise.all([
      // To store owner
      transporter.sendMail({
        from: `"Qalbi Couture Contact" <${process.env.EMAIL_USER}>`,
        to: process.env.CONTACT_EMAIL || "info@qalbicouture.com",
        replyTo: email,
        subject: `[Contact] ${subject || "New Enquiry"} — ${name}`,
        html: ownerHtml,
        text: `From: ${name} <${email}>\nPhone: ${phone || "—"}\nSubject: ${subject || "—"}\n\n${message}`,
      }),
      // Auto-reply to customer
      transporter.sendMail({
        from: `"Qalbi Couture" <${process.env.EMAIL_USER}>`,
        to: email,
        subject: `We received your message, ${name} 🌸 — Qalbi Couture`,
        html: autoReplyHtml,
      }),
    ]);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Contact form error:", error);
    return NextResponse.json(
      { error: "Failed to send message. Please try again or email us directly at info@qalbicouture.com." },
      { status: 500 }
    );
  }
}

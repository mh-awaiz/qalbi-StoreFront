import { NextResponse } from "next/server";
import nodemailer from "nodemailer";

import { getOrder } from "../../../../lib/orders";

export async function POST(request) {
  try {
    
    const { orderId, waybill, isMock } = await request.json();

    if (!orderId) {
      return NextResponse.json(
        { error: "orderId is required" },
        { status: 400 },
      );
    }

    const order = getOrder(orderId);
    if (!order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    // Skip if email not configured
    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
      console.warn("Email credentials not set — skipping confirmation email");
      return NextResponse.json({ success: true, skipped: true });
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

    const appUrl =
      process.env.NEXT_PUBLIC_APP_URL || "https://www.qalbicouture.com";
    const addr = order.shippingAddress;
    const trackingWaybill = waybill || order.delhiveryWaybill || null;

    // ── Delhivery tracking URLs ──────────────────────────────────────────────
    // 1. Official Delhivery website tracking link
    const delhiveryTrackUrl =
      trackingWaybill && !isMock
        ? `https://www.delhivery.com/track/package/${trackingWaybill}`
        : null;

    // 2. Our own track-order page (always available)
    const ourTrackUrl = `${appUrl}/track-order?order=${order.orderNumber}&phone=${addr.phone}`;

    // ── Build product rows ───────────────────────────────────────────────────
    const itemRows = order.items
      .map(
        (item) => `
      <tr>
        <td style="padding:14px 0;border-bottom:1px solid #f0e8e0;">
          <table cellpadding="0" cellspacing="0" width="100%">
            <tr>
              ${
                item.image
                  ? `
              <td width="56" style="vertical-align:top;padding-right:14px;">
                <img src="${item.image}" width="56" height="68"
                  style="border-radius:10px;object-fit:cover;display:block;" alt="${item.title}" />
              </td>`
                  : ""
              }
              <td style="vertical-align:top;">
                <p style="margin:0;font-size:13px;font-weight:600;color:#1a0a00;line-height:1.4;">${item.title}</p>
                ${item.size ? `<p style="margin:4px 0 0;font-size:11px;color:#9b6e4f;">Size: ${item.size}</p>` : ""}
                <p style="margin:4px 0 0;font-size:11px;color:#9b6e4f;">Qty: ${item.qty}</p>
              </td>
              <td style="vertical-align:top;text-align:right;white-space:nowrap;">
                <p style="margin:0;font-size:14px;font-weight:700;color:#da3f3f;">
                  ₹${(item.price * item.qty).toLocaleString("en-IN")}
                </p>
                ${item.qty > 1 ? `<p style="margin:3px 0 0;font-size:11px;color:#b8927a;">₹${item.price.toLocaleString("en-IN")} each</p>` : ""}
              </td>
            </tr>
          </table>
        </td>
      </tr>`,
      )
      .join("");

    // ── Tracking section HTML ────────────────────────────────────────────────
    const trackingSection = trackingWaybill
      ? `
      <!-- Tracking waybill -->
      <table width="100%" cellpadding="0" cellspacing="0" style="margin-top:24px;">
        <tr>
          <td style="background:#fff8f0;border:2px solid #f5d9bc;border-radius:16px;padding:20px 24px;">
            <table width="100%" cellpadding="0" cellspacing="0">
              <tr>
                <td>
                  <p style="margin:0 0 4px;font-size:10px;font-weight:700;letter-spacing:3px;color:#9b6e4f;text-transform:uppercase;">
                     Delhivery Tracking ID
                  </p>
                  <p style="margin:0;font-size:24px;font-weight:800;color:#1a0a00;letter-spacing:2px;font-family:monospace;">
                    ${trackingWaybill}
                  </p>
                  <p style="margin:8px 0 0;font-size:12px;color:#9b6e4f;">
                    Use this ID to track your order on Delhivery's website or our tracking page.
                  </p>
                </td>
              </tr>
            </table>

            <!-- Track buttons -->
            <table cellpadding="0" cellspacing="0" style="margin-top:18px;">
              <tr>
                ${
                  delhiveryTrackUrl
                    ? `
                <td style="padding-right:10px;">
                  <a href="${delhiveryTrackUrl}"
                    style="display:inline-block;background:#da3f3f;color:#fff;text-decoration:none;
                           font-size:12px;font-weight:700;padding:10px 20px;border-radius:50px;
                           letter-spacing:0.5px;">
                     Track on Delhivery
                  </a>
                </td>`
                    : ""
                }
                <td>
                  <a href="${ourTrackUrl}"
                    style="display:inline-block;background:#fff;color:#da3f3f;text-decoration:none;
                           font-size:12px;font-weight:700;padding:10px 20px;border-radius:50px;
                           border:2px solid #da3f3f;letter-spacing:0.5px;">
                     Track on Our Site
                  </a>
                </td>
              </tr>
            </table>
          </td>
        </tr>
      </table>`
      : `
      <!-- No waybill yet — just show our tracking page -->
      <table width="100%" cellpadding="0" cellspacing="0" style="margin-top:24px;">
        <tr>
          <td style="background:#fff8f0;border:2px solid #f5d9bc;border-radius:16px;padding:20px 24px;text-align:center;">
            <p style="margin:0 0 6px;font-size:13px;font-weight:600;color:#1a0a00;">
               Your order is being prepared!
            </p>
            <p style="margin:0 0 16px;font-size:12px;color:#9b6e4f;">
              Your tracking ID will be assigned once dispatched (within 1–2 business days).
              We'll send you another email with the tracking details.
            </p>
            <a href="${ourTrackUrl}"
              style="display:inline-block;background:#da3f3f;color:#fff;text-decoration:none;
                     font-size:12px;font-weight:700;padding:11px 28px;border-radius:50px;">
              Track My Order
            </a>
          </td>
        </tr>
      </table>`;

    // ── Full HTML email ──────────────────────────────────────────────────────
    const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Order Confirmed — Qalbi Couture</title>
</head>
<body style="margin:0;padding:0;background:#faf3ec;font-family:'Segoe UI',Arial,sans-serif;-webkit-font-smoothing:antialiased;">

<table width="100%" cellpadding="0" cellspacing="0" style="background:#faf3ec;padding:32px 16px;">
  <tr><td align="center">
  <table width="100%" cellpadding="0" cellspacing="0" style="max-width:580px;">

    <!-- HEADER -->
    <tr>
      <td style="background:linear-gradient(135deg,#1a0a00 0%,#da3f3f 100%);
                 border-radius:20px 20px 0 0;padding:36px 36px 32px;text-align:center;">
        <p style="margin:0 0 6px;font-size:11px;font-weight:700;letter-spacing:5px;
                  color:rgba(255,255,255,0.55);text-transform:uppercase;">
          Qalbi Couture
        </p>
        <h1 style="margin:0;font-size:28px;font-weight:800;color:#fff;letter-spacing:1px;">
          Order Confirmed! 
        </h1>
        <p style="margin:10px 0 0;font-size:13px;color:rgba(255,255,255,0.7);">
          Shukriya, ${order.customer.name}! Your order is on its way.
        </p>
      </td>
    </tr>

    <!-- BODY -->
    <tr>
      <td style="background:#fff;padding:32px 32px 8px;border-left:1px solid #f0e0d0;border-right:1px solid #f0e0d0;">

        <!-- Order number -->
        <table width="100%" cellpadding="0" cellspacing="0">
          <tr>
            <td style="background:#fff8f0;border:1.5px solid #f5d9bc;border-radius:12px;
                       padding:14px 20px;margin-bottom:24px;">
              <p style="margin:0;font-size:10px;font-weight:700;letter-spacing:3px;
                        color:#9b6e4f;text-transform:uppercase;">Order Number</p>
              <p style="margin:6px 0 0;font-size:22px;font-weight:800;color:#1a0a00;letter-spacing:1px;">
                ${order.orderNumber}
              </p>
              <p style="margin:4px 0 0;font-size:11px;color:#b8927a;">
                Placed on ${new Date(order.createdAt).toLocaleDateString(
                  "en-IN",
                  {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  },
                )}
              </p>
            </td>
          </tr>
        </table>

        <!-- Tracking section -->
        ${trackingSection}

        <!-- Divider -->
        <table width="100%" cellpadding="0" cellspacing="0" style="margin:28px 0 0;">
          <tr><td style="border-top:1px solid #f0e8e0;"></td></tr>
        </table>

        <!-- Order items -->
        <p style="margin:20px 0 10px;font-size:11px;font-weight:700;letter-spacing:3px;
                  color:#9b6e4f;text-transform:uppercase;">Your Items</p>
        <table width="100%" cellpadding="0" cellspacing="0">
          ${itemRows}
        </table>

        <!-- Totals -->
        <table width="100%" cellpadding="0" cellspacing="0" style="margin-top:4px;">
          <tr>
            <td style="padding:10px 0;border-top:1px solid #f0e8e0;">
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td style="font-size:13px;color:#9b6e4f;">Subtotal</td>
                  <td style="font-size:13px;color:#9b6e4f;text-align:right;">
                    ₹${order.subtotal.toLocaleString("en-IN")}
                  </td>
                </tr>
                <tr>
                  <td style="font-size:13px;color:#9b6e4f;padding-top:6px;">Shipping</td>
                  <td style="font-size:13px;text-align:right;padding-top:6px;
                             ${order.shippingCharge === 0 ? "color:#22c55e;font-weight:700;" : "color:#9b6e4f;"}">
                    ${order.shippingCharge === 0 ? "FREE" : "₹" + order.shippingCharge.toLocaleString("en-IN")}
                  </td>
                </tr>
                <tr>
                  <td style="font-size:16px;font-weight:800;color:#1a0a00;padding-top:10px;
                             border-top:2px solid #f0e0d0;">Total Paid</td>
                  <td style="font-size:16px;font-weight:800;color:#da3f3f;text-align:right;
                             padding-top:10px;border-top:2px solid #f0e0d0;">
                    ₹${order.total.toLocaleString("en-IN")}
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        </table>

        <!-- Delivery address -->
        <table width="100%" cellpadding="0" cellspacing="0" style="margin-top:24px;">
          <tr>
            <td style="background:#f9f5f0;border-radius:12px;padding:16px 20px;">
              <p style="margin:0 0 8px;font-size:10px;font-weight:700;letter-spacing:3px;
                        color:#9b6e4f;text-transform:uppercase;">Delivering To</p>
              <p style="margin:0;font-size:13px;font-weight:700;color:#1a0a00;">${addr.name}</p>
              <p style="margin:4px 0 0;font-size:12px;color:#6b4226;line-height:1.6;">
                ${addr.line1}${addr.line2 ? ", " + addr.line2 : ""}<br/>
                ${addr.city}, ${addr.state} — ${addr.pincode}<br/>
                 ${addr.phone}
              </p>
            </td>
          </tr>
        </table>

        <!-- Delivery timeline -->
        <table width="100%" cellpadding="0" cellspacing="0" style="margin-top:24px;">
          <tr>
            <td>
              <p style="margin:0 0 14px;font-size:10px;font-weight:700;letter-spacing:3px;
                        color:#9b6e4f;text-transform:uppercase;">⏱ Expected Timeline</p>
              <table width="100%" cellpadding="0" cellspacing="0">
                ${[
                  {
                    step: "1",
                    label: "Order Confirmed",
                    sub: "Right now",
                    done: true,
                  },
                  {
                    step: "2",
                    label: "Packed & Dispatched",
                    sub: "Within 1–2 business days",
                    done: !!trackingWaybill,
                  },
                  {
                    step: "3",
                    label: "Out for Delivery",
                    sub: "5–8 business days",
                    done: false,
                  },
                  {
                    step: "4",
                    label: "Delivered to You",
                    sub:
                      "Est. " +
                      new Date(Date.now() + 7 * 86400000).toLocaleDateString(
                        "en-IN",
                        { day: "numeric", month: "short" },
                      ),
                    done: false,
                  },
                ]
                  .map(
                    (s) => `
                <tr>
                  <td style="padding:6px 0;">
                    <table cellpadding="0" cellspacing="0">
                      <tr>
                        <td width="28" style="vertical-align:middle;padding-right:12px;">
                          <div style="width:24px;height:24px;border-radius:50%;
                               background:${s.done ? "#da3f3f" : "#f0e8e0"};
                               color:${s.done ? "#fff" : "#9b6e4f"};
                               font-size:11px;font-weight:700;text-align:center;line-height:24px;">
                            ${s.done ? "✓" : s.step}
                          </div>
                        </td>
                        <td>
                          <p style="margin:0;font-size:12px;font-weight:${s.done ? "700" : "500"};
                                    color:${s.done ? "#1a0a00" : "#9b6e4f"};">${s.label}</p>
                          <p style="margin:1px 0 0;font-size:11px;color:#b8927a;">${s.sub}</p>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>`,
                  )
                  .join("")}
              </table>
            </td>
          </tr>
        </table>

      </td>
    </tr>

    <!-- HELPFUL LINKS -->
    <tr>
      <td style="background:#fff8f0;padding:20px 32px;
                 border-left:1px solid #f0e0d0;border-right:1px solid #f0e0d0;">
        <p style="margin:0 0 12px;font-size:11px;font-weight:700;letter-spacing:2px;
                  color:#9b6e4f;text-transform:uppercase;">Quick Links</p>
        <table cellpadding="0" cellspacing="0">
          <tr>
            <td style="padding-right:10px;">
              <a href="${ourTrackUrl}"
                style="display:inline-block;font-size:11px;font-weight:600;color:#da3f3f;
                       text-decoration:none;padding:8px 16px;border:1.5px solid #da3f3f;
                       border-radius:50px;">
                Track Order
              </a>
            </td>
            <td style="padding-right:10px;">
              <a href="${appUrl}/shop"
                style="display:inline-block;font-size:11px;font-weight:600;color:#6b4226;
                       text-decoration:none;padding:8px 16px;border:1.5px solid #e8d5c0;
                       border-radius:50px;">
                Shop More
              </a>
            </td>
            <td>
              <a href="${appUrl}/returns"
                style="display:inline-block;font-size:11px;font-weight:600;color:#6b4226;
                       text-decoration:none;padding:8px 16px;border:1.5px solid #e8d5c0;
                       border-radius:50px;">
                Return Policy
              </a>
            </td>
          </tr>
        </table>
      </td>
    </tr>

    <!-- FOOTER -->
    <tr>
      <td style="background:#1a0a00;border-radius:0 0 20px 20px;padding:24px 32px;text-align:center;">
        <p style="margin:0 0 8px;font-size:16px;font-weight:700;color:#f5d9bc;letter-spacing:3px;">
          QALBI COUTURE
        </p>
        <p style="margin:0 0 12px;font-size:11px;color:rgba(255,255,255,0.4);letter-spacing:2px;">
          CRAFTED WITH LOVE — DELIVERED WITH CARE
        </p>
        <p style="margin:0;font-size:11px;color:rgba(255,255,255,0.3);">
          Questions? Reply to this email or WhatsApp us at +91 81304 21960<br/>
          <a href="${appUrl}/contact" style="color:#da3f3f;text-decoration:none;">info@qalbicouture.com</a>
        </p>
      </td>
    </tr>

  </table>
  </td></tr>
</table>
</body>
</html>`;

    // ── Send the email ────────────────────────────────────────────────────────
    await transporter.sendMail({
      from: `"Qalbi Couture" <${process.env.EMAIL_USER}>`,
      to: order.customer.email,
      subject: trackingWaybill
        ? `Your order ${order.orderNumber} is on its way! 🚚 Track: ${trackingWaybill}`
        : `Order Confirmed — ${order.orderNumber} | Qalbi Couture`,
      html,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("send-confirmation error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.1";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");
    if (!RESEND_API_KEY) {
      throw new Error("RESEND_API_KEY is not configured");
    }

    const {
      bookingReference,
      customerName,
      customerEmail,
      pickupAddress,
      dropoffAddress,
      pickupAt,
      vehicleName,
      totalPrice,
      passengers,
      luggage,
      serviceType,
      durationHours,
      distanceKm,
      durationMinutes,
    } = await req.json();

    if (!customerEmail || !bookingReference) {
      throw new Error("Missing required fields: customerEmail, bookingReference");
    }

    // Fetch brand settings for email branding
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    const { data: brandRow } = await supabase
      .from("brand_settings")
      .select("business_name, business_email, business_phone, business_address, business_logo_url, primary_brand_color, secondary_brand_color")
      .limit(1)
      .single();

    const brand = {
      name: brandRow?.business_name ?? "EliteDrive",
      email: brandRow?.business_email ?? "hello@elitedrive.com",
      phone: brandRow?.business_phone ?? "",
      address: brandRow?.business_address ?? "",
      logoUrl: brandRow?.business_logo_url ?? null,
      primaryColor: brandRow?.primary_brand_color
        ? `hsl(${brandRow.primary_brand_color})`
        : "#1a1a2e",
      accentColor: brandRow?.secondary_brand_color
        ? `hsl(${brandRow.secondary_brand_color})`
        : "#c4973b",
    };

    const serviceLabels: Record<string, string> = {
      "one-way-transfer": "One-Way Transfer",
      "from-airport": "Airport Pickup",
      "to-airport": "Airport Drop-off",
      "chauffeur-hourly": "Hourly Chauffeur",
      "private-tour": "Private Tour",
    };

    const pickupDate = new Date(pickupAt);
    const formattedDate = pickupDate.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
    const formattedTime = pickupDate.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    });

    const logoHtml = brand.logoUrl
      ? `<img src="${brand.logoUrl}" alt="${brand.name}" style="height:48px;margin-bottom:16px;" />`
      : "";

    const htmlBody = `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#f4f4f7;font-family:'Segoe UI',Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f4f4f7;padding:32px 0;">
    <tr><td align="center">
      <table width="600" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:12px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,0.08);">
        
        <!-- Header -->
        <tr><td style="background:${brand.primaryColor};padding:32px 40px;text-align:center;">
          ${logoHtml}
          <h1 style="margin:0;color:#ffffff;font-size:24px;font-weight:700;letter-spacing:0.5px;">${brand.name}</h1>
          <p style="margin:8px 0 0;color:rgba(255,255,255,0.8);font-size:14px;">Premium Chauffeur Service</p>
        </td></tr>

        <!-- Confirmation Banner -->
        <tr><td style="background:${brand.accentColor};padding:16px 40px;text-align:center;">
          <p style="margin:0;color:#ffffff;font-size:16px;font-weight:600;">✓ Booking Confirmed</p>
        </td></tr>

        <!-- Body -->
        <tr><td style="padding:32px 40px;">
          <p style="margin:0 0 8px;color:#333;font-size:16px;">Dear <strong>${customerName}</strong>,</p>
          <p style="margin:0 0 24px;color:#555;font-size:14px;line-height:1.6;">
            Thank you for choosing ${brand.name}. Your reservation has been confirmed and payment processed successfully.
          </p>

          <!-- Reference -->
          <table width="100%" cellpadding="0" cellspacing="0" style="background:#f8f8fb;border-radius:8px;margin-bottom:24px;">
            <tr><td style="padding:16px 20px;text-align:center;">
              <p style="margin:0 0 4px;color:#888;font-size:12px;text-transform:uppercase;letter-spacing:1px;">Booking Reference</p>
              <p style="margin:0;color:${brand.primaryColor};font-size:22px;font-weight:700;letter-spacing:1px;">${bookingReference}</p>
            </td></tr>
          </table>

          <!-- Trip Details -->
          <table width="100%" cellpadding="0" cellspacing="0" style="border:1px solid #eee;border-radius:8px;margin-bottom:24px;">
            <tr><td style="padding:16px 20px;border-bottom:1px solid #eee;">
              <p style="margin:0 0 4px;color:#888;font-size:11px;text-transform:uppercase;letter-spacing:0.5px;">Service</p>
              <p style="margin:0;color:#333;font-size:14px;font-weight:600;">${serviceLabels[serviceType] ?? serviceType}${durationHours > 0 ? ` • ${durationHours} hours` : ""}</p>
            </td></tr>
            <tr><td style="padding:16px 20px;border-bottom:1px solid #eee;">
              <p style="margin:0 0 4px;color:#888;font-size:11px;text-transform:uppercase;letter-spacing:0.5px;">Date &amp; Time</p>
              <p style="margin:0;color:#333;font-size:14px;font-weight:600;">${formattedDate} at ${formattedTime}</p>
            </td></tr>
            <tr><td style="padding:16px 20px;border-bottom:1px solid #eee;">
              <p style="margin:0 0 4px;color:#888;font-size:11px;text-transform:uppercase;letter-spacing:0.5px;">Pickup</p>
              <p style="margin:0;color:#333;font-size:14px;">${pickupAddress}</p>
            </td></tr>
            <tr><td style="padding:16px 20px;border-bottom:1px solid #eee;">
              <p style="margin:0 0 4px;color:#888;font-size:11px;text-transform:uppercase;letter-spacing:0.5px;">Drop-off</p>
              <p style="margin:0;color:#333;font-size:14px;">${dropoffAddress}</p>
            </td></tr>
            <tr><td style="padding:16px 20px;border-bottom:1px solid #eee;">
              <p style="margin:0 0 4px;color:#888;font-size:11px;text-transform:uppercase;letter-spacing:0.5px;">Vehicle</p>
              <p style="margin:0;color:#333;font-size:14px;font-weight:600;">${vehicleName}</p>
            </td></tr>
            <tr><td style="padding:16px 20px;">
              <table width="100%"><tr>
                <td style="width:33%"><p style="margin:0 0 4px;color:#888;font-size:11px;text-transform:uppercase;">Passengers</p><p style="margin:0;color:#333;font-size:14px;font-weight:600;">${passengers}</p></td>
                <td style="width:33%"><p style="margin:0 0 4px;color:#888;font-size:11px;text-transform:uppercase;">Luggage</p><p style="margin:0;color:#333;font-size:14px;font-weight:600;">${luggage}</p></td>
                <td style="width:33%"><p style="margin:0 0 4px;color:#888;font-size:11px;text-transform:uppercase;">Distance</p><p style="margin:0;color:#333;font-size:14px;font-weight:600;">${distanceKm?.toFixed(1) ?? "—"} km</p></td>
              </tr></table>
            </td></tr>
          </table>

          <!-- Total -->
          <table width="100%" cellpadding="0" cellspacing="0" style="background:${brand.primaryColor};border-radius:8px;margin-bottom:24px;">
            <tr><td style="padding:20px;text-align:center;">
              <p style="margin:0 0 4px;color:rgba(255,255,255,0.7);font-size:12px;text-transform:uppercase;letter-spacing:1px;">Total Paid</p>
              <p style="margin:0;color:${brand.accentColor};font-size:28px;font-weight:700;">$${Number(totalPrice).toFixed(2)}</p>
            </td></tr>
          </table>

          <p style="margin:0;color:#888;font-size:13px;line-height:1.6;text-align:center;">
            If you have any questions, contact us at
            <a href="mailto:${brand.email}" style="color:${brand.accentColor};text-decoration:none;">${brand.email}</a>
            ${brand.phone ? ` or call <strong>${brand.phone}</strong>` : ""}
          </p>
        </td></tr>

        <!-- Footer -->
        <tr><td style="background:#f8f8fb;padding:24px 40px;text-align:center;border-top:1px solid #eee;">
          <p style="margin:0 0 4px;color:#aaa;font-size:12px;">${brand.name}${brand.address ? ` • ${brand.address}` : ""}</p>
          <p style="margin:0;color:#ccc;font-size:11px;">© ${new Date().getFullYear()} ${brand.name}. All rights reserved.</p>
        </td></tr>

      </table>
    </td></tr>
  </table>
</body>
</html>`;

    // Send customer confirmation email
    const resendRes = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${RESEND_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: `${brand.name} <onboarding@resend.dev>`,
        to: [customerEmail],
        subject: `Booking Confirmed — ${bookingReference} | ${brand.name}`,
        html: htmlBody,
      }),
    });

    const resendData = await resendRes.json();

    if (!resendRes.ok) {
      console.error("Resend API error:", resendData);
      throw new Error(`Resend error [${resendRes.status}]: ${JSON.stringify(resendData)}`);
    }

    // Send admin notification email
    const adminHtml = `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#f4f4f7;font-family:'Segoe UI',Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f4f4f7;padding:32px 0;">
    <tr><td align="center">
      <table width="600" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:12px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,0.08);">

        <tr><td style="background:${brand.primaryColor};padding:24px 40px;text-align:center;">
          ${logoHtml}
          <h1 style="margin:0;color:#ffffff;font-size:20px;font-weight:700;">🔔 New Booking Received</h1>
        </td></tr>

        <tr><td style="background:${brand.accentColor};padding:12px 40px;text-align:center;">
          <p style="margin:0;color:#ffffff;font-size:14px;font-weight:600;">${bookingReference} • $${Number(totalPrice).toFixed(2)}</p>
        </td></tr>

        <tr><td style="padding:28px 40px;">
          <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:20px;">
            <tr>
              <td style="padding:8px 0;border-bottom:1px solid #eee;width:140px;"><strong style="color:#888;font-size:12px;text-transform:uppercase;">Customer</strong></td>
              <td style="padding:8px 0;border-bottom:1px solid #eee;color:#333;font-size:14px;">${customerName} — <a href="mailto:${customerEmail}" style="color:${brand.accentColor};">${customerEmail}</a></td>
            </tr>
            <tr>
              <td style="padding:8px 0;border-bottom:1px solid #eee;"><strong style="color:#888;font-size:12px;text-transform:uppercase;">Service</strong></td>
              <td style="padding:8px 0;border-bottom:1px solid #eee;color:#333;font-size:14px;">${serviceLabels[serviceType] ?? serviceType}${durationHours > 0 ? ` (${durationHours}h)` : ""}</td>
            </tr>
            <tr>
              <td style="padding:8px 0;border-bottom:1px solid #eee;"><strong style="color:#888;font-size:12px;text-transform:uppercase;">Date & Time</strong></td>
              <td style="padding:8px 0;border-bottom:1px solid #eee;color:#333;font-size:14px;">${formattedDate} at ${formattedTime}</td>
            </tr>
            <tr>
              <td style="padding:8px 0;border-bottom:1px solid #eee;"><strong style="color:#888;font-size:12px;text-transform:uppercase;">Pickup</strong></td>
              <td style="padding:8px 0;border-bottom:1px solid #eee;color:#333;font-size:14px;">${pickupAddress}</td>
            </tr>
            <tr>
              <td style="padding:8px 0;border-bottom:1px solid #eee;"><strong style="color:#888;font-size:12px;text-transform:uppercase;">Drop-off</strong></td>
              <td style="padding:8px 0;border-bottom:1px solid #eee;color:#333;font-size:14px;">${dropoffAddress}</td>
            </tr>
            <tr>
              <td style="padding:8px 0;border-bottom:1px solid #eee;"><strong style="color:#888;font-size:12px;text-transform:uppercase;">Vehicle</strong></td>
              <td style="padding:8px 0;border-bottom:1px solid #eee;color:#333;font-size:14px;">${vehicleName}</td>
            </tr>
            <tr>
              <td style="padding:8px 0;border-bottom:1px solid #eee;"><strong style="color:#888;font-size:12px;text-transform:uppercase;">Passengers / Luggage</strong></td>
              <td style="padding:8px 0;border-bottom:1px solid #eee;color:#333;font-size:14px;">${passengers} pax / ${luggage} bags</td>
            </tr>
            <tr>
              <td style="padding:8px 0;border-bottom:1px solid #eee;"><strong style="color:#888;font-size:12px;text-transform:uppercase;">Distance</strong></td>
              <td style="padding:8px 0;border-bottom:1px solid #eee;color:#333;font-size:14px;">${distanceKm?.toFixed(1) ?? "—"} km • ~${Math.round(durationMinutes ?? 0)} min</td>
            </tr>
            <tr>
              <td style="padding:8px 0;"><strong style="color:#888;font-size:12px;text-transform:uppercase;">Total</strong></td>
              <td style="padding:8px 0;color:${brand.accentColor};font-size:18px;font-weight:700;">$${Number(totalPrice).toFixed(2)}</td>
            </tr>
          </table>
        </td></tr>

        <tr><td style="background:#f8f8fb;padding:20px 40px;text-align:center;border-top:1px solid #eee;">
          <p style="margin:0;color:#aaa;font-size:11px;">This is an automated notification from ${brand.name}</p>
        </td></tr>

      </table>
    </td></tr>
  </table>
</body>
</html>`;

    // Send to admin (brand email)
    const adminRes = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${RESEND_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: `${brand.name} <onboarding@resend.dev>`,
        to: [brand.email],
        subject: `🔔 New Booking ${bookingReference} — ${customerName} | $${Number(totalPrice).toFixed(2)}`,
        html: adminHtml,
      }),
    });

    const adminData = await adminRes.json();
    if (!adminRes.ok) {
      console.error("Admin email error:", adminData);
      // Don't throw — customer email already sent successfully
    }

    return new Response(JSON.stringify({ success: true, id: resendData.id }), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error sending booking email:", error);
    const message = error instanceof Error ? error.message : "Unknown error";
    return new Response(JSON.stringify({ success: false, error: message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});

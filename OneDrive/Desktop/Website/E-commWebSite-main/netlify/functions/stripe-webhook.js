const Stripe = require('stripe');

exports.handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
  const sig = event.headers['stripe-signature'];

  if (!webhookSecret || !sig) {
    console.error('Missing STRIPE_WEBHOOK_SECRET or stripe-signature header');
    return { statusCode: 400, body: 'Webhook configuration error' };
  }

  const stripe = Stripe(process.env.STRIPE_SECRET_KEY);
  let stripeEvent;

  try {
    const rawBody = event.isBase64Encoded
      ? Buffer.from(event.body, 'base64').toString('utf8')
      : event.body;
    stripeEvent = stripe.webhooks.constructEvent(rawBody, sig, webhookSecret);
  } catch (err) {
    console.error('Stripe signature verification failed:', err.message);
    return { statusCode: 400, body: `Webhook Error: ${err.message}` };
  }

  const supabaseUrl = process.env.VITE_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  const updateOrder = async (paymentIntentId, status) => {
    const res = await fetch(
      `${supabaseUrl}/rest/v1/orders?stripe_payment_intent_id=eq.${encodeURIComponent(paymentIntentId)}`,
      {
        method: 'PATCH',
        headers: {
          apikey: serviceRoleKey,
          Authorization: `Bearer ${serviceRoleKey}`,
          'Content-Type': 'application/json',
          Prefer: 'return=minimal',
        },
        body: JSON.stringify({ status }),
      }
    );
    if (!res.ok) {
      const text = await res.text();
      throw new Error(`Supabase update failed: ${text}`);
    }
  };

  // Resolve customer email: from Stripe metadata (both guests and logged-in),
  // or fall back to querying the order → profile in Supabase
  const resolveCustomerEmail = async (pi) => {
    // Fastest path: email was stored in PaymentIntent metadata by create-payment-intent
    if (pi.metadata?.customerEmail) return pi.metadata.customerEmail;
    if (pi.receipt_email) return pi.receipt_email;

    // Fall back: look up the order's user profile
    try {
      const orderRes = await fetch(
        `${supabaseUrl}/rest/v1/orders?stripe_payment_intent_id=eq.${encodeURIComponent(pi.id)}&select=user_id`,
        {
          headers: {
            apikey: serviceRoleKey,
            Authorization: `Bearer ${serviceRoleKey}`,
          },
        }
      );
      const orders = await orderRes.json();
      const userId = orders?.[0]?.user_id;
      if (!userId) return null;

      const profileRes = await fetch(
        `${supabaseUrl}/rest/v1/profiles?id=eq.${userId}&select=email,name`,
        {
          headers: {
            apikey: serviceRoleKey,
            Authorization: `Bearer ${serviceRoleKey}`,
          },
        }
      );
      const profiles = await profileRes.json();
      return profiles?.[0]?.email ?? null;
    } catch {
      return null;
    }
  };

  const sendConfirmationEmail = async (to, orderId, total) => {
    const apiKey = process.env.RESEND_API_KEY;
    if (!apiKey) {
      console.warn('RESEND_API_KEY not set — skipping confirmation email');
      return;
    }

    const fromAddress = process.env.RESEND_FROM_EMAIL || 'onboarding@resend.dev';
    const shortId = orderId ? orderId.slice(0, 8).toUpperCase() : 'N/A';
    const formattedTotal = total ? `$${(total / 100).toFixed(2)}` : '';

    const html = `
      <!DOCTYPE html>
      <html>
      <body style="font-family:sans-serif;max-width:560px;margin:0 auto;padding:32px 16px;color:#111;">
        <div style="text-align:center;margin-bottom:32px;">
          <div style="display:inline-flex;align-items:center;justify-content:center;
               width:48px;height:48px;background:#2563eb;border-radius:10px;
               color:#fff;font-weight:700;font-size:24px;">E</div>
          <h1 style="margin:16px 0 4px;font-size:22px;">Order Confirmed!</h1>
          <p style="color:#6b7280;margin:0;">Thanks for shopping with EComm.</p>
        </div>

        <div style="background:#f0fdf4;border:1px solid #bbf7d0;border-radius:12px;padding:20px;margin-bottom:24px;">
          <p style="margin:0;font-size:14px;color:#15803d;">
            ✓ &nbsp;Your payment was successful and your order is being processed.
          </p>
        </div>

        ${orderId ? `
        <table style="width:100%;border-collapse:collapse;margin-bottom:24px;">
          <tr style="background:#f9fafb;">
            <td style="padding:12px 16px;font-size:14px;color:#6b7280;">Order ID</td>
            <td style="padding:12px 16px;font-size:14px;font-family:monospace;text-align:right;">${shortId}</td>
          </tr>
          ${formattedTotal ? `
          <tr>
            <td style="padding:12px 16px;font-size:14px;color:#6b7280;border-top:1px solid #e5e7eb;">Total charged</td>
            <td style="padding:12px 16px;font-size:14px;font-weight:600;text-align:right;border-top:1px solid #e5e7eb;">${formattedTotal}</td>
          </tr>` : ''}
        </table>` : ''}

        <div style="background:#eff6ff;border-radius:12px;padding:20px;margin-bottom:32px;">
          <p style="margin:0 0 8px;font-weight:600;font-size:14px;">What happens next?</p>
          <ul style="margin:0;padding-left:20px;font-size:14px;color:#374151;line-height:1.8;">
            <li>Your order will be processed within 1 business day</li>
            <li>You'll receive a shipping notification once it's on its way</li>
          </ul>
        </div>

        <div style="text-align:center;margin-bottom:32px;">
          <a href="https://ecommnexora.netlify.app/products"
             style="display:inline-block;background:#2563eb;color:#fff;text-decoration:none;
                    padding:12px 28px;border-radius:8px;font-weight:600;font-size:14px;">
            Continue Shopping
          </a>
        </div>

        <p style="text-align:center;font-size:12px;color:#9ca3af;">
          Questions? Email us at <a href="mailto:support@ecomm.com" style="color:#2563eb;">support@ecomm.com</a>
        </p>
      </body>
      </html>
    `;

    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ from: fromAddress, to, subject: `Order Confirmed — EComm${shortId !== 'N/A' ? ` #${shortId}` : ''}`, html }),
    });

    if (!res.ok) {
      const body = await res.text();
      console.error('Resend email failed:', body);
    } else {
      console.log(`Confirmation email sent to ${to}`);
    }
  };

  try {
    switch (stripeEvent.type) {
      case 'payment_intent.succeeded': {
        const pi = stripeEvent.data.object;
        await updateOrder(pi.id, 'processing');
        console.log(`Order → processing: ${pi.id}`);

        const email = await resolveCustomerEmail(pi);
        if (email) {
          await sendConfirmationEmail(email, pi.id, pi.amount);
        } else {
          console.warn(`No customer email found for payment intent ${pi.id}`);
        }
        break;
      }

      case 'payment_intent.payment_failed': {
        const pi = stripeEvent.data.object;
        await updateOrder(pi.id, 'cancelled');
        console.log(`Order → cancelled: ${pi.id}`);
        break;
      }

      default:
        break;
    }
  } catch (err) {
    console.error('Webhook processing error:', err);
    return { statusCode: 500, body: `Processing error: ${err.message}` };
  }

  return { statusCode: 200, body: JSON.stringify({ received: true }) };
};

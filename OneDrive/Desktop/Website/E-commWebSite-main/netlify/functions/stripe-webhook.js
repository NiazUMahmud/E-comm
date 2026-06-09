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
    // Use raw body string — required for signature verification
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

  try {
    switch (stripeEvent.type) {
      case 'payment_intent.succeeded':
        await updateOrder(stripeEvent.data.object.id, 'processing');
        console.log(`Order → processing: ${stripeEvent.data.object.id}`);
        break;

      case 'payment_intent.payment_failed':
        await updateOrder(stripeEvent.data.object.id, 'cancelled');
        console.log(`Order → cancelled: ${stripeEvent.data.object.id}`);
        break;

      default:
        break;
    }
  } catch (err) {
    console.error('Webhook processing error:', err);
    return { statusCode: 500, body: `Processing error: ${err.message}` };
  }

  return { statusCode: 200, body: JSON.stringify({ received: true }) };
};

const Stripe = require('stripe');

exports.handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  // Require authenticated user
  const authHeader = event.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return { statusCode: 401, body: JSON.stringify({ error: 'Authentication required' }) };
  }

  try {
    const { items, currency = 'usd' } = JSON.parse(event.body);

    if (!Array.isArray(items) || items.length === 0) {
      return { statusCode: 400, body: JSON.stringify({ error: 'Cart is empty' }) };
    }

    const allowedCurrencies = ['usd', 'eur', 'gbp', 'cad', 'aud'];
    if (!allowedCurrencies.includes(currency)) {
      return { statusCode: 400, body: JSON.stringify({ error: 'Invalid currency' }) };
    }

    // Fetch real prices from Supabase server-side — prevents client price manipulation
    const ids = items.map(i => i.id).join(',');
    const priceRes = await fetch(
      `${process.env.VITE_SUPABASE_URL}/rest/v1/products?select=id,price&id=in.(${ids})`,
      {
        headers: {
          apikey: process.env.VITE_SUPABASE_ANON_KEY,
          Authorization: `Bearer ${process.env.VITE_SUPABASE_ANON_KEY}`,
        },
      }
    );

    if (!priceRes.ok) throw new Error('Failed to verify product prices');
    const products = await priceRes.json();

    // Compute total from verified DB prices (not client-supplied prices)
    let subtotal = 0;
    for (const item of items) {
      const product = products.find(p => p.id === item.id);
      if (!product) {
        return { statusCode: 400, body: JSON.stringify({ error: `Product not found: ${item.id}` }) };
      }
      if (!Number.isInteger(item.quantity) || item.quantity < 1 || item.quantity > 100) {
        return { statusCode: 400, body: JSON.stringify({ error: 'Invalid quantity' }) };
      }
      subtotal += product.price * item.quantity;
    }

    const total = subtotal * 1.08; // 8% tax

    if (total < 0.5)   return { statusCode: 400, body: JSON.stringify({ error: 'Order total too low' }) };
    if (total > 99999) return { statusCode: 400, body: JSON.stringify({ error: 'Order total exceeds limit' }) };

    const stripe = Stripe(process.env.STRIPE_SECRET_KEY);
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(total * 100),
      currency,
      automatic_payment_methods: { enabled: true },
    });

    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ clientSecret: paymentIntent.client_secret }),
    };
  } catch (err) {
    console.error('Payment intent error:', err);
    return { statusCode: 500, body: JSON.stringify({ error: err.message }) };
  }
};

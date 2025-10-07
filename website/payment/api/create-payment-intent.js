// api/create-payment-intent.js
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

// Services configuration (should match frontend)
const SERVICES = {
  consultation: { price: 50000, name: 'Initial Consultation' },
  sprint: { price: 500000, name: 'Two-Week Sprint' },
  retainer: { price: 800000, name: 'Monthly Retainer' }
};

module.exports = async (req, res) => {
  const { serviceId, email, name } = req.body;

  // Validate service
  const service = SERVICES[serviceId];
  if (!service) {
    return res.status(400).json({ error: 'Invalid service' });
  }

  try {
    // Create or retrieve customer
    const customers = await stripe.customers.list({ email, limit: 1 });
    
    let customer;
    if (customers.data.length > 0) {
      customer = customers.data[0];
    } else {
      customer = await stripe.customers.create({
        email,
        name,
        metadata: { source: 'tukugroup_payment_page' }
      });
    }

    // Create Payment Intent
    const paymentIntent = await stripe.paymentIntents.create({
      amount: service.price,
      currency: 'usd',
      customer: customer.id,
      metadata: {
        serviceId,
        serviceName: service.name,
        customerName: name
      },
      receipt_email: email,
      description: `${service.name} - TUKU GROUP`
    });

    res.json({ clientSecret: paymentIntent.client_secret });

  } catch (error) {
    console.error('Payment Intent error:', error);
    res.status(500).json({ error: 'Payment setup failed' });
  }
};
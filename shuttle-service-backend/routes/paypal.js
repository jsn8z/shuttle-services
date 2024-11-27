const express = require('express');
const router = express.Router();
const paypal = require('@paypal/checkout-server-sdk');

// PayPal Client Configuration
const payPalClient = () => {
  const Environment =
    process.env.PAYPAL_MODE === 'live'
      ? paypal.core.LiveEnvironment
      : paypal.core.SandboxEnvironment;
  return new paypal.core.PayPalHttpClient(
    new Environment(
      process.env.PAYPAL_CLIENT_ID,
      process.env.PAYPAL_CLIENT_SECRET
    )
  );
};

// Proceed to Payment Route
router.post('/checkout', async (req, res) => {
  const { totalAmount, currency } = req.body;

  if (!totalAmount || !currency) {
    return res.status(400).json({ message: 'Total amount and currency are required' });
  }

  const request = new paypal.orders.OrdersCreateRequest();
  request.prefer('return=representation');
  request.requestBody({
    intent: 'CAPTURE',
    purchase_units: [
      {
        amount: {
          currency_code: currency,
          value: totalAmount.toString(),
        },
      },
    ],
  });

  try {
    const payPalClientInstance = payPalClient();
    const order = await payPalClientInstance.execute(request);
    res.status(201).json({ orderId: order.result.id });
  } catch (error) {
    console.error('PayPal Checkout Error:', error);
    res.status(500).json({ message: 'Failed to create PayPal order', error });
  }
});

// Capture Payment Route
router.post('/capture/:orderId', async (req, res) => {
  const { orderId } = req.params;

  if (!orderId) {
    return res.status(400).json({ message: 'Order ID is required' });
  }

  const request = new paypal.orders.OrdersCaptureRequest(orderId);
  request.requestBody({});

  try {
    const payPalClientInstance = payPalClient();
    const capture = await payPalClientInstance.execute(request);
    res.status(200).json({ message: 'Payment captured successfully', capture });
  } catch (error) {
    console.error('PayPal Capture Error:', error);
    res.status(500).json({ message: 'Failed to capture PayPal payment', error });
  }
});

module.exports = router;

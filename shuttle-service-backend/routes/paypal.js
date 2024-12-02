const express = require('express');
const router = express.Router();
const axios = require('axios');
require('dotenv').config();

// Helper: Get PayPal Access Token
async function generateAccessToken() {
  try {
    const response = await axios({
      url: process.env.PAYPAL_BASE_URL + '/v1/oauth2/token',
      method: 'post',
      data: 'grant_type=client_credentials',
      auth: {
        username: process.env.PAYPAL_CLIENT_ID,
        password: process.env.PAYPAL_CLIENT_SECRET
      }
    });

    return response.data.access_token;
  } catch (error) {
    console.error('Error fetching PayPal access token:', error.message);
    throw new Error('Failed to fetch PayPal access token');
  }
}

// Create Order
router.post('/checkout', async (req, res) => {
  console.log('Inside PayPal /checkout route');
  const { totalAmount, currency } = req.body;

  if (!totalAmount || !currency || isNaN(totalAmount)) {
    return res
      .status(400)
      .json({ message: 'Total amount (number) and currency are required' });
  }

  try {
    const accessToken = await generateAccessToken();

    const url =
      process.env.PAYPAL_MODE === 'live'
        ? 'https://api.paypal.com/v2/checkout/orders'
        : 'https://api.sandbox.paypal.com/v2/checkout/orders';

    const orderData = {
      intent: 'CAPTURE',
      purchase_units: [
        {
          amount: {
            currency_code: currency,
            value: totalAmount.toString(),
            breakdown: {
              item_total: {
                currency_code: currency,
                value: totalAmount.toString(),
              },
            },
          },
        },
      ],
      application_context: {
        return_url: `${process.env.FRONTEND_URL}/payment-success`, // Redirect on approval
        cancel_url: `${process.env.FRONTEND_URL}/payment-failure`, // Redirect on cancel
        shipping_preference: 'NO_SHIPPING',
        user_action: 'PAY_NOW'
      },
    };

    const response = await axios.post(url, orderData, {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.data || !response.data.links) {
      throw new Error('Invalid response from PayPal order creation');
    }

    console.log('Order Created:', response.data);
    // Send the approval link in the response
    const approvalLink = response.data.links.find(
      (link) => link.rel === 'approve'
    ).href;

    console.log(approvalLink)

    if (!approvalLink) {
      throw new Error('Approval link not found in PayPal response');
    }

    res.status(201).json({ orderId: response.data.id, totalAmount: totalAmount, approvalLink : approvalLink  });
  } catch (error) {
    console.error('Error creating PayPal order:', error.message);
    res.status(500).json({ message: 'Failed to create PayPal order', error: error.message });
  }
});

// Capture Payment
router.post('/capture/:orderId', async (req, res) => {
  const { orderId } = req.params;
  console.log('Entered capture');

  if (!orderId) {
    return res.status(400).json({ message: 'Order ID is required' });
  }

  try {
    const accessToken = await generateAccessToken();

    const url =
      process.env.PAYPAL_MODE === 'live'
        ? `https://api.paypal.com/v2/checkout/orders/${orderId}/capture`
        : `https://api.sandbox.paypal.com/v2/checkout/orders/${orderId}/capture`;

    const response = await axios.post(url, {}, {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
    });

    console.log('Payment Captured:', response.data);
    const captureDetails = response.data.purchase_units[0].payments.captures[0];

    if (!captureDetails) {
      throw new Error('Capture details not found in PayPal response');
    }

    res.status(200).json({
      message: 'Payment captured successfully',
      capture: captureDetails,
    });
  } catch (error) {
    console.error('Error capturing payment:', error.message);
    res.status(500).json({ message: 'Failed to capture PayPal payment', error: error.message });
  }
});

module.exports = router;

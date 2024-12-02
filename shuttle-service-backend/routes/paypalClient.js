// paypalClient.js

const paypal = require('@paypal/checkout-server-sdk');
require('dotenv').config();

// Define PayPal environment based on the NODE_ENV (production or sandbox)
const environment = process.env.NODE_ENV === 'production'
  ? new paypal.core.LiveEnvironment(process.env.PAYPAL_CLIENT_ID, process.env.PAYPAL_SECRET)
  : new paypal.core.SandboxEnvironment(process.env.PAYPAL_CLIENT_ID, process.env.PAYPAL_SECRET);

// Create a PayPal HTTP client with the environment
const paypalClient = new paypal.core.PayPalHttpClient(environment);

module.exports = paypalClient;

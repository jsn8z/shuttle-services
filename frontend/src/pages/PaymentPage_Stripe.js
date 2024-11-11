// src/pages/PaymentPage.js
import React from 'react';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import PaymentForm from '../components/PaymentForm';

const stripePromise = loadStripe('your-publishable-key');

const PaymentPage = () => {
  const handlePaymentSuccess = () => alert("Payment Successful!");

  return (
    <Elements stripe={stripePromise}>
      <PaymentForm amount={100} onPaymentSuccess={handlePaymentSuccess} />
    </Elements>
  );
};

export default PaymentPage;

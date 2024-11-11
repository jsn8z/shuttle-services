// src/components/PaymentForm.js
import React, { useState } from 'react';
import { CardElement, useStripe, useElements } from '@stripe/react-stripe-js';

const PaymentForm = ({ amount, onPaymentSuccess }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [error, setError] = useState(null);
  const [processing, setProcessing] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setProcessing(true);

    const card = elements.getElement(CardElement);
    const { error, paymentIntent } = await stripe.confirmCardPayment('{YOUR_CLIENT_SECRET}', {
      payment_method: {
        card: card,
      },
    });

    if (error) {
      setError(error.message);
      setProcessing(false);
    } else if (paymentIntent.status === 'succeeded') {
      onPaymentSuccess();
    }
  };

  return (
    <div>
      <h2>Payment</h2>
      <form onSubmit={handleSubmit}>
        <CardElement />
        <button type="submit" disabled={!stripe || processing}>
          Pay ${amount}
        </button>
        {error && <div style={{ color: 'red' }}>{error}</div>}
      </form>
    </div>
  );
};

export default PaymentForm;

// src/pages/PaymentPage.js
import React from 'react';
import { useLocation } from 'react-router-dom';

const PaymentPage = () => {
  const { state } = useLocation();
  const { name, email } = state || {};

  return (
    <div className="payment-page">
      <h1>Payment Page</h1>
      <p>Thank you for booking with us!</p>
      <p>Booking Details:</p>
      <p>Name: {name}</p>
      <p>Email: {email}</p>
      <button>Make Payment</button>
    </div>
  );
};

export default PaymentPage;

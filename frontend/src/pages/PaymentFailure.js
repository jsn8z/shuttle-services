import React from 'react';
import { useLocation } from 'react-router-dom';

const PaymentFailure = () => {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const errorMessage = queryParams.get('error');

  return (
    <div>
      <h1>Payment Failed</h1>
      <p>We encountered an issue while processing your payment.</p>
      {errorMessage && <p>Error: {decodeURIComponent(errorMessage)}</p>}
      <p>Please try again or contact support for assistance.</p>
    </div>
  );
};

export default PaymentFailure;

// src/pages/PaymentPage.js
import React, { useEffect, useState } from 'react';

const PaymentPage = () => {
  const [totalAmount, setTotalAmount] = useState(null); // State to hold the dynamic amount
  const [currency, setCurrency] = useState('USD'); // Default currency

  useEffect(() => {
    // Dynamically load the PayPal SDK
    const script = document.createElement('script');
    script.src = `https://www.sandbox.paypal.com/sdk/js?client-id=${process.env.REACT_APP_PAYPAL_CLIENT_ID}&currency=${currency}`;
    script.async = true;

    script.onload = () => {
      // Render PayPal buttons after the script loads
      const paypalButtonContainer = document.getElementById('paypal-button-container');
      if (paypalButtonContainer) {
        window.paypal.Buttons({
          style: {
            layout: 'vertical', // Vertical or horizontal layout
            color: 'blue',      // Blue, silver, black, or white
            shape: 'rect',      // Rectangular or pill-shaped buttons
            label: 'pay',       // Button label: pay, checkout, etc.
          },
          createOrder: (data, actions) => {
            // Call the backend to create an order
            return fetch('/paypal/checkout', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                totalAmount,
                currency, // Pass the currency to the backend
              }),
            })
              .then((response) => response.json())
              .then((order) => {
                if (order && order.approvalLink) {
                  setTotalAmount(order.totalAmount); // Update the total amount
                  return order.orderId; // Return the order ID to PayPal
                } else {
                  throw new Error('Failed to create order');
                }
              })
              .catch((error) => {
                console.error('Error creating order:', error);
                alert('Unable to create the order. Please try again.');
              });
          },
          onApprove: (data, actions) => {
            // Call the backend to capture the order
            return fetch(`/paypal/capture/${data.orderID}`, {
              method: 'POST',
            })
              .then((response) => response.json())
              .then((details) => {
                if (details && details.capture) {
                  alert(
                    `Transaction completed by ${details.capture.payer.name.given_name}`
                  );
                  window.location.href = '/payment-success'; // Redirect to success page
                } else {
                  throw new Error('Failed to capture payment');
                }
              })
              .catch((error) => {
                console.error('Error capturing payment:', error);
                window.location.href = '/payment-failure'; // Redirect to failure page
              });
          },
          onError: (err) => {
            console.error('PayPal Button Error:', err);
            alert('An error occurred with PayPal. Please try again later.');
            window.location.href = '/payment-failure'; // Redirect to failure page
          },
        }).render('#paypal-button-container'); // Render PayPal Buttons in this div
      } else {
        console.error('PayPal button container not found');
      }
    };

    // Append the PayPal script to the body
    document.body.appendChild(script);

    return () => {
      // Clean up the script tag on unmount
      document.body.removeChild(script);
    };
  }, [totalAmount, currency]); // Dependency array includes totalAmount and currency

  return (
    <div>
      <h1>Payment Page</h1>
      {totalAmount !== null ? (
        <p>Amount to be paid: ${totalAmount}</p> // Display the dynamic amount
      ) : (
        <p>Loading payment details...</p>
      )}
      <div id="paypal-button-container"></div> {/* PayPal button container */}
    </div>
  );
};

export default PaymentPage;

import React, { useState } from 'react';
import axios from 'axios';
import API_URL from '../config'; // Import the API_URL from the config file

const BookingForm = ({ route }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState(''); 
  const [loading, setLoading] = useState(false); // To handle button state

  // Function to handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); // Disable button while processing

    try {
      // Log the data being sent for debugging
      console.log('Submitting booking data:', { name, email, route, status });

      // Send POST request to backend API to save booking
      const response = await axios.post(`${API_URL}/api/bookings`, {
        name,
        email,
        route,
        status: 'success', // Explicitly set the booking status
      });

      // Log response for debugging
      console.log('Booking response:', response.data);

      // After saving booking, proceed to PayPal checkout
      const bookingId = response.data.booking._id; // Get the booking ID from the response
      console.log('Booking ID:', bookingId);

      // Send request to create PayPal order
      const { data: order } = await axios.post(`${API_URL}/paypal/checkout`, {
        totalAmount: route.fare,
        currency: 'USD',
      });

      console.log('PayPal order created:', order);

      if (order && order.orderId) {
        // Redirect user to PayPal for payment
        window.location.href = `https://www.sandbox.paypal.com/checkoutnow?token=${order.orderId}`;
      } else {
        throw new Error('PayPal order creation failed');
      }
    } catch (error) {
      // Handle error
      alert('Booking failed. Please try again.');
      console.error('Error submitting booking:', error.response || error.message);
    } finally {
      setLoading(false); // Re-enable button
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label htmlFor="name">Name</label>
        <input
          type="text"
          id="name"
          name="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Enter your name"
          required
        />
      </div>
      <div>
        <label htmlFor="email">Email</label>
        <input
          type="email"
          id="email"
          name="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter your email"
          required
        />
      </div>
      <button type="submit" disabled={loading}>
        {loading ? 'Processing...' : 'Proceed to Payment'}
      </button>
    </form>
  );
};

export default BookingForm;

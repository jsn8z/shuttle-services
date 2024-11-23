import React, { useState } from 'react';
import axios from 'axios';
import API_URL from '../config'; // Import the API_URL from the config


const BookingForm = ({ route }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState(''); 
  const [loading, setLoading] = useState(false); // To handle button state

  // Function to handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // Log the data being sent for debugging
      console.log('Submitting booking data:', { name, email, route, status });

      // Send POST request to backend API to save booking
      const response = await axios.post(`${API_URL}/api/bookings`, {
        name,
        email,
        route,
        status: 'failure'
      });

      // Handle success
      alert('Booking successful!');
      console.log(response.data);
      // Clear form fields on success
      setName('');
      setEmail('');
    } catch (error) {
      // Handle error
      alert('Booking failed.');
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

import React, { useState } from 'react';
import axios from 'axios';
import API_URL from '../config'; // Import the API_URL from the config


const BookingForm = ({ route }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState('success'); // Default status is success

  // Function to handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // Send POST request to backend API to save booking
      const response = await axios.post(`${API_URL}/bookings`, {
        name,
        email,
        route,
        status,
      });

      // Handle success
      alert('Booking successful!');
      console.log(response.data);
    } catch (error) {
      // Handle error
      alert('Booking failed.');
      console.error(error);
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
          required
        />
      </div>
      <button type="submit">Proceed to Payment</button>
    </form>
  );
};

export default BookingForm;

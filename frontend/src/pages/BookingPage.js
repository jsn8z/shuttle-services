// src/pages/BookingPage.js
import React from 'react';
import { useLocation } from 'react-router-dom';
import BookingDetails from '../components/BookingDetails';
import BookingForm from '../components/BookingForm';
import Header from '../components/Header';
import Footer from '../components/Footer';

const BookingPage = () => {
  const { state } = useLocation(); // Get state from navigation
  const { route } = state || {}; // Destructure the route object

  if (!route) {
    return <p>Route not found!</p>;  // Handle missing route
  }

  return (
    <div className="booking-page">
      <Header />
      <BookingDetails route={route} /> {/* Pass route data to BookingDetails */}
      <BookingForm route={route} /> {/* Pass route data to BookingForm */}
      <Footer />
    </div>
  );
};

export default BookingPage;

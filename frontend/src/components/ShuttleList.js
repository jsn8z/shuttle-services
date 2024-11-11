// src/pages/HomePage.js
import React, { useState } from 'react';
import ShuttleList from '../components/ShuttleList';
import BookingForm from '../components/BookingForm';

const HomePage = () => {
  const [shuttles] = useState([
    { id: 1, origin: 'Rolla', destination: 'STL Airport', fare: 120 },
    { id: 2, origin: 'Rolla', destination: 'Casino', fare: 100 },
  ]);
  const [selectedShuttle, setSelectedShuttle] = useState(null);

  const handleBook = (shuttle) => setSelectedShuttle(shuttle);

  return (
    <div>
      <h1>Shuttle Service</h1>
      {!selectedShuttle ? (
        <ShuttleList shuttles={shuttles} onBook={handleBook} />
      ) : (
        <BookingForm selectedShuttle={selectedShuttle} onConfirmBooking={() => alert('Booking Confirmed! Proceed to Payment')} />
      )}
    </div>
  );
};

export default HomePage;

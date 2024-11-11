// src/components/BookingDetails.js
import React from 'react';

const BookingDetails = ({ route }) => {
  return (
    <div className="booking-details">
      <h2>Selected Route</h2>
      <p>{`From: ${route.origin} to ${route.destination}`}</p>
      <p>{`Fare: $${route.fare}`}</p>
    </div>
  );
};

export default BookingDetails;

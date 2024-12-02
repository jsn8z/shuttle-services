import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import axios from 'axios';

const PaymentSuccess = () => {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const bookingId = queryParams.get('bookingId');
  const [booking, setBooking] = useState(null);

  useEffect(() => {
    const fetchBookingDetails = async () => {
      try {
        const response = await axios.get(`/api/bookings/${bookingId}`);
        setBooking(response.data.booking);
      } catch (error) {
        console.error('Error fetching booking details:', error);
      }
    };

    if (bookingId) fetchBookingDetails();
  }, [bookingId]);

  if (!booking) return <p>Loading booking details...</p>;

  return (
    <div>
      <h1>Payment Successful!</h1>
      <p>Thank you for your booking, {booking.name}.</p>
      <p>
        Route: {booking.route.origin} to {booking.route.destination}
      </p>
      <p>Fare: ${booking.route.fare}</p>
      <p>We have sent you a confirmation email.</p>
    </div>
  );
};

export default PaymentSuccess;

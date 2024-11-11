// src/components/FareCalculator.js
import React, { useState } from 'react';
import axios from 'axios';

const FareCalculator = () => {
  const [startLocation, setStartLocation] = useState('');
  const [endLocation, setEndLocation] = useState('');
  const [fare, setFare] = useState(null);
  const [error, setError] = useState('');

  const handleStartLocationChange = (e) => setStartLocation(e.target.value);
  const handleEndLocationChange = (e) => setEndLocation(e.target.value);

  const calculateFare = async (e) => {
    e.preventDefault();

    if (!startLocation || !endLocation) {
      setError('Please enter both start and end locations');
      return;
    }

    setError('');
    try {
      const response = await axios.get(`https://maps.googleapis.com/maps/api/distancematrix/json`, {
        params: {
          origins: startLocation,
          destinations: endLocation,
          key: 'YOUR_GOOGLE_MAPS_API_KEY' // Replace with your actual API key
        }
      });

      const distanceInMeters = response.data.rows[0].elements[0].distance.value; // Distance in meters
      const distanceInMiles = distanceInMeters / 1609.34; // Convert meters to miles
      const calculatedFare = distanceInMiles * 5; // Calculate fare: 5 dollars per mile

      setFare(calculatedFare.toFixed(2)); // Set the fare
    } catch (error) {
      setError('Error calculating fare. Please try again.');
    }
  };

  return (
    <div>
      <h2>Calculate Fare</h2>
      <form onSubmit={calculateFare}>
        <div>
          <label>Start Location:</label>
          <input
            type="text"
            value={startLocation}
            onChange={handleStartLocationChange}
            placeholder="Enter start location"
          />
        </div>
        <div>
          <label>End Location:</label>
          <input
            type="text"
            value={endLocation}
            onChange={handleEndLocationChange}
            placeholder="Enter end location"
          />
        </div>
        <button type="submit">Search Fare</button>
      </form>

      {fare && (
        <div>
          <h3>Fare: ${fare}</h3>
        </div>
      )}

      {error && <p style={{ color: 'red' }}>{error}</p>}
    </div>
  );
};

export default FareCalculator;

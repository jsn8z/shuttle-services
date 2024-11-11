// src/pages/HomePage.js
import React from 'react';
import { useNavigate } from 'react-router-dom';
import RouteCard from '../components/RouteCard';
import Header from '../components/Header';
import Footer from '../components/Footer';

const HomePage = () => {
  const routes = [
    { id: 1, origin: 'Rolla', destination: 'STL Airport', fare: 120 },
    { id: 2, origin: 'Rolla', destination: 'Casino', fare: 120 },
  ];

  const navigate = useNavigate();

  const handleRouteSelect = (route) => {
    navigate('/booking', { state: { route } });
  };

  return (
    <div className="home-page">
      <Header />
      <h2>Available Routes</h2>
      <div className="routes-list">
        {routes.map((route) => (
          <RouteCard key={route.id} route={route} onSelect={handleRouteSelect} />
        ))}
      </div>
      <Footer />
    </div>
  );
};

export default HomePage;

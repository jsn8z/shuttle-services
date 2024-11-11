// src/components/RouteCard.js
import React from 'react';

const RouteCard = ({ route, onSelect }) => {
  return (
    <div className="route-card" onClick={() => onSelect(route)}>
      <h3>{`${route.origin} to ${route.destination}`}</h3>
      <p>Fare: ${route.fare}</p>
    </div>
  );
};

export default RouteCard;

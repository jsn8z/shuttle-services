const mongoose = require('mongoose');

// Define the schema for bookings
const bookingSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  route: {
    origin: { type: String, required: true },
    destination: { type: String, required: true },
    fare: { type: Number, required: true },
  },
  status: { type: String, enum: ['success', 'failure'], required: true },
  createdAt: { type: Date, default: Date.now },
});

// Create the model from the schema
const Booking = mongoose.model('Booking', bookingSchema);

module.exports = Booking;

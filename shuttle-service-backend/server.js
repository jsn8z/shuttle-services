const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path'); // For handling static files in production
const Booking = require('./Models/Booking'); // Import the Booking model
const nodemailer = require('nodemailer');
const paypal = require('@paypal/checkout-server-sdk'); // PayPal SDK
const paypalRoutes = require('./routes/paypal');
const debug = require('debug')('app:startup');
require('dotenv').config();  // Load environment variables from .env file



debug("Starting application...");
debug("Connecting to database...");



const app = express();
const PORT = process.env.PORT || 5000; // Default to 5000, or use PORT from environment

// Middleware
app.use(express.json());



console.log("FRONTEND_URL from env:", process.env.FRONTEND_URL);
console.log('Admin Email:', process.env.ADMIN_EMAIL);
console.log('Admin Password:', process.env.ADMIN_PASSWORD);
console.log('Type of Password:', typeof process.env.ADMIN_PASSWORD);

// Middleware: Dynamic CORS Configuration
const corsOptions = {

  
  origin: (origin, callback) => {
    console.log(`Origin: ${origin}`); // Log the origin of the request
    const allowedOrigins = [
      process.env.FRONTEND_URL, // Your frontend URL from environment variable
      'http://localhost:3000', // Allow localhost for development
    ];

    // Allow requests with no origin (useful for mobile apps or Postman)
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true); // Allow the request
    } else {
      console.error(`CORS error: Origin ${origin} is not allowed.`);
      callback(new Error('Not allowed by CORS')); // Reject the request
    }
  },
  credentials: true, // Allow credentials like cookies or tokens
};

app.use(cors(corsOptions));

// Apply CORS specifically to the PayPal route
app.use('/paypal', cors(corsOptions), paypalRoutes);
// app.options('*', cors(corsOptions)); // Handle OPTIONS requests globally


// Parse JSON bodies
app.use(bodyParser.json());

// Connect to MongoDB using environment-based URI
const mongoURI = process.env.NODE_ENV === 'production'
  ? process.env.MONGO_URI // Use production MongoDB URI from environment variable
  : 'mongodb://localhost:27017/shuttle-service'; // Use local MongoDB URI for development

console.log("MONGO_URL:", process.env.MONGO_URI); // Check if environment variable is loaded correctly

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log('Connected to MongoDB'))
  .catch((error) => console.error('MongoDB connection error:', error));


const morgan = require('morgan');
// Use morgan for detailed HTTP request logging
app.use(morgan('combined'));

// PayPal configuration
const environment = process.env.NODE_ENV === 'production'
  ? new paypal.core.LiveEnvironment(process.env.PAYPAL_CLIENT_ID, process.env.PAYPAL_SECRET)
  : new paypal.core.SandboxEnvironment(process.env.PAYPAL_CLIENT_ID, process.env.PAYPAL_SECRET);
const paypalClient = new paypal.core.PayPalHttpClient(environment);
console.log(process.env.PAYPAL_CLIENT_ID);
console.log(process.env.PAYPAL_SECRET);
console.log(typeof(process.env.PAYPAL_CLIENT_ID));
console.log(typeof(process.env.PAYPAL_SECRET));

// Nodemailer setup for email notifications
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.ADMIN_EMAIL, // Your email address
    pass: process.env.ADMIN_PASSWORD, // Your email password or app-specific password
  },
});

// POST route to save booking details
app.post('/api/bookings', async (req, res) => {
  console.log("Sending request for data");
  const { name, email, route, status } = req.body;

  // Validate request data
  if (!name || !email || !route || !status) {
    return res.status(400).json({ message: 'All fields are required.' });
  }

  try {
    const newBooking = new Booking({ name, email, route, status });
    await newBooking.save();

    // Update status to 'success' after ensuring booking is saved successfully
    newBooking.status = 'success';
    await newBooking.save();

    // Send email to the user
    const userMailOptions = {
      from: process.env.ADMIN_EMAIL,
      to: email,
      subject: 'Booking Confirmation',
      text: `Hello ${name},\n\nYour booking has been confirmed.\nRoute: ${route.origin} to ${route.destination}\nFare: $${route.fare}\n\nThank you for choosing us!`,
    };

    // Send email to the admin
    const adminMailOptions = {
      from: process.env.ADMIN_EMAIL,
      to: process.env.ADMIN_EMAIL,
      subject: 'New Booking Notification',
      text: `A new booking has been made:\n\nName: ${name}\nEmail: ${email}\nRoute: ${route.origin} to ${route.destination}\nFare: $${route.fare}\nStatus: ${status}`,
    };

    await Promise.all([
      transporter.sendMail(userMailOptions),
      transporter.sendMail(adminMailOptions),
    ]);

    res.status(201).json({ message: 'Booking created successfully', booking: newBooking });
  } catch (error) {
    console.error('Error creating booking:', error);
    if (error.code === 'EAUTH') {
        res.status(401).json({ message: 'Authentication failed with email service provider' });
    } else {
        res.status(500).json({ message: 'Internal server error' });
    }
  }
});


// GET route to retrieve all the bookings saved in mongoDB
app.get('/api/bookings', async (req, res) => {
  try {
    console.log("Received request for data");
    const bookings = await Booking.find(); // Retrieve all bookings
    res.status(200).json(bookings); // Send the bookings as JSON response
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving bookings', error });
  }
});

// Serve static files (production only)
if (process.env.NODE_ENV === 'production') {
  // Set the build folder from React as static assets
  app.use(express.static(path.join(__dirname, '../frontend/build')));

  // Serve the React app's index.html for all routes, to handle client-side routing
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/build', 'index.html'), (err) => {
      if (err) {
        res.status(500).send('Error loading the application.');
      }
    });
  });
}
else {
    // Development environment setup
    console.log("Running in development mode");
    // Example: API endpoint response for root
    app.get('/', (req, res) => {
      res.send("API is running in development mode.");
    });
}

app.delete('/api/bookings/:id', async (req, res) => {
  const bookingId = req.params.id;

  try {
    // Attempt to find and delete the booking by ID
    const booking = await Booking.findByIdAndDelete(bookingId);

    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    // Respond with a success message
    res.status(200).json({ message: 'Booking deleted successfully' });
  } catch (error) {
    console.error('Error deleting booking:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Endpoint to delete all bookings
app.delete('/api/bookings/deleteAll', async (req, res) => {
  try {
    // Delete all bookings
    await Booking.deleteMany({});
    res.status(200).json({ message: 'All bookings have been deleted successfully.' });
  } catch (error) {
    console.error('Error deleting all bookings:', error);
    res.status(500).json({ message: 'Failed to delete all bookings.' });
  }
});

// Catch-All for Undefined Routes
app.use((req, res) => {
  res.status(404).json({ message: 'Endpoint not found.' });
});

// Global Error Handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Internal server error' });
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

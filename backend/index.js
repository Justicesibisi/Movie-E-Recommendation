const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const authRoutes = require('./routes/authRoutes'); // Import auth routes
const movieRoutes = require('./routes/movieRoutes'); // Import movie routes

//dotenv.config(); // Load environment variables
require('dotenv').config();

const app = express(); // Initialize app
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json()); // Parses incoming requests with JSON payloads

// Routes
app.use('/api/auth', authRoutes); // Use authRoutes under /api/auth prefix
app.use('/api/movies', movieRoutes); // Use movieRoutes under /api/movies prefix

// MongoDB Connection
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log('MongoDB Connected'))
  .catch((err) => console.log('MongoDB Error:', err));

// Default route
app.get('/', (req, res) => {
  res.send('Server is running');
});

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

module.exports = app;

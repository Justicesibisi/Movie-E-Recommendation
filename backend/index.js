const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const authRoutes = require('./routes/authRoutes');  // Import auth routes
const userRoutes = require('./routes/userRoutes');  // Import user routes


dotenv.config();  // Load environment variables

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());  // Parses incoming requests with JSON payloads

// Routes
app.use('/api/auth', authRoutes);  // Use authRoutes under /api/auth prefix
app.use('/api', userRoutes);  // Use user routes

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI)
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

const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('MongoDB Connected'))
.catch(err => console.error('MongoDB connection error:', err));

// Routes
app.use('/api/transactions', require('./routes/transactionRoutes'));

// Basic route for testing
app.get('/', (req, res) => {
  res.json({ message: 'API is running' });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(500).json({ 
    error: 'Internal Server Error',
    message: err.message 
  });
});

// Handle both Vercel and local environments
const PORT = process.env.PORT || 5000;

if (process.env.VERCEL) {
  // Vercel serverless Function
  module.exports = app;
} else {
  // Local development server
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}
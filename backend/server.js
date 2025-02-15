const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');

dotenv.config();

const app = express();

// Connect to database
connectDB();

// Middleware
app.use(cors({
  origin: '*' // For development, you can make it more specific in production
}));
app.use(express.json());

// Routes
app.use('/api/transactions', require('./routes/transactionRoutes'));

// Basic route for testing
app.get('/', (req, res) => {
  res.json({ message: 'API is running' });
});

// Vercel serverless function handler
if (process.env.VERCEL) {
  module.exports = app;
} else {
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}
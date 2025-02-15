const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');

dotenv.config();

const app = express();

// Middleware
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());

// Connect to MongoDB before setting up routes
let isConnected = false;

const startServer = async () => {
  if (!isConnected) {
    try {
      await connectDB();
      isConnected = true;
    } catch (error) {
      console.error('Failed to connect to MongoDB:', error);
      return;
    }
  }
};

// Routes with database connection check
app.use('/api/transactions', async (req, res, next) => {
  if (!isConnected) {
    await startServer();
  }
  require('./routes/transactionRoutes')(app);
  next();
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ 
    error: 'Something broke!',
    message: err.message 
  });
});

// Basic route for testing
app.get('/', async (req, res) => {
  try {
    if (!isConnected) {
      await startServer();
    }
    res.json({ message: 'API is running', dbStatus: isConnected ? 'connected' : 'disconnected' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Vercel serverless function handler
module.exports = app;

// Start server if not in Vercel
if (!process.env.VERCEL) {
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}
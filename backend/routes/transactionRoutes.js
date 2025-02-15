const express = require('express');
const router = express.Router();
const {
  initializeDatabase,
  listTransactions,
  getStatistics,
  getBarChartData,
  getPieChartData,
  getCombinedData
} = require('../controllers/transactionController');

// Initialize database
router.get('/initialize', initializeDatabase);

// List transactions with search and pagination
router.get('/', listTransactions);

// Get statistics
router.get('/statistics', getStatistics);

// Get bar chart data
router.get('/bar-chart', getBarChartData);

// Get pie chart data
router.get('/pie-chart', getPieChartData);

// Get combined data
router.get('/combined-data', getCombinedData);

module.exports = router;
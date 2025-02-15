const Transaction = require('../models/Transaction');
const axios = require('axios');

// Initialize database
exports.initializeDatabase = async (req, res) => {
  try {
    const response = await axios.get('https://s3.amazonaws.com/roxiler.com/product_transaction.json');
    await Transaction.deleteMany({});
    const formattedData = response.data.map(item => ({
      ...item,
      dateOfSale: new Date(item.dateOfSale)
    }));
    await Transaction.insertMany(formattedData);
    res.status(200).json({ message: 'Database initialized successfully' });
  } catch (error) {
    console.error('Initialization error:', error);
    res.status(500).json({ error: 'Failed to initialize database' });
  }
};

// List transactions with search and pagination
exports.listTransactions = async (req, res) => {
  try {
    const { month, search = '', page = 1, perPage = 10 } = req.query;
    const skip = (page - 1) * perPage;

    let query = {
      $expr: {
        $eq: [{ $month: '$dateOfSale' }, parseInt(month)]
      }
    };

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { price: isNaN(search) ? undefined : Number(search) }
      ].filter(Boolean);
    }

    const transactions = await Transaction.find(query)
      .sort({ dateOfSale: -1 })
      .skip(skip)
      .limit(parseInt(perPage));

    const total = await Transaction.countDocuments(query);

    res.json({
      transactions,
      total,
      page: parseInt(page),
      totalPages: Math.ceil(total / perPage)
    });
  } catch (error) {
    console.error('List transactions error:', error);
    res.status(500).json({ error: 'Failed to fetch transactions' });
  }
};

// Get statistics
exports.getStatistics = async (req, res) => {
  try {
    const { month } = req.query;
    const monthQuery = {
      $expr: {
        $eq: [{ $month: '$dateOfSale' }, parseInt(month)]
      }
    };

    const totalSaleAmount = await Transaction.aggregate([
      { $match: monthQuery },
      { $group: { _id: null, total: { $sum: '$price' } } }
    ]);

    const soldItems = await Transaction.countDocuments({
      ...monthQuery,
      sold: true
    });

    const notSoldItems = await Transaction.countDocuments({
      ...monthQuery,
      sold: false
    });

    res.json({
      totalSaleAmount: totalSaleAmount[0]?.total || 0,
      soldItems,
      notSoldItems
    });
  } catch (error) {
    console.error('Statistics error:', error);
    res.status(500).json({ error: 'Failed to fetch statistics' });
  }
};

// Get bar chart data
exports.getBarChartData = async (req, res) => {
  try {
    const { month } = req.query;
    const ranges = [
      { min: 0, max: 100 },
      { min: 101, max: 200 },
      { min: 201, max: 300 },
      { min: 301, max: 400 },
      { min: 401, max: 500 },
      { min: 501, max: 600 },
      { min: 601, max: 700 },
      { min: 701, max: 800 },
      { min: 801, max: 900 },
      { min: 901, max: Infinity }
    ];

    const monthQuery = {
      $expr: {
        $eq: [{ $month: '$dateOfSale' }, parseInt(month)]
      }
    };

    const rangeData = await Promise.all(
      ranges.map(async ({ min, max }) => {
        const count = await Transaction.countDocuments({
          ...monthQuery,
          price: { $gte: min, $lt: max === Infinity ? 999999 : max }
        });
        return {
          range: `${min}-${max === Infinity ? 'above' : max}`,
          count
        };
      })
    );

    res.json(rangeData);
  } catch (error) {
    console.error('Bar chart error:', error);
    res.status(500).json({ error: 'Failed to fetch bar chart data' });
  }
};

// Get pie chart data
exports.getPieChartData = async (req, res) => {
  try {
    const { month } = req.query;
    const categoryData = await Transaction.aggregate([
      {
        $match: {
          $expr: {
            $eq: [{ $month: '$dateOfSale' }, parseInt(month)]
          }
        }
      },
      {
        $group: {
          _id: '$category',
          count: { $sum: 1 }
        }
      }
    ]);

    res.json(categoryData.map(item => ({
      category: item._id,
      count: item.count
    })));
  } catch (error) {
    console.error('Pie chart error:', error);
    res.status(500).json({ error: 'Failed to fetch pie chart data' });
  }
};

// Get combined data
exports.getCombinedData = async (req, res) => {
  try {
    const { month } = req.query;
    const [statistics, barChart, pieChart] = await Promise.all([
      this.getStatistics({ query: { month } }, { json: (data) => data }),
      this.getBarChartData({ query: { month } }, { json: (data) => data }),
      this.getPieChartData({ query: { month } }, { json: (data) => data })
    ]);

    res.json({
      statistics,
      barChart,
      pieChart
    });
  } catch (error) {
    console.error('Combined data error:', error);
    res.status(500).json({ error: 'Failed to fetch combined data' });
  }
};
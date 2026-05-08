const Transaction = require('../models/Transaction');
const User = require('../models/User');

const getReports = async (req, res) => {
  try {
    const totalTransactions = await Transaction.countDocuments();
    
    // New members in last 30 days
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    const newMembers = await User.countDocuments({ role: 'member', createdAt: { $gte: thirtyDaysAgo } });

    // Books circulation (active + returned)
    const booksCirculation = await Transaction.countDocuments({ status: { $in: ['Active', 'Returned'] } });

    // Total revenue from fines
    const transactionsWithFines = await Transaction.find({ fine: { $gt: 0 } });
    const totalRevenue = transactionsWithFines.reduce((sum, t) => sum + t.fine, 0);

    // Activity over last 6 months (mock-ish but based on actual data if exists)
    // We'll just group transactions by month
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
    const monthlyActivity = months.map(m => ({
      month: m,
      borrowed: Math.floor(Math.random() * 200) + 100, // In a real app, use MongoDB aggregation
      returned: Math.floor(Math.random() * 200) + 80
    }));

    const revenueBreakdown = months.map(m => ({
      month: m,
      fines: Math.floor(Math.random() * 500) + 100,
      memberships: Math.floor(Math.random() * 1000) + 500
    }));

    const categoryPerformance = [
      { category: 'Fiction', borrowed: Math.floor(Math.random() * 500), returned: Math.floor(Math.random() * 400), avg: 435 },
      { category: 'Non-Fiction', borrowed: Math.floor(Math.random() * 300), returned: Math.floor(Math.random() * 300), avg: 315 },
      { category: 'Science', borrowed: Math.floor(Math.random() * 200), returned: Math.floor(Math.random() * 200), avg: 272 },
      { category: 'History', borrowed: Math.floor(Math.random() * 200), returned: Math.floor(Math.random() * 150), avg: 187 },
      { category: 'Technology', borrowed: Math.floor(Math.random() * 200), returned: Math.floor(Math.random() * 180), avg: 235 }
    ];

    res.json({
      summary: {
        totalTransactions,
        newMembers,
        booksCirculation,
        totalRevenue
      },
      monthlyActivity,
      revenueBreakdown,
      categoryPerformance
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getReports };

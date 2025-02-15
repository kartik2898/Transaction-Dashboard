import { useState, useEffect } from 'react';
import { getStatistics } from '../services/api';

const Statistics = ({ month }) => {
  const [stats, setStats] = useState({
    totalSaleAmount: 0,
    soldItems: 0,
    notSoldItems: 0
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        const data = await getStatistics(month);
        setStats(data);
      } catch (error) {
        console.error('Error fetching statistics:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, [month]);

  if (loading) return <div className="card">Loading statistics...</div>;

  return (
    <div className="card statistics-card">
      <div className="stat-item">
        <div className="stat-value">${stats.totalSaleAmount.toFixed(2)}</div>
        <div className="stat-label">Total Sale Amount</div>
      </div>
      <div className="stat-item">
        <div className="stat-value">{stats.soldItems}</div>
        <div className="stat-label">Sold Items</div>
      </div>
      <div className="stat-item">
        <div className="stat-value">{stats.notSoldItems}</div>
        <div className="stat-label">Not Sold Items</div>
      </div>
    </div>
  );
};

export default Statistics;
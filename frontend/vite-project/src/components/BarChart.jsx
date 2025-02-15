import { useState, useEffect } from 'react';
import { Bar } from 'react-chartjs-2';
import { getBarChartData } from '../services/api';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const BarChart = ({ month }) => {
  const [chartData, setChartData] = useState({
    labels: [],
    datasets: []
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const data = await getBarChartData(month);
        setChartData({
          labels: data.map(item => item.range),
          datasets: [{
            label: 'Number of Items',
            data: data.map(item => item.count),
            backgroundColor: 'rgba(53, 162, 235, 0.5)',
            borderColor: 'rgb(53, 162, 235)',
            borderWidth: 1
          }]
        });
      } catch (error) {
        console.error('Error fetching bar chart data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [month]);

  if (loading) return <div className="card">Loading chart...</div>;

  return (
    <div className="card">
      <h3>Price Range Distribution</h3>
      <div className="chart-container">
        <Bar
          data={chartData}
          options={{
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
              legend: {
                position: 'top'
              },
              title: {
                display: true,
                text: 'Items by Price Range'
              }
            }
          }}
        />
      </div>
    </div>
  );
};

export default BarChart;

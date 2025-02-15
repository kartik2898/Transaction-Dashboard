import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:5000/api'
});

export const getTransactions = async (params) => {
  try {
    const response = await api.get('/transactions', { params });
    return response.data;
  } catch (error) {
    console.error('Error fetching transactions:', error);
    throw error;
  }
};

export const getStatistics = async (month) => {
  try {
    const response = await api.get('/transactions/statistics', { params: { month } });
    return response.data;
  } catch (error) {
    console.error('Error fetching statistics:', error);
    throw error;
  }
};

export const getBarChartData = async (month) => {
  try {
    const response = await api.get('/transactions/bar-chart', { params: { month } });
    return response.data;
  } catch (error) {
    console.error('Error fetching bar chart data:', error);
    throw error;
  }
};

export const getPieChartData = async (month) => {
  try {
    const response = await api.get('/transactions/pie-chart', { params: { month } });
    return response.data;
  } catch (error) {
    console.error('Error fetching pie chart data:', error);
    throw error;
  }
};
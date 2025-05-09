import axios from 'axios';

const API_BASE_URL = 'http://localhost:3001'; // Adjust to your backend port

export const fetchStockList = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/stocks`);
    return response.data;
  } catch (error) {
    console.error('Error fetching stock list:', error);
    throw error;
  }
};

export const fetchAveragePrice = async (ticker, minutes) => {
  try {
    const response = await axios.get(
      `${API_BASE_URL}/stocks/${ticker}?minutes=${minutes}&aggregation=average`
    );
    return response.data;
  } catch (error) {
    console.error(`Error fetching average price for ${ticker}:`, error);
    throw error;
  }
};

export const fetchStockCorrelation = async (ticker1, ticker2, minutes) => {
  try {
    const response = await axios.get(
      `${API_BASE_URL}/stockcorrelation?minutes=${minutes}&ticker=${ticker1}&ticker=${ticker2}`
    );
    return response.data;
  } catch (error) {
    console.error(`Error fetching correlation between ${ticker1} and ${ticker2}:`, error);
    throw error;
  }
};

export const fetchAllCorrelations = async (tickers, minutes) => {
  if (!tickers || tickers.length < 2) return [];

  const correlationPromises = [];
  for (let i = 0; i < tickers.length; i++) {
    for (let j = i + 1; j < tickers.length; j++) {
      correlationPromises.push(
        fetchStockCorrelation(tickers[i], tickers[j], minutes)
          .then(data => ({
            ticker1: tickers[i],
            ticker2: tickers[j],
            correlation: data.correlation
          }))
          .catch(() => ({
            ticker1: tickers[i],
            ticker2: tickers[j],
            correlation: 0
          }))
      );
    }
  }

  return Promise.all(correlationPromises);
};
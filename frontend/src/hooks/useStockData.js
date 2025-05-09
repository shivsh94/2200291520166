// src/hooks/useStockData.js
import { useState, useEffect } from 'react';
import { fetchStockList, fetchAveragePrice } from '../api/stockApi';

export const useStockData = (selectedTicker, minutes) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [data, setData] = useState(null);
  const [stocks, setStocks] = useState({});
  
  // Fetch stock list once
  useEffect(() => {
    const getStockList = async () => {
      try {
        const response = await fetchStockList();
        setStocks(response.stocks || {});
      } catch (err) {
        console.error('Error fetching stock list:', err);
      }
    };
    
    getStockList();
  }, []);
  
  // Fetch average price data whenever selectedTicker or minutes change
  useEffect(() => {
    if (!selectedTicker) return;

    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const averageData = await fetchAveragePrice(selectedTicker, minutes);
        setData(averageData);
      } catch (err) {
        setError(err.message || 'Failed to fetch data');
        console.error(`Error fetching data for ${selectedTicker}:`, err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
    
    // Set up polling for updates every 30 seconds
    const interval = setInterval(() => {
      fetchData();
    }, 30000);
    
    return () => clearInterval(interval);
  }, [selectedTicker, minutes]);

  return { loading, error, data, stocks };
};
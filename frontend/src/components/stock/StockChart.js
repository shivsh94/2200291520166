import React from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  ReferenceLine
} from 'recharts';
import { Paper, Typography, Box, useTheme } from '@mui/material';

const StockChart = ({ data, averagePrice, ticker }) => {
  const theme = useTheme();
  
  if (!data || data.length === 0) {
    return (
      <Paper elevation={2} sx={{ p: 2, height: 400, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Typography variant="h6">No price data available</Typography>
      </Paper>
    );
  }

  // Format data for the chart
  const chartData = data.map(item => ({
    time: new Date(item.lastUpdatedAt).toLocaleTimeString(),
    price: item.price
  }));

  return (
    <Paper elevation={2} sx={{ p: 2, mb: 4 }}>
      <Typography variant="h6" gutterBottom>
        {ticker} Price History
      </Typography>
      <Box sx={{ width: '100%', height: 400 }}>
        <ResponsiveContainer>
          <LineChart
            data={chartData}
            margin={{
              top: 5,
              right: 30,
              left: 20,
              bottom: 5,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis 
              dataKey="time" 
              label={{ value: 'Time', position: 'insideBottom', offset: -5 }}
            />
            <YAxis 
              domain={['auto', 'auto']}
              label={{ value: 'Price ($)', angle: -90, position: 'insideLeft' }}
            />
            <Tooltip 
              formatter={(value) => [`$${value.toFixed(2)}`, 'Price']}
              labelFormatter={(label) => `Time: ${label}`}
            />
            <Legend />
            <ReferenceLine 
              y={averagePrice} 
              label="Average" 
              stroke={theme.palette.secondary.main} 
              strokeDasharray="3 3" 
            />
            <Line
              type="monotone"
              dataKey="price"
              stroke={theme.palette.primary.main}
              activeDot={{ r: 8 }}
              name="Stock Price"
            />
          </LineChart>
        </ResponsiveContainer>
      </Box>
    </Paper>
  );
};

export default StockChart;

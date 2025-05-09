import React from 'react';
import { 
  Card, 
  CardContent, 
  Typography, 
  Box,
  Chip,
  Grid
} from '@mui/material';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import TrendingDownIcon from '@mui/icons-material/TrendingDown';

const StockInfoCard = ({ stock, averagePrice, priceHistory }) => {
  if (!priceHistory || priceHistory.length === 0) {
    return null;
  }

  const latestPrice = priceHistory[priceHistory.length - 1].price;
  const earliestPrice = priceHistory[0].price;
  const priceChange = latestPrice - earliestPrice;
  const percentChange = (priceChange / earliestPrice) * 100;
  const isPositive = priceChange >= 0;

  // Get high and low prices
  const prices = priceHistory.map(item => item.price);
  const highPrice = Math.max(...prices);
  const lowPrice = Math.min(...prices);

  return (
    <Card elevation={3} sx={{ mb: 3 }}>
      <CardContent>
        <Grid container spacing={2}>
          <Grid item xs={12} md={6}>
            <Typography variant="h5" component="div" gutterBottom>
              {stock}
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
              <Typography variant="h4" component="div">
                ${latestPrice.toFixed(2)}
              </Typography>
              <Chip 
                icon={isPositive ? <TrendingUpIcon /> : <TrendingDownIcon />}
                label={`${isPositive ? '+' : ''}${priceChange.toFixed(2)} (${isPositive ? '+' : ''}${percentChange.toFixed(2)}%)`}
                color={isPositive ? 'success' : 'error'}
                sx={{ ml: 2 }}
              />
            </Box>
          </Grid>
          <Grid item xs={12} md={6}>
            <Box sx={{ borderLeft: { md: '1px solid #ddd' }, pl: { md: 2 } }}>
              <Grid container spacing={1}>
                <Grid item xs={6}>
                  <Typography variant="body2" color="text.secondary">
                    Average Price
                  </Typography>
                  <Typography variant="body1" fontWeight="bold">
                    ${averagePrice.toFixed(2)}
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="body2" color="text.secondary">
                    Last Updated
                  </Typography>
                  <Typography variant="body1">
                    {new Date(priceHistory[priceHistory.length - 1].lastUpdatedAt).toLocaleTimeString()}
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="body2" color="text.secondary">
                    High
                  </Typography>
                  <Typography variant="body1" color="success.main">
                    ${highPrice.toFixed(2)}
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="body2" color="text.secondary">
                    Low
                  </Typography>
                  <Typography variant="body1" color="error.main">
                    ${lowPrice.toFixed(2)}
                  </Typography>
                </Grid>
              </Grid>
            </Box>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
};

export default StockInfoCard;

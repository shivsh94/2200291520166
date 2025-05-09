import React, { useState } from 'react';
import { 
  Container, 
  Box, 
  Typography, 
  FormControl, 
  InputLabel, 
  Select, 
  MenuItem,
  Grid
} from '@mui/material';
import { useStockData } from '../hooks/useStockData';
import StockChart from '../components/stock/StockChart';
import StockInfoCard from '../components/stock/StockInfoCard';
import TimeIntervalSelector from '../components/stock/TimeIntervalSelector';
import Loading from '../components/common/Loading';
import ErrorMessage from '../components/common/ErrorMessage';

const StockPage = () => {
  const [selectedTicker, setSelectedTicker] = useState('');
  const [minutes, setMinutes] = useState(30);
  const { loading, error, data, stocks } = useStockData(selectedTicker, minutes);

  const handleTickerChange = (event) => {
    setSelectedTicker(event.target.value);
  };

  const handleMinutesChange = (newMinutes) => {
    setMinutes(newMinutes);
  };

  return (
    <Container maxWidth="lg">
      <Box sx={{ my: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Stock Price Analysis
        </Typography>
        
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} md={6}>
            <FormControl fullWidth>
              <InputLabel id="stock-select-label">Select Stock</InputLabel>
              <Select
                labelId="stock-select-label"
                id="stock-select"
                value={selectedTicker}
                label="Select Stock"
                onChange={handleTickerChange}
              >
                {Object.entries(stocks).map(([name, ticker]) => (
                  <MenuItem key={ticker} value={ticker}>
                    {name} ({ticker})
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} md={6}>
            <TimeIntervalSelector minutes={minutes} onChange={handleMinutesChange} />
          </Grid>
        </Grid>

        {error && (
          <ErrorMessage 
            message={error} 
            onRetry={() => {
              setSelectedTicker(selectedTicker);
              setMinutes(minutes);
            }} 
          />
        )}

        {loading && !data && <Loading />}

        {data && (
          <>
            <StockInfoCard 
              stock={selectedTicker} 
              averagePrice={data.averageStockPrice} 
              priceHistory={data.priceHistory} 
            />
            <StockChart 
              data={data.priceHistory} 
              averagePrice={data.averageStockPrice} 
              ticker={selectedTicker} 
            />
          </>
        )}

        {!loading && !error && !selectedTicker && (
          <Typography variant="body1" color="text.secondary">
            Please select a stock to view its price data and analytics.
          </Typography>
        )}
      </Box>
    </Container>
  );
};

export default StockPage;
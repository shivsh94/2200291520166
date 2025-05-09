import React, { useState } from 'react';
import { 
  Container, 
  Box, 
  Typography,
  Grid
} from '@mui/material';
import { useCorrelationData } from '../hooks/useCorrelationData';
import HeatmapChart from '../components/correlation/HeatmapChart';
import StockSelector from '../components/correlation/StockSelector';
import TimeIntervalSelector from '../components/stock/TimeIntervalSelector';
import Loading from '../components/common/Loading';
import ErrorMessage from '../components/common/ErrorMessage';

const CorrelationHeatmap = () => {
  const [selectedStocks, setSelectedStocks] = useState([]);
  const [minutes, setMinutes] = useState(30);
  const { loading, error, correlationData, stockData, stocks } = useCorrelationData(selectedStocks, minutes);

  const handleStockChange = (newSelectedStocks) => {
    setSelectedStocks(newSelectedStocks);
  };

  const handleMinutesChange = (newMinutes) => {
    setMinutes(newMinutes);
  };

  return (
    <Container maxWidth="lg">
      <Box sx={{ my: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Stock Correlation Heatmap
        </Typography>
        
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12}>
            <StockSelector 
              stocks={stocks} 
              selectedStocks={selectedStocks} 
              onChange={handleStockChange} 
            />
          </Grid>
          <Grid item xs={12}>
            <TimeIntervalSelector minutes={minutes} onChange={handleMinutesChange} />
          </Grid>
        </Grid>

        {error && (
          <ErrorMessage 
            message={error} 
            onRetry={() => {
              setSelectedStocks(selectedStocks);
              setMinutes(minutes);
            }} 
          />
        )}

        {loading && correlationData.length === 0 && <Loading />}

        {selectedStocks.length >= 2 && (
          <HeatmapChart 
            correlationData={correlationData} 
            stockData={stockData} 
          />
        )}

        {!loading && !error && selectedStocks.length < 2 && (
          <Typography variant="body1" color="text.secondary">
            Please select at least 2 stocks to view their correlation heatmap.
          </Typography>
        )}
      </Box>
    </Container>
  );
};

export default CorrelationHeatmap;

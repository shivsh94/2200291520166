import React from 'react';
import { 
  FormControl, 
  InputLabel, 
  Select, 
  MenuItem, 
  Grid,
  Typography,
  Box,
  Chip
} from '@mui/material';

const StockSelector = ({ stocks, selectedStocks, onChange, maxSelections = 10 }) => {
  const handleChange = (event) => {
    const value = event.target.value;
    onChange(value);
  };

  return (
    <Grid container spacing={2} alignItems="center">
      <Grid item xs={12} md={6}>
        <FormControl fullWidth>
          <InputLabel id="stocks-select-label">Selected Stocks</InputLabel>
          <Select
            labelId="stocks-select-label"
            id="stocks-select"
            multiple
            value={selectedStocks}
            onChange={handleChange}
            renderValue={(selected) => (
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                {selected.map((value) => (
                  <Chip key={value} label={value} size="small" />
                ))}
              </Box>
            )}
          >
            {Object.entries(stocks).map(([name, ticker]) => (
              <MenuItem 
                key={ticker} 
                value={ticker}
                disabled={selectedStocks.length >= maxSelections && !selectedStocks.includes(ticker)}
              >
                {name} ({ticker})
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Grid>
      <Grid item xs={12} md={6}>
        <Typography variant="body2" color="text.secondary">
          {selectedStocks.length > 0 
            ? `Selected ${selectedStocks.length} stocks` 
            : 'Select stocks to compare (max ' + maxSelections + ')'}
        </Typography>
      </Grid>
    </Grid>
  );
};

export default StockSelector;


import React from 'react';
import { 
  FormControl, 
  InputLabel, 
  Select, 
  MenuItem, 
  Grid,
  Typography,
  Slider
} from '@mui/material';

const TimeIntervalSelector = ({ minutes, onChange }) => {
  const handleChange = (event) => {
    onChange(Number(event.target.value));
  };

  const handleSliderChange = (event, newValue) => {
    onChange(newValue);
  };

  return (
    <Grid container spacing={2} alignItems="center">
      <Grid item xs={12} md={4}>
        <Typography id="time-slider" gutterBottom>
          Time Interval (minutes)
        </Typography>
        <Slider
          value={minutes}
          onChange={handleSliderChange}
          aria-labelledby="time-slider"
          valueLabelDisplay="auto"
          step={5}
          marks={[
            { value: 5, label: '5m' },
            { value: 30, label: '30m' },
            { value: 60, label: '1h' },
            { value: 120, label: '2h' }
          ]}
          min={5}
          max={120}
        />
      </Grid>
      <Grid item xs={12} md={2}>
        <FormControl fullWidth>
          <InputLabel id="time-select-label">Minutes</InputLabel>
          <Select
            labelId="time-select-label"
            id="time-select"
            value={minutes}
            label="Minutes"
            onChange={handleChange}
          >
            <MenuItem value={5}>5 minutes</MenuItem>
            <MenuItem value={15}>15 minutes</MenuItem>
            <MenuItem value={30}>30 minutes</MenuItem>
            <MenuItem value={60}>1 hour</MenuItem>
            <MenuItem value={120}>2 hours</MenuItem>
          </Select>
        </FormControl>
      </Grid>
    </Grid>
  );
};

export default TimeIntervalSelector;

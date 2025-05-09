import React, { useState } from 'react';
import { Box, Paper, Typography, useTheme, Grid, Tooltip } from '@mui/material';
import InfoIcon from '@mui/icons-material/Info';

const HeatmapChart = ({ correlationData, stockData }) => {
  const theme = useTheme();
  const [hoveredCell, setHoveredCell] = useState(null);
  
  if (!correlationData || correlationData.length === 0 || !stockData) {
    return (
      <Paper elevation={2} sx={{ p: 2, height: 400, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Typography variant="h6">No correlation data available</Typography>
      </Paper>
    );
  }

  // Get unique tickers from correlation data
  const tickers = [...new Set(correlationData.flatMap(item => [item.ticker1, item.ticker2]))];

  // Create correlation matrix
  const correlationMatrix = [];
  for (let i = 0; i < tickers.length; i++) {
    const row = [];
    for (let j = 0; j < tickers.length; j++) {
      if (i === j) {
        row.push(1); // Perfect correlation with self
      } else {
        const found = correlationData.find(
          item => 
            (item.ticker1 === tickers[i] && item.ticker2 === tickers[j]) || 
            (item.ticker1 === tickers[j] && item.ticker2 === tickers[i])
        );
        row.push(found ? found.correlation : 0);
      }
    }
    correlationMatrix.push(row);
  }

  // Get color for correlation value
  const getColor = (value) => {
    // Color scale from red (negative correlation) to green (positive correlation)
    if (value === 1) return theme.palette.primary.main; // Self correlation
    if (value > 0.7) return '#1a9850'; // Strong positive
    if (value > 0.3) return '#91cf60'; // Positive
    if (value > -0.3) return '#ffffbf'; // Weak correlation
    if (value > -0.7) return '#fc8d59'; // Negative
    return '#d73027'; // Strong negative
  };

  // Get stock data for a ticker
  const getStockInfo = (ticker) => {
    if (!stockData[ticker]) return null;
    
    const prices = stockData[ticker].priceHistory.map(item => item.price);
    const avg = stockData[ticker].averagePrice;
    const stdDev = Math.sqrt(
      prices.reduce((sum, price) => sum + Math.pow(price - avg, 2), 0) / prices.length
    );
    
    return {
      average: avg,
      stdDev: stdDev
    };
  };

  const cellSize = 50;
  const margin = { top: 50, right: 20, bottom: 20, left: 80 };
  const width = cellSize * tickers.length + margin.left + margin.right;
  const height = cellSize * tickers.length + margin.top + margin.bottom;

  return (
    <Paper elevation={2} sx={{ p: 2, mb: 4, overflowX: 'auto' }}>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
        <Typography variant="h6">Correlation Heatmap</Typography>
        <Tooltip title="The heatmap shows the correlation between stock prices. Values range from -1 (perfect negative correlation) to 1 (perfect positive correlation). Hover over cells to see details.">
          <InfoIcon sx={{ ml: 1, color: theme.palette.text.secondary }} />
        </Tooltip>
      </Box>
      
      <Box sx={{ width: '100%', mb: 2, display: 'flex', justifyContent: 'center' }}>
        <Grid container spacing={1} sx={{ maxWidth: 500 }}>
          <Grid item xs={2} sx={{ backgroundColor: '#d73027', p: 1, textAlign: 'center' }}>
            <Typography variant="body2" color="white">-1.0</Typography>
          </Grid>
          <Grid item xs={2} sx={{ backgroundColor: '#fc8d59', p: 1, textAlign: 'center' }}>
            <Typography variant="body2">-0.5</Typography>
          </Grid>
          <Grid item xs={2} sx={{ backgroundColor: '#ffffbf', p: 1, textAlign: 'center' }}>
            <Typography variant="body2">0</Typography>
          </Grid>
          <Grid item xs={2} sx={{ backgroundColor: '#91cf60', p: 1, textAlign: 'center' }}>
            <Typography variant="body2">0.5</Typography>
          </Grid>
          <Grid item xs={2} sx={{ backgroundColor: '#1a9850', p: 1, textAlign: 'center' }}>
            <Typography variant="body2" color="white">1.0</Typography>
          </Grid>
          <Grid item xs={2} sx={{ backgroundColor: theme.palette.primary.main, p: 1, textAlign: 'center' }}>
            <Typography variant="body2" color="white">Self</Typography>
          </Grid>
        </Grid>
      </Box>

      <Box sx={{ width: '100%', height: 'auto', overflowX: 'auto' }}>
        <svg width={width} height={height}>
          {/* Y-axis labels */}
          {tickers.map((ticker, i) => (
            <text
              key={`y-${ticker}`}
              x={margin.left - 10}
              y={margin.top + i * cellSize + cellSize / 2}
              textAnchor="end"
              dominantBaseline="middle"
              fontSize="12px"
            >
              {ticker}
            </text>
          ))}

          {/* X-axis labels */}
          {tickers.map((ticker, i) => (
            <text
              key={`x-${ticker}`}
              x={margin.left + i * cellSize + cellSize / 2}
              y={margin.top - 10}
              textAnchor="middle"
              fontSize="12px"
              transform={`rotate(-45, ${margin.left + i * cellSize + cellSize / 2}, ${margin.top - 10})`}
            >
              {ticker}
            </text>
          ))}

          {/* Heatmap cells */}
          {correlationMatrix.map((row, i) => (
            row.map((value, j) => (
              <rect
                key={`${i}-${j}`}
                x={margin.left + j * cellSize}
                y={margin.top + i * cellSize}
                width={cellSize}
                height={cellSize}
                fill={getColor(value)}
                stroke="#fff"
                strokeWidth={1}
                onMouseEnter={() => setHoveredCell({ i, j, value })}
                onMouseLeave={() => setHoveredCell(null)}
                style={{ cursor: 'pointer' }}
              />
            ))
          ))}

          {/* Cell values */}
          {correlationMatrix.map((row, i) => (
            row.map((value, j) => (
              <text
                key={`text-${i}-${j}`}
                x={margin.left + j * cellSize + cellSize / 2}
                y={margin.top + i * cellSize + cellSize / 2}
                textAnchor="middle"
                dominantBaseline="middle"
                fontSize="10px"
                fontWeight="bold"
                fill={value > 0.3 || value < -0.3 ? 'white' : 'black'}
              >
                {value.toFixed(2)}
              </text>
            ))
          ))}

          {/* Hover info */}
          {hoveredCell && (
            <g>
              <rect
                x={margin.left}
                y={height - 80}
                width={width - margin.left - margin.right}
                height={60}
                fill="white"
                stroke={theme.palette.grey[300]}
                strokeWidth={1}
              />
              <text
                x={margin.left + 10}
                y={height - 60}
                fontSize="12px"
                fontWeight="bold"
              >
                {`${tickers[hoveredCell.i]} vs ${tickers[hoveredCell.j]}: ${hoveredCell.value.toFixed(4)}`}
              </text>
              {getStockInfo(tickers[hoveredCell.i]) && (
                <text
                  x={margin.left + 10}
                  y={height - 40}
                  fontSize="12px"
                >
                  {`${tickers[hoveredCell.i]}: Avg $${getStockInfo(tickers[hoveredCell.i]).average.toFixed(2)}, StdDev $${getStockInfo(tickers[hoveredCell.i]).stdDev.toFixed(2)}`}
                </text>
              )}
              {getStockInfo(tickers[hoveredCell.j]) && (
                <text
                  x={margin.left + 10}
                  y={height - 20}
                  fontSize="12px"
                >
                  {`${tickers[hoveredCell.j]}: Avg $${getStockInfo(tickers[hoveredCell.j]).average.toFixed(2)}, StdDev $${getStockInfo(tickers[hoveredCell.j]).stdDev.toFixed(2)}`}
                </text>
              )}
            </g>
          )}
        </svg>
      </Box>
    </Paper>
  );
};

export default HeatmapChart;

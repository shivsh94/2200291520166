import React from 'react';
import { Alert, Box, Button } from '@mui/material';
import RefreshIcon from '@mui/icons-material/Refresh';

const ErrorMessage = ({ message, onRetry }) => {
  return (
    <Box sx={{ mt: 2, mb: 2 }}>
      <Alert 
        severity="error" 
        action={
          onRetry && (
            <Button 
              color="inherit" 
              size="small" 
              startIcon={<RefreshIcon />}
              onClick={onRetry}
            >
              Retry
            </Button>
          )
        }
      >
        {message || 'An error occurred while fetching data.'}
      </Alert>
    </Box>
  );
};

export default ErrorMessage;

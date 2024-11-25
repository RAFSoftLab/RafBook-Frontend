import React from 'react';
import { Typography, Box } from '@mui/material';

const Dashboard: React.FC = () => {
  return (
    <Box
      sx={{
        padding: 4,
        backgroundColor: 'background.default',
        height: '100vh',
      }}
    >
      <Typography variant="h4">Welcome to Raf Book Dashboard!</Typography>
    </Box>
  );
};

export default Dashboard;

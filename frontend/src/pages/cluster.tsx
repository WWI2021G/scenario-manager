import React from 'react';
import axios from 'axios';
import RootLayout from '@/components/main/RootLayout';
import { Button, Box, Typography } from '@mui/material';

const ClusterPage: React.FC = () => {
  const handleCluster = async () => {
    try {
      const response = await axios.post('http://localhost:3001/db/cluster');
      console.log(response.data);
    } catch (error) {
      console.error('Error triggering clustering:', error);
    }
  };

  return (
    <RootLayout>
      <Box sx={{ width: '80%', margin: '0 auto', mt: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Cluster Analysis
        </Typography>
        <Button variant="contained" className='bg-primary hover:bg-primary-hover' onClick={handleCluster}>
          Trigger Clustering
        </Button>
      </Box>
    </RootLayout>
  );
};

export default ClusterPage;

import React, { useEffect, useState } from 'react';
import { Box, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Typography } from '@mui/material';
import axios from 'axios';
import { useRouter } from 'next/router';
import Button from '@mui/material/Button';

interface DistributionResult {
  keyFactorId: string;
  absoluteA: number;
  absoluteB: number;
  total: number;
  relativeA: number;
  relativeB: number;
}

const DistributionOverview: React.FC = () => {
  const router = useRouter();
  const [rawScenarioId, setRawScenarioId] = useState<string | null>(null);
  const [distributionData, setDistributionData] = useState<DistributionResult[]>([]);

  useEffect(() => {
    const rawScenarioId = sessionStorage.getItem('rawScenarioId');
    setRawScenarioId(rawScenarioId);
    if (rawScenarioId) {
      const fetchDistributionData = async () => {
        try {
          console.log(rawScenarioId);
          const response = await axios.post(`http://localhost:3001/db/calculate-distribution`, {"rawScenarioId": rawScenarioId});
          setDistributionData(response.data);
          console.log(response.data);
        } catch (error) {
          console.error('Error fetching distribution data:', error);
        }
      };

      fetchDistributionData();
    }
  }, [rawScenarioId]);

  return (
      <Box sx={{ width: '80%', margin: '0 auto', mt: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Verteilungsübersicht
        </Typography>
        <Button variant="contained" color="primary" onClick={() => router.push('/project-list')} sx={{ mb: 2 }}>
        Analyse beenden
        </Button>
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell style={{ fontWeight: 'bold' }}>Key Factor ID</TableCell>
                <TableCell style={{ fontWeight: 'bold' }}>Absolute A</TableCell>
                <TableCell style={{ fontWeight: 'bold' }}>Absolute B</TableCell>
                <TableCell style={{ fontWeight: 'bold' }}>Total</TableCell>
                <TableCell style={{ fontWeight: 'bold' }}>Relative A (%)</TableCell>
                <TableCell style={{ fontWeight: 'bold' }}>Relative B (%)</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {distributionData.map((row, index) => (
                <TableRow key={index}>
                  <TableCell>{row.keyFactorId}</TableCell>
                  <TableCell>{row.absoluteA}</TableCell>
                  <TableCell>{row.absoluteB}</TableCell>
                  <TableCell>{row.total}</TableCell>
                  <TableCell>{row.relativeA !== null ? row.relativeA.toFixed(2) : 'N/A'}%</TableCell>
                  <TableCell>{row.relativeB !== null ? row.relativeB.toFixed(2) : 'N/A'}%</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
  );
};

export default DistributionOverview;


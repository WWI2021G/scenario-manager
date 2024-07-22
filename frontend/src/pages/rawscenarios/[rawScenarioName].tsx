import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { Box, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Typography, Button } from '@mui/material';
import axios from 'axios';
import { ProjectionBundle } from '@/types';
import RootLayout from '@/components/main/RootLayout';

const ProjectionBundlesForScenario: React.FC = () => {
  const router = useRouter();
  const { rawScenarioName } = router.query;
  const [projectionBundles, setProjectionBundles] = useState<ProjectionBundle[]>([]);

  useEffect(() => {
    if (rawScenarioName) {
      const fetchProjectionBundles = async () => {
        try {
          const response = await axios.post('http://localhost:3001/db/rsid', { name: rawScenarioName });
          const rawScenarioId = response.data.rawScenario_id;
          sessionStorage.setItem('rawScenarioId', rawScenarioId);
          const bundlesResponse = await axios.get(`http://localhost:3001/db/pb/rs/${rawScenarioId}`);
          setProjectionBundles(bundlesResponse.data);
        } catch (error) {
          console.error('Error fetching projection bundles:', error);
        }
      };

      fetchProjectionBundles();
    }
  }, [rawScenarioName]);

  return (
    <RootLayout>
      <Box sx={{ width: '80%', margin: '0 auto', mt: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Rohszenario-Katalog für: {rawScenarioName}
        </Typography>
        <Button variant="contained" color="primary" onClick={() => console.log('wabec')} sx={{ mb: 2 }}>
          Projektionsverteilung
        </Button>
        <Button variant="outlined" color="secondary" onClick={() => router.push('/rawscenarios')} sx={{ ml: 2, mb: 2 }}>
          Zurück
        </Button>
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell sx={{ fontWeight: 'bold' }}>ID</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Konsistenzwert</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Anzahl partieller Inkonsistenzen</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>p-Wert</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Zusammensetzung</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {projectionBundles.map((bundle) => (
                <TableRow key={bundle.projectionBundle_id}>
                  <TableCell>PB-{bundle.projectionBundle_id}</TableCell>
                  <TableCell>{bundle.consistency}</TableCell>
                  <TableCell>{bundle.numPartInconsistencies}</TableCell>
                  <TableCell>{bundle.pValue}</TableCell>
                  <TableCell>
                    {bundle.projections.slice(0, 3).map((proj) => proj.name).join(', ')}
                    {bundle.projections.length > 3 && (
                      <span title={bundle.projections.slice(3).map((proj) => proj.name).join(', ')}>...</span>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
    </RootLayout>
  );
};

export default ProjectionBundlesForScenario;


import React, { useEffect, useState } from 'react';
import { Box, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Typography } from '@mui/material';
import axios from 'axios';
import { ProjectionBundle } from '@/types';
import ProjectionBundleTable from './RawScenarioBundleTable';

  interface RawScenario {
    rawscenario_id: number;
    name: string;
    quality: number;
  }

  const RawScenariosTable: React.FC = () => {
    const [rawScenarios, setRawScenarios] = useState<RawScenario[]>([]);
    const [selectedScenarioId, setSelectedScenarioId] = useState<number | null>(null);
    const [projectionBundles, setProjectionBundles] = useState<ProjectionBundle[]>([]);

    useEffect(() => {
      const fetchRawScenarios = async () => {
        try {
          const scenarioProject_id = sessionStorage.getItem("scenarioProject_id");
          const response = await axios.get(`http://localhost:3001/db/rs/sp/${scenarioProject_id}`);
            console.log(response.data);
          setRawScenarios(response.data);
        } catch (error) {
          console.error('Error fetching raw scenarios:', error);
        }
      };

      fetchRawScenarios();
    }, []);

    const handleRawScenarioClick = async (rawscenario_id: number) => {
    setSelectedScenarioId(rawscenario_id);
    try {
      const response = await axios.get(`http://localhost:3001/db/pb/rs/${rawscenario_id}`);
      setProjectionBundles(response.data);
    } catch (error) {
      console.error('Error fetching projection bundles:', error);
    }
  };

  return (
    <Box sx={{ width: '80%', margin: '0 auto', mt: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Raw Scenarios
      </Typography>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Name</TableCell>
              <TableCell>Quality</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {rawScenarios.map((scenario) => (
              <TableRow key={scenario.rawscenario_id} onClick={() => handleRawScenarioClick(scenario.rawscenario_id)}>
                <TableCell>{scenario.rawscenario_id}</TableCell>
                <TableCell style={{ cursor: 'pointer', color: 'blue' }}>{scenario.name}</TableCell>
                <TableCell>{scenario.quality}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      {selectedScenarioId !== null && (
        <ProjectionBundleTable projectionBundles={projectionBundles} />
      )}
    </Box>
  );
};

export default RawScenariosTable;

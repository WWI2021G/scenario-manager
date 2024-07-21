import React, { useEffect, useState } from 'react';
import { Box, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Typography } from '@mui/material';
import axios from 'axios';
import { ProjectionBundle } from '@/types';
import ProjectionBundleTable from './RawScenarioBundleTable';
import { RawScenario } from '@/types';


  const RawScenariosTable: React.FC = () => {
    const [rawScenarios, setRawScenarios] = useState<RawScenario[]>([]);
    const [selectedScenarioName, setSelectedScenarioName] = useState<string | null>(null);
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

    const handleRawScenarioClick = async (rawscenario_name: string, quality: number ) => {
    setSelectedScenarioName(rawscenario_name);
    console.log(rawscenario_name);
    console.log(quality);
    try {
      const idRespone = await axios.post(`http://localhost:3001/db/rsid`, {"name": rawscenario_name, "quality": quality});
      const rawScenario_id = idRespone.data.rawScenario_id;
        console.log(rawScenario_id);
        const response = await axios.get(`http://localhost:3001/db/pb/rs/${rawScenario_id}`);
        console.log(response.data);
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
              <TableCell>Name</TableCell>
              <TableCell>Quality</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {rawScenarios.map((scenario) => (
              <TableRow key={scenario.name} onClick={() => handleRawScenarioClick(scenario.name, scenario.quality)}>
                <TableCell style={{ cursor: 'pointer', color: 'blue' }}>{scenario.name}</TableCell>
                <TableCell>{scenario.quality}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      {selectedScenarioName !== null && (
        <ProjectionBundleTable projectionBundles={projectionBundles} />
      )}
    </Box>
  );
};

export default RawScenariosTable;

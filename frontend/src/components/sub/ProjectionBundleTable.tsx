import React, { useState } from 'react';
import { Box, Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Typography } from '@mui/material';
import { ProjectionBundle, FutureProjection, Probability } from '@/types';
import FutureProjectionSelection from './FutureProjectionSelection';

const ProjectionBundleTable: React.FC = () => {
  const [projectionBundles, setProjectionBundles] = useState<ProjectionBundle[]>([]);
  const [showSelection, setShowSelection] = useState(false);

  const handleCreateBundle = (selectedProjections: FutureProjection[]) => {
    const newBundle: ProjectionBundle = {
      id: Math.floor(Math.random() * 1000),
      name: `Projection Bundle ${Math.floor(Math.random() * 1000)}`,
      description: 'A new projection bundle',
      projections: selectedProjections,
      numberOfPartialInconsistencies: 9,
      pValue: 100,
      probability: selectedProjections.reduce((acc, proj) => {
        const prob = proj.probability === Probability.HIGH ? 0.8 : proj.probability === Probability.MEDIUM ? 0.5 : 0.2;
        return acc * prob;
      }, 1),
    };

    setProjectionBundles([...projectionBundles, newBundle]);
    setShowSelection(false);
  };

  return (
    <Box sx={{ width: '80%', margin: '0 auto', mt: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Projection Bundles
      </Typography>
      {showSelection ? (
        <FutureProjectionSelection onCreateBundle={handleCreateBundle} onCancel={() => setShowSelection(false)} />
      ) : (
        <>
          <Button variant="contained" color="primary" onClick={() => setShowSelection(true)} sx={{ mb: 2 }}>
            Create New Projection Bundle
          </Button>
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>ID</TableCell>
                  <TableCell>Name</TableCell>
                  <TableCell>Description</TableCell>
                  <TableCell>Consistency Value</TableCell>
                  <TableCell>Number of Partial Inconsistencies</TableCell>
                  <TableCell>p-Value</TableCell>
                  <TableCell>Probability</TableCell>
                  <TableCell>Zusammensetzung</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {projectionBundles.map((bundle) => (
                  <TableRow key={bundle.id}>
                    <TableCell>PB-{bundle.id}</TableCell>
                    <TableCell>{bundle.name}</TableCell>
                    <TableCell>{bundle.description}</TableCell>
                    <TableCell>{bundle.probability}</TableCell>
                    <TableCell>{bundle.numberOfPartialInconsistencies}</TableCell>
                    <TableCell>{bundle.pValue}</TableCell>
                    <TableCell>{bundle.probability}</TableCell>
                    <TableCell>
                      {bundle.projections.slice(0, 4).map((projection) => projection.name).join(', ')}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </>
      )}
    </Box>
  );
};

export default ProjectionBundleTable;

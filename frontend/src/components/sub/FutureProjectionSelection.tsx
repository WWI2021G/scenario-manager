import React, { useState } from 'react';
import { Box, Button, Checkbox, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Typography } from '@mui/material';
import { KeyFactor, FutureProjection, ProjectionType, Probability } from '@/types';

const dummyFutureProjections: FutureProjection[] = [
  {
    id: 1,
    name: 'Erlebniseinkauf 1',
    keyFactor: {} as KeyFactor,
    projectionDescription: 'Projection for Erlebnis shopping',
    timeFrame: new Date(),
    projectionType: ProjectionType.TREND,
    probability: Probability.HIGH,
  },
  {
    id: 2,
    name: 'Der wahrhafte Verbraucher 1',
    keyFactor: {} as KeyFactor,
    projectionDescription: 'Projection for genuine consumers',
    timeFrame: new Date(),
    projectionType: ProjectionType.TREND,
    probability: Probability.MEDIUM,
  },
  // Add more dummy data as needed
];

interface FutureProjectionSelectionProps {
  onCreateBundle: (selectedProjections: FutureProjection[]) => void;
  onCancel: () => void;
}

const FutureProjectionSelection: React.FC<FutureProjectionSelectionProps> = ({ onCreateBundle, onCancel }) => {
  const [selectedProjections, setSelectedProjections] = useState<FutureProjection[]>([]);

  const handleSelectProjection = (projection: FutureProjection) => {
    setSelectedProjections((prev) =>
      prev.includes(projection)
        ? prev.filter((p) => p.id !== projection.id)
        : [...prev, projection]
    );
  };

  const handleCreateBundle = () => {
    onCreateBundle(selectedProjections);
  };

  return (
    <Box sx={{ width: '80%', margin: '0 auto', mt: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Select Future Projections
      </Typography>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', my: 2 }}>
        <Button
          variant="contained"
          color="primary"
          onClick={handleCreateBundle}
          disabled={selectedProjections.length === 0}
        >
          Create Projection Bundle
        </Button>
        <Button variant="outlined" color="secondary" onClick={onCancel}>
          Cancel
        </Button>
      </Box>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell />
              <TableCell>ID</TableCell>
              <TableCell>Name</TableCell>
              <TableCell>Key Factor</TableCell>
              <TableCell>Projection Description</TableCell>
              <TableCell>Time Frame</TableCell>
              <TableCell>Projection Type</TableCell>
              <TableCell>Probability</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {dummyFutureProjections.map((projection) => (
              <TableRow key={projection.id}>
                <TableCell>
                  <Checkbox
                    checked={selectedProjections.includes(projection)}
                    onChange={() => handleSelectProjection(projection)}
                  />
                </TableCell>
                <TableCell>{projection.id}</TableCell>
                <TableCell>{projection.name}</TableCell>
                <TableCell>{projection.keyFactor.title}</TableCell>
                <TableCell>{projection.projectionDescription}</TableCell>
                <TableCell>{projection.timeFrame.toLocaleDateString()}</TableCell>
                <TableCell>{projection.projectionType}</TableCell>
                <TableCell>{projection.probability}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default FutureProjectionSelection;

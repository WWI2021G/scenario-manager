import React, { useState } from 'react';
import { Box, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, TextField, Typography } from '@mui/material';
import { KeyFactor, FutureProjection, ProjectionType, Probability } from "@/types";

const keyFactors: KeyFactor[] = [
  {
    id: 1,
    title: 'Einkaufsmotivation',
    description: 'Motivation for shopping',
    property: 'Behavioral',
    currentStateDescription: 'Current state of shopping motivation',
    projectionA: {
      id: 1,
      name: 'Erlebniseinkauf',
      keyFactor: {} as KeyFactor, // Circular reference handled later
      projectionDescription: 'Projection for Erlebnis shopping',
      timeFrame: new Date(),
      projectionType: ProjectionType.TREND,
      probability: Probability.HIGH,
    },
    projectionB: {
      id: 2,
      name: 'Der wahrhafte Verbraucher',
      keyFactor: {} as KeyFactor, // Circular reference handled later
      projectionDescription: 'Projection for genuine consumers',
      timeFrame: new Date(),
      projectionType: ProjectionType.TREND,
      probability: Probability.MEDIUM,
    },

  },
  {
    id: 4,
    title: 'Einkaufsmotivation',
    description: 'Motivation for shopping',
    property: 'Behavioral',
    currentStateDescription: 'Current state of shopping motivation',
    projectionA: {
      id: 1,
      name: 'Erlebniseinkauf',
      keyFactor: {} as KeyFactor, // Circular reference handled later
      projectionDescription: 'Projection for Erlebnis shopping',
      timeFrame: new Date(),
      projectionType: ProjectionType.TREND,
      probability: Probability.HIGH,
    },
    projectionB: {
      id: 2,
      name: 'Der wahrhafte Verbraucher',
      keyFactor: {} as KeyFactor, // Circular reference handled later
      projectionDescription: 'Projection for genuine consumers',
      timeFrame: new Date(),
      projectionType: ProjectionType.TREND,
      probability: Probability.MEDIUM,
    },
  },
  {
    id: 2,
    title: 'Einkaufsmotivation',
    description: 'Motivation for shopping',
    property: 'Behavioral',
    currentStateDescription: 'Current state of shopping motivation',
    projectionA: {
      id: 1,
      name: 'Erlebniseinkauf',
      keyFactor: {} as KeyFactor, // Circular reference handled later
      projectionDescription: 'Projection for Erlebnis shopping',
      timeFrame: new Date(),
      projectionType: ProjectionType.TREND,
      probability: Probability.HIGH,
    },
    projectionB: {
      id: 2,
      name: 'Der wahrhafte Verbraucher',
      keyFactor: {} as KeyFactor, // Circular reference handled later
      projectionDescription: 'Projection for genuine consumers',
      timeFrame: new Date(),
      projectionType: ProjectionType.TREND,
      probability: Probability.MEDIUM,
    },

  }
  // Add more key factors as needed
];

keyFactors.forEach((kf) => {
  if (kf.projectionA) kf.projectionA.keyFactor = kf;
  if (kf.projectionB) kf.projectionB.keyFactor = kf;
});

const allProjections: (FutureProjection | undefined)[] = keyFactors.flatMap(kf => [kf.projectionA, kf.projectionB]);

const ConsistencyMatrix: React.FC = () => {
  const [matrix, setMatrix] = useState<number[][]>(() => {
    const size = allProjections.length;
    return Array.from({ length: size }, () => Array(size).fill(0));
  });

  const handleChange = (i: number, j: number, value: number) => {
    const newMatrix = [...matrix];
    newMatrix[i][j] = value;
    setMatrix(newMatrix);
  };

  return (
    <Box sx={{ width: '80%', margin: '0 auto', mt: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Konsistenzmatrix
      </Typography>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell />
              {keyFactors.map((kf, kfIndex) => (
                <TableCell key={`kf-head-${kfIndex}`} colSpan={2} align="center">
                  {kf.title}
                </TableCell>
              ))}
            </TableRow>
            <TableRow>
              <TableCell />
              {allProjections.map((proj, index) => (
                <TableCell key={`proj-head-${index}`} align="center">
                  {proj?.name ?? ''}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {allProjections.map((projRow, i) => (
              <TableRow key={`row-${i}`}>
                {i % 2 === 0 && (
                  <TableCell rowSpan={2} component="th" scope="row">
                    {keyFactors[Math.floor(i / 2)].title}
                  </TableCell>
                )}
                <TableCell component="th" scope="row">
                  {projRow?.name ?? ''}
                </TableCell>
                {allProjections.map((projCol, j) => (
                  <TableCell key={`cell-${i}-${j}`} align="center">
                    {i >= j ? (
                      <TextField
                        type="number"
                        inputProps={{ min: 1, max: 5 }}
                        value={matrix[i][j]}
                        onChange={(e) => handleChange(i, j, Number(e.target.value))}
                        disabled={i === j}
                      />
                    ) : (
                      <Box sx={{ bgcolor: 'grey.300', width: '100%', height: '100%' }} />
                    )}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default ConsistencyMatrix;

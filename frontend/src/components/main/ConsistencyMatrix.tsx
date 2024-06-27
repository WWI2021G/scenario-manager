import React, { useState } from 'react';
import { Box, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, TextField, Typography } from '@mui/material';
import { KeyFactor, FutureProjection, ProjectionType, Probability } from "@/types";

const keyFactors: KeyFactor[] = [
  {
    id: 1,
    title: 'Einkaufsmotivation 1',
    description: 'Motivation for shopping',
    property: 'Behavioral',
    currentStateDescription: 'Current state of shopping motivation',
    projectionA: {
      id: 1,
      name: 'Erlebniseinkauf 1',
      keyFactor: {} as KeyFactor, // Circular reference handled later
      projectionDescription: 'Projection for Erlebnis shopping',
      timeFrame: new Date(),
      projectionType: ProjectionType.TREND,
      probability: Probability.HIGH,
    },
    projectionB: {
      id: 2,
      name: 'Der wahrhafte Verbraucher 1',
      keyFactor: {} as KeyFactor, // Circular reference handled later
      projectionDescription: 'Projection for genuine consumers',
      timeFrame: new Date(),
      projectionType: ProjectionType.TREND,
      probability: Probability.MEDIUM,
    },
  },
  {
    id: 2,
    title: 'Einkaufsmotivation 2',
    description: 'Motivation for shopping',
    property: 'Behavioral',
    currentStateDescription: 'Current state of shopping motivation',
    projectionA: {
      id: 3,
      name: 'Erlebniseinkauf 2',
      keyFactor: {} as KeyFactor, // Circular reference handled later
      projectionDescription: 'Projection for Erlebnis shopping',
      timeFrame: new Date(),
      projectionType: ProjectionType.TREND,
      probability: Probability.HIGH,
    },
    projectionB: {
      id: 4,
      name: 'Der wahrhafte Verbraucher 2',
      keyFactor: {} as KeyFactor, // Circular reference handled later
      projectionDescription: 'Projection for genuine consumers',
      timeFrame: new Date(),
      projectionType: ProjectionType.TREND,
      probability: Probability.MEDIUM,
    },
  },
  {
    id: 3,
    title: 'Einkaufsmotivation 3',
    description: 'Motivation for shopping',
    property: 'Behavioral',
    currentStateDescription: 'Current state of shopping motivation',
    projectionA: {
      id: 5,
      name: 'Erlebniseinkauf 3',
      keyFactor: {} as KeyFactor, // Circular reference handled later
      projectionDescription: 'Projection for Erlebnis shopping',
      timeFrame: new Date(),
      projectionType: ProjectionType.TREND,
      probability: Probability.HIGH,
    },
    projectionB: {
      id: 6,
      name: 'Der wahrhafte Verbraucher 3',
      keyFactor: {} as KeyFactor, // Circular reference handled later
      projectionDescription: 'Projection for genuine consumers',
      timeFrame: new Date(),
      projectionType: ProjectionType.TREND,
      probability: Probability.MEDIUM,
    },
  }
];

// Fix circular references
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

  const isSameKeyFactor = (i: number, j: number) => {
    const projRow = allProjections[i];
    const projCol = allProjections[j];
    return projRow?.keyFactor.id === projCol?.keyFactor.id;
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
              <TableCell />
              {keyFactors.map((kf, kfIndex) => (
                <TableCell key={`kf-head-${kfIndex}`} colSpan={2} align="center">
                  {kf.title}
                </TableCell>
              ))}
            </TableRow>
            <TableRow>
              <TableCell />
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
              <TableRow key={`row-${i}`} sx={{ height: 70 }}>
                {i % 2 === 0 && (
                  <TableCell rowSpan={2} component="th" scope="row">
                    {keyFactors[Math.floor(i / 2)].title}
                  </TableCell>
                )}
                <TableCell component="th" scope="row">
                  {projRow?.name ?? ''}
                </TableCell>
                {allProjections.map((projCol, j) => (
                  <TableCell
                    key={`cell-${i}-${j}`}
                    align="center"
                    sx={{
                      bgcolor: (i >= j || j >= -i)
                        ? isSameKeyFactor(i, j)
                          ? 'grey.500'
                          : 'gray.400'
                        : 'grey.400'
                    }}
                  >
                    {i > j ? (
                      isSameKeyFactor(i, j) ? (
                        <Box sx={{ bgcolor: 'grey.400', width: '100%', height: '100%' }} />
                      ) : (
                        <TextField
                          type="number"
                          inputProps={{ min: 1, max: 5 }}
                          value={matrix[i][j]}
                          onChange={(e) => handleChange(i, j, Number(e.target.value))}
                          disabled={i === j}
                          sx={{ width: '60px' }}
                        />
                      )
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

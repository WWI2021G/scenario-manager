import * as React from 'react';
import { useState } from 'react';
import { Box, Select, MenuItem, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from '@mui/material';
import { KeyFactor, InfluencMatrix, InfluencingArea } from '@/types';

const keyFactors: KeyFactor[] = [
  { id: 1, name: 'Factor1' },
  { id: 2, name: 'Factor2' },
  { id: 3, name: 'Factor3' },
  { id: 4, name: 'Factor4' },
  { id: 5, name: 'Factor5' },
];

const initializeMatrix = (factors: KeyFactor[]): InfluencMatrix => {
  const matrix = new Map<string, Map<string, number>>();
  factors.forEach((factor) => {
    const innerMap = new Map<string, number>();
    factors.forEach((innerFactor) => {
      innerMap.set(innerFactor.name, 0);
    });
    matrix.set(factor.name, innerMap);
  });
  return matrix;
};

const InfluencMatrixComponent: React.FC = () => {
  const [matrix, setMatrix] = useState<InfluencMatrix>(initializeMatrix(keyFactors));

  const handleChange = (row: string, col: string, value: number) => {
    setMatrix((prevMatrix) => {
      const newMatrix = new Map(prevMatrix);
      const innerMap = new Map(newMatrix.get(row) || []);
      innerMap.set(col, value);
      newMatrix.set(row, innerMap);
      return newMatrix;
    });
  };

  return (
    <Box sx={{ width: '80%', margin: '0 auto', mt: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Einflussmatrix
      </Typography>
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell sx={{ padding: '4px' }}></TableCell>
              {keyFactors.map((factor) => (
                <TableCell key={factor.id} align="center" sx={{ padding: '4px' }}>
                  {factor.name}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {keyFactors.map((rowFactor) => (
              <TableRow key={rowFactor.id}>
                <TableCell component="th" scope="row">
                  {rowFactor.name}
                </TableCell>
                {keyFactors.map((colFactor) => (
                  <TableCell key={colFactor.id} align="center">
                    {rowFactor.name === colFactor.name ? (
                      '-'
                    ) : (
                      <Select
                        value={matrix.get(rowFactor.name)?.get(colFactor.name) || 0}
                        onChange={(e) => handleChange(rowFactor.name, colFactor.name, Number(e.target.value))}
                        displayEmpty
                      >
                        {[0, 1, 2, 3].map((val) => (
                          <MenuItem key={val} value={val}>
                            {val}
                          </MenuItem>
                        ))}
                      </Select>
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

export default InfluencMatrixComponent;

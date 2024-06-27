import * as React from "react";
import { useState } from "react";
import {
  Box,
  Select,
  MenuItem,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography
} from "@mui/material";
import { KeyFactor, InfluencMatrix } from "@/types";

const keyFactors: KeyFactor[] = [
  {
    id: 1, title: "Factor1", description: "", property: "", currentStateDescription: "", projectionA: undefined,
    projectionB: undefined
  },
  {
    id: 2, title: "Factor2", description: "", property: "", currentStateDescription: "", projectionA: undefined,
    projectionB: undefined
  },
  {
    id: 3, title: "Factor3", description: "", property: "", currentStateDescription: "", projectionA: undefined,
    projectionB: undefined
  },
  {
    id: 4, title: "Factor4", description: "", property: "", currentStateDescription: "", projectionA: undefined,
    projectionB: undefined
  },
  {
    id: 5, title: "Factor5", description: "", property: "", currentStateDescription: "", projectionA: undefined,
    projectionB: undefined
  }
];

const initializeMatrix = (factors: KeyFactor[]): InfluencMatrix => {
  const matrix = new Map<string, Map<string, number>>();
  factors.forEach((factor) => {
    const innerMap = new Map<string, number>();
    factors.forEach((innerFactor) => {
      innerMap.set(innerFactor.title, 0);
    });
    matrix.set(factor.title, innerMap);
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
    <Box sx={{ width: "80%", margin: "0 auto", mt: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Einflussmatrix
      </Typography>
      <TableContainer>
        <Table sx={{ borderCollapse: "collapse" }}>
          <TableHead>
            <TableRow>
              <TableCell sx={{ padding: "4px" }}></TableCell>
              {keyFactors.map((factor) => (
                <TableCell key={factor.id} align="center" sx={{ padding: "4px" }}>
                  {factor.title}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {keyFactors.map((rowFactor) => (
              <TableRow key={rowFactor.id}>
                <TableCell component="th" scope="row" sx={{ padding: "4px" }}>
                  {rowFactor.title}
                </TableCell>
                {keyFactors.map((colFactor) => (
                  <TableCell key={colFactor.id} align="center" sx={{ padding: "4px" }}>
                    {rowFactor.title === colFactor.title ? (
                      "-"
                    ) : (
                      <Select
                        value={matrix.get(rowFactor.title)?.get(colFactor.title) || 0}
                        onChange={(e) => handleChange(rowFactor.title, colFactor.title, Number(e.target.value))}
                        displayEmpty
                        sx={{ padding: "0", minWidth: "50px" }}
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

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
  Typography,
  Button
} from "@mui/material";
import { InfluencingFactor, InfluencMatrix } from "@/types";
import axios from "axios";
import { useRouter } from 'next/router';

const initializeMatrix = (factors: InfluencingFactor[]): InfluencMatrix => {
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
  const router = useRouter();
  // HACK: Immer eins
  // Mit Session-Variable ersetzen <2024-07-05> Weiberle17
  const scenarioProjectID = 1;
  const [influencingFactors, setInfluencingFactors] = useState<InfluencingFactor[]>([]);
  const [matrix, setMatrix] = useState<InfluencMatrix>(initializeMatrix(influencingFactors));

  React.useEffect(() => {
    getProjectInfluencingFactors(scenarioProjectID);
  }, []);

  const getProjectInfluencingFactors = (scenarioProjectID: number) => {
    axios.get('http://localhost:3001/db/if/sp/' + scenarioProjectID)
      .then(response => {
        setInfluencingFactors(response.data)
      })
      .catch(error => console.error(error));
  };

  const handleChange = (row: string, col: string, value: number) => {
    setMatrix((prevMatrix) => {
      const newMatrix = new Map(prevMatrix);
      const innerMap = new Map(newMatrix.get(row) || []);
      innerMap.set(col, value);
      newMatrix.set(row, innerMap);
      return newMatrix;
    });
  };

  const handleDone = () => {
    // TODO: Compute KeyFactors <2024-07-07> Weiberle17
    // Berechnungen hier, oder in Backend? Wie bekommt man Aktiv- und Passivsumme?
    router.push("/keyfactors");
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
              {influencingFactors.map((factor) => (
                <TableCell key={factor.name} align="center" sx={{ padding: "4px" }}>
                  {factor.name}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {influencingFactors.map((rowFactor) => (
              <TableRow key={rowFactor.name}>
                <TableCell component="th" scope="row" sx={{ padding: "4px" }}>
                  {rowFactor.name}
                </TableCell>
                {influencingFactors.map((colFactor) => (
                  <TableCell key={colFactor.name} align="center" sx={{ padding: "4px" }}>
                    {rowFactor.name === colFactor.name ? (
                      "-"
                    ) : (
                      <Select
                        value={matrix.get(rowFactor.name)?.get(colFactor.name) || 0}
                        onChange={(e) => handleChange(rowFactor.name, colFactor.name, Number(e.target.value))}
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
      <Button variant="contained" className={'bg-primary hover:bg-primary-hover'} onClick={handleDone} sx={{ mb: 2 }}>
        Alle Eingaben getätigt
      </Button>
    </Box>
  );
};

export default InfluencMatrixComponent;

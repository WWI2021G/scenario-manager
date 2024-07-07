import React, { useState } from "react";
import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Select,
  MenuItem,
  Typography, Button
} from "@mui/material";
import {
  KeyFactor,
  FutureProjection,
  ProjectionType,
  Probability,
} from "@/types";
import zIndex from "@mui/material/styles/zIndex";
import axios from "axios";

// HACK: Immer eins
// Mit Session-Variable ersetzen <2024-07-04> Weiberle17
const scenarioProject_id = 1

const ConsistencyMatrix: React.FC = () => {
  const [futureProjections, setFutureProjections] = useState<FutureProjection[]>([]);
  const [keyFactors, setKeyFactors] = useState<KeyFactor[]>([]);
  const [matrix, setMatrix] = useState<number[][]>([]);

  React.useEffect(() => {
    getFutureProjections(scenarioProject_id);
    getKeyFactors(scenarioProject_id);
    initiateMatrix();
  }, []);

  const getFutureProjections = async (scenarioProject_id: number) => {
    await axios.get("http://localhost:3001/db/fp/sp/" + scenarioProject_id)
      .then(response => {
        setFutureProjections(response.data);
      })
      .catch(error => console.error(error))
  };

  const getKeyFactors = async (scenarioProject_id: number) => {
    await axios.get("http://localhost:3001/db/kf/sp/" + scenarioProject_id)
      .then(response => {
        setKeyFactors(response.data)
      })
      .catch(error => console.error(error))
  };

    console.log(futureProjections);
    console.log(keyFactors);
  const initiateMatrix = () => {
    console.log(futureProjections.length);
    const size = 6;
    setMatrix(Array.from({ length: size }, () => Array(size).fill(0)));
  };

  const handleChange = (i: number, j: number, value: number) => {
    const newMatrix = [...matrix];
    newMatrix[i][j] = value;
    setMatrix(newMatrix);
  };

  const isSameKeyFactor = (i: number, j: number) => {
    const projRow = futureProjections[i];
    const projCol = futureProjections[j];
    return projRow?.keyFactor.name === projCol?.keyFactor.name;
  };

  const acceptedValues = [1, 2, 6, 8, 9];

  return (
    <Box sx={{ width: "100%", margin: "0 auto", mt: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Konsistenzmatrix
      </Typography>
      <Box sx={{ display: "flex", justifyContent: "left", my: 2 }}>
        <Button variant="outlined" color="secondary" >
          Cancel
        </Button>
      </Box>
      <TableContainer
        component={Paper}
        sx={{
          maxHeight: "80vh", // Set a max height for the table container
          overflowY: "auto", // Enable vertical scrolling
        }}
      >
        <Table stickyHeader>
          <TableHead>
            <TableRow sx={{ zIndex: 4 }}>
              <TableCell />
              <TableCell />
              {keyFactors.map((kf, kfIndex) => (
                <TableCell
                  key={`kf-head-${kfIndex}`}
                  colSpan={2}
                  align="center"
                  sx={{
                    position: "sticky",
                    top: 0,
                    zIndex: 4,
                    background: "#fff",
                    maxWidth: "200px", // Set a maximum width for wrapping
                    whiteSpace: "normal", // Allow wrapping
                    wordBreak: "break-word", // Break words if necessary
                    overflowWrap: "break-word", // Handle overflow
                  }}
                >
                  {kf.name}
                </TableCell>
              ))}
            </TableRow>
            <TableRow >
              <TableCell sx={{ zIndex: 4 }} />
              <TableCell sx={{ zIndex: 4 }} />
              {futureProjections.map((proj, index) => (
                <TableCell
                  key={`proj-head-${index}`}
                  align="center"
                  sx={{
                    position: "sticky",
                    top: 0,
                    zIndex: 5,
                    background: "#fff",
                    maxWidth: "200px", // Set a maximum width for wrapping
                    whiteSpace: "normal", // Allow wrapping
                    overflowWrap: "break-word", // Handle overflow
                  }}
                >
                  {proj?.name ?? ""}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {futureProjections.map((projRow, i) => (
              <TableRow key={`row-${i}`} sx={{ height: 70, background: "#fff", zIndex: 4 }}>
                {i % 2 === 0 && (
                  <TableCell
                    rowSpan={2}
                    component="th"
                    scope="row"
                    sx={{
                      position: "sticky",
                      left: 0,
                      zIndex: 1,
                      background: "#fff",
                      width: "200px", // Set a maximum width for wrapping
                      whiteSpace: "normal", // Allow wrapping
                      overflowWrap: "break-word", // Handle overflow
                    }}
                  >
                    {keyFactors[Math.floor(i / 2)].name}
                  </TableCell>
                )}
                <TableCell
                  component="th"
                  scope="row"
                  sx={{
                    position: "sticky",
                    left: 0,
                    zIndex: 2,
                    background: "#fff",
                    maxWidth: "250px", // Set a maximum width for wrapping
                    whiteSpace: "normal", // Allow wrapping
                    overflowWrap: "break-word", // Handle overflow
                    lineBreak: "normal",
                  }}
                >
                  {projRow?.name ?? ""}
                </TableCell>
                {futureProjections.map((projCol, j) => (
                  <TableCell
                    key={`cell-${i}-${j}`}
                    align="center"
                    sx={{
                      background: '#fff',
                      bgcolor:
                        i >= j || j >= -i
                          ? isSameKeyFactor(i, j)
                            ? "grey.500"
                            : "gray.400"
                          : "white",
                      zIndex: 1,
                      position: "sticky",
                    }}
                  >
                    {i > j ? (
                      isSameKeyFactor(i, j) ? (
                        <Box
                          sx={{
                            bgcolor: "white",
                            width: "100%",
                            height: "100%",
                            zIndex: 2,
                          }}
                        />
                      ) : (
                        <Select
                          value={matrix[i][j]}
                          onChange={(e) =>
                            handleChange(i, j, Number(e.target.value))
                          }
                          displayEmpty
                          sx={{ width: "60px", zIndex: 2, background: "#fff" }}
                        >
                          {acceptedValues.map((value) => (
                            <MenuItem key={value} value={value}>
                              {value}
                            </MenuItem>
                          ))}
                        </Select>
                      )
                    ) : (
                      <Box
                        sx={{
                          bgcolor: "grey.300",
                          width: "100%",
                          height: "100%",
                          zIndex: 2,
                        }}
                      />
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

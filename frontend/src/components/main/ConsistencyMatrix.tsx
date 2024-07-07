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

const keyFactors: KeyFactor[] = [
  {
    id: 1,
    title: "Einkaufsmotivation 1",
    description: "Motivation for shopping",
    property: "Behavioral",
    currentStateDescription: "Current state of shopping motivation",
    projectionA: {
      id: 1,
      name: "Erlebniseinkauf 1",
      keyFactor: {} as KeyFactor, // Circular reference handled later
      projectionDescription: "Projection for Erlebnis shopping",
      timeFrame: new Date(),
      projectionType: ProjectionType.TREND,
      probability: Probability.HIGH,
    },
    projectionB: {
      id: 2,
      name: "Der wahrhafte Verbraucher 1",
      keyFactor: {} as KeyFactor, // Circular reference handled later
      projectionDescription: "Projection for genuine consumers",
      timeFrame: new Date(),
      projectionType: ProjectionType.TREND,
      probability: Probability.MEDIUM,
    },
  },
  {
    id: 2,
    title: "Einkaufsmotivation 2",
    description: "Motivation for shopping",
    property: "Behavioral",
    currentStateDescription: "Current state of shopping motivation",
    projectionA: {
      id: 3,
      name: "Erlebniseinkauf 2",
      keyFactor: {} as KeyFactor, // Circular reference handled later
      projectionDescription: "Projection for Erlebnis shopping",
      timeFrame: new Date(),
      projectionType: ProjectionType.TREND,
      probability: Probability.HIGH,
    },
    projectionB: {
      id: 4,
      name: "Der wahrhafte Verbraucher 2",
      keyFactor: {} as KeyFactor, // Circular reference handled later
      projectionDescription: "Projection for genuine consumers",
      timeFrame: new Date(),
      projectionType: ProjectionType.TREND,
      probability: Probability.MEDIUM,
    },
  },
  {
    id: 3,
    title: "Einkaufsmotivation 3",
    description: "Motivation for shopping",
    property: "Behavioral",
    currentStateDescription: "Current state of shopping motivation",
    projectionA: {
      id: 5,
      name: "Erlebniseinkauf 3",
      keyFactor: {} as KeyFactor, // Circular reference handled later
      projectionDescription: "Projection for Erlebnis shopping",
      timeFrame: new Date(),
      projectionType: ProjectionType.TREND,
      probability: Probability.HIGH,
    },
    projectionB: {
      id: 6,
      name: "Der wahrhafte Verbraucher 3",
      keyFactor: {} as KeyFactor, // Circular reference handled later
      projectionDescription: "Projection for genuine consumers",
      timeFrame: new Date(),
      projectionType: ProjectionType.TREND,
      probability: Probability.MEDIUM,
    },
  },
  {
    id: 4,
    title: "Einkaufsmotivation 4",
    description: "Motivation for shopping",
    property: "Behavioral",
    currentStateDescription: "Current state of shopping motivation",
    projectionA: {
      id: 7,
      name: "Erlebniseinkauf 4",
      keyFactor: {} as KeyFactor, // Circular reference handled later
      projectionDescription: "Projection for Erlebnis shopping",
      timeFrame: new Date(),
      projectionType: ProjectionType.TREND,
      probability: Probability.HIGH,
    },
    projectionB: {
      id: 8,
      name: "Der wahrhafte Verbraucher 4",
      keyFactor: {} as KeyFactor, // Circular reference handled later
      projectionDescription: "Projection for genuine consumers",
      timeFrame: new Date(),
      projectionType: ProjectionType.TREND,
      probability: Probability.MEDIUM,
    },
  },
  {
    id: 5,
    title: "Einkaufsmotivation 5",
    description: "Motivation for shopping",
    property: "Behavioral",
    currentStateDescription: "Current state of shopping motivation",
    projectionA: {
      id: 9,
      name: "Erlebniseinkauf 5",
      keyFactor: {} as KeyFactor, // Circular reference handled later
      projectionDescription: "Projection for Erlebnis shopping",
      timeFrame: new Date(),
      projectionType: ProjectionType.TREND,
      probability: Probability.HIGH,
    },
    projectionB: {
      id: 10,
      name: "Der wahrhafte Verbraucher 5",
      keyFactor: {} as KeyFactor, // Circular reference handled later
      projectionDescription: "Projection for genuine consumers",
      timeFrame: new Date(),
      projectionType: ProjectionType.TREND,
      probability: Probability.MEDIUM,
    },
  },
];

// Fix circular references
keyFactors.forEach((kf) => {
  if (kf.projectionA) kf.projectionA.keyFactor = kf;
  if (kf.projectionB) kf.projectionB.keyFactor = kf;
});

const allProjections: (FutureProjection | undefined)[] = keyFactors.flatMap(
  (kf) => [kf.projectionA, kf.projectionB]
);

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

  const acceptedValues = [1, 2, 6, 8, 9];

  return (
    <Box sx={{ width: "100%", margin: "0 auto", mt: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Konsistenzmatrix
      </Typography>
      <Box sx={{ display: "flex", justifyContent: "left",  my: 2}}>
        <Button variant="contained" className='bg-primary hover:bg-primary-hover mr-4' type="submit">
          Konsitenzwerte speichern
        </Button>
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
            <TableRow sx={{zIndex: 4}}>
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
                  {kf.title}
                </TableCell>
              ))}
            </TableRow>
            <TableRow >
              <TableCell sx={{zIndex: 4}}/>
              <TableCell sx={{zIndex: 4}}/>
              {allProjections.map((proj, index) => (
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
            {allProjections.map((projRow, i) => (
              <TableRow key={`row-${i}`} sx={{ height: 70, background: "#fff", zIndex: 4}}>
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
                    {keyFactors[Math.floor(i / 2)].title}
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
                {allProjections.map((projCol, j) => (
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
                          defaultValue={1}
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

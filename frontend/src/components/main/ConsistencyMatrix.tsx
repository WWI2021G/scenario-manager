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
  Typography,
  Button,
} from "@mui/material";
import { KeyFactor, FutureProjection } from "@/types";
import axios from "axios";
import router from "next/router";

const ConsistencyMatrix: React.FC = () => {
  const [scenarioProject_id, setScenarioProject_id] = useState<number>();
  const [futureProjections, setFutureProjections] = useState<
    FutureProjection[]
  >([]);
  const [keyFactors, setKeyFactors] = useState<KeyFactor[]>([]);
  const [matrix, setMatrix] = useState<
    Map<FutureProjection, Map<FutureProjection, number>>
  >(new Map());

  React.useEffect(() => {
    if (typeof window) {
      setScenarioProject_id(
        Number(sessionStorage.getItem("scenarioProject_id")),
      );
    }
    if (scenarioProject_id) {
      getFutureProjections(scenarioProject_id);
    }
  }, [scenarioProject_id]);

  React.useEffect(() => {
    if (futureProjections.length > 0) {
      getKeyFactors();
      initiateMatrix();
    }
  }, [futureProjections]);

  const getFutureProjections = async (scenarioProject_id: number) => {
    await axios
      .get("http://localhost:3001/db/fp/sp/" + scenarioProject_id)
      .then((response) => {
        setFutureProjections(response.data);
      })
      .catch((error) => console.error(error));
  };

  const getKeyFactors = async () => {
    const keyFactorMap: Map<string, FutureProjection[]> = new Map();
    const keyFactorArray: KeyFactor[] = [];
    futureProjections.forEach((futureProjection) => {
      if (!keyFactorMap.has(futureProjection.keyFactor.name)) {
        keyFactorMap.set(futureProjection.keyFactor.name, []);
      }
      const array: FutureProjection[] = keyFactorMap.get(
        futureProjection.keyFactor.name,
      )!;
      if (!array.includes(futureProjection)) {
        array.push(futureProjection);
      }
    });
    keyFactorMap.forEach((futureProjections) => {
      const keyFactor = futureProjections[0].keyFactor;
      keyFactor.projectionA = futureProjections[0];
      keyFactor.projectionB = futureProjections[1];
      keyFactorArray.push(keyFactor);
    });
    setKeyFactors(keyFactorArray);
  };

  const initiateMatrix = () => {
    const consistencyMatrix = new Map();
    futureProjections.forEach((futureProjection) => {
      if (!consistencyMatrix.has(futureProjection)) {
        consistencyMatrix.set(futureProjection, new Map());
      }
      const innerMap = consistencyMatrix.get(futureProjection);
      futureProjections.forEach((innerFutureProjection) => {
        if (!innerMap.has(innerFutureProjection)) {
          innerMap.set(innerFutureProjection, 0);
        }
      });
    });
    setMatrix(consistencyMatrix);
  };

  const containsZero = (
    map:
      | Map<FutureProjection, Map<FutureProjection, number>>
      | Map<FutureProjection, number>,
  ): boolean => {
    let returnBool: boolean = false;
    map.forEach((innerMap, _key) => {
      if (innerMap instanceof Map) {
        innerMap.forEach((value, _innerKey) => {
          if (value === 0) {
            returnBool = true;
          }
        });
      }
    });
    return returnBool;
  };

  const mapToJson = (
    map:
      | Map<FutureProjection, Map<FutureProjection, number>>
      | Map<FutureProjection, number>,
  ) => {
    const obj: any = {};
    map.forEach((value, key) => {
      if (value instanceof Map) {
        obj[key.name] = mapToJson(value);
      } else {
        obj[key.name] = value;
      }
    });
    return obj;
  };

  const handleChange = (
    projRow: FutureProjection | undefined,
    projCol: FutureProjection | undefined,
    value: number,
  ) => {
    if (projRow && projCol) {
      const innerMap = matrix.get(projRow);
      if (innerMap) {
        innerMap.set(projCol, value);
      }
    }
  };

  const handleSubmit = async () => {
    // TODO: fix logic to prevent unchanged fields
    if (containsZero(matrix)) {
      const jsonMatrix = mapToJson(matrix);
      await axios
        .post("http://localhost:3001/db/pb/calculate", {
          matrix: jsonMatrix,
          scenarioProject_id: scenarioProject_id,
        })
        .then((response) => {
          console.log(response);
          router.push("/projection-bundles");
        })
        .catch((error) => console.error(error));
    } else {
      console.error("Not all values set");
    }
  };

  const acceptedValues = [0, 1, 2, 6, 8, 9];

  return (
    <Box sx={{ width: "100%", margin: "0 auto", mt: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Konsistenzmatrix
      </Typography>
      <Box sx={{ display: "flex", justifyContent: "left", my: 2 }}>
        <Button
          variant="contained"
          className="bg-primary hover:bg-primary-hover mr-4"
          onClick={handleSubmit}
        >
          Konsistenzwerte speichern
        </Button>
        <Button
          variant="outlined"
          color="secondary"
          onClick={() => router.push("/keyfactors")}
        >
          Abbrechen
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
              {keyFactors.map((kf) => (
                <TableCell
                  key={`kf-head-${kf.name}`}
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
            <TableRow>
              <TableCell sx={{ zIndex: 4 }} />
              <TableCell sx={{ zIndex: 4 }} />
              {keyFactors.map((kf) =>
                [kf.projectionA, kf.projectionB].map((proj) => (
                  <TableCell
                    key={`proj-head-${proj?.name}`}
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
                )),
              )}
            </TableRow>
          </TableHead>
          <TableBody>
            {futureProjections.map((projRow, i) => (
              <TableRow
                key={`row-${projRow?.name}`}
                sx={{ height: 70, background: "#fff", zIndex: 4 }}
              >
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
                    {projRow.keyFactor.name}
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
                    key={`cell-${projRow?.name}-${projCol?.name}`}
                    align="center"
                    sx={{
                      background: "#fff",
                      bgcolor:
                        i >= j || j >= -i
                          ? projRow?.keyFactor.name === projCol?.keyFactor.name
                            ? "grey.500"
                            : "gray.400"
                          : "white",
                      zIndex: 1,
                      position: "sticky",
                    }}
                  >
                    {i > j ? (
                      projRow?.keyFactor.name === projCol?.keyFactor.name ? (
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
                          onChange={(e) =>
                            handleChange(
                              projRow,
                              projCol,
                              Number(e.target.value),
                            )
                          }
                          displayEmpty
                          sx={{ width: "60px", zIndex: 2, background: "#fff" }}
                        >
                          {acceptedValues.map((value) => (
                            <MenuItem
                              key={value}
                              value={value}
                              hidden={value === 0}
                            >
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

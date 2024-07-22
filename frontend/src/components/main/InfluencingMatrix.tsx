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
import { InfluencingFactor, InfluencMatrix, ScenarioType } from "@/types";
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
  const [scenarioProject_id, setScenarioProject_id] = useState<number>();
  const [influencingFactors, setInfluencingFactors] = useState<InfluencingFactor[]>([]);
  const [matrix, setMatrix] = useState<InfluencMatrix>(initializeMatrix(influencingFactors));

  React.useEffect(() => {
    if (typeof window) {
      setScenarioProject_id(Number(sessionStorage.getItem("scenarioProject_id")));
    }
    if (scenarioProject_id) {
      getProjectInfluencingFactors(scenarioProject_id);
    }
  }, [scenarioProject_id]);

  const getProjectInfluencingFactors = async (scenarioProjectID: number) => {
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

  const handleDone = async () => {
    for (let i = 0; i < influencingFactors.length; i++) {
      const activeSum = getActiveSum(influencingFactors[i]);
      const passiveSum = getPassiveSum(influencingFactors[i]);
      await axios.post("http://localhost:3001/db/if/as/update", { "scenarioProject_id": scenarioProject_id, "name": influencingFactors[i].name, "description": influencingFactors[i].description, "activeSum": activeSum, "passiveSum": passiveSum })
        .then(response => {
          console.log(response);
        })
        .catch(error => console.error(error));
      await axios.post("http://localhost:3001/db/if/ps/update", { "scenarioProject_id": scenarioProject_id, "name": influencingFactors[i].name, "description": influencingFactors[i].description, "activeSum": activeSum, "passiveSum": passiveSum })
        .then(response => {
          console.log(response);
        })
        .catch(error => console.error(error));
    };
    await createKeyFactors();
    router.push("/influence-matrix/influencing-factors-summary");
  };

  const getActiveSum = (factor: InfluencingFactor): number | undefined => {
    const innerMap = matrix.get(factor.name);
    if (!innerMap) {
      return undefined;
    }
    let sum = 0;
    innerMap.forEach((value) => {
      sum += value;
    });
    return sum;
  }

  const getPassiveSum = (factor: InfluencingFactor): number | undefined => {
    let sum = 0;
    matrix.forEach((innerMap, _) => {
      if (innerMap.has(factor.name)) {
        sum += innerMap.get(factor.name)!;
      }
    });
    if (sum === 0) {
      return undefined;
    }
    return sum;
  }

  const createKeyFactors = async () => {
    if (!scenarioProject_id) {
      console.error("scenarioProject_id hasn't been set correctly");
      return;
    }
    await getProjectInfluencingFactors(scenarioProject_id);
    if (influencingFactors.length <= 20) {
      await postKeyFactors(influencingFactors);
      return;
    }
    let scenarioType: ScenarioType = {} as ScenarioType;
    await axios.get("http://localhost:3001/db/sp/" + scenarioProject_id)
      .then(response => {
        scenarioType = response.data.scenarioType;
      })
      .catch(error => console.error(error));
    switch (scenarioType) {
      case "Umfeldszenario":
        const keyFactorsUS = new Map();
        influencingFactors.forEach(influencingFactor => {
          const di = influencingFactor.activeSum * influencingFactor.passiveSum;
          keyFactorsUS.set(influencingFactor, di);
        });
        const mapArrayUS = Array.from(keyFactorsUS.entries());
        mapArrayUS.sort((a, b) => {
          if (a[1] > b[1]) return -1;
          if (a[1] < b[1]) return 1;
          return 0;
        });
        const sortedKeysUS: InfluencingFactor[] = mapArrayUS.map(([key, _value]) => key).slice(0, 20);
        await postKeyFactors(sortedKeysUS);
        break;
      case "LangfristigesUmfeldszenario":
        const keyFactorsLUS = influencingFactors.slice(0, 20).sort((a, b) => b.activeSum - a.activeSum);
        await postKeyFactors(keyFactorsLUS);
        break;
      case "KurzfristigesUmfeldszenario":
        const keyFactorsKUS = influencingFactors.slice(0, 20).sort((a, b) => b.passiveSum - a.passiveSum);
        await postKeyFactors(keyFactorsKUS);
        break;
      case "Systemszenario":
        const keyFactorsSZ = influencingFactors.slice(0, 20).sort((a, b) => b.activeSum - a.activeSum);
        await postKeyFactors(keyFactorsSZ);
        break;
      case "RisikomeidendesSystemszenario":
        const keyFactorsRMZ = new Map();
        influencingFactors.forEach(influencingFactor => {
          const di = influencingFactor.activeSum / influencingFactor.passiveSum;
          keyFactorsRMZ.set(influencingFactor, di);
        });
        const mapArrayRMZ = Array.from(keyFactorsRMZ.entries());
        mapArrayRMZ.sort((a, b) => {
          if (a[1] > b[1]) return -1;
          if (a[1] < b[1]) return 1;
          return 0;
        });
        const sortedKeysRMZ: InfluencingFactor[] = mapArrayRMZ.map(([key, _value]) => key).slice(0, 20);
        await postKeyFactors(sortedKeysRMZ);
        break;
      case "RisikosuchendesSystemszenario":
        const keyFactorsRSZ = new Map();
        influencingFactors.forEach(influencingFactor => {
          const di = influencingFactor.activeSum * influencingFactor.passiveSum;
          keyFactorsRMZ.set(influencingFactor, di);
        });
        const mapArrayRSZ = Array.from(keyFactorsRSZ.entries());
        mapArrayRSZ.sort((a, b) => {
          if (a[1] < b[1]) return -1;
          if (a[1] > b[1]) return 1;
          return 0;
        });
        const sortedKeysRSZ: InfluencingFactor[] = mapArrayRSZ.map(([key, _value]) => key).slice(0, 20);
        await postKeyFactors(sortedKeysRSZ);
        break;
    };
  };

  const postKeyFactors = async (influencingFactors: InfluencingFactor[]) => {
    console.log(influencingFactors);
    for (let i = 0; i < influencingFactors.length; i++) {
      let influencingFactor_id = 0;
      await axios.post("http://localhost:3001/db/ifid", influencingFactors[i])
        .then(response => {
          influencingFactor_id = response.data.influencingFactor_id
        })
        .catch(error => console.error(error));
      await axios.post("http://localhost:3001/db/kf/add", { "scenarioProject_id": scenarioProject_id, "influencingFactor_id": influencingFactor_id })
        .then(response => {
          console.log(response);
        })
        .catch(error => console.error(error));
    }
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


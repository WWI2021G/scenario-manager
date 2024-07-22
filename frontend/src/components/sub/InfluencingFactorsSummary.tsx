import React, { useEffect, useState } from "react";
import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  Paper,
} from "@mui/material";
import axios from "axios";
import router from "next/router";
import Button from "@mui/material/Button";
import { InfluencingFactor } from "@/types";

const InfluencingFactorsSummary: React.FC = () => {
  const [influencingFactors, setInfluencingFactors] = useState<
    InfluencingFactor[]
  >([]);
  const [scenarioProjectId, setScenarioProjectId] = useState<number | null>(
    null,
  );

  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedProjectId = sessionStorage.getItem("scenarioProject_id");
      if (storedProjectId) {
        setScenarioProjectId(Number(storedProjectId));
      }
    }
  }, []);

  useEffect(() => {
    const fetchInfluencingFactors = async () => {
      if (scenarioProjectId) {
        try {
          const response = await axios.get(
            `http://localhost:3001/db/if/sp/${scenarioProjectId}`,
          );
          setInfluencingFactors(response.data);
        } catch (error) {
          console.error("Error fetching influencing factors:", error);
        }
      }
    };

    fetchInfluencingFactors();
  }, [scenarioProjectId]);

  return (
    <Box sx={{ width: "80%", margin: "0 auto", mt: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Kennzahlen der Einflussfaktoren
      </Typography>
      <Button
        variant="contained"
        color="primary"
        sx={{ my: 2 }}
        onClick={() => router.push("/keyfactors")}
      >
        Schlüsselfaktoren
      </Button>
      <Button
        variant="outlined"
        color="secondary"
        sx={{ ml: 2 }}
        onClick={() => window.history.back()}
      >
        Zurück
      </Button>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow className="font-bold">
              <TableCell className="font-bold">Name</TableCell>
              <TableCell className="font-bold">Aktivsumme</TableCell>
              <TableCell className="font-bold">Passivsumme</TableCell>
              <TableCell className="font-bold">Dynamik Index (DI)</TableCell>
              <TableCell className="font-bold">Impuls Index (IPI)</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {influencingFactors.map((factor, index) => (
              <TableRow key={index}>
                <TableCell>{factor.name}</TableCell>
                <TableCell>{factor.activeSum}</TableCell>
                <TableCell>{factor.passiveSum}</TableCell>
                <TableCell>{factor.activeSum * factor.passiveSum}</TableCell>
                <TableCell>
                  {factor.passiveSum !== 0
                    ? (factor.activeSum / factor.passiveSum).toFixed(2)
                    : "N/A"}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default InfluencingFactorsSummary;

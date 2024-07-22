import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
} from "@mui/material";
import axios from "axios";
import { RawScenario } from "@/types";

const RawScenariosTable: React.FC = () => {
  const [rawScenarios, setRawScenarios] = useState<RawScenario[]>([]);
  const router = useRouter();

  useEffect(() => {
    const fetchRawScenarios = async () => {
      try {
        const scenarioProject_id = sessionStorage.getItem("scenarioProject_id");
        const response = await axios.get(
          `http://localhost:3001/db/rs/sp/${scenarioProject_id}`,
        );
        setRawScenarios(response.data);
      } catch (error) {
        console.error("Error fetching raw scenarios:", error);
      }
    };

    fetchRawScenarios();
  }, []);

  const handleRawScenarioClick = (rawscenario_name: string) => {
    router.push(`/rawscenarios/${encodeURIComponent(rawscenario_name)}`);
  };

  return (
    <Box sx={{ width: "80%", margin: "0 auto", mt: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Rohszenarien
      </Typography>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Quality</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {rawScenarios.map((scenario) => (
              <TableRow
                key={scenario.name}
                onClick={() => handleRawScenarioClick(scenario.name)}
                style={{ cursor: "pointer" }}
              >
                <TableCell style={{ color: "blue" }}>{scenario.name}</TableCell>
                <TableCell>{scenario.quality}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default RawScenariosTable;

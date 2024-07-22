import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
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
import { ProjectionBundle } from "@/types";
import router from "next/router";

const ProjectionBundleTable: React.FC = () => {
  const [projectionBundles, setProjectionBundles] = useState<
    ProjectionBundle[]
  >([]);

  useEffect(() => {
    const fetchProjectionBundles = async () => {
      try {
        const scenarioProject_id = sessionStorage.getItem("scenarioProject_id");
        const response = await axios.get(
          `http://localhost:3001/db/pb/sp/${scenarioProject_id}`,
        );
        console.log(response.data);
        setProjectionBundles(response.data);
      } catch (error) {
        console.error("Error fetching projection bundles:", error);
      }
    };

    fetchProjectionBundles();
  }, []);

  const handleSubmit = async (projectionBundles: ProjectionBundle[]) => {
    console.log(projectionBundles);
    const scenarioProject_id = sessionStorage.getItem("scenarioProject_id");
    console.log(scenarioProject_id);
    await axios
      .post("http://localhost:3001/db/cluster", {
        projectionBundles,
        scenarioProject_id,
      })
      .then((response) => {
        console.log(response);
        router.push("/rawscenarios");
      })
      .catch((error) => console.error(error));
  };

  return (
    <Box sx={{ width: "80%", margin: "0 auto", mt: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Projektionsbündel-Katalog
      </Typography>
      <Button
        variant="contained"
        color="primary"
        onClick={() => handleSubmit(projectionBundles)}
        sx={{ mb: 2 }}
      >
        Clusteranalyse
      </Button>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Konsistenzwert</TableCell>
              <TableCell>Anzahl partieller Inkonsistenzen</TableCell>
              <TableCell>p-Wert</TableCell>
              <TableCell>Zusammensetzung</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {projectionBundles.map((bundle) => (
              <TableRow key={bundle.projectionBundle_id}>
                <TableCell>PB-{bundle.projectionBundle_id}</TableCell>
                <TableCell>{bundle.consistency}</TableCell>
                <TableCell>{bundle.numPartInconsistencies}</TableCell>
                <TableCell>{bundle.pValue}</TableCell>
                <TableCell>
                  {bundle.projections
                    .slice(0, 3)
                    .map((proj) => proj.name)
                    .join(", ")}
                  {bundle.projections.length > 3 && (
                    <span
                      title={bundle.projections
                        .slice(3)
                        .map((proj) => proj.name)
                        .join(", ")}
                    >
                      ...
                    </span>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default ProjectionBundleTable;

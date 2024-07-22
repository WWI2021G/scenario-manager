import * as React from "react";
import { useState, useEffect } from "react";
import {
  Box,
  Button,
  Checkbox,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
} from "@mui/material";
import axios from "axios";
import { InfluencingFactor } from "@/types";

interface InfluencingFactorCatalogueProps {
  onClose: () => void;
}

export default function InfluencingFactorCatalogue({
  onClose,
}: InfluencingFactorCatalogueProps) {
  const [allInfluencingFactors, setAllInfluencingFactors] = useState<
    InfluencingFactor[]
  >([]);
  const [selectedFactors, setSelectedFactors] = useState<InfluencingFactor[]>(
    [],
  );

  useEffect(() => {
    axios
      .get("http://localhost:3001/db/if/all")
      .then((response) => {
        setAllInfluencingFactors(response.data);
      })
      .catch((error) =>
        console.error("Error fetching all influencing factors:", error),
      );
  }, []);

  const handleToggle = (factor: InfluencingFactor) => {
    const currentIndex = selectedFactors.indexOf(factor);
    const newChecked = [...selectedFactors];

    if (currentIndex === -1) {
      newChecked.push(factor);
    } else {
      newChecked.splice(currentIndex, 1);
    }

    setSelectedFactors(newChecked);
  };

  const handleAdd = async () => {
    try {
      const scenarioProjectId = sessionStorage.getItem("scenarioProject_id");
      if (!scenarioProjectId) {
        throw new Error("No scenario project ID found in session storage");
      }

      // Fetch existing influencing factors for the project to avoid duplicates
      const existingFactorsResponse = await axios.get(
        `http://localhost:3001/db/if/sp/${scenarioProjectId}`,
      );
      const existingFactors: InfluencingFactor[] = existingFactorsResponse.data;

      for (const factor of selectedFactors) {
        // Check if the factor is already linked to the project
        const isDuplicate = existingFactors.some(
          (existingFactor) => existingFactor.name === factor.name,
        );
        if (isDuplicate) {
          console.log(`Factor ${factor.name} is already linked to the project`);
          continue; // Skip this factor if it's a duplicate
        }

        const response = await axios.post("http://localhost:3001/db/ifid", {
          name: factor.name,
          description: factor.description,
        });
        console.log(response.data);
        const influencingFactorId = response.data.influencingFactor_id;
        console.log(influencingFactorId, scenarioProjectId);

        await axios.post("http://localhost:3001/db/if/link", {
          influencingFactor_id: influencingFactorId,
          scenarioProject_id: scenarioProjectId,
        });

        console.log(`Added ${factor.name} to project`);
      }

      onClose();
    } catch (error) {
      console.error("Error adding influencing factors to project:", error);
    }
  };

  return (
    <Box sx={{ width: "80%", margin: "0 auto", mt: 4 }}>
      <h1 className="text-3xl my-4 font-bold">
        Persistenter Einflussfaktorenkatalog
      </h1>
      <Button
        variant="contained"
        color="primary"
        onClick={handleAdd}
        sx={{ mt: 2 }}
      >
        Hinzufügen
      </Button>
      <Button
        variant="outlined"
        color="secondary"
        onClick={onClose}
        sx={{ mt: 2, ml: 2 }}
      >
        Abbrechen
      </Button>
      <List>
        {allInfluencingFactors.map((factor, index) => (
          <ListItem key={index} button onClick={() => handleToggle(factor)}>
            <ListItemText
              primary={factor.name}
              secondary={factor.description}
            />
            <ListItemSecondaryAction>
              <Checkbox
                edge="end"
                onChange={() => handleToggle(factor)}
                checked={selectedFactors.indexOf(factor) !== -1}
              />
            </ListItemSecondaryAction>
          </ListItem>
        ))}
      </List>
    </Box>
  );
}

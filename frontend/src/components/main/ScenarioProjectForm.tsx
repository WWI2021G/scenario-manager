import * as React from "react";
import { useState } from "react";
import { Box, Button, FormControl, InputLabel, MenuItem, Select, TextField, Typography } from "@mui/material";
import { ScenarioProject, ScenarioType } from "@/types";
import { SelectChangeEvent } from "@mui/material/Select";

export default function ScenarioProjectForm({ onSave }: { onSave: (project: ScenarioProject) => void }) {
  const [project, setProject] = useState<ScenarioProject>({
    name: '',
    description: '',
    influencingFactors: [],
    keyFactors: [],
    futureProjections: [],
    projectionBundles: [],
    scenarioType: ScenarioType.Umfeldszenario,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setProject(prevProject => ({
      ...prevProject,
      [name]: value
    }));
  };

  const handleSelectChange = (e: SelectChangeEvent<ScenarioType>) => {
    const { name, value } = e.target;
    setProject(prevProject => ({
      ...prevProject,
      [name]: value as ScenarioType
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(project);
    setProject({
      name: '',
      description: '',
      influencingFactors: [],
      keyFactors: [],
      futureProjections: [],
      projectionBundles: [],
      scenarioType: ScenarioType.Umfeldszenario,
    });
  };

  const handleCancel = () => {
    // Placeholder function for cancel

  };

  return (
    <Box sx={{ width: '50%', margin: '0 auto', mt: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Create New Project
      </Typography>
      <form onSubmit={handleSubmit}>
        <TextField
          label="Name"
          name="name"
          value={project.name}
          onChange={handleChange}
          fullWidth
          margin="normal"
          variant="outlined"
        />
        <TextField
          label="Description"
          name="description"
          value={project.description}
          onChange={handleChange}
          fullWidth
          margin="normal"
          variant="outlined"
        />
        <FormControl fullWidth margin="normal">
          <InputLabel>Scenario Type</InputLabel>
          <Select
            name="scenarioType"
            value={project.scenarioType}
            onChange={handleSelectChange}
            label="Scenario Type"
          >
            {Object.values(ScenarioType).map((type) => (
              <MenuItem key={type} value={type}>
                {type}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <Button type="submit" variant="contained" className='bg-primary hover:bg-primary-hover' sx={{ mt: 2 }}>
          Save Project
        </Button>
      </form>
    </Box>
  );
}

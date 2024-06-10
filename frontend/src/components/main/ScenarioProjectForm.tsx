import * as React from 'react';
import { useState } from 'react';
import { Box, Button, TextField, Typography, List, ListItem, ListItemText } from '@mui/material';
import { InfluencingFactor, ScenarioProject } from "@/types";

export default function ScenarioProjectForm({ onSave }: { onSave: (project: ScenarioProject) => void }) {
  const [project, setProject] = useState<ScenarioProject>({
    name: '',
    description: '',
    influencingFactors: [],
    keyFactors: [],
    futureProjections: [],
    projectionBundles: [],
    scenarioType: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setProject({ ...project, [name]: value });
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
      scenarioType: '',
    });
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
        <TextField
          label="Scenario Type"
          name="scenarioType"
          value={project.scenarioType}
          onChange={handleChange}
          fullWidth
          margin="normal"
          variant="outlined"
        />
        <Button type="submit" variant="contained" color="primary" sx={{ mt: 2 }}>
          Save Project
        </Button>
      </form>
    </Box>
  );
}

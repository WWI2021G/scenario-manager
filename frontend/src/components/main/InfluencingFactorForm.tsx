"use client";
import * as React from 'react';
import { useState } from 'react';
import { InfluencingFactor, InfluencingArea } from '@/types';
import { Box, Button, TextField, Typography, Select, MenuItem, FormControl, InputLabel, List, ListItem, ListItemText, SelectChangeEvent } from '@mui/material';

export default function InfluencingFactorForm() {
  const [influencingFactor, setInfluencingFactor] = useState<InfluencingFactor>({
    id: 0,
    name: '',
    description: '',
    variable: '',
    influencingArea: InfluencingArea.Handel, // Default value
  });
  const [influencingFactorsList, setInfluencingFactorsList] = useState<InfluencingFactor[]>([]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | { value: unknown }>) => {
    const { name, value } = (e.target as HTMLInputElement | HTMLTextAreaElement | { name: string; value: unknown });
    setInfluencingFactor({ ...influencingFactor, [name]: value });
  };

  const handleSelectChange = (event: SelectChangeEvent<InfluencingArea>) => {
    setInfluencingFactor({ ...influencingFactor, influencingArea: event.target.value as InfluencingArea });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setInfluencingFactorsList([...influencingFactorsList, { ...influencingFactor, id: influencingFactorsList.length + 1 }]);
    setInfluencingFactor({
      id: 0,
      name: '',
      description: '',
      variable: '',
      influencingArea: InfluencingArea.Handel, // Reset to default value
    });
  };

  return (
    <Box sx={{ width: '50%', margin: '0 auto', mt: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Add Influencing Factor
      </Typography>
      <form onSubmit={handleSubmit}>
        <TextField
          label="Name"
          name="name"
          value={influencingFactor.name}
          onChange={handleChange}
          fullWidth
          margin="normal"
          variant="outlined"
        />
        <TextField
          label="Description"
          name="description"
          value={influencingFactor.description}
          onChange={handleChange}
          fullWidth
          margin="normal"
          variant="outlined"
        />
        <TextField
          label="Variable"
          name="variable"
          value={influencingFactor.variable}
          onChange={handleChange}
          fullWidth
          margin="normal"
          variant="outlined"
        />
        <FormControl fullWidth margin="normal" variant="outlined">
          <InputLabel id="influencingAreas-label">Influencing Areas</InputLabel>
          <Select
            labelId="influencingAreas-label"
            label="Influencing Areas"
            name="influencingAreas"
            value={influencingFactor.influencingArea}
            onChange={handleSelectChange}
          >
            {Object.values(InfluencingArea).map((area) => (
              <MenuItem key={area} value={area}>
                {area}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <Button type="submit" variant="contained" color="primary" sx={{ mt: 2 }}>
          Add Influencing Factor
        </Button>
      </form>
      <Box sx={{ mt: 4 }}>
        <Typography variant="h5" component="h2">
          Influencing Factors List
        </Typography>
        <List>
          {influencingFactorsList.map((factor) => (
            <ListItem key={factor.id}>
              <ListItemText
                primary={`${factor.name} - ${factor.description}`}
                secondary={`Variable: ${factor.variable}, Influencing Areas: ${factor.influencingArea}`}
              />
            </ListItem>
          ))}
        </List>
      </Box>
    </Box>
  );
}

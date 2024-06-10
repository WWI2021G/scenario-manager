"use client";
import * as React from 'react';
import { useState } from 'react';
import { InfluencingFactor } from '../../types';
import { Box, Button, TextField, Typography, List, ListItem, ListItemText } from '@mui/material';

export default function InfluencingFactorForm() {
  const [influencingFactor, setInfluencingFactor] = useState<InfluencingFactor>({
    id: 0,
    name: '',
    description: '',
    variable: '',
    influencingAreas: '',
  });
  const [influencingFactorsList, setInfluencingFactorsList] = useState<InfluencingFactor[]>([]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setInfluencingFactor({ ...influencingFactor, [name]: value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setInfluencingFactorsList([...influencingFactorsList, { ...influencingFactor, id: influencingFactorsList.length + 1 }]);
    setInfluencingFactor({
      id: 0,
      name: '',
      description: '',
      variable: '',
      influencingAreas: '',
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
        <TextField
          label="Influencing Areas"
          name="influencingAreas"
          value={influencingFactor.influencingAreas}
          onChange={handleChange}
          fullWidth
          margin="normal"
          variant="outlined"
        />
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
                secondary={`Variable: ${factor.variable}, Influencing Areas: ${factor.influencingAreas}`}
              />
            </ListItem>
          ))}
        </List>
      </Box>
    </Box>
  );
}

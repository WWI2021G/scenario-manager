"use client";
import * as React from 'react';
import { useState } from 'react';
import { InfluencingFactor } from '@/types';
import { Box, Button, TextField, Typography, Select, MenuItem, FormControl, InputLabel, List, ListItem, ListItemText, SelectChangeEvent } from '@mui/material';

export default function InfluencingFactorForm() {
  const [influencingFactor, setInfluencingFactor] = useState<InfluencingFactor>({
    id: 0,
    name: '',
    description: '',
  });
  const [influencingFactorsList, setInfluencingFactorsList] = useState<InfluencingFactor[]>([]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | { value: unknown }>) => {
    const { name, value } = (e.target as HTMLInputElement | HTMLTextAreaElement | { name: string; value: unknown });
    setInfluencingFactor({ ...influencingFactor, [name]: value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setInfluencingFactorsList([...influencingFactorsList, { ...influencingFactor, id: influencingFactorsList.length + 1 }]);
    setInfluencingFactor({
      id: 0,
      name: '',
      description: '',
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
              />
            </ListItem>
          ))}
        </List>
      </Box>
    </Box>
  );
}

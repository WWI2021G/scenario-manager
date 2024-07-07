import * as React from 'react';
import { useState } from 'react';
import { useRouter } from 'next/router';
import {
  Box,
  Button,
  TextField,
  Typography,
} from "@mui/material";
import { InfluencingFactor,  } from '@/types';
import axios from 'axios';

export default function CreateInfluencingFactor() {
  const [influencingFactor, setInfluencingFactor] = useState<InfluencingFactor>({
    name: '',
    description: '',
  });
  const router = useRouter();

  // HACK: Immer eins
  // Mit Session-Variable ersetzen <2024-07-05> Weiberle17
  let scenarioProject_id = 1;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | { value: unknown }>) => {
    const { name, value } = (e.target as HTMLInputElement | HTMLTextAreaElement | { name: string; value: unknown });
    setInfluencingFactor({ ...influencingFactor, [name]: value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    axios.post('http://localhost:3001/db/if/add', { scenarioProject_id, influencingFactor })
      .then(response => {
        console.log(response);
      })
      .catch(error => console.error(error));
    router.push('/influencing-factors');
  };

  return (
    <Box sx={{ width: '50%', margin: '0 auto', mt: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Create New Influencing Factor
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
          Save Influencing Factor
        </Button>
      </form>
    </Box>
  );
}

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

export default function CreateInfluencingFactor() {
  const [influencingFactor, setInfluencingFactor] = useState<InfluencingFactor>({
    id: 0,
    name: '',
    description: '',
  });
  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | { value: unknown }>) => {
    const { name, value } = (e.target as HTMLInputElement | HTMLTextAreaElement | { name: string; value: unknown });
    setInfluencingFactor({ ...influencingFactor, [name]: value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const storedFactors = localStorage.getItem('influencingFactors');
    const factors = storedFactors ? JSON.parse(storedFactors) : [];
    factors.push({ ...influencingFactor, id: factors.length + 1 });
    localStorage.setItem('influencingFactors', JSON.stringify(factors));
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

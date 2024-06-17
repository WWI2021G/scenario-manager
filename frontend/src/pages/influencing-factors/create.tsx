import * as React from 'react';
import { useState } from 'react';
import { useRouter } from 'next/router';
import {
  Box,
  Button,
  TextField,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  SelectChangeEvent
} from "@mui/material";
import { InfluencingFactor, InfluencingArea } from '@/types';

export default function CreateInfluencingFactor() {
  const [influencingFactor, setInfluencingFactor] = useState<InfluencingFactor>({
    id: 0,
    name: '',
    description: '',
    variable: '',
    influencingArea: InfluencingArea.Handel,
  });
  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | { value: unknown }>) => {
    const { name, value } = (e.target as HTMLInputElement | HTMLTextAreaElement | { name: string; value: unknown });
    setInfluencingFactor({ ...influencingFactor, [name]: value });
  };

  const handleSelectChange = (event: SelectChangeEvent<InfluencingArea>) => {
    setInfluencingFactor({ ...influencingFactor, influencingArea: event.target.value as InfluencingArea });
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
          Save Influencing Factor
        </Button>
      </form>
    </Box>
  );
}

import React, { useState } from 'react';
import { TextField, Button, Box } from '@mui/material';
import { FutureProjection } from '@/types';

const FutureProjectionForm: React.FC = () => {
  const [futureProjection, setFutureProjection] = useState<FutureProjection>({
    id: 0,
    name: '',
    mainProjection: '',
    mainProjectionDescription: '',
    alternativeProjection: '',
    alternativeProjectionDescription: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFutureProjection({ ...futureProjection, [name]: value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Placeholder function for submit
    console.log('Form submitted', futureProjection);
  };

  const handleCancel = () => {
    // Placeholder function for cancel
    console.log('Form canceled');
  };

  return (
    <Box
      component="form"
      onSubmit={handleSubmit}
      sx={{
        display: 'flex',
        flexDirection: 'column',
        gap: 2,
        maxWidth: '800px',
        margin: '0 auto',
      }}
    >
      <TextField
        label="Name"
        name="name"
        value={futureProjection.name}
        onChange={handleChange}
        required
      />
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'row',
          gap: 2,
          width: '100%',
          margin: '0 auto',
        }}>
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            gap: 2,
            width: '100%',
            margin: '0 auto',
          }}><TextField
          label="Main Projection"
          name="mainProjection"
          value={futureProjection.mainProjection}
          onChange={handleChange}
          required
        />
          <TextField
            label="Main Projection Description"
            name="mainProjectionDescription"
            value={futureProjection.mainProjectionDescription}
            onChange={handleChange}
            required
            multiline
            rows={8}
          /></Box>
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            gap: 2,
            width: '100%',
            margin: '0 auto',
          }}><TextField
          label="Alternative Projection"
          name="alternativeProjection"
          value={futureProjection.alternativeProjection}
          onChange={handleChange}
          required
        />
          <TextField
            label="Alternative Projection Description"
            name="alternativeProjectionDescription"
            value={futureProjection.alternativeProjectionDescription}
            onChange={handleChange}
            required
            multiline
            rows={8}
          /></Box></Box>
      <Box sx={{ display: 'flex', justifyContent: 'left' }}>
        <Button variant="contained" color="primary" type="submit" className={'mr-4'}>
          Add Future Projection
        </Button>
        <Button variant="outlined" color="secondary" onClick={handleCancel}>
          Cancel
        </Button>
      </Box>
    </Box>
  );
};

export default FutureProjectionForm;

import React, { useState } from 'react';
import { TextField, Button, Box } from '@mui/material';
import { FutureProjection } from '@/types';

const FutureProjectionForm: React.FC = () => {
  const [mainProjection, setMainProjection] = useState<FutureProjection>({
    id: 0,
    name: '',
    projection: '',
    projectionDescription: '',
  });

  const [alternativeProjection, setAlternativeProjection] = useState<FutureProjection>({
    id: 1,
    name: '',
    projection: '',
    projectionDescription: '',
  });

  const handleChangeMain = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setMainProjection({ ...mainProjection, [name]: value });
  };

  const handleChangeAlternative = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setAlternativeProjection({ ...alternativeProjection, [name]: value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Placeholder function for submit
    console.log('Main Projection submitted', mainProjection);
    console.log('Alternative Projection submitted', alternativeProjection);
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
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'row',
          gap: 2,
          width: '100%',
          margin: '0 auto',
        }}
      >
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            gap: 2,
            width: '100%',
            margin: '0 auto',
          }}
        >
          <TextField
            label="Name"
            name="name"
            value={mainProjection.name}
            onChange={handleChangeMain}
            required
          />
          <TextField
            label="Main Projection"
            name="projection"
            value={mainProjection.projection}
            onChange={handleChangeMain}
            required
          />
          <TextField
            label="Main Projection Description"
            name="projectionDescription"
            value={mainProjection.projectionDescription}
            onChange={handleChangeMain}
            required
            multiline
            rows={8}
          />
        </Box>
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            gap: 2,
            width: '100%',
            margin: '0 auto',
          }}
        >
          <TextField
            label="Name"
            name="name"
            value={alternativeProjection.name}
            onChange={handleChangeMain}
            required
          />
          <TextField
            label="Alternative Projection"
            name="projection"
            value={alternativeProjection.projection}
            onChange={handleChangeAlternative}
            required
          />
          <TextField
            label="Alternative Projection Description"
            name="projectionDescription"
            value={alternativeProjection.projectionDescription}
            onChange={handleChangeAlternative}
            required
            multiline
            rows={8}
          />
        </Box>
      </Box>
      <Box sx={{ display: 'flex', justifyContent: 'left' }}>
        <Button variant="contained" color="primary" type="submit" className="mr-4">
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

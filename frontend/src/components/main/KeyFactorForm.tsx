import React, { useState, useEffect } from 'react';
import { TextField, Button, Box } from '@mui/material';
import { KeyFactor } from '@/types';

interface KeyFactorFormProps {
  onSubmit: (keyFactor: KeyFactor) => void;
  onCancel: () => void;
  initialData?: KeyFactor | null;
}

const KeyFactorForm: React.FC<KeyFactorFormProps> = ({ onSubmit, onCancel, initialData }) => {
  const [keyFactor, setKeyFactor] = useState<KeyFactor>({
    id: 0,
    title: '',
    description: '',
    property: '',
    currentStateDescription: '',
    projectionA: undefined,
    projectionB: undefined,
  });

  useEffect(() => {
    if (initialData) {
      setKeyFactor(initialData);
    }
  }, [initialData]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setKeyFactor({ ...keyFactor, [name]: value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(keyFactor);
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
        label="Title"
        name="title"
        value={keyFactor.title}
        onChange={handleChange}
        required
      />
      <TextField
        label="Description"
        name="description"
        value={keyFactor.description}
        onChange={handleChange}
        required
        multiline
        rows={4}
      />
      <TextField
        label="Property"
        name="property"
        value={keyFactor.property}
        onChange={handleChange}
        required
      />
      <TextField
        label="Current State Description"
        name="currentStateDescription"
        value={keyFactor.currentStateDescription}
        onChange={handleChange}
        required
        multiline
        rows={4}
      />
      <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
        <Button variant="contained" color="primary" type="submit">
          {initialData ? 'Update KeyFactor' : 'Add KeyFactor'}
        </Button>
        <Button variant="outlined" color="secondary" onClick={onCancel}>
          Cancel
        </Button>
      </Box>
    </Box>
  );
};

export default KeyFactorForm;

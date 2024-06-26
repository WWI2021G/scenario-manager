import React, { useState } from 'react';
import { KeyFactor } from '@/types';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import MenuItem from '@mui/material/MenuItem';

interface KeyFactorFormProps {
  onSubmit: (keyFactor: KeyFactor) => void;
  onCancel: () => void;
}

const KeyFactorForm: React.FC<KeyFactorFormProps> = ({ onSubmit, onCancel }) => {
  const [keyFactor, setKeyFactor] = useState<KeyFactor>({
    id: 0,
    title: '',
    description: '',
    property: '',
    currentStateDescription: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setKeyFactor({
      ...keyFactor,
      [name]: value,
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(keyFactor);
  };

  return (
    <Box component="form" onSubmit={handleSubmit}>
      <TextField
        label="Title"
        name="title"
        value={keyFactor.title}
        onChange={handleChange}
        fullWidth
        margin="normal"
      />
      <TextField
        label="Description"
        name="description"
        value={keyFactor.description}
        onChange={handleChange}
        fullWidth
        margin="normal"
      />
      <TextField
        label="Property"
        name="property"
        value={keyFactor.property}
        onChange={handleChange}
        fullWidth
        margin="normal"
      />
      <TextField
        label="Current State Description"
        name="currentStateDescription"
        value={keyFactor.currentStateDescription}
        onChange={handleChange}
        fullWidth
        margin="normal"
      />

      <Button type="submit" variant="contained" className='bg-primary hover:bg-primary-hover mr-4'>
        Add KeyFactor Description
      </Button>
      <Button type="button" variant="contained" color="secondary" onClick={onCancel}>
        Back
      </Button>
    </Box>
  );
};

export default KeyFactorForm;


import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { Box, Button, TextField, Typography } from '@mui/material';
import axios from 'axios';

interface EditInfluencingFactorFormProps {
  ifName: string;
}

const EditInfluencingFactorForm: React.FC<EditInfluencingFactorFormProps> = ({ifName}) => {
  const router = useRouter();
  const { name } = router.query;

  const [oldName, setOldName] = useState<string>('');
  const [newName, setNewName] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    if (name) {
      fetchInfluencingFactor(name as string);
    }
  }, [name]);

  const fetchInfluencingFactor = async (name: string) => {
    try {
      const response = await axios.post('http://localhost:3001/db/ifname', { name });
      const factor = response.data;
      setOldName(factor.name);
      setNewName(factor.name);
      setDescription(factor.description);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching influencing factor:', error);
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:3001/db/if/update', { oldName, newName, description });
      router.push('/influencing-factors');
    } catch (error) {
      console.error('Error updating influencing factor:', error);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <Box sx={{ width: '50%', margin: '0 auto', mt: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Edit Influencing Factor
      </Typography>
      <form onSubmit={handleSubmit}>
        <TextField
          label="Name"
          value={newName}
          onChange={(e) => setNewName(e.target.value)}
          fullWidth
          margin="normal"
          variant="outlined"
        />
        <TextField
          label="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          fullWidth
          margin="normal"
          variant="outlined"
        />
        <Button type="submit" variant="contained" className="bg-primary hover:bg-primary-hover" sx={{ mt: 2 }}>
          Save Changes
        </Button>
      </form>
    </Box>
  );
};

export default EditInfluencingFactorForm;


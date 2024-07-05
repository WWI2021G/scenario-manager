// components/LoginForm.tsx
import React, { useState } from 'react';
import { Box, Button, TextField, Typography } from '@mui/material';
import { useRouter } from 'next/router';
import { User } from '@/types';
const mockUser: User = {
  id: 1,
  username: 'testuser',
  password: 'password123',
};

const LoginForm: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();

    if (username === mockUser.username && password === mockUser.password) {
      setError('');
      router.push('/');  // Navigate to the homepage on successful login
    } else {
      setError('Invalid username or password');
    }
  };

  return (
    <Box
      component="form"
      onSubmit={handleSubmit}
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 2,
        maxWidth: '400px',
        margin: '0 auto',
        mt: 4,
      }}
    >
      <Typography variant="h4" component="h1">
        Login
      </Typography>
      {error && <Typography color="error">{error}</Typography>}
      <TextField
        label="Username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        fullWidth
        required
      />
      <TextField
        label="Password"
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        fullWidth
        required
      />
      <Button variant="contained" color="primary" type="submit" fullWidth>
        Login
      </Button>
    </Box>
  );
};

export default LoginForm;

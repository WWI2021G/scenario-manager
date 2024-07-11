import React, { useState, useEffect } from 'react';
import { Box, Button, TextField, Typography } from '@mui/material';
import { useRouter } from 'next/navigation';
import { User } from '@/types';
import bcrypt from 'bcryptjs';
import axios from 'axios';

const mockUser: User = {
  id: 1,
  username: 'testuser',
  password: 'password123',
};

const LoginForm: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [usernameError, setUsernameError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [isClient, setIsClient] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setIsClient(true);
  }, []);

  const handleLogin = async (event: React.FormEvent) => {
    event.preventDefault();
    setUsernameError('');
    setPasswordError('');
    let hashedPassword = undefined;
    await axios.post("http://localhost:3001/db/username", { "name": username })
      .then(response => {
        hashedPassword = response.data.userPasswordHash;
        setUsernameError('');
      })
      .catch(error => {
        if (error.response.data === "No data returned from the query.") {
          setUsernameError("Username doesn't exist");
          return;
        }
      });
    const match = await bcrypt.compare(password, hashedPassword);

    if (match) {
      setPasswordError('');
      await axios.post("http://localhost:3001/db/userid", { "userName": username })
        .then(response => {
          setPasswordError('');
          sessionStorage.setItem("user_id", response.data.scenarioUser_id);
        })
        .catch(error => {
          if (error.response.data === "No data returned from the query.") {
            setUsernameError("Username doesn't exist");
            return;
          } else {
            setUsernameError("Error getting checking username");
          }
        });
      router.push('/project-list'); // Navigate to the homepage on successful login
    } else {
      setPasswordError('Invalid password');
    }
  };

  const handleRegister = async (event: React.FormEvent) => {
    event.preventDefault();
    setUsernameError('');
    setPasswordError('');
    try {
      const usernameResponse = await axios.post("http://localhost:3001/db/username", { "name": username });
      if (usernameResponse.data) {
        setUsernameError('Username already exists');
        return;
      }
    } catch (error: any) {
      if (error.response.data === "No data returned from the query.") {
        setUsernameError("");
      }
    }
    const salt = bcrypt.genSaltSync(10);
    const hashedPassword = bcrypt.hashSync(password, salt);
    await axios.post("http://localhost:3001/db/user/add", { "userName": username, "userPasswordHash": hashedPassword })
      .then(response => {
        sessionStorage.setItem("user_id", response.data.scenarioUser_id);
      })
      .catch(error => {
        setUsernameError("Error adding user to database");
        setPasswordError("Error adding user to database");
        console.error(error)
      });
    router.push('/project-list'); // Navigate to the homepage on successful login
  };

  if (!isClient) {
    return null;
  }

  return (
    <Box
      component="form"
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
      {usernameError && passwordError}
      <TextField
        label="Username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        fullWidth
        required
        error={Boolean(usernameError)}
        helperText={usernameError}
      />
      <TextField
        label="Password"
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        fullWidth
        required
        error={Boolean(passwordError)}
        helperText={passwordError}
      />
      <Button variant="contained" color="primary" onClick={handleLogin} fullWidth>
        Login
      </Button>
      <Button variant="contained" color="primary" onClick={handleRegister} fullWidth>
        Registrieren
      </Button>
    </Box>
  );
};

export default LoginForm;


import React, { useState } from 'react';
import { TextField, Button, Container, Paper, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import md5 from 'md5';

const Login = () => {
  const navigate = useNavigate();
  const [credentials, setCredentials] = useState({ user: '', pass: '' });
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('https://grass-notch-bandana.glitch.me/login', {
        user: credentials.user,
        pass: md5(credentials.pass)
      }, {
        headers: {
          'Content-Type': 'application/json'
        }
      });

      if (response.status === 200) {
        // Store the response data
        localStorage.setItem('userData', JSON.stringify(response.data));
        localStorage.setItem('token', response.data.token);
        
        // Set token expiration (5 minutes from now)
        const expirationTime = new Date().getTime() + (5 * 60 * 1000);
        localStorage.setItem('tokenExpiration', expirationTime);
        
        navigate('/dashboard');
      }
    } catch (error) {
      setError('Invalid credentials');
      console.error('Login error:', error);
    }
  };

  return (
    <Container component="main" maxWidth="xs">
      <Paper elevation={3} style={{ padding: 20, marginTop: 100 }}>
        <Typography component="h1" variant="h5" align="center">
          Login
        </Typography>
        <form onSubmit={handleSubmit}>
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            label="Username"
            value={credentials.user}
            onChange={(e) => setCredentials({ ...credentials, user: e.target.value })}
          />
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            label="Password"
            type="password"
            value={credentials.pass}
            onChange={(e) => setCredentials({ ...credentials, pass: e.target.value })}
          />
          {error && (
            <Typography color="error" align="center">
              {error}
            </Typography>
          )}
          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            style={{ marginTop: 20 }}
          >
            Sign In
          </Button>
        </form>
      </Paper>
    </Container>
  );
};

export default Login;
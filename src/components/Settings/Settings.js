import React, { useState, useEffect } from 'react';
import {
  Box,
  TextField,
  Button,
  Typography,
  Paper,
  Container,
  Stack,
  Snackbar,
  Alert
} from '@mui/material';
import { useNavigate } from 'react-router-dom';

const API_URL = process.env.REACT_APP_API_URL_PRODUCTION;

const Settings = () => {
  const [businessName, setBusinessName] = useState('');
  const [logoUrl, setLogoUrl] = useState('');
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('success');
  const navigate = useNavigate();

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const [titleResponse, logoResponse] = await Promise.all([
        fetch(`${API_URL}/titulo`),
        fetch(`${API_URL}/logo`)
      ]);

      const titleData = await titleResponse.json();
      const logoData = await logoResponse.json();

      setBusinessName(titleData.titulo || '');
      setLogoUrl(logoData.logo || '');
    } catch (error) {
      showSnackbar('Error loading settings', 'error');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const [titleResponse, logoResponse] = await Promise.all([
        fetch(`${API_URL}/titulo`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ valor: businessName }),
        }),
        fetch(`${API_URL}/logo`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ valor: logoUrl }),
        })
      ]);

      if (titleResponse.ok && logoResponse.ok) {
        showSnackbar('Settings saved successfully', 'success');
        setTimeout(() => navigate('/'), 1500);
      } else {
        showSnackbar('Error saving settings', 'error');
      }
    } catch (error) {
      showSnackbar('Error saving settings', 'error');
    }
  };

  const handleCancel = () => {
    navigate('/');
  };

  const showSnackbar = (message, severity) => {
    setSnackbarMessage(message);
    setSnackbarSeverity(severity);
    setOpenSnackbar(true);
  };

  return (
    <Container maxWidth="sm">
      <Paper elevation={3} sx={{ p: 4, mt: 4 }}>
        <Typography variant="h5" component="h2" gutterBottom>
          Business Settings
        </Typography>
        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
          <TextField
            fullWidth
            label="Business Name"
            value={businessName}
            onChange={(e) => setBusinessName(e.target.value)}
            margin="normal"
            required
            variant="outlined"
          />
          <TextField
            fullWidth
            label="Logo URL"
            value={logoUrl}
            onChange={(e) => setLogoUrl(e.target.value)}
            margin="normal"
            required
            variant="outlined"
            helperText="Enter the URL of your business logo"
          />
          <Stack direction="row" spacing={2} sx={{ mt: 3 }}>
            <Button
              type="submit"
              variant="contained"
              color="primary"
              fullWidth
            >
              Save
            </Button>
            <Button
              variant="outlined"
              color="secondary"
              fullWidth
              onClick={handleCancel}
            >
              Cancel
            </Button>
          </Stack>
        </Box>
      </Paper>
      <Snackbar
        open={openSnackbar}
        autoHideDuration={3000}
        onClose={() => setOpenSnackbar(false)}
      >
        <Alert 
          onClose={() => setOpenSnackbar(false)} 
          severity={snackbarSeverity}
          sx={{ width: '100%' }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default Settings;
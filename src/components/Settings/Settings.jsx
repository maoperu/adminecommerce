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
import { Editor } from '@tinymce/tinymce-react';

const API_URL = process.env.REACT_APP_API_URL_PRODUCTION;
const TINYMCE_API = process.env.REACT_APP_TINYMCE_API_KEY;

const Settings = () => {
  const [businessName, setBusinessName] = useState('');
  const [logoUrl, setLogoUrl] = useState('');
  const [cintillo, setCintillo] = useState('');
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('success');
  const navigate = useNavigate();

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const [titleResponse, logoResponse, cintilloResponse] = await Promise.all([
        fetch(`${API_URL}/titulo`),
        fetch(`${API_URL}/logo`),
        fetch(`${API_URL}/cintillo`)
      ]);

      const titleData = await titleResponse.json();
      const logoData = await logoResponse.json();
      const cintilloData = await cintilloResponse.json();

      setBusinessName(titleData.titulo || '');
      setLogoUrl(logoData.logo || '');
      setCintillo(cintilloData.cintillo || '');
    } catch (error) {
      showSnackbar('Error al cargar la configuración', 'error');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const [titleResponse, logoResponse, cintilloResponse] = await Promise.all([
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
        }),
        fetch(`${API_URL}/cintillo`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ valor: cintillo }),
        })
      ]);

      if (titleResponse.ok && logoResponse.ok && cintilloResponse.ok) {
        showSnackbar('Configuración guardada exitosamente', 'success');
        setTimeout(() => navigate('/'), 1500);
      } else {
        showSnackbar('Error al guardar la configuración', 'error');
      }
    } catch (error) {
      showSnackbar('Error al guardar la configuración', 'error');
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
          Configuración del Negocio
        </Typography>
        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
          <TextField
            fullWidth
            label="Nombre del Negocio"
            value={businessName}
            onChange={(e) => setBusinessName(e.target.value)}
            margin="normal"
            required
            variant="outlined"
          />
          <TextField
            fullWidth
            label="URL del Logo"
            value={logoUrl}
            onChange={(e) => setLogoUrl(e.target.value)}
            margin="normal"
            required
            variant="outlined"
            helperText="Ingrese la URL de su logo"
          />
          
          <Typography variant="subtitle1" sx={{ mt: 2, mb: 1 }}>
            Cintillo
          </Typography>
          <Editor
            apiKey={TINYMCE_API}
            value={cintillo}
            onEditorChange={(content) => setCintillo(content)}
            init={{
              height: 300,
              menubar: false,
              plugins: [
                'advlist', 'autolink', 'lists', 'link', 'image', 'charmap', 'preview',
                'anchor', 'searchreplace', 'visualblocks', 'code', 'fullscreen',
                'insertdatetime', 'media', 'table', 'code', 'help', 'wordcount'
              ],
              toolbar: 'undo redo | blocks | ' +
                'bold italic forecolor | alignleft aligncenter ' +
                'alignright alignjustify | bullist numlist outdent indent | ' +
                'removeformat | help',
            }}
          />
          
          <Stack direction="row" spacing={2} sx={{ mt: 3 }}>
            <Button
              type="submit"
              variant="contained"
              color="primary"
              fullWidth
            >
              Guardar
            </Button>
            <Button
              variant="outlined"
              color="secondary"
              fullWidth
              onClick={handleCancel}
            >
              Cancelar
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
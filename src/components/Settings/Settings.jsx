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
import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import TextAlign from '@tiptap/extension-text-align'
import Color from '@tiptap/extension-color'
import Link from '@tiptap/extension-link' // Añadir esta importación

const API_URL = process.env.REACT_APP_API_URL_PRODUCTION;

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

  const editor = useEditor({
    extensions: [
      StarterKit,
      TextAlign.configure({
        types: ['heading', 'paragraph'],
      }),
      Color,
      Link.configure({
        openOnClick: true,
        HTMLAttributes: {
          rel: 'noopener noreferrer',
          target: '_blank',
        },
      }),
    ],
    content: cintillo,
    onUpdate: ({ editor }) => {
      setCintillo(editor.getHTML());
    },
  });

  // Añadir este useEffect para actualizar el contenido del editor
  useEffect(() => {
    if (editor && cintillo) {
      editor.commands.setContent(cintillo);
    }
  }, [cintillo, editor]);

  const setLink = () => {
    const url = window.prompt('Ingrese la URL:');

    if (url === null) {
      return;
    }

    if (url === '') {
      editor?.chain().focus().extendMarkRange('link').unsetLink().run();
      return;
    }

    editor?.chain().focus().extendMarkRange('link').setLink({ href: url }).run();
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
          <Box sx={{ border: '1px solid #ccc', borderRadius: 1, mb: 2 }}>
            <Box sx={{ p: 1, borderBottom: '1px solid #ccc', bgcolor: '#f5f5f5' }}>
              <Button
                size="small"
                onClick={() => editor?.chain().focus().toggleBold().run()}
                sx={{ minWidth: 'auto', p: 0.5 }}
              >
                <strong>B</strong>
              </Button>
              <Button
                size="small"
                onClick={() => editor?.chain().focus().toggleItalic().run()}
                sx={{ minWidth: 'auto', p: 0.5, mx: 0.5 }}
              >
                <em>I</em>
              </Button>
              <Button
                size="small"
                onClick={() => editor?.chain().focus().setTextAlign('left').run()}
                sx={{ minWidth: 'auto', p: 0.5 }}
              >
                🡄
              </Button>
              <Button
                size="small"
                onClick={() => editor?.chain().focus().setTextAlign('center').run()}
                sx={{ minWidth: 'auto', p: 0.5, mx: 0.5 }}
              >
                ▇
              </Button>
              <Button
                size="small"
                onClick={() => editor?.chain().focus().setTextAlign('right').run()}
                sx={{ minWidth: 'auto', p: 0.5 }}
              >
                🡆
              </Button>
            </Box>
            <Box sx={{ p: 2 }}>
              <EditorContent editor={editor} />
            </Box>
          </Box>
          
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
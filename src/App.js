import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, Link } from 'react-router-dom';
import ProductList from './components/Products/ProductList';
import Login from './components/Auth/Login';
import Settings from './components/Settings/Settings';
import { Container, AppBar, Toolbar, Typography, Button } from '@mui/material';

const API_URL = process.env.REACT_APP_API_URL_PRODUCTION;

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [titulo, setTitulo] = useState('Admin Panel');
  const [logo, setLogo] = useState('');

  useEffect(() => {
    // Obtener título
    fetch(`${API_URL}/titulo`)
      .then(response => response.json())
      .then(data => {
        if (data.titulo) {
          setTitulo(data.titulo);
        }
      })
      .catch(error => {
        console.error('Error al obtener el título:', error);
      });

    // Obtener logo
    fetch(`${API_URL}/logo`)
      .then(response => response.json())
      .then(data => {
        if (data.logo) {
          setLogo(data.logo);
        }
      })
      .catch(error => {
        console.error('Error al obtener el logo:', error);
      });
  }, []);

  const handleLogin = () => {
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
  };

  const ProtectedRoute = ({ children }) => {
    if (!isAuthenticated) {
      return <Navigate to="/login" />;
    }
    return children;
  };

  return (
    <Router>
      <div>
        {isAuthenticated && (
          <AppBar position="static">
            <Toolbar>
              <Typography variant="h6" component="div" sx={{ flexGrow: 1, display: 'flex', alignItems: 'center' }}>
                {logo && <img src={logo} alt="Logo" style={{ height: '30px', marginRight: '10px' }} />}
                {titulo}
              </Typography>
              <Button color="inherit" component={Link} to="/settings">
                Settings
              </Button>
              <Button color="inherit" onClick={handleLogout}>
                Logout
              </Button>
            </Toolbar>
          </AppBar>
        )}
        <Container sx={{ mt: 3 }}>
          <Routes>
            <Route path="/login" element={<Login onLogin={handleLogin} />} />
            <Route
              path="/"
              element={
                <ProtectedRoute>
                  <ProductList />
                </ProtectedRoute>
              }
            />
            <Route
              path="/settings"
              element={
                <ProtectedRoute>
                  <Settings />
                </ProtectedRoute>
              }
            />
          </Routes>
        </Container>
      </div>
    </Router>
  );
}

export default App;
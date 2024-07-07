// src/components/AppBar.tsx
import React from 'react';
import { AppBar as MuiAppBar, Toolbar, Typography, Button, Box } from '@mui/material';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import Sidebar from './Sidebar';

const AppBar: React.FC = () => {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error('Failed to logout', error);
    }
  };

  const handleLogin = () => {
    navigate('/login');
  };

  return (
    <>
      <MuiAppBar position="fixed">
        <Toolbar>
          {currentUser && <Sidebar />}
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Social Media App
          </Typography>
          {currentUser ? (
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Typography variant="body1" component="div" sx={{ marginRight: 2 }}>
                {currentUser.email}
              </Typography>
              <Button color="inherit" onClick={handleLogout}>
                Logout
              </Button>
            </Box>
          ) : (
            <Button color="inherit" onClick={handleLogin}>
              Login
            </Button>
          )}
        </Toolbar>
      </MuiAppBar>
      <Toolbar /> {/* This Toolbar is to push the content below the fixed AppBar */}
    </>
  );
};

export default AppBar;

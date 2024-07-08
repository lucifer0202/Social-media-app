// src/components/Sidebar.tsx
import React, { useState } from 'react';
import { Drawer, List, ListItem, ListItemIcon, ListItemText, IconButton, Toolbar, Typography, Divider, Box } from '@mui/material';
import { Home, PostAdd, ListAlt, Menu, Bookmark } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

const drawerWidth = 240;

const Sidebar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  const handleDrawerToggle = () => {
    setIsOpen(!isOpen);
  };

  return (
    <Box sx={{ display: 'flex' }}>
      <IconButton
        color="inherit"
        aria-label="open drawer"
        edge="start"
        onClick={handleDrawerToggle}
        sx={{ marginRight: 2, display: { sm: 'none' } }}
      >
        <Menu />
      </IconButton>
      <Drawer
        variant="temporary"
        open={isOpen}
        onClose={handleDrawerToggle}
        ModalProps={{
          keepMounted: true, // Better open performance on mobile.
        }}
        sx={{
          display: { xs: 'block', sm: 'none' },
          '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
        }}
      >
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Social Media App
          </Typography>
        <Divider />
        <List>
          <ListItem button onClick={() => { navigate('/'); handleDrawerToggle(); }}>
            <ListItemIcon>
              <Home />
            </ListItemIcon>
            <ListItemText primary="My Feed Page" />
          </ListItem>
          <ListItem button onClick={() => { navigate('/myposts'); handleDrawerToggle(); }}>
            <ListItemIcon>
              <ListAlt />
            </ListItemIcon>
            <ListItemText primary="My Posts" />
          </ListItem>
          <ListItem button onClick={() => { navigate('/createpost'); handleDrawerToggle(); }}>
            <ListItemIcon>
              <PostAdd />
            </ListItemIcon>
            <ListItemText primary="Create Post" />
          </ListItem>
          <ListItem button onClick={() => { navigate('/savedposts'); handleDrawerToggle(); }}>
            <ListItemIcon>
              <Bookmark />
            </ListItemIcon>
            <ListItemText primary="Saved Posts" />
          </ListItem>
        </List>
      </Drawer>
      <Drawer
        variant="permanent"
        sx={{
          display: { xs: 'none', sm: 'block' },
          '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
        }}
        open
      >
        <Toolbar>
          <Typography variant="h6" noWrap>
            Social Media
          </Typography>
        </Toolbar>
        <Divider />
        <List>
          <ListItem button onClick={() => navigate('/')}>
            <ListItemIcon>
              <Home />
            </ListItemIcon>
            <ListItemText primary="My Feed Page" />
          </ListItem>
          <ListItem button onClick={() => navigate('/myposts')}>
            <ListItemIcon>
              <ListAlt />
            </ListItemIcon>
            <ListItemText primary="My Posts" />
          </ListItem>
          <ListItem button onClick={() => navigate('/createpost')}>
            <ListItemIcon>
              <PostAdd />
            </ListItemIcon>
            <ListItemText primary="Create Post" />
          </ListItem>
          <ListItem button onClick={() => navigate('/savedposts')}>
            <ListItemIcon>
              <Bookmark />
            </ListItemIcon>
            <ListItemText primary="Saved Posts" />
          </ListItem>
        </List>
      </Drawer>
    </Box>
  );
};

export default Sidebar;

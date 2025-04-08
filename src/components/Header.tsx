import React from 'react';
import { AppBar, Toolbar, Typography, IconButton } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';

interface HeaderProps {
  drawerWidth: number;
  handleDrawerToggle: () => void;
  channelName: string;
}

const Header: React.FC<HeaderProps> = ({ drawerWidth, handleDrawerToggle, channelName }) => {
  return (
    <AppBar
      position="fixed"
      sx={{
        width: { md: `calc(100% - ${drawerWidth}px)` },
        ml: { minWidth: `${drawerWidth}px` },
      }}
      data-cy="header"
    >
      <Toolbar>
        <IconButton
          color="inherit"
          aria-label="open drawer"
          edge="start"
          onClick={handleDrawerToggle}
          sx={{ mr: 2, display: { md: 'none' } }}
          data-cy="menu-button"
        >
          <MenuIcon />
        </IconButton>
        <Typography variant="h6" noWrap component="div" data-cy="channel-name">
          {channelName}
        </Typography>
      </Toolbar>
    </AppBar>
  );
};

export default Header;

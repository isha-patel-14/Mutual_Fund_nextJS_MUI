'use client';

import { AppBar, Toolbar, Typography, Button, Box, Container, IconButton, Menu, MenuItem } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import { usePathname, useRouter } from 'next/navigation';
import { useState } from 'react';

const pages = [
  { name: 'Explore Funds', path: '/funds' },
  { name: 'SIP Calculator', path: '/sip-calculator' },
  { name: 'Compare Funds', path: '/compare' },
];

export default function Navbar() {
  const router = useRouter();
  const pathname = usePathname();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const handleMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleNavigation = (path: string) => {
    router.push(path);
    handleClose();
  };

  return (
    <AppBar position="sticky" sx={{ backgroundColor: 'background.paper', boxShadow: 2 }}>
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          {/* Logo/Brand - visible on all screens */}
          <Typography
            variant="h6"
            onClick={() => router.push('/')}
            sx={{
              mr: 2,
              fontFamily: 'monospace',
              fontWeight: 700,
              letterSpacing: '.2rem',
              color: 'primary.main',
              textDecoration: 'none',
              cursor: 'pointer',
              flexGrow: { xs: 1, md: 0 }
            }}
          >
            MF EXPLORER
          </Typography>

          {/* Mobile menu */}
          <Box sx={{ display: { xs: 'flex', md: 'none' } }}>
            <IconButton
              size="large"
              aria-label="menu"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              onClick={handleMenu}
              color="primary"
            >
              <MenuIcon />
            </IconButton>
            <Menu
              id="menu-appbar"
              anchorEl={anchorEl}
              anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'right',
              }}
              keepMounted
              transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              open={Boolean(anchorEl)}
              onClose={handleClose}
            >
              {pages.map((page) => (
                <MenuItem 
                  key={page.path}
                  onClick={() => handleNavigation(page.path)}
                  selected={pathname === page.path}
                >
                  <Typography textAlign="center">{page.name}</Typography>
                </MenuItem>
              ))}
            </Menu>
          </Box>

          {/* Desktop menu */}
          <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' }, gap: 2, justifyContent: 'flex-end' }}>
            {pages.map((page) => (
              <Button
                key={page.path}
                onClick={() => handleNavigation(page.path)}
                sx={{
                  color: 'text.primary',
                  position: 'relative',
                  '&::after': {
                    content: '""',
                    position: 'absolute',
                    bottom: 0,
                    left: 0,
                    width: pathname === page.path ? '100%' : '0%',
                    height: '2px',
                    backgroundColor: 'primary.main',
                    transition: 'width 0.3s ease-in-out'
                  },
                  '&:hover::after': {
                    width: '100%'
                  }
                }}
              >
                {page.name}
              </Button>
            ))}
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
}
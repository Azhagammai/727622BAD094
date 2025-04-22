import { AppBar, Toolbar, Typography, Button, Box, Container } from '@mui/material';
import { Link, useLocation } from 'react-router-dom';

const Navbar = () => {
  const location = useLocation();

  const navItems = [
    { path: '/', label: 'Feed' },
    { path: '/trending', label: 'Trending Posts' },
    { path: '/top-users', label: 'Top Users' },
    { path: '/calculator', label: 'Number Calculator' },
  ];

  return (
    <AppBar position="fixed" sx={{ top: 0, left: 0, right: 0, zIndex: 1000 }}>
      <Container maxWidth="xl">
        <Toolbar sx={{ 
          display: 'flex', 
          justifyContent: 'space-between',
          alignItems: 'center',
          height: '64px',
          width: '100%'
        }}>
          <Typography 
            variant="h6" 
            component="div" 
            sx={{ 
              flexGrow: 0,
              fontWeight: 'bold',
              fontSize: { xs: '1rem', sm: '1.25rem' }
            }}
          >
            Social Media Analytics
          </Typography>
          <Box sx={{ 
            display: 'flex',
            gap: { xs: 1, sm: 2 },
            alignItems: 'center'
          }}>
            {navItems.map((item) => (
              <Button
                key={item.path}
                component={Link}
                to={item.path}
                color="inherit"
                sx={{
                  fontWeight: location.pathname === item.path ? 'bold' : 'normal',
                  textDecoration: location.pathname === item.path ? 'underline' : 'none',
                  fontSize: { xs: '0.8rem', sm: '0.9rem' },
                  whiteSpace: 'nowrap',
                  padding: { xs: '6px 8px', sm: '8px 16px' }
                }}
              >
                {item.label}
              </Button>
            ))}
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
};

export default Navbar; 
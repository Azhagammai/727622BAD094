import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material';
import CssBaseline from '@mui/material/CssBaseline';
import { useEffect, useState } from 'react';
import TopUsers from './pages/TopUsers';
import TrendingPosts from './pages/TrendingPosts';
import Feed from './pages/Feed';
import Navbar from './components/Navbar';
import NumberCalculator from './components/NumberCalculator';
import authService from './services/authService';
import { CircularProgress, Box, Alert, Snackbar } from '@mui/material';

const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
  },
});

function App() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const initializeAuth = async () => {
      try {
      
        const isAuthenticated = await authService.verifyToken();
        
        if (!isAuthenticated) {
       
          await authService.register();
        }
      } catch (err) {
        setError(err.message || 'Failed to initialize authentication');
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();
  }, []);

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
          <Navbar />
          <Box component="main" sx={{ 
            flexGrow: 1, 
            pt: '80px',
            px: { xs: 2, sm: 3 },
            width: '100%',
            maxWidth: '1440px',
            mx: 'auto'
          }}>
            <Routes>
              <Route path="/" element={<Feed />} />
              <Route path="/top-users" element={<TopUsers />} />
              <Route path="/trending" element={<TrendingPosts />} />
              <Route path="/calculator" element={<NumberCalculator />} />
            </Routes>
          </Box>
          {error && (
            <Snackbar open={!!error} autoHideDuration={6000} onClose={() => setError(null)}>
              <Alert severity="error" onClose={() => setError(null)}>
                {error}
              </Alert>
            </Snackbar>
          )}
        </Box>
      </Router>
    </ThemeProvider>
  );
}

export default App;

import { useState, useEffect } from 'react';
import { 
  Container, 
  Typography, 
  Box, 
  Card, 
  CardContent, 
  Button, 
  CircularProgress,
  Grid,
  Alert,
  Snackbar
} from '@mui/material';
import NumberService from '../services/numberService';

const numberService = new NumberService(10); 

const NumberCalculator = () => {
  const [results, setResults] = useState({
    p: null,
    f: null, 
    e: null, 
    r: null  
  });
  const [loading, setLoading] = useState({});
  const [errors, setErrors] = useState({});
  const [apiStatus, setApiStatus] = useState(null);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'info' });

  const numberTypes = [
    { id: 'p', label: 'Prime Numbers' },
    { id: 'f', label: 'Fibonacci Numbers' },
    { id: 'e', label: 'Even Numbers' },
    { id: 'r', label: 'Random Numbers' }
  ];

  
  useEffect(() => {
    const verifyApis = async () => {
      try {
        const status = await numberService.verifyApiEndpoints();
        setApiStatus(status);
        
        const failedEndpoints = Object.entries(status)
          .filter(([_, status]) => status !== 'OK')
          .map(([type, _]) => numberTypes.find(t => t.id === type)?.label);
        
        if (failedEndpoints.length > 0) {
          setSnackbar({
            open: true,
            message: `Warning: Could not connect to: ${failedEndpoints.join(', ')}`,
            severity: 'warning'
          });
        }
      } catch (error) {
        setSnackbar({
          open: true,
          message: 'Error verifying API endpoints',
          severity: 'error'
        });
      }
    };

    verifyApis();
  }, []);

  const fetchNumbers = async (type) => {
    setLoading(prev => ({ ...prev, [type]: true }));
    setErrors(prev => ({ ...prev, [type]: null }));
    
    try {
      const result = await numberService.fetchNumbers(type);
      setResults(prev => ({ ...prev, [type]: result }));
    } catch (error) {
      setErrors(prev => ({ 
        ...prev, 
        [type]: error.message || 'Error fetching numbers'
      }));
      setSnackbar({
        open: true,
        message: `Error fetching ${numberTypes.find(t => t.id === type)?.label}: ${error.message}`,
        severity: 'error'
      });
    } finally {
      setLoading(prev => ({ ...prev, [type]: false }));
    }
  };

  const renderNumberList = (numbers) => {
    if (!numbers || numbers.length === 0) return 'No numbers';
    return numbers.join(', ');
  };

  const handleSnackbarClose = () => {
    setSnackbar(prev => ({ ...prev, open: false }));
  };

  return (
    <Container>
      <Box sx={{ py: 4 }}>
        <Typography variant="h4" gutterBottom>
          Number Calculator
        </Typography>
        
        {apiStatus && (
          <Box sx={{ mb: 3 }}>
            <Typography variant="h6" gutterBottom>
              API Status:
            </Typography>
            <Grid container spacing={2}>
              {Object.entries(apiStatus).map(([type, status]) => (
                <Grid item xs={6} sm={3} key={type}>
                  <Alert severity={status === 'OK' ? 'success' : 'error'}>
                    {numberTypes.find(t => t.id === type)?.label}: {status === 'OK' ? 'Connected' : 'Error'}
                  </Alert>
                </Grid>
              ))}
            </Grid>
          </Box>
        )}

        <Grid container spacing={3}>
          {numberTypes.map(({ id, label }) => (
            <Grid item xs={12} md={6} key={id}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    {label}
                  </Typography>
                  <Button 
                    variant="contained" 
                    onClick={() => fetchNumbers(id)}
                    disabled={loading[id]}
                    sx={{ mb: 2 }}
                  >
                    {loading[id] ? <CircularProgress size={24} /> : 'Fetch Numbers'}
                  </Button>

                  {errors[id] && (
                    <Alert severity="error" sx={{ mb: 2 }}>
                      {errors[id]}
                    </Alert>
                  )}
                  
                  {results[id] && (
                    <Box>
                      <Typography variant="subtitle1">
                        Previous Window State:
                      </Typography>
                      <Typography variant="body2" sx={{ mb: 1 }}>
                        {renderNumberList(results[id].windowPrevState)}
                      </Typography>
                      
                      <Typography variant="subtitle1">
                        Current Window State:
                      </Typography>
                      <Typography variant="body2" sx={{ mb: 1 }}>
                        {renderNumberList(results[id].windowCurrState)}
                      </Typography>
                      
                      <Typography variant="subtitle1">
                        Latest Numbers:
                      </Typography>
                      <Typography variant="body2" sx={{ mb: 1 }}>
                        {renderNumberList(results[id].numbers)}
                      </Typography>
                      
                      <Typography variant="h6" color="primary">
                        Average: {results[id].avg}
                      </Typography>
                    </Box>
                  )}
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
      >
        <Alert onClose={handleSnackbarClose} severity={snackbar.severity}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default NumberCalculator; 
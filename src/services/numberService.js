import axios from 'axios';
import authService from './authService';

const BASE_URL = 'http://20.244.56.144/evaluation-service';

// Create axios instance with timeout
const api = axios.create({
  baseURL: BASE_URL,
  timeout: 500, // 500ms timeout as per requirements
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = authService.getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add response interceptor to handle token expiration
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid, try to register again
      try {
        await authService.register();
        // Retry the original request
        const token = authService.getToken();
        error.config.headers.Authorization = `Bearer ${token}`;
        return api.request(error.config);
      } catch (err) {
        return Promise.reject(err);
      }
    }
    return Promise.reject(error);
  }
);

class NumberService {
  constructor(windowSize = 10) {
    this.windowSize = windowSize;
    this.numberCache = {
      p: [], // prime numbers
      f: [], // fibonacci numbers
      e: [], // even numbers
      r: [], // random numbers
    };
  }

  // Verify API endpoints
  async verifyApiEndpoints() {
    const endpoints = {
      p: '/primes',
      f: '/fibo',
      e: '/even',
      r: '/rand'
    };

    const status = {};
    
    for (const [type, endpoint] of Object.entries(endpoints)) {
      try {
        await api.get(endpoint);
        status[type] = 'OK';
      } catch (error) {
        status[type] = error.response?.status || 'ERROR';
      }
    }
    
    return status;
  }

  // Fetch numbers based on type
  async fetchNumbers(type) {
    try {
      let endpoint;
      switch (type) {
        case 'p':
          endpoint = '/primes';
          break;
        case 'f':
          endpoint = '/fibo';
          break;
        case 'e':
          endpoint = '/even';
          break;
        case 'r':
          endpoint = '/rand';
          break;
        default:
          throw new Error('Invalid number type');
      }

      const response = await api.get(endpoint);
      const numbers = response.data.numbers;

      // Update cache
      this.updateCache(type, numbers);

      return {
        windowPrevState: [...this.numberCache[type]],
        windowCurrState: this.getWindowState(type),
        numbers: numbers,
        avg: this.calculateAverage(type)
      };
    } catch (error) {
      if (error.code === 'ECONNABORTED') {
        throw new Error('Request timeout');
      }
      throw error;
    }
  }

  // Update cache with new numbers
  updateCache(type, numbers) {
    // Filter out duplicates
    const uniqueNumbers = numbers.filter(num => !this.numberCache[type].includes(num));
    
    // Add new numbers
    this.numberCache[type].push(...uniqueNumbers);
    
    // Keep only window size numbers
    if (this.numberCache[type].length > this.windowSize) {
      this.numberCache[type] = this.numberCache[type].slice(-this.windowSize);
    }
  }

  // Get current window state
  getWindowState(type) {
    return [...this.numberCache[type]];
  }

  // Calculate average of current window
  calculateAverage(type) {
    const numbers = this.numberCache[type];
    if (numbers.length === 0) return 0;
    
    const sum = numbers.reduce((acc, curr) => acc + curr, 0);
    return (sum / numbers.length).toFixed(2);
  }
}

export default NumberService; 
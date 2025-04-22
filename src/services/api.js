import axios from 'axios';
import authService from './authService';

const BASE_URL = 'http://20.244.56.144/evaluation-service';

// Create axios instance
const api = axios.create({
  baseURL: BASE_URL,
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
  (error) => Promise.reject(error)
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

// Data service
export const dataService = {
  // Get all users
  getUsers: async () => {
    const response = await api.get('/users');
    return response.data;
  },

  // Get all posts
  getPosts: async () => {
    const response = await api.get('/posts');
    return response.data;
  },

  // Get comments for a post
  getComments: async (postId) => {
    const response = await api.get(`/posts/${postId}/comments`);
    return response.data;
  }
}; 
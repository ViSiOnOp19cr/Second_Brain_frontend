import axios from 'axios';
import type { AxiosError, AxiosResponse, InternalAxiosRequestConfig } from 'axios';
import { BACKEND_URL } from '../config';

// Create axios instance with default config
const api = axios.create({
  baseURL: BACKEND_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Request interceptor for adding auth token
api.interceptors.request.use(
    (config: InternalAxiosRequestConfig): InternalAxiosRequestConfig => {
      const token = localStorage.getItem('token');
      
      if (token && config.headers) {
        config.headers.Authorization = token;
      }
      
      return config;
  },
  (error: AxiosError) => {
    return Promise.reject(error);
  }
);

// Response interceptor for handling common error cases
api.interceptors.response.use(
  (response: AxiosResponse) => response,
  (error: AxiosError) => {
    const { response } = error;
    
    // Handle specific HTTP status codes
    if (response) {
      // Handle authentication errors
      if (response.status === 401) {
        // Clear token if it's invalid or expired
        localStorage.removeItem('token');
        
        // Redirect to login if not already there
        if (window.location.pathname !== '/signin') {
          window.location.href = '/signin';
        }
      }
      
      // Server errors
      if (response.status >= 500) {
        console.error('Server error:', error);
      }
    } else if (error.request) {
      // Network error (no response)
      console.error('Network error:', error);
    } else {
      // Request setup error
      console.error('Request error:', error);
    }
    
    return Promise.reject(error);
  }
);

export default api;

import axios from 'axios';

// Debug: Log the API URL
const baseURL = import.meta.env.VITE_API_URL?.endsWith('/')
  ? import.meta.env.VITE_API_URL.slice(0, -1)
  : import.meta.env.VITE_API_URL;

console.log('API URL:', baseURL);

const api = axios.create({
  baseURL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
});

// Add request interceptor for debugging
api.interceptors.request.use(
  (config) => {
    // Ensure URL doesn't have double /api/v1
    if (config.url?.startsWith('/api/v1') && config.baseURL?.endsWith('/api/v1')) {
      config.url = config.url.replace('/api/v1', '');
    }
    
    console.log('API Request:', {
      method: config.method,
      url: config.url,
      baseURL: config.baseURL,
      fullUrl: `${config.baseURL}${config.url}`
    });
    return config;
  },
  (error) => {
    console.error('API Request Error:', error);
    return Promise.reject(error);
  }
);

// Add response interceptor for error handling
api.interceptors.response.use(
  (response) => {
    console.log('API Response:', {
      status: response.status,
      url: response.config.url,
      data: response.data
    });
    return response;
  },
  (error) => {
    console.error('API Error:', {
      message: error.message,
      status: error.response?.status,
      data: error.response?.data,
      url: error.config?.url,
      fullUrl: `${error.config?.baseURL}${error.config?.url}`
    });
    if (error.response?.status === 401) {
      // Handle unauthorized access
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api; 
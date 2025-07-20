import axios from 'axios';
window.axios = axios;

// Set the base URL to the current domain
window.axios.defaults.baseURL = window.location.origin;

// Set common headers
window.axios.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest';

// Add response interceptor for better error handling
window.axios.interceptors.response.use(
  response => response,
  error => {
    console.error('Axios Error:', error);

    // Log additional details in production
    if (process.env.NODE_ENV === 'production') {
      console.error('Request URL:', error.config?.url);
      console.error('Request Method:', error.config?.method);
      console.error('Status:', error.response?.status);
      console.error('Status Text:', error.response?.statusText);
      console.error('Response Data:', error.response?.data);
    }

    return Promise.reject(error);
  }
);

import axios from 'axios';

// Create an axios instance with a predefined configuration
const apiClient = axios.create({
  baseURL: '/api', // Your new base URL from the .env file or just hardcoded
});

// Use an interceptor to automatically add the Authorization header
apiClient.interceptors.request.use(
  (config) => {
    // Get the token from localStorage
    const token = localStorage.getItem('patientToken');
    if (token) {
      // If the token exists, add it to the request headers
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    // Handle the error
    return Promise.reject(error);
  }
);

export default apiClient;
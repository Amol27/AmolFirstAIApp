import axios from 'axios';

const API_BASE_URL = 'https://jsonplaceholder.typicode.com';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

apiClient.interceptors.request.use(
  (config) => {
    console.log('API Request:', config.method?.toUpperCase(), config.url);
    return config;
  },
  (error) => {
    console.error('API Request Error:', error);
    return Promise.reject(error);
  }
);

apiClient.interceptors.response.use(
  (response) => {
    console.log('API Response:', response.status, response.config.url);
    return response;
  },
  (error) => {
    console.error('API Response Error:', error.response?.status, error.message);
    return Promise.reject(error);
  }
);

export const apiService = {
  get: (url, config = {}) => apiClient.get(url, config),
  post: (url, data, config = {}) => apiClient.post(url, data, config),
  put: (url, data, config = {}) => apiClient.put(url, data, config),
  delete: (url, config = {}) => apiClient.delete(url, config),
};

export const authAPI = {
  login: (credentials) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          data: {
            user: { id: 1, name: 'John Doe', email: credentials.email },
            token: 'mock-jwt-token-12345',
          },
        });
      }, 1000);
    });
  },
  
  logout: () => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({ data: { message: 'Logged out successfully' } });
      }, 500);
    });
  },
};

export const userAPI = {
  getProfile: () => apiService.get('/users/1'),
  updateProfile: (userData) => apiService.put('/users/1', userData),
};

export default apiService;

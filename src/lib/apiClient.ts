import axios, { AxiosInstance, AxiosResponse, AxiosError } from 'axios';

// Environment configuration
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://vitan-task-production.up.railway.app';
const APP_NAME = import.meta.env.VITE_APP_NAME || 'WhatsTask';
const ENV_NAME = import.meta.env.VITE_ENV_NAME || 'development';

// API Response types
export interface ApiResponse<T = any> {
  success: boolean;
  data: T;
  error?: string;
  message?: string;
}

export interface ApiError {
  message: string;
  status: number;
  requestId?: string;
}

// Create axios instance
const apiClient: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
    'X-App-Name': APP_NAME,
    'X-Environment': ENV_NAME,
  },
});

// Request interceptor for auth
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
apiClient.interceptors.response.use(
  (response: AxiosResponse<ApiResponse>) => {
    return response;
  },
  (error: AxiosError<ApiResponse>) => {
    // Handle 401 Unauthorized
    if (error.response?.status === 401) {
      localStorage.removeItem('accessToken');
      localStorage.removeItem('user');
      
      // Get current path for redirect
      const currentPath = window.location.pathname;
      const redirectTo = currentPath !== '/login' ? currentPath : '/tasks';
      
      window.location.href = `/login?redirectTo=${encodeURIComponent(redirectTo)}`;
      return Promise.reject({
        message: 'Session expired. Please login again.',
        status: 401,
      });
    }

    // Handle other errors
    const apiError: ApiError = {
      message: error.response?.data?.error || error.message || 'An unexpected error occurred',
      status: error.response?.status || 500,
      requestId: error.response?.headers?.['x-request-id'] as string,
    };

    return Promise.reject(apiError);
  }
);

// API helper functions
export const api = {
  get: <T>(url: string, config = {}) => 
    apiClient.get<ApiResponse<T>>(url, config).then(res => res.data),
  
  post: <T>(url: string, data = {}, config = {}) => 
    apiClient.post<ApiResponse<T>>(url, data, config).then(res => res.data),
  
  put: <T>(url: string, data = {}, config = {}) => 
    apiClient.put<ApiResponse<T>>(url, data, config).then(res => res.data),
  
  delete: <T>(url: string, config = {}) => 
    apiClient.delete<ApiResponse<T>>(url, config).then(res => res.data),
  
  patch: <T>(url: string, data = {}, config = {}) => 
    apiClient.patch<ApiResponse<T>>(url, data, config).then(res => res.data),
};

export default apiClient;

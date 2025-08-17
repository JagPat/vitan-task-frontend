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

// Central API function using fetch
export async function api(path: string, init: RequestInit = {}) {
  const url = `${API_BASE_URL}${path}`;
  
  // Add auth token if present
  const token = localStorage.getItem('accessToken');
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    'X-App-Name': APP_NAME,
    'X-Environment': ENV_NAME,
    ...(init.headers as Record<string, string> || {}),
  };
  
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const response = await fetch(url, {
    ...init,
    headers,
  });

  // Handle 401 Unauthorized
  if (response.status === 401) {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('user');
    
    // Get current path for redirect
    const currentPath = window.location.pathname;
    const redirectTo = currentPath !== '/login' ? currentPath : '/tasks';
    
    window.location.href = `/login?redirectTo=${encodeURIComponent(redirectTo)}`;
    throw new Error('Session expired. Please login again.');
  }

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error || `${response.status} ${response.statusText}`);
  }

  return response.json();
}

// API helper functions for backward compatibility
export const apiClient = {
  get: (url: string, config = {}) => 
    api(url, { method: 'GET', ...config }),
  
  post: (url: string, data = {}, config = {}) => 
    api(url, { method: 'POST', body: JSON.stringify(data), ...config }),
  
  put: (url: string, data = {}, config = {}) => 
    api(url, { method: 'PUT', body: JSON.stringify(data), ...config }),
  
  delete: (url: string, config = {}) => 
    api(url, { method: 'DELETE', ...config }),
  
  patch: (url: string, data = {}, config = {}) => 
    api(url, { method: 'PATCH', body: JSON.stringify(data), ...config }),
};

export default apiClient;

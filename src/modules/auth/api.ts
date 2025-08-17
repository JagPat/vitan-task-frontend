import { api } from '../../lib/apiClient';

// Types
export interface LoginCredentials {
  email?: string;
  phone?: string;
  password: string;
}

export interface User {
  id: string;
  email?: string;
  phone?: string;
  name: string;
  role: string;
  is_verified: boolean;
}

export interface AuthResponse {
  user: User;
  token: string;
  expiresIn: string;
}

export interface RegisterUserData {
  email?: string;
  phone?: string;
  password: string;
  name: string;
  role?: string;
}

// Auth API functions
export const authApi = {
  // Login user
  login: async (credentials: LoginCredentials): Promise<AuthResponse> => {
    const response = await api('/api/modules/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
    if (response.success) {
      localStorage.setItem('accessToken', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
    }
    return response.data;
  },

  // Register new user
  register: async (userData: RegisterUserData): Promise<{ user: User }> => {
    const response = await api('/api/modules/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
    return response.data;
  },

  // Logout user
  logout: (): void => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('user');
    window.location.href = '/login';
  },

  // Get current user
  getCurrentUser: (): User | null => {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
  },

  // Check if user is authenticated
  isAuthenticated: (): boolean => {
    return !!localStorage.getItem('accessToken');
  },

  // Get auth token
  getToken: (): string | null => {
    return localStorage.getItem('accessToken');
  },

  // Update password
  updatePassword: async (currentPassword: string, newPassword: string): Promise<{ message: string }> => {
    const response = await api('/api/modules/auth/password/update', {
      method: 'POST',
      body: JSON.stringify({
        currentPassword,
        newPassword,
      }),
    });
    return response.data;
  },

  // Health check
  health: async () => {
    return api('/api/modules/auth/health');
  },
};

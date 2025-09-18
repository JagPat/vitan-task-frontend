import { useState, useEffect, useCallback } from 'react';
import jwt_decode from 'jwt-decode';

/**
 * Custom hook for authentication with multi-role support
 * Supports admin and user roles with JWT token management
 */
export const useAuth = () => {
  const DEV_MODE = (import.meta?.env?.VITE_NO_AUTH === 'true') || (import.meta?.env?.VITE_DEV_MODE === 'true');
  const [authUser, setAuthUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Login function
  const login = useCallback((userData) => {
    try {
      const { token, user } = userData;
      
      // Store token based on role
      if (user.role === 'admin') {
        localStorage.setItem('adminToken', token);
      } else {
        localStorage.setItem('userToken', token);
      }
      
      // Store user info
      localStorage.setItem('authUser', JSON.stringify(user));
      
      setAuthUser(user);
      setError(null);
      
      return user;
    } catch (error) {
      console.error('Login error:', error);
      setError('Login failed');
      throw error;
    }
  }, []);

  // Logout function
  const logout = useCallback(() => {
    localStorage.removeItem('adminToken');
    localStorage.removeItem('userToken');
    localStorage.removeItem('authUser');
    setAuthUser(null);
    setError(null);
  }, []);
  // Initialize auth state from localStorage
  useEffect(() => {
    const initializeAuth = () => {
      try {
        const token = localStorage.getItem('adminToken') || localStorage.getItem('userToken');
        if (token) {
          const decoded = jwt_decode(token);
          const now = Date.now() / 1000;

          if (decoded.exp > now) {
            const user = {
              id: decoded.userId,
              email: decoded.email,
              role: decoded.role,
              loginMethod: decoded.loginMethod,
              token,
              exp: decoded.exp,
            };
            setAuthUser(user);
          } else {
            logout();
          }
        } else if (DEV_MODE) {
          const storedUser = localStorage.getItem('authUser');
          if (storedUser) {
            const user = JSON.parse(storedUser);
            setAuthUser(user);
          }
        }
      } catch (error) {
        console.error('Error initializing auth:', error);
        logout();
      } finally {
        setIsLoading(false);
      }
    };

    initializeAuth();
  }, [DEV_MODE, logout]);


  // Check if user is authenticated
  const isAuthenticated = useCallback(() => {
    if (DEV_MODE) return !!authUser; // allow tokenless in dev mode
    return !!authUser && !!authUser.token;
  }, [authUser, DEV_MODE]);

  // Check if user is admin
  const isAdmin = useCallback(() => {
    return authUser?.role === 'admin';
  }, [authUser]);

  // Check if user is regular user
  const isUser = useCallback(() => {
    return authUser?.role === 'user';
  }, [authUser]);

  // Check if user has specific role
  const hasRole = useCallback((role) => {
    return authUser?.role === role;
  }, [authUser]);

  // Check if user has any of the specified roles
  const hasAnyRole = useCallback((roles) => {
    return roles.includes(authUser?.role);
  }, [authUser]);

  // Get user's permissions based on role
  const getUserPermissions = useCallback(() => {
    if (!authUser) return [];
    
    switch (authUser.role) {
      case 'super_admin':
        return ['read', 'write', 'delete', 'admin', 'manage_users', 'system_settings', 'manage_organizations', 'manage_billing'];
      case 'admin':
        return ['read', 'write', 'delete', 'admin', 'manage_users', 'system_settings'];
      case 'moderator':
        return ['read', 'write', 'create_tasks', 'view_dashboard'];
      case 'user':
        return ['read', 'write', 'create_tasks', 'view_dashboard'];
      default:
        return [];
    }
  }, [authUser]);

  // Check if user has specific permission
  const hasPermission = useCallback((permission) => {
    const permissions = getUserPermissions();
    return permissions.includes(permission);
  }, [getUserPermissions]);

  // Refresh token (if needed)
  const refreshToken = useCallback(async () => {
    try {
      const token = localStorage.getItem('adminToken') || localStorage.getItem('userToken');
      if (!token) return false;

      const response = await fetch('https://vitan-task-backend-production.up.railway.app/api/modules/auth/google/verify', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        return true;
      } else {
        logout();
        return false;
      }
    } catch (error) {
      console.error('Token refresh error:', error);
      logout();
      return false;
    }
  }, [logout]);

  // Auto-refresh token before expiry
   
  useEffect(() => {
    if (!authUser?.exp) return;

    const timeUntilExpiry = (authUser.exp * 1000) - Date.now();
    const refreshTime = Math.max(timeUntilExpiry - (5 * 60 * 1000), 0); // Refresh 5 minutes before expiry

    const timer = setTimeout(() => {
      refreshToken();
    }, refreshTime);

    return () => clearTimeout(timer);
  }, [authUser?.exp, refreshToken]);

  return {
    // State
    authUser,
    isLoading,
    error,
    
    // Actions
    login,
    logout,
    
    // Role checks
    isAuthenticated,
    isAdmin,
    isUser,
    hasRole,
    hasAnyRole,
    
    // Permission checks
    getUserPermissions,
    hasPermission,
    
    // Token management
    refreshToken,
    
    // User info
    user: authUser,
    token: authUser?.token,
    role: authUser?.role,
    email: authUser?.email
  };
};

export default useAuth;

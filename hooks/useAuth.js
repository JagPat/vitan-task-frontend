/**
 * SIMPLIFIED AUTH HOOK - NO AUTHENTICATION REQUIRED FOR TESTING
 * This hook always returns admin role and bypasses all auth checks
 */

export const useAuth = () => {
  // STATIC DEFAULT USER - Always admin for testing
  const defaultUser = {
    id: 'dev-admin-001',
    name: 'Dev Admin',
    email: 'admin@vitan.dev',
    role: 'admin',
    picture: 'https://via.placeholder.com/150/4F46E5/FFFFFF?text=Admin',
    status: 'active',
    loginMethod: 'dev-bypass'
  };

  // Always return admin role
  const isAuthenticated = () => true;
  const isAdmin = () => true;
  const isUser = () => false;
  const hasRole = (role) => role === 'admin';
  const hasAnyRole = (roles) => roles.includes('admin');
  
  // Admin has all permissions
  const getUserPermissions = () => [
    'read', 'write', 'delete', 'admin', 
    'manage_users', 'system_settings', 'create_tasks', 
    'view_dashboard', 'manage_teams', 'manage_projects'
  ];
  
  const hasPermission = (permission) => true;

  // No-op functions for compatibility
  const login = () => console.log('DEV MODE: Login bypassed');
  const logout = () => console.log('DEV MODE: Logout bypassed');
  const tempLogin = () => console.log('DEV MODE: Temp login bypassed');
  const refreshToken = () => Promise.resolve(true);

  return {
    // State - Always authenticated admin
    authUser: defaultUser,
    isLoading: false,
    error: null,
    
    // Actions - No-op for compatibility
    login,
    logout,
    tempLogin,
    
    // Role checks - Always admin
    isAuthenticated,
    isAdmin,
    isUser,
    hasRole,
    hasAnyRole,
    
    // Permission checks - Always true
    getUserPermissions,
    hasPermission,
    
    // Token management - No-op
    refreshToken,
    
    // User info - Always admin
    user: defaultUser,
    token: 'dev-admin-token',
    role: 'admin',
    email: 'admin@vitan.dev'
  };
};

export default useAuth;

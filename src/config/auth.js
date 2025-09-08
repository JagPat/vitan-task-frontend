/**
 * Authentication Configuration
 * Contains settings for Google OAuth and other auth methods
 */

export const authConfig = {
  // Google OAuth Configuration
  google: {
    clientId: import.meta.env.VITE_GOOGLE_CLIENT_ID || 'your_google_oauth_client_id_here',
    scope: 'openid email profile',
    redirectUri: window.location.origin,
  },
  
  // API Configuration
  api: {
    baseUrl: import.meta.env.VITE_API_BASE_URL || 'https://vitan-task-backend-production.up.railway.app',
    endpoints: {
      googleAuth: '/api/modules/auth/google/login',
      googleVerify: '/api/modules/auth/google/verify',
      adminProfile: '/api/modules/auth/admin/profile',
      adminStats: '/api/modules/auth/admin/stats',
      adminLogout: '/api/modules/auth/admin/logout',
    }
  },
  
  // JWT Configuration
  jwt: {
    storageKey: 'adminToken',
    userStorageKey: 'adminUser',
    expiryCheckInterval: 5 * 60 * 1000, // 5 minutes
  },
  
  // Admin Configuration
  admin: {
    allowedEmails: ['jagrutpatel@gmail.com'],
    role: 'admin',
    permissions: ['read', 'write', 'delete', 'admin'],
  }
};

export default authConfig;


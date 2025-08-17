// Auth Module - Frontend
// This module contains all authentication-related components and functionality

export { default as LoginDialog } from '../../components/LoginDialog';
export { default as authApi } from '../../api/whatsTaskClient';

// Auth-related utilities
export { default as authUtils } from '../../utils/authUtils';

// Auth module metadata
export const moduleInfo = {
  name: 'auth',
  version: '2.0.0',
  description: 'Authentication and authorization',
  dependencies: [],
  routes: [
    '/login',
    '/auth/verify',
    '/auth/confirm'
  ]
};

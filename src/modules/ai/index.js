// AI Module - Frontend
// This module contains all AI-related components and functionality

export { default as AIAdminDashboard } from '../../pages/AIAdminDashboard';

// AI-related utilities
export { default as aiApi } from '../../api/whatsTaskClient';

// AI module metadata
export const moduleInfo = {
  name: 'ai',
  version: '1.0.0',
  description: 'AI-powered features and automation',
  dependencies: ['auth', 'tasks', 'analytics'],
  routes: [
    '/ai',
    '/ai/admin',
    '/ai/automation'
  ]
};

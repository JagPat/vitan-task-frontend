// Analytics Module - Frontend
// This module contains all analytics-related components and functionality

export { default as Analytics } from '../../pages/Analytics';
export { default as AnalyticsHeader } from '../../components/analytics/AnalyticsHeader';
export { default as KeyMetrics } from '../../components/analytics/KeyMetrics';
export { default as PriorityBreakdown } from '../../components/analytics/PriorityBreakdown';

// Analytics-related utilities
export { default as analyticsApi } from '../../api/whatsTaskClient';

// Analytics module metadata
export const moduleInfo = {
  name: 'analytics',
  version: '1.0.0',
  description: 'Data analytics and reporting',
  dependencies: ['auth', 'tasks', 'projects', 'users'],
  routes: [
    '/analytics',
    '/analytics/dashboard',
    '/analytics/reports'
  ]
};

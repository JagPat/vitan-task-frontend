// Projects Module - Frontend
// This module contains all project-related components and functionality

export { default as Projects } from '../../pages/Projects';
export { default as ProjectDetails } from '../../pages/ProjectDetails';
export { default as CreateProjectDialog } from '../../components/projects/CreateProjectDialog';
export { default as CreateProjectTaskDialog } from '../../components/projects/CreateProjectTaskDialog';
export { default as ProjectCard } from '../../components/projects/ProjectCard';

// Project-related utilities
export { default as projectUtils } from '../../utils/projectUtils';
export { default as projectApi } from '../../api/whatsTaskClient';

// Project module metadata
export const moduleInfo = {
  name: 'projects',
  version: '2.0.0',
  description: 'Project management and collaboration',
  dependencies: ['auth', 'users', 'tasks'],
  routes: [
    '/projects',
    '/projects/create',
    '/projects/:id',
    '/projects/:id/tasks'
  ]
};

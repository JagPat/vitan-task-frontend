// Tasks Module - Frontend
// This module contains all task-related components and functionality

export { default as TaskList } from '../../components/tasks/TaskList';
export { default as CreateTask } from '../../pages/CreateTask';
export { default as TaskDetails } from '../../pages/TaskDetails';
export { default as MyTasks } from '../../pages/MyTasks';
export { default as DeletedTasks } from '../../pages/DeletedTasks';
export { default as UnifiedTaskView } from '../../pages/UnifiedTaskView';
export { default as TeamTaskView } from '../../pages/TeamTaskView';

// Task-related utilities
export { default as taskUtils } from '../../utils/taskUtils';
export { default as taskApi } from '../../api/whatsTaskClient';

// Task module metadata
export const moduleInfo = {
  name: 'tasks',
  version: '2.0.0',
  description: 'Task management and collaboration',
  dependencies: ['auth', 'users', 'projects'],
  routes: [
    '/tasks',
    '/tasks/create',
    '/tasks/:id',
    '/my-tasks',
    '/deleted-tasks',
    '/team-tasks'
  ]
};

// Users Module - Frontend
// This module contains all user-related components and functionality

export { default as Team } from '../../pages/Team';
export { default as EditUserDialog } from '../../components/team/EditUserDialog';
export { default as InviteUserDialog } from '../../components/team/InviteUserDialog';
export { default as TeamMemberCard } from '../../components/team/TeamMemberCard';

// User-related utilities
export { default as userUtils } from '../../utils/userUtils';
export { default as userApi } from '../../api/whatsTaskClient';

// User module metadata
export const moduleInfo = {
  name: 'users',
  version: '2.0.0',
  description: 'User management and team collaboration',
  dependencies: ['auth'],
  routes: [
    '/team',
    '/users',
    '/users/:id',
    '/users/invite'
  ]
};

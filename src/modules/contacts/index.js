// Contacts Module - Frontend
// This module contains all contact-related components and functionality

export { default as ContactManager } from '../../components/ContactManager';

// Contact-related utilities
export { default as contactApi } from '../../api/whatsTaskClient';

// Contact module metadata
export const moduleInfo = {
  name: 'contacts',
  version: '1.0.0',
  description: 'Contact management and organization',
  dependencies: ['auth', 'users'],
  routes: [
    '/contacts',
    '/contacts/groups',
    '/contacts/import'
  ]
};

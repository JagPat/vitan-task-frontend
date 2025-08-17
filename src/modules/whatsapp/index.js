// WhatsApp Module - Frontend
// This module contains all WhatsApp-related components and functionality

export { default as WhatsAppAdmin } from '../../pages/WhatsAppAdmin';
export { default as WhatsAppTest } from '../../pages/WhatsAppTest';

// WhatsApp-related utilities
export { default as whatsappApi } from '../../api/whatsTaskClient';

// WhatsApp module metadata
export const moduleInfo = {
  name: 'whatsapp',
  version: '1.0.0',
  description: 'WhatsApp integration and messaging',
  dependencies: ['auth', 'users', 'contacts'],
  routes: [
    '/whatsapp',
    '/whatsapp/admin',
    '/whatsapp/test'
  ]
};

import { createClient } from '@base44/sdk';
// import { getAccessToken } from '@base44/sdk/utils/auth-utils';

// Create a client with authentication required
export const base44 = createClient({
  appId: "6880b2fcd196d7d62bb4c007", 
  requiresAuth: true // Ensure authentication is required for all operations
});

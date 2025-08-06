// API Configuration
// This file controls whether to use real backend API or mock API for testing

const API_CONFIG = {
  // Set to 'mock' for frontend-only testing, 'real' for full integration
  mode: process.env.REACT_APP_API_MODE || 'real',
  
  // Real backend configuration
  real: {
    baseURL: 'https://vitan-task-production.up.railway.app',
    timeout: 10000,
    retries: 2
  },
  
  // Mock API configuration
  mock: {
    baseURL: 'mock://localhost',
    timeout: 1000,
    retries: 0
  }
};

// Helper function to get current API mode
export const getApiMode = () => API_CONFIG.mode;

// Helper function to check if using mock API
export const isMockMode = () => API_CONFIG.mode === 'mock';

// Helper function to get API configuration
export const getApiConfig = () => {
  const mode = getApiMode();
  return {
    ...API_CONFIG[mode],
    mode
  };
};

// Helper function to get base URL
export const getBaseURL = () => {
  const config = getApiConfig();
  return config.baseURL;
};

// Helper function to get timeout
export const getTimeout = () => {
  const config = getApiConfig();
  return config.timeout;
};

// Helper function to get retry count
export const getRetries = () => {
  const config = getApiConfig();
  return config.retries;
};

export default API_CONFIG; 
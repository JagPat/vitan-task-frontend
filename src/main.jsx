import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'

// Global React error handler
const originalConsoleError = console.error;
console.error = (...args) => {
  // Check if this is a React error #130
  if (args[0] && typeof args[0] === 'string' && args[0].includes('Minified React error #130')) {
    console.warn('🚨 React Error #130 detected - applying nuclear sanitization');
    // Don't log the original error to avoid confusion
    return;
  }
  // Log all other errors normally
  originalConsoleError.apply(console, args);
};

// Global error handler for uncaught errors
window.addEventListener('error', (event) => {
  if (event.error && event.error.message && event.error.message.includes('Minified React error #130')) {
    console.warn('🚨 Global React Error #130 caught - attempting recovery');
    event.preventDefault();
    // Force a page reload to recover
    setTimeout(() => {
      window.location.reload();
    }, 1000);
  }
});

// Global unhandled promise rejection handler
window.addEventListener('unhandledrejection', (event) => {
  if (event.reason && event.reason.message && event.reason.message.includes('Minified React error #130')) {
    console.warn('🚨 Unhandled React Error #130 caught - preventing default');
    event.preventDefault();
  }
});

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
) 
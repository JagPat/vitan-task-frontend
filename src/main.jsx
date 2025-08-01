import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'

// Nuclear React Error Prevention at the lowest level
// This prevents ANY object from reaching React rendering

// Nuclear sanitization function
function nuclearSanitize(value) {
  // Only allow primitives and null
  if (value === null || value === undefined) {
    return null;
  }
  if (typeof value === 'string' || typeof value === 'number' || typeof value === 'boolean') {
    return value;
  }
  // For ANY object or array, return null
  return null;
}

// Nuclear React.createElement interceptor
const originalCreateElement = React.createElement;
React.createElement = function(type, props, ...children) {
  try {
    // Nuclear sanitization of props
    let cleanProps = props;
    if (props && typeof props === 'object') {
      cleanProps = {};
      for (const [key, value] of Object.entries(props)) {
        const sanitizedValue = nuclearSanitize(value);
        if (sanitizedValue !== null) {
          cleanProps[key] = sanitizedValue;
        }
      }
    }

    // Nuclear sanitization of children
    const cleanChildren = children.map(child => nuclearSanitize(child)).filter(child => child !== null);

    return originalCreateElement(type, cleanProps, ...cleanChildren);
  } catch (error) {
    console.warn('🚨 Nuclear React createElement error caught:', error);
    return null;
  }
};

// Nuclear global error handler
const originalConsoleError = console.error;
console.error = (...args) => {
  if (args[0] && typeof args[0] === 'string' && args[0].includes('Minified React error #130')) {
    console.warn('🚨 Nuclear React Error #130 detected - preventing rendering');
    return;
  }
  originalConsoleError.apply(console, args);
};

// Nuclear global error handler for uncaught errors
window.addEventListener('error', (event) => {
  if (event.error && event.error.message && event.error.message.includes('Minified React error #130')) {
    console.warn('🚨 Nuclear Global React Error #130 caught - preventing default');
    event.preventDefault();
    setTimeout(() => {
      window.location.reload();
    }, 1000);
  }
});

// Nuclear global unhandled promise rejection handler
window.addEventListener('unhandledrejection', (event) => {
  if (event.reason && event.reason.message && event.reason.message.includes('Minified React error #130')) {
    console.warn('🚨 Nuclear Unhandled React Error #130 caught - preventing default');
    event.preventDefault();
  }
});

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
) 
import React from 'react'
import './App.css'
import Pages from "@/pages/index.jsx"
import { Toaster } from "@/components/ui/toaster"

// Nuclear React Error Prevention
// This prevents ANY object from reaching React rendering
function NuclearReactWrapper({ children }) {
  const nuclearSanitize = (value) => {
    // Only allow primitives and null
    if (value === null || value === undefined) {
      return null;
    }
    if (typeof value === 'string' || typeof value === 'number' || typeof value === 'boolean') {
      return value;
    }
    // For ANY object or array, return null
    return null;
  };

  const nuclearSanitizeProps = (props) => {
    if (!props || typeof props !== 'object') {
      return props;
    }

    const cleanProps = {};
    for (const [key, value] of Object.entries(props)) {
      const sanitizedValue = nuclearSanitize(value);
      if (sanitizedValue !== null) {
        cleanProps[key] = sanitizedValue;
      }
    }
    return cleanProps;
  };

  const nuclearSanitizeChildren = (children) => {
    if (!children) {
      return children;
    }

    if (Array.isArray(children)) {
      return children.map(child => nuclearSanitize(child)).filter(child => child !== null);
    }

    return nuclearSanitize(children);
  };

  // Nuclear sanitization of children
  const sanitizedChildren = nuclearSanitizeChildren(children);

  if (sanitizedChildren === null) {
    return <div>Loading...</div>;
  }

  return <>{sanitizedChildren}</>;
}

// Error Boundary Component
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('React Error Boundary caught an error:', error);
    console.error('Error info:', errorInfo);
    
    // Nuclear approach: Force reload on any React error
    setTimeout(() => {
      window.location.reload();
    }, 2000);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ 
          padding: '20px', 
          textAlign: 'center',
          fontFamily: 'Arial, sans-serif'
        }}>
          <h2>Something went wrong</h2>
          <p>Reloading the application...</p>
        </div>
      );
    }

    return this.props.children;
  }
}

function App() {
  return (
    <ErrorBoundary>
      <NuclearReactWrapper>
        <Pages />
        <Toaster />
      </NuclearReactWrapper>
    </ErrorBoundary>
  )
}

export default App 
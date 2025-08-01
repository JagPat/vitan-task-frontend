import React from 'react'
import './App.css'
import Pages from "@/pages/index.jsx"
import { Toaster } from "@/components/ui/toaster"
import { finalReactValidation } from "@/utils"

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
    console.error('React Error Boundary caught an error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-slate-50">
          <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-6">
            <div className="text-center">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
              </div>
              <h2 className="text-xl font-semibold text-slate-800 mb-2">Something went wrong</h2>
              <p className="text-slate-600 mb-4">We're sorry, but something unexpected happened. Please try refreshing the page.</p>
              <button
                onClick={() => window.location.reload()}
                className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors"
              >
                Refresh Page
              </button>
            </div>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

// Nuclear React Component Wrapper
function NuclearComponentWrapper({ children }) {
  // Validate the children before rendering
  const validatedChildren = React.Children.map(children, (child) => {
    if (child === null || child === undefined) {
      return null;
    }
    
    // If it's a React element, validate its type
    if (React.isValidElement(child)) {
      // Check if the component type is a function (valid React component)
      if (typeof child.type === 'function') {
        return child;
      }
      
      // Check if it's a string (HTML element)
      if (typeof child.type === 'string') {
        return child;
      }
      
      // Check if it's a valid React component
      const validatedType = finalReactValidation(child.type);
      if (validatedType === null) {
        console.warn('Invalid React component type detected:', child.type);
        return null;
      }
      return child;
    }
    
    // If it's a primitive, it's safe
    if (typeof child === 'string' || typeof child === 'number' || typeof child === 'boolean') {
      return child;
    }
    
    // If it's an array, validate each item
    if (Array.isArray(child)) {
      return child.map(item => finalReactValidation(item)).filter(item => item !== null);
    }
    
    // For any other object, return null
    console.warn('Invalid React child detected:', child);
    return null;
  });
  
  return validatedChildren;
}

function App() {
  return (
    <ErrorBoundary>
      <NuclearComponentWrapper>
        <Pages />
        <Toaster />
      </NuclearComponentWrapper>
    </ErrorBoundary>
  )
}

export default App 
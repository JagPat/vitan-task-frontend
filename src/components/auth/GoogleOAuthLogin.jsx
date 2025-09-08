import React, { useEffect, useState, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import googleAuthService from '../../services/googleAuth';
import { useAuth } from '../../hooks/useAuth';

const GoogleOAuthLogin = ({ onLoginSuccess, onLoginError, className = '' }) => {
  const [isInitialized, setIsInitialized] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const buttonRef = useRef(null);
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();

  useEffect(() => {
    initializeGoogleOAuth();
    
    // Listen for login events
    const handleLoginSuccess = async (event) => {
      try {
        setIsLoading(false);
        setError(null);
        
        // Login through our auth hook
        const user = await login(event.detail);
        
        // Redirect based on role
        if (user.role === 'admin') {
          navigate('/admin/dashboard');
        } else {
          navigate('/dashboard');
        }
        
        // Call parent callback if provided
        if (onLoginSuccess) {
          onLoginSuccess(event.detail);
        }
      } catch (error) {
        console.error('Login error:', error);
        setError('Login failed. Please try again.');
      }
    };

    const handleLoginError = (event) => {
      setIsLoading(false);
      setError(event.detail.error);
      if (onLoginError) {
        onLoginError(event.detail.error);
      }
    };

    window.addEventListener('adminLoginSuccess', handleLoginSuccess);
    window.addEventListener('adminLoginError', handleLoginError);

    return () => {
      window.removeEventListener('adminLoginSuccess', handleLoginSuccess);
      window.removeEventListener('adminLoginError', handleLoginError);
    };
  }, [onLoginSuccess, onLoginError]);

  const initializeGoogleOAuth = async () => {
    try {
      setIsLoading(true);
      await googleAuthService.initialize();
      setIsInitialized(true);
      
      // Render the button after initialization
      if (buttonRef.current) {
        googleAuthService.renderButton(buttonRef.current.id);
      }
    } catch (error) {
      console.error('Failed to initialize Google OAuth:', error);
      const message = error?.message?.includes('Client ID')
        ? 'Google Sign-In not configured. Please set VITE_GOOGLE_CLIENT_ID.'
        : 'Failed to initialize Google OAuth';
      setError(message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleManualLogin = async () => {
    if (!isInitialized) {
      setError('Google OAuth not initialized');
      return;
    }

    try {
      setIsLoading(true);
      setError(null);
      googleAuthService.prompt();
    } catch (error) {
      setError('Failed to prompt Google OAuth');
      setIsLoading(false);
    }
  };

  if (isLoading && !isInitialized) {
    return (
      <div className={`flex items-center justify-center p-4 ${className}`}>
        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
        <span className="ml-2 text-gray-600">Initializing Google OAuth...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`text-center p-4 ${className}`}>
        <div className="text-red-600 mb-2">{error}</div>
        {error?.includes('VITE_GOOGLE_CLIENT_ID') && (
          <div className="text-xs text-gray-500 mb-2">
            Configure an OAuth Client ID in your environment.
          </div>
        )}
        <button
          onClick={initializeGoogleOAuth}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className={`space-y-4 ${className}`}>
      <div className="text-center">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          Admin Login
        </h3>
        <p className="text-sm text-gray-600 mb-4">
          Sign in with your Google account to access admin features
        </p>
        <div className="text-xs text-gray-500">
          Need access? Contact your workspace admin to be invited.
        </div>
      </div>

      {/* Google OAuth Button Container */}
      <div className="flex justify-center">
        <div
          ref={buttonRef}
          id="google-oauth-button"
          className="w-full max-w-sm"
        >
          {/* Google will render the button here */}
        </div>
      </div>

      {/* Manual Login Button (fallback) */}
      {isInitialized && (
        <div className="text-center">
          <button
            onClick={handleManualLogin}
            disabled={isLoading}
            className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 transition-colors disabled:opacity-50"
          >
            {isLoading ? 'Signing in...' : 'Sign in with Google'}
          </button>
        </div>
      )}

      {/* Loading State */}
      {isLoading && (
        <div className="flex items-center justify-center p-2">
          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
          <span className="ml-2 text-sm text-gray-600">Signing in...</span>
        </div>
      )}

      {/* Dev no-auth quick login */}
      {(import.meta?.env?.VITE_NO_AUTH === 'true' || import.meta?.env?.VITE_DEV_MODE === 'true') && (
        <div className="text-center space-y-2">
          <div className="text-xs text-gray-500">Developer quick login (no OAuth)</div>
          <div className="flex flex-wrap justify-center gap-2">
            <button
              onClick={() => login({ token: 'dev-token', user: { email: 'superadmin@demo.local', role: 'super_admin' } }) && navigate('/admin/dashboard')}
              className="px-3 py-1 bg-purple-600 text-white rounded text-sm"
            >
              Super Admin
            </button>
            <button
              onClick={() => login({ token: 'dev-token', user: { email: 'admin@demo.local', role: 'admin' } }) && navigate('/admin/dashboard')}
              className="px-3 py-1 bg-blue-600 text-white rounded text-sm"
            >
              Admin
            </button>
            <button
              onClick={() => login({ token: 'dev-token', user: { email: 'moderator@demo.local', role: 'moderator' } }) && navigate('/dashboard')}
              className="px-3 py-1 bg-amber-600 text-white rounded text-sm"
            >
              Moderator
            </button>
            <button
              onClick={() => login({ token: 'dev-token', user: { email: 'user@demo.local', role: 'user' } }) && navigate('/dashboard')}
              className="px-3 py-1 bg-gray-700 text-white rounded text-sm"
            >
              User
            </button>
          </div>
        </div>
      )}

      {/* Info */}
      <div className="text-xs text-gray-500 text-center">
        Only authorized admin accounts can access this system
      </div>
    </div>
  );
};

export default GoogleOAuthLogin;

/**
 * Google OAuth Service for Admin Authentication
 * Handles Google OAuth flow and token management
 */

class GoogleAuthService {
  constructor() {
    this.clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;
    this.apiBaseUrl = import.meta.env.VITE_API_BASE_URL || 'https://vitan-task-backend-production.up.railway.app';
    
    if (!this.clientId) {
      console.warn('Google Client ID not configured. Please set VITE_GOOGLE_CLIENT_ID');
    }
  }

  /**
   * Initialize Google OAuth
   */
  async initialize() {
    if (!window.google) {
      await this.loadGoogleScript();
    }
    
    return new Promise((resolve, reject) => {
      window.google.accounts.id.initialize({
        client_id: this.clientId,
        callback: this.handleCredentialResponse.bind(this),
        auto_select: false,
        cancel_on_tap_outside: true,
      });
      
      resolve();
    });
  }

  /**
   * Load Google OAuth script
   */
  loadGoogleScript() {
    return new Promise((resolve, reject) => {
      const script = document.createElement('script');
      script.src = 'https://accounts.google.com/gsi/client';
      script.async = true;
      script.defer = true;
      
      script.onload = resolve;
      script.onerror = reject;
      
      document.head.appendChild(script);
    });
  }

  /**
   * Handle Google OAuth credential response
   */
  async handleCredentialResponse(response) {
    try {
      const { credential } = response;
      
      // Send credential to backend for verification
      const result = await this.authenticateWithBackend(credential);
      
      // Store token and user info
      if (result.success) {
        localStorage.setItem('adminToken', result.data.token);
        localStorage.setItem('adminUser', JSON.stringify(result.data.user));
        
        // Trigger login success event
        window.dispatchEvent(new CustomEvent('adminLoginSuccess', {
          detail: result.data
        }));
        
        return result.data;
      } else {
        throw new Error(result.error || 'Authentication failed');
      }
      
    } catch (error) {
      console.error('Google OAuth error:', error);
      
      // Trigger login error event
      window.dispatchEvent(new CustomEvent('adminLoginError', {
        detail: { error: error.message }
      }));
      
      throw error;
    }
  }

  /**
   * Authenticate with backend using Google ID token
   */
  async authenticateWithBackend(idToken) {
    try {
      const response = await fetch(`${this.apiBaseUrl}/api/modules/auth/google`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ idToken }),
      });

      const result = await response.json();
      
      if (!response.ok) {
        throw new Error(result.error || 'Backend authentication failed');
      }
      
      return result;
      
    } catch (error) {
      console.error('Backend authentication error:', error);
      throw error;
    }
  }

  /**
   * Render Google OAuth button
   */
  renderButton(elementId) {
    if (!window.google?.accounts?.id) {
      console.error('Google OAuth not initialized');
      return;
    }
    
    window.google.accounts.id.renderButton(
      document.getElementById(elementId),
      {
        theme: 'outline',
        size: 'large',
        type: 'standard',
        text: 'signin_with',
        shape: 'rectangular',
        logo_alignment: 'left',
      }
    );
  }

  /**
   * Prompt Google OAuth login
   */
  prompt() {
    if (!window.google?.accounts?.id) {
      console.error('Google OAuth not initialized');
      return;
    }
    
    window.google.accounts.id.prompt();
  }

  /**
   * Check if user is logged in as admin
   */
  isAdminLoggedIn() {
    const token = localStorage.getItem('adminToken');
    const user = localStorage.getItem('adminUser');
    
    if (!token || !user) {
      return false;
    }
    
    try {
      const userData = JSON.parse(user);
      return userData.role === 'admin';
    } catch {
      return false;
    }
  }

  /**
   * Get admin user info
   */
  getAdminUser() {
    const user = localStorage.getItem('adminUser');
    if (!user) return null;
    
    try {
      return JSON.parse(user);
    } catch {
      return null;
    }
  }

  /**
   * Get admin token
   */
  getAdminToken() {
    return localStorage.getItem('adminToken');
  }

  /**
   * Logout admin user
   */
  async logout() {
    try {
      const token = this.getAdminToken();
      
      if (token) {
        // Call backend logout endpoint
        await fetch(`${this.apiBaseUrl}/api/modules/auth/admin/logout`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });
      }
      
      // Clear local storage
      localStorage.removeItem('adminToken');
      localStorage.removeItem('adminUser');
      
      // Trigger logout event
      window.dispatchEvent(new CustomEvent('adminLogout'));
      
    } catch (error) {
      console.error('Logout error:', error);
      // Still clear local storage even if backend call fails
      localStorage.removeItem('adminToken');
      localStorage.removeItem('adminUser');
    }
  }

  /**
   * Verify admin token with backend
   */
  async verifyToken() {
    try {
      const token = this.getAdminToken();
      if (!token) return false;
      
      const response = await fetch(`${this.apiBaseUrl}/api/modules/auth/google/verify`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      
      return response.ok;
      
    } catch (error) {
      console.error('Token verification error:', error);
      return false;
    }
  }
}

// Create singleton instance
const googleAuthService = new GoogleAuthService();

export default googleAuthService;


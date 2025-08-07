// WhatsTask API Client for Railway Backend
const API_BASE_URL = 'https://vitan-task-production.up.railway.app';

// Phone number normalization functions
const normalizePhoneNumberForAPI = (phoneNumber) => {
  // Remove all non-digit characters
  const normalized = phoneNumber.replace(/[^\d]/g, '');
  
  // If it starts with country code (91 for India), keep it as is
  // This matches the database format (no + prefix)
  return normalized;
};

const normalizePhoneNumberForVerification = (phoneNumber) => {
  // For verification, we need the + prefix
  const normalized = phoneNumber.replace(/[^\d]/g, '');
  
  // Add + prefix for verification endpoint
  if (normalized && !normalized.startsWith('+')) {
    return `+${  normalized}`;
  }
  return normalized;
};

const normalizePhoneNumberForDisplay = (phoneNumber) => {
  // Add + prefix for display
  if (phoneNumber && !phoneNumber.startsWith('+')) {
    return `+${phoneNumber}`;
  }
  return phoneNumber;
};

class WhatsTaskClient {
  constructor() {
    this.baseURL = API_BASE_URL;
  }

  // Generic request method with retry logic
  async request(endpoint, options = {}, retries = 2) {
    const url = `${this.baseURL}${endpoint}`;
    const { headers: customHeaders, ...restOptions } = options;
    const config = {
      credentials: 'include',
      ...restOptions,
      headers: {
        'Content-Type': 'application/json',
        ...customHeaders,
      },
    };

    for (let attempt = 0; attempt <= retries; attempt++) {
      try {
        const response = await fetch(url, config);
        const data = await response.json();
        
        if (!response.ok) {
          let errorMessage;
          
          // Handle different error response formats
          if (data.error) {
            errorMessage = typeof data.error === 'string' ? data.error : data.error.message || JSON.stringify(data.error);
          } else if (data.message) {
            errorMessage = data.message;
          } else {
            errorMessage = `HTTP ${response.status}`;
          }
          
          console.error(`API request failed (attempt ${attempt + 1}/${retries + 1}):`, response.status, errorMessage);
          
          // If this is the last attempt, throw the error
          if (attempt === retries) {
            throw new Error(errorMessage);
          }
          
          // Wait before retrying (exponential backoff)
          await new Promise(resolve => setTimeout(resolve, Math.pow(2, attempt) * 1000));
          continue;
        }
        
        return data;
      } catch (error) {
        console.error(`API request failed (attempt ${attempt + 1}/${retries + 1}):`, error);
        
        // If this is the last attempt, throw the error
        if (attempt === retries) {
          throw error;
        }
        
        // Wait before retrying (exponential backoff)
        await new Promise(resolve => setTimeout(resolve, Math.pow(2, attempt) * 1000));
      }
    }
  }

  // Login with WhatsApp number
  async loginWithWhatsApp(phoneNumber) {
    const normalizedPhone = normalizePhoneNumberForAPI(phoneNumber);
    
    console.log('Login attempt:', {
      original: phoneNumber,
      normalized: normalizedPhone,
    });
    
    return this.request('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({
        whatsappNumber: normalizedPhone,
      })
    });
  }

  // Send email verification code
  async sendEmailVerificationCode(email) {
    console.log('Email verification attempt:', { email });
    
    // For now, we'll simulate email verification since the backend doesn't support it yet
    // In a real implementation, this would call an email OTP endpoint
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          success: true,
          message: 'Verification code sent to your email',
          code: '123456' // Mock code for testing
        });
      }, 1000);
    });
  }

  // Verify email code
  async verifyEmailCode(email, code) {
    console.log('Email verification attempt:', { email, code });
    
    // For now, we'll simulate email verification
    // In a real implementation, this would call an email verification endpoint
    return new Promise((resolve) => {
      setTimeout(() => {
        if (code === '123456') {
          resolve({
            success: true,
            message: 'Email verified successfully',
            data: {
              token: 'mock-email-token',
              user: {
                id: 1,
                email: email,
                full_name: 'Test User',
                role: 'user'
              }
            }
          });
        } else {
          resolve({
            success: false,
            error: 'Invalid verification code'
          });
        }
      }, 1000);
    });
  }

  // Login with email and password (kept for backward compatibility)
  async loginWithEmail(email, password) {
    return this.request('/api/auth/login-email', {
      method: 'POST',
      body: JSON.stringify({
        email,
        password
      })
    });
  }

  // Login with OAuth credentials
  async loginWithOAuth(email, password) {
    console.log('OAuth login attempt:', { email });
    
    // Basic validation
    if (!email || !password) {
      return {
        success: false,
        error: 'Email and password are required'
      };
    }
    
    // Email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return {
        success: false,
        error: 'Please enter a valid email address'
      };
    }
    
    // Password strength validation
    if (password.length < 6) {
      return {
        success: false,
        error: 'Password must be at least 6 characters long'
      };
    }
    
    try {
              // Use existing email authentication endpoint
        const response = await this.request('/api/auth/login-email', {
          method: 'POST',
          body: JSON.stringify({
            email,
            password
          })
        });
      
            // Enhanced error handling for invalid credentials
      if (!response.success) {
        // Don't allow unauthorized access even if the API fails
        localStorage.removeItem('authToken');
        sessionStorage.removeItem('currentUser');
        
        // Clear any existing user data
        localStorage.removeItem('user');
        sessionStorage.removeItem('userProfile');

        return {
          success: false,
          error: response.error || 'Invalid email or password. Please check your credentials.'
        };
      }

      // For successful login, ensure we store the session data properly
      if (response.success) {
        console.log('OAuth login success:', response); // Debug log
        
        // Handle different response structures
        if (response.data) {
          // Standard response with data object
          if (response.data.token) {
            localStorage.setItem('authToken', response.data.token);
          }
          if (response.data.user) {
            sessionStorage.setItem('currentUser', JSON.stringify(response.data.user));
          }
        } else if (response.token) {
          // Direct token in response
          localStorage.setItem('authToken', response.token);
          if (response.user) {
            sessionStorage.setItem('currentUser', JSON.stringify(response.user));
          }
        }
        
        // Ensure session persistence
        localStorage.setItem('loginMethod', 'oauth');
        localStorage.setItem('loginTime', Date.now().toString());
      }
      
      return response;
      
    } catch (error) {
      console.error('OAuth login error:', error);
      
      // Ensure no unauthorized access on network errors
      localStorage.removeItem('authToken');
      sessionStorage.removeItem('currentUser');
      
      return {
        success: false,
        error: 'Login failed. Please check your credentials and try again.'
      };
    }
  }

  // Send verification code
  async sendVerificationCode(phoneNumber) {
    const normalizedPhone = normalizePhoneNumberForVerification(phoneNumber);
    
    console.log('Verification attempt:', {
      original: phoneNumber,
      normalized: normalizedPhone
    });
    
    try {
      const response = await this.request('/api/auth/verify', {
        method: 'POST',
        body: JSON.stringify({
          whatsappNumber: normalizedPhone
        })
      });
      
      // Enhanced security: Clear any stale auth data on verification attempts
      if (!response.success) {
        localStorage.removeItem('authToken');
        sessionStorage.removeItem('currentUser');
        localStorage.removeItem('user');
        sessionStorage.removeItem('userProfile');
      }
      
      return response;
    } catch (error) {
      console.error('Error sending verification code:', error);
      
      // Clear auth data on network errors
      localStorage.removeItem('authToken');
      sessionStorage.removeItem('currentUser');
      localStorage.removeItem('user');
      sessionStorage.removeItem('userProfile');
      
      return {
        success: false,
        error: 'Failed to send verification code. Please try again.'
      };
    }
  }

  // Verify code
  async verifyCode(phoneNumber, code) {
    const normalizedPhone = normalizePhoneNumberForVerification(phoneNumber);
    
    try {
      const response = await this.request('/api/auth/confirm', {
        method: 'POST',
        body: JSON.stringify({
          whatsappNumber: normalizedPhone,
          verificationCode: code
        })
      });
      
      // Enhanced authentication handling
      if (!response.success) {
        localStorage.removeItem('authToken');
        sessionStorage.removeItem('currentUser');
        localStorage.removeItem('user');
        sessionStorage.removeItem('userProfile');
        
        return {
          success: false,
          error: response.error || 'Invalid verification code. Please try again.'
        };
      }
      
      // For successful verification, ensure robust session management
      if (response.success) {
        console.log('WhatsApp verification success:', response); // Debug log
        
        // Handle different response structures
        if (response.data) {
          if (response.data.token) {
            localStorage.setItem('authToken', response.data.token);
          }
          if (response.data.user) {
            sessionStorage.setItem('currentUser', JSON.stringify(response.data.user));
          }
        } else if (response.token) {
          // Direct token in response
          localStorage.setItem('authToken', response.token);
          if (response.user) {
            sessionStorage.setItem('currentUser', JSON.stringify(response.user));
          }
        }
        
        // Ensure session persistence
        localStorage.setItem('loginMethod', 'whatsapp');
        localStorage.setItem('loginTime', Date.now().toString());
      }
      
      return response;
    } catch (error) {
      console.error('Error verifying code:', error);
      
      // Clear auth data on network errors
      localStorage.removeItem('authToken');
      sessionStorage.removeItem('currentUser');
      localStorage.removeItem('user');
      sessionStorage.removeItem('userProfile');
      
      return {
        success: false,
        error: 'Verification failed. Please try again.'
      };
    }
  }

  // Get current user
  async getCurrentUser(token) {
    return this.request('/api/auth/me', {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
  }

  // Send WhatsApp message
  async sendWhatsAppMessage(phoneNumber, message) {
    const normalizedPhone = normalizePhoneNumberForAPI(phoneNumber);
    
    return this.request('/api/whatsapp/send', {
      method: 'POST',
      body: JSON.stringify({
        phoneNumber: normalizedPhone,
        message
      })
    });
  }

  // Get tasks
  async getTasks(filters = {}) {
    const queryParams = new URLSearchParams(filters).toString();
    return this.request(`/api/tasks?${queryParams}`);
  }

  // Get task by ID
  async getTaskById(taskId) {
    return this.request(`/api/tasks/${taskId}`);
  }

  // Create task
  async createTask(taskData) {
    // Normalize phone numbers in task data
    const normalizedTaskData = {
      ...taskData,
      assigned_to_whatsapp: taskData.assigned_to_whatsapp ? 
        normalizePhoneNumberForAPI(taskData.assigned_to_whatsapp) : null,
      created_by_whatsapp: taskData.created_by_whatsapp ? 
        normalizePhoneNumberForAPI(taskData.created_by_whatsapp) : null
    };

    console.log('Creating task with data:', normalizedTaskData);

    try {
      const response = await this.request('/api/tasks', {
        method: 'POST',
        body: JSON.stringify(normalizedTaskData)
      });
      
      console.log('Task creation response:', response);
      return response;
    } catch (error) {
      console.error('Task creation failed:', error);
      
      // Provide more specific error messages
      if (error.message.includes('500')) {
        throw new Error('Server error occurred. Please try again later.');
      } else if (error.message.includes('400')) {
        throw new Error('Invalid task data. Please check your input.');
      } else if (error.message.includes('401')) {
        throw new Error('Authentication required. Please log in again.');
      } else {
        throw new Error(`Task creation failed: ${error.message}`);
      }
    }
  }

  // Update task
  async updateTask(taskId, taskData) {
    // Normalize phone numbers in task data
    const normalizedTaskData = {
      ...taskData,
      assigned_to_whatsapp: taskData.assigned_to_whatsapp ? 
        normalizePhoneNumberForAPI(taskData.assigned_to_whatsapp) : null,
      created_by_whatsapp: taskData.created_by_whatsapp ? 
        normalizePhoneNumberForAPI(taskData.created_by_whatsapp) : null
    };

    return this.request(`/api/tasks/${taskId}`, {
      method: 'PUT',
      body: JSON.stringify(normalizedTaskData)
    });
  }

  // Delete task
  async deleteTask(taskId, data = {}) {
    return this.request(`/api/tasks/${taskId}`, {
      method: 'DELETE',
      body: JSON.stringify(data)
    });
  }

  // Get users
  async getUsers() {
    return this.request('/api/users');
  }

  // Get user by ID
  async getUser(userId) {
    return this.request(`/api/users/${userId}`);
  }

  // Update user
  async updateUser(userId, userData) {
    return this.request(`/api/users/${userId}`, {
      method: 'PUT',
      body: JSON.stringify(userData)
    });
  }

  // Delete user
  async deleteUser(userId, data = {}) {
    return this.request(`/api/users/${userId}`, {
      method: 'DELETE',
      body: JSON.stringify(data)
    });
  }

  // Get projects
  async getProjects() {
    return this.request('/api/projects');
  }

  // Get project by ID
  async getProject(projectId) {
    return this.request(`/api/projects/${projectId}`);
  }

  // Create project
  async createProject(projectData) {
    return this.request('/api/projects', {
      method: 'POST',
      body: JSON.stringify(projectData)
    });
  }

  // Update project
  async updateProject(projectId, projectData) {
    return this.request(`/api/projects/${projectId}`, {
      method: 'PUT',
      body: JSON.stringify(projectData)
    });
  }

  // Delete project
  async deleteProject(projectId, data = {}) {
    return this.request(`/api/projects/${projectId}`, {
      method: 'DELETE',
      body: JSON.stringify(data)
    });
  }

  // Get templates
  async getTemplates() {
    return this.request('/api/templates');
  }

  // Health check
  async healthCheck() {
    try {
      const response = await this.request('/health');
      console.log('Backend health check successful:', response);
      return response;
    } catch (error) {
      console.error('Backend health check failed:', error);
      throw error;
    }
  }

  // Static methods for phone number handling
  static normalizeForAPI = normalizePhoneNumberForAPI;
  static normalizeForDisplay = normalizePhoneNumberForDisplay;
  static normalizeForVerification = normalizePhoneNumberForVerification;
}

export const whatsTaskClient = new WhatsTaskClient(); 
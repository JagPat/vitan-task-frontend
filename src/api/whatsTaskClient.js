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

  // Login with email and password
  async loginWithEmail(email, password) {
    return this.request('/api/auth/login-email', {
      method: 'POST',
      body: JSON.stringify({
        email,
        password
      })
    });
  }

  // Send verification code
  async sendVerificationCode(phoneNumber) {
    const normalizedPhone = normalizePhoneNumberForVerification(phoneNumber);
    
    console.log('Verification attempt:', {
      original: phoneNumber,
      normalized: normalizedPhone
    });
    
    return this.request('/api/auth/verify', {
      method: 'POST',
      body: JSON.stringify({
        whatsappNumber: normalizedPhone
      })
    });
  }

  // Verify code
  async verifyCode(phoneNumber, code) {
    const normalizedPhone = normalizePhoneNumberForVerification(phoneNumber);
    
    return this.request('/api/auth/confirm', {
      method: 'POST',
      body: JSON.stringify({
        whatsappNumber: normalizedPhone,
        verificationCode: code
      })
    });
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
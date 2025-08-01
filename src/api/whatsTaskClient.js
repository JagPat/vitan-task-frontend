// WhatsTask API Client for Railway Backend
const API_BASE_URL = 'https://vitan-task-production.up.railway.app';

// Phone number normalization functions
const normalizePhoneNumberForAPI = (phoneNumber) => {
  // Remove all non-digit characters
  let normalized = phoneNumber.replace(/[^\d]/g, '');
  
  // If it starts with country code (91 for India), keep it as is
  // This matches the database format (no + prefix)
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

  // Generic request method
  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    const config = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers
      },
      ...options
    };

    try {
      const response = await fetch(url, config);
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || `HTTP ${response.status}`);
      }
      
      return data;
    } catch (error) {
      console.error('API request failed:', error);
      throw error;
    }
  }

  // Login with WhatsApp number
  async loginWithWhatsApp(phoneNumber) {
    const normalizedPhone = normalizePhoneNumberForAPI(phoneNumber);
    
    console.log('Login attempt:', {
      original: phoneNumber,
      normalized: normalizedPhone
    });
    
    return this.request('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({
        whatsappNumber: normalizedPhone
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
    const normalizedPhone = normalizePhoneNumberForAPI(phoneNumber);
    
    return this.request('/api/auth/verify', {
      method: 'POST',
      body: JSON.stringify({
        whatsappNumber: normalizedPhone
      })
    });
  }

  // Verify code
  async verifyCode(phoneNumber, code) {
    const normalizedPhone = normalizePhoneNumberForAPI(phoneNumber);
    
    return this.request('/api/auth/verify-code', {
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

    return this.request('/api/tasks', {
      method: 'POST',
      body: JSON.stringify(normalizedTaskData)
    });
  }

  // Get users
  async getUsers() {
    return this.request('/api/users');
  }

  // Get projects
  async getProjects() {
    return this.request('/api/projects');
  }

  // Get templates
  async getTemplates() {
    return this.request('/api/templates');
  }

  // Health check
  async healthCheck() {
    return this.request('/health');
  }

  // Static methods for phone number handling
  static normalizeForAPI = normalizePhoneNumberForAPI;
  static normalizeForDisplay = normalizePhoneNumberForDisplay;
}

export const whatsTaskClient = new WhatsTaskClient(); 
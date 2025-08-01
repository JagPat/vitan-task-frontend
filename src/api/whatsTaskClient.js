// WhatsTask API Client for Railway Backend
const API_BASE_URL = 'https://vitan-task-production.up.railway.app';

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
        ...options.headers,
      },
      ...options,
    };

    try {
      const response = await fetch(url, config);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      
      // Validate that we got a proper object/array, not undefined/null
      if (data === undefined || data === null) {
        console.warn('API returned undefined/null data:', { endpoint, data });
        return { success: false, error: 'Invalid response data' };
      }
      
      return data;
    } catch (error) {
      console.error('API request failed:', error);
      return { success: false, error: error.message };
    }
  }

  // Health check
  async healthCheck() {
    return this.request('/health');
  }

  // Tasks API
  async getTasks(filters = {}) {
    const queryParams = new URLSearchParams(filters).toString();
    const endpoint = `/api/tasks${queryParams ? `?${queryParams}` : ''}`;
    return this.request(endpoint);
  }

  async createTask(taskData) {
    return this.request('/api/tasks', {
      method: 'POST',
      body: JSON.stringify(taskData),
    });
  }

  async updateTask(taskId, taskData) {
    return this.request(`/api/tasks/${taskId}`, {
      method: 'PUT',
      body: JSON.stringify(taskData),
    });
  }

  async deleteTask(taskId, data = {}) {
    return this.request(`/api/tasks/${taskId}`, {
      method: 'DELETE',
      body: JSON.stringify(data),
    });
  }

  async getTaskById(taskId) {
    return this.request(`/api/tasks/${taskId}`);
  }

  // Users API
  async getUsers() {
    return this.request('/api/users');
  }

  async createUser(userData) {
    return this.request('/api/users', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  }

  async updateUser(userId, userData) {
    return this.request(`/api/users/${userId}`, {
      method: 'PUT',
      body: JSON.stringify(userData),
    });
  }

  async deleteUser(userId) {
    return this.request(`/api/users/${userId}`, {
      method: 'DELETE',
    });
  }

  // Authentication API
  async loginWithWhatsApp(whatsappNumber) {
    return this.request('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({
        whatsappNumber
      }),
    });
  }

  async loginWithEmail(email, password) {
    return this.request('/api/auth/login-email', {
      method: 'POST',
      body: JSON.stringify({
        email,
        password
      }),
    });
  }

  async logout(token) {
    return this.request('/api/auth/logout', {
      method: 'POST',
      body: JSON.stringify({
        token
      }),
    });
  }

  async getCurrentUser(token) {
    return this.request('/api/auth/me', {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
  }

  async sendVerificationCode(whatsappNumber) {
    return this.request('/api/auth/verify', {
      method: 'POST',
      body: JSON.stringify({
        whatsappNumber
      }),
    });
  }

  async confirmVerificationCode(whatsappNumber, verificationCode) {
    return this.request('/api/auth/confirm', {
      method: 'POST',
      body: JSON.stringify({
        whatsappNumber,
        verificationCode
      }),
    });
  }

  // WhatsApp Integration
  async sendWhatsAppMessage(phoneNumber, message) {
    return this.request('/webhook', {
      method: 'POST',
      body: JSON.stringify({
        phone_number: phoneNumber,
        message: message,
      }),
    });
  }

  // Analytics API
  async getAnalytics(dateRange = {}) {
    const queryParams = new URLSearchParams(dateRange).toString();
    const endpoint = `/api/analytics${queryParams ? `?${queryParams}` : ''}`;
    return this.request(endpoint);
  }

  // Task Statistics
  async getTaskStats() {
    return this.request('/api/tasks/stats');
  }

  // User Statistics
  async getUserStats() {
    return this.request('/api/users/stats');
  }

  // Projects API
  async getProjects() {
    return this.request('/api/projects');
  }

  async getProjectById(projectId) {
    return this.request(`/api/projects/${projectId}`);
  }

  async createProject(projectData) {
    return this.request('/api/projects', {
      method: 'POST',
      body: JSON.stringify(projectData),
    });
  }

  async updateProject(projectId, projectData) {
    return this.request(`/api/projects/${projectId}`, {
      method: 'PUT',
      body: JSON.stringify(projectData),
    });
  }

  async deleteProject(projectId) {
    return this.request(`/api/projects/${projectId}`, {
      method: 'DELETE',
    });
  }
}

// Create and export the client instance
export const whatsTaskClient = new WhatsTaskClient();

// Export the base URL for reference
export { API_BASE_URL }; 
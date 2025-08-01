import { whatsTaskClient } from './whatsTaskClient';

// Task entity using WhatsTask API
export const Task = {
  // Get all tasks
  async getAll(filters = {}) {
    const response = await whatsTaskClient.getTasks(filters);
    return response.data || [];
  },

  // Get task by ID
  async getById(taskId) {
    const response = await whatsTaskClient.getTaskById(taskId);
    return response.data;
  },

  // Create new task
  async create(taskData) {
    const response = await whatsTaskClient.createTask(taskData);
    return response.data;
  },

  // Update task
  async update(taskId, taskData) {
    const response = await whatsTaskClient.updateTask(taskId, taskData);
    return response.data;
  },

  // Delete task
  async delete(taskId, data = {}) {
    await whatsTaskClient.deleteTask(taskId, data);
    return { success: true };
  },

  // Get tasks by WhatsApp number
  async getByWhatsApp(whatsappNumber, status = 'all') {
    const filters = { assigned_to_whatsapp: whatsappNumber };
    if (status !== 'all') {
      filters.status = status;
    }
    const response = await whatsTaskClient.getTasks(filters);
    return response.data || [];
  },

  // Filter tasks (alias for getAll with filters)
  async filter(filters = {}) {
    const response = await whatsTaskClient.getTasks(filters);
    return response.data || [];
  },

  // List tasks (alias for getAll)
  async list(sort = '') {
    const response = await whatsTaskClient.getTasks({});
    return response.data || [];
  }
};

// User entity using WhatsTask API
export const User = {
  // Get all users
  async getAll() {
    const response = await whatsTaskClient.getUsers();
    return response.data || [];
  },

  // Get current user from authentication
  async me() {
    try {
      // Get token from localStorage
      const token = localStorage.getItem('authToken');
      
      if (!token) {
        // Try to get user from session storage as fallback
        const sessionUser = sessionStorage.getItem('currentUser');
        if (sessionUser) {
          try {
            const parsedUser = JSON.parse(sessionUser);
            // Sanitize session user data to prevent React error #130
            if (parsedUser && typeof parsedUser === 'object' && !Array.isArray(parsedUser)) {
              return this.sanitizeUserData(parsedUser);
            }
          } catch (error) {
            console.error('Error parsing session user data:', error);
            sessionStorage.removeItem('currentUser');
          }
        }
        
        // Return null if no authentication
        return null;
      }
      
      // Get current user from auth endpoint
      const response = await whatsTaskClient.request('/api/auth/me', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (response.success && response.data && typeof response.data === 'object') {
        // Sanitize user data to prevent React error #130
        const sanitizedUser = this.sanitizeUserData(response.data);
        sessionStorage.setItem('currentUser', JSON.stringify(sanitizedUser));
        return sanitizedUser;
      }
      
      return null;
    } catch (error) {
      console.error('Error fetching current user:', error);
      return null;
    }
  },

  // Sanitize user data to prevent React error #130
  sanitizeUserData(userData) {
    if (!userData || typeof userData !== 'object' || Array.isArray(userData)) {
      return null;
    }

    // Create a clean user object with only primitive values
    const cleanUser = {
      id: typeof userData.id === 'number' ? userData.id : null,
      full_name: typeof userData.full_name === 'string' ? userData.full_name : null,
      email: typeof userData.email === 'string' ? userData.email : null,
      role: typeof userData.role === 'string' ? userData.role : null,
      whatsapp_number: typeof userData.whatsapp_number === 'string' ? userData.whatsapp_number : null,
      company: typeof userData.company === 'string' ? userData.company : null,
      location: typeof userData.location === 'string' ? userData.location : null,
      verified: typeof userData.verified === 'boolean' ? userData.verified : false
    };

    return cleanUser;
  },

  // Create new user
  async create(userData) {
    const response = await whatsTaskClient.createUser(userData);
    return response.data;
  },

  // Update user
  async update(userId, userData) {
    const response = await whatsTaskClient.updateUser(userId, userData);
    return response.data;
  },

  // Delete user
  async delete(userId) {
    await whatsTaskClient.deleteUser(userId);
    return { success: true };
  },

  // List users (alias for getAll)
  async list(sort = '') {
    const response = await whatsTaskClient.getUsers();
    return response.data || [];
  },

  // Filter users
  async filter(filters = {}) {
    const response = await whatsTaskClient.getUsers(filters);
    return response.data || [];
  }
};

// Activity Log entity
export const ActivityLog = {
  // Get activity logs for a task
  async getByTaskId(taskId) {
    const response = await whatsTaskClient.request(`/api/analytics/task/${taskId}/activity`);
    return response.data || [];
  },

  // Create activity log
  async create(activityData) {
    const response = await whatsTaskClient.request('/api/analytics/activity', {
      method: 'POST',
      body: JSON.stringify(activityData),
    });
    return response.data;
  },

  // List activity logs
  async list(sort = '') {
    const response = await whatsTaskClient.request('/api/analytics/activities');
    return response.data || [];
  },

  // Filter activity logs
  async filter(filters = {}, sort = '') {
    const response = await whatsTaskClient.request('/api/analytics/activities', {
      method: 'GET',
      params: filters
    });
    return response.data || [];
  },

  // Get user activity
  async getUserActivity(whatsappNumber, days = 30) {
    const response = await whatsTaskClient.request(`/api/analytics/user/${whatsappNumber}/activity?days=${days}`);
    return response.data || [];
  },

  // Get activity timeline
  async getTimeline(startDate, endDate) {
    const response = await whatsTaskClient.request(`/api/analytics/timeline?start_date=${startDate}&end_date=${endDate}`);
    return response.data || [];
  }
};

// Project entity using WhatsTask API
export const Project = {
  // Get all projects
  async getAll() {
    const response = await whatsTaskClient.getProjects();
    return response.data || [];
  },

  // Get project by ID
  async getById(projectId) {
    const response = await whatsTaskClient.getProjectById(projectId);
    return response.data;
  },

  // Create new project
  async create(projectData) {
    const response = await whatsTaskClient.createProject(projectData);
    return response.data;
  },

  // Update project
  async update(projectId, projectData) {
    const response = await whatsTaskClient.updateProject(projectId, projectData);
    return response.data;
  },

  // Delete project
  async delete(projectId) {
    await whatsTaskClient.deleteProject(projectId);
    return { success: true };
  },

  // List projects (alias for getAll)
  async list(sort = '') {
    const response = await whatsTaskClient.getProjects();
    return response.data || [];
  }
};

// Task Template entity
export const TaskTemplate = {
  // Get all templates
  async getAll() {
    const response = await whatsTaskClient.request('/api/templates');
    return response.data || [];
  },

  // List templates (alias for getAll)
  async list(sort = '') {
    const response = await whatsTaskClient.request('/api/templates');
    return response.data || [];
  },

  // Create template
  async create(templateData) {
    const response = await whatsTaskClient.request('/api/templates', {
      method: 'POST',
      body: JSON.stringify(templateData),
    });
    return response.data;
  },

  // Update template
  async update(templateId, templateData) {
    const response = await whatsTaskClient.request(`/api/templates/${templateId}`, {
      method: 'PUT',
      body: JSON.stringify(templateData),
    });
    return response.data;
  },

  // Delete template
  async delete(templateId) {
    await whatsTaskClient.request(`/api/templates/${templateId}`, {
      method: 'DELETE',
    });
    return { success: true };
  }
};
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
  async delete(taskId) {
    await whatsTaskClient.deleteTask(taskId);
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

  // Get current user (placeholder - implement based on your auth system)
  async me() {
    // For now, return a mock user or get from localStorage
    const mockUser = {
      id: 1,
      full_name: 'Current User',
      email: 'user@example.com',
      whatsapp_number: '+1234567890',
      role: 'admin'
    };
    return mockUser;
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
    const response = await whatsTaskClient.request(`/api/tasks/${taskId}/activity`);
    return response.data || [];
  },

  // Create activity log
  async create(activityData) {
    const response = await whatsTaskClient.request('/api/activity', {
      method: 'POST',
      body: JSON.stringify(activityData),
    });
    return response.data;
  },

  // List activity logs
  async list(sort = '') {
    const response = await whatsTaskClient.request('/api/activity');
    return response.data || [];
  },

  // Filter activity logs
  async filter(filters = {}, sort = '') {
    const response = await whatsTaskClient.request('/api/activity', {
      method: 'GET',
      params: filters
    });
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
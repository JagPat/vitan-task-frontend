// Mock API Service for Frontend Testing
// This simulates backend responses without requiring actual API calls

class MockApiService {
  constructor() {
    this.mockData = {
      tasks: [
        {
          id: "mock-task-1",
          title: "Complete project documentation",
          description: "Write comprehensive documentation for the new feature",
          status: "pending",
          priority: "high",
          assigned_to: "mock-user-1",
          due_date: "2025-08-15",
          created_at: "2025-08-05T10:00:00Z"
        },
        {
          id: "mock-task-2", 
          title: "Review code changes",
          description: "Review pull request #123 for the authentication module",
          status: "in_progress",
          priority: "medium",
          assigned_to: "mock-user-2",
          due_date: "2025-08-10",
          created_at: "2025-08-04T14:30:00Z"
        }
      ],
      users: [
        {
          id: "mock-user-1",
          full_name: "John Doe",
          email: "john@example.com",
          phone_number: "+1234567890",
          role: "developer",
          is_external: false
        },
        {
          id: "mock-user-2",
          full_name: "Jane Smith", 
          email: "jane@example.com",
          phone_number: "+1987654321",
          role: "manager",
          is_external: false
        }
      ],
      projects: [
        {
          id: "mock-project-1",
          name: "Website Redesign",
          description: "Complete redesign of company website",
          status: "active",
          created_at: "2025-08-01T09:00:00Z"
        }
      ]
    };
  }

  // Simulate API delay
  async delay(ms = 500) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  // Mock task operations
  async getTasks(filters = {}) {
    await this.delay();
    let tasks = [...this.mockData.tasks];
    
    // Apply filters
    if (filters.status) {
      tasks = tasks.filter(task => task.status === filters.status);
    }
    if (filters.assigned_to) {
      tasks = tasks.filter(task => task.assigned_to === filters.assigned_to);
    }
    
    return {
      data: tasks,
      success: true,
      message: "Tasks retrieved successfully"
    };
  }

  async createTask(taskData) {
    await this.delay();
    const newTask = {
      id: `mock-task-${Date.now()}`,
      ...taskData,
      status: "pending",
      created_at: new Date().toISOString()
    };
    
    this.mockData.tasks.push(newTask);
    
    return {
      data: newTask,
      success: true,
      message: "Task created successfully"
    };
  }

  async updateTask(taskId, taskData) {
    await this.delay();
    const taskIndex = this.mockData.tasks.findIndex(t => t.id === taskId);
    
    if (taskIndex === -1) {
      throw new Error("Task not found");
    }
    
    this.mockData.tasks[taskIndex] = {
      ...this.mockData.tasks[taskIndex],
      ...taskData
    };
    
    return {
      data: this.mockData.tasks[taskIndex],
      success: true,
      message: "Task updated successfully"
    };
  }

  async deleteTask(taskId) {
    await this.delay();
    const taskIndex = this.mockData.tasks.findIndex(t => t.id === taskId);
    
    if (taskIndex === -1) {
      throw new Error("Task not found");
    }
    
    this.mockData.tasks.splice(taskIndex, 1);
    
    return {
      success: true,
      message: "Task deleted successfully"
    };
  }

  // Mock user operations
  async getUsers() {
    await this.delay();
    return {
      data: this.mockData.users,
      success: true,
      message: "Users retrieved successfully"
    };
  }

  async getCurrentUser() {
    await this.delay();
    return {
      data: this.mockData.users[0],
      success: true,
      message: "Current user retrieved successfully"
    };
  }

  // Mock project operations
  async getProjects() {
    await this.delay();
    return {
      data: this.mockData.projects,
      success: true,
      message: "Projects retrieved successfully"
    };
  }

  // Mock WhatsApp operations
  async sendWhatsAppMessage(phoneNumber, message) {
    await this.delay();
    console.log(`Mock WhatsApp message sent to ${phoneNumber}: ${message}`);
    
    return {
      success: true,
      message: "WhatsApp message sent successfully",
      messageId: `mock-msg-${Date.now()}`
    };
  }

  // Mock health check
  async healthCheck() {
    await this.delay(100);
    return {
      status: "healthy",
      message: "Mock API server is running",
      timestamp: new Date().toISOString()
    };
  }

  // Mock error responses
  async simulateError(errorType = "network") {
    await this.delay();
    
    const errors = {
      network: new Error("Network error - please check your connection"),
      server: new Error("Server error - please try again later"),
      validation: new Error("Validation error - please check your input"),
      auth: new Error("Authentication error - please log in again")
    };
    
    throw errors[errorType] || errors.network;
  }
}

// Create singleton instance
const mockApiService = new MockApiService();

export default mockApiService; 
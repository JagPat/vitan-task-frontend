interface ApiResponse<T> {
  data?: T
  error?: string
  status: number
}

// Mock API delay to simulate network requests
const mockDelay = (ms = 500) => new Promise((resolve) => setTimeout(resolve, ms))

// Mock data
const mockUsers = [
  { id: "1", name: "John Doe", email: "john@example.com", role: "admin", language: "en" },
  { id: "2", name: "Jane Smith", email: "jane@example.com", role: "user", language: "en" },
  { id: "3", name: "Mike Johnson", email: "mike@example.com", role: "user", language: "es" },
]

const mockTasks = [
  {
    id: "1",
    title: "Setup project infrastructure",
    description: "Initialize the project with proper tooling",
    status: "in-progress",
    priority: "high",
    projectId: "1",
    assigneeId: "1",
    createdAt: "2024-01-15T10:00:00Z",
    dueDate: "2024-01-20T18:00:00Z",
  },
  {
    id: "2",
    title: "Design user interface",
    description: "Create mockups and wireframes",
    status: "open",
    priority: "medium",
    projectId: "1",
    assigneeId: "2",
    createdAt: "2024-01-16T09:00:00Z",
    dueDate: "2024-01-25T17:00:00Z",
  },
]

const mockProjects = [
  {
    id: "1",
    name: "VitanTask Platform",
    description: "Main task management platform",
    status: "active",
    progress: 65,
    teamMembers: ["1", "2"],
    createdAt: "2024-01-10T08:00:00Z",
  },
]

// API Service Class
class ApiService {
  private baseUrl = "/api"

  private async request<T>(endpoint: string, options?: RequestInit): Promise<ApiResponse<T>> {
    try {
      await mockDelay()

      // Simulate network errors occasionally
      if (Math.random() < 0.1) {
        throw new Error("Network error")
      }

      // Mock API responses based on endpoint
      const response = this.getMockResponse<T>(endpoint, options)
      return response
    } catch (error) {
      return {
        error: error instanceof Error ? error.message : "Unknown error",
        status: 500,
      }
    }
  }

  private getMockResponse<T>(endpoint: string, options?: RequestInit): ApiResponse<T> {
    const method = options?.method || "GET"

    // Authentication endpoints
    if (endpoint.includes("/modules/auth/me")) {
      if (method === "GET") {
        return { data: mockUsers[0] as T, status: 200 }
      }
      if (method === "PUT") {
        return { data: mockUsers[0] as T, status: 200 }
      }
    }

    // Dashboard endpoints
    if (endpoint.includes("/modules/dashboard/quick-stats")) {
      return {
        data: {
          totalTasks: 24,
          completedTasks: 18,
          activeTasks: 6,
          totalProjects: 3,
          activeProjects: 2,
          teamMembers: 8,
        } as T,
        status: 200,
      }
    }

    // Tasks endpoints
    if (endpoint.includes("/modules/tasks")) {
      if (method === "GET" && !endpoint.includes("/modules/tasks/")) {
        return { data: mockTasks as T, status: 200 }
      }
      if (method === "POST") {
        const newTask = { ...mockTasks[0], id: Date.now().toString() }
        return { data: newTask as T, status: 201 }
      }
      if (method === "PUT") {
        return { data: mockTasks[0] as T, status: 200 }
      }
      if (endpoint.includes("/modules/tasks/")) {
        return { data: mockTasks[0] as T, status: 200 }
      }
    }

    // Projects endpoints
    if (endpoint.includes("/modules/projects")) {
      if (method === "GET") {
        return { data: mockProjects as T, status: 200 }
      }
      if (method === "POST") {
        const newProject = { ...mockProjects[0], id: Date.now().toString() }
        return { data: newProject as T, status: 201 }
      }
    }

    // Users endpoints
    if (endpoint.includes("/modules/users")) {
      return { data: mockUsers as T, status: 200 }
    }

    // Admin endpoints
    if (endpoint.includes("/modules/auth/admin/stats")) {
      return {
        data: {
          totalUsers: 156,
          activeUsers: 89,
          adminUsers: 12,
          newUsersThisMonth: 23,
        } as T,
        status: 200,
      }
    }

    // System endpoints
    if (endpoint.includes("/modules/system/status")) {
      return {
        data: {
          status: "healthy",
          uptime: "99.9%",
          lastRestart: "2024-01-10T08:00:00Z",
          version: "1.0.0",
        } as T,
        status: 200,
      }
    }

    // Analytics endpoints
    if (endpoint.includes("/modules/analytics/performance")) {
      return {
        data: {
          responseTime: 245,
          throughput: 1250,
          errorRate: 0.02,
        } as T,
        status: 200,
      }
    }

    // WhatsApp endpoints
    if (endpoint.includes("/modules/whatsapp/incoming")) {
      return {
        data: {
          message: "Task created successfully",
          taskId: "123",
        } as T,
        status: 200,
      }
    }

    return { error: "Endpoint not found", status: 404 }
  }

  // Auth API methods
  async getProfile() {
    return this.request<any>("/modules/auth/me")
  }

  async updateProfile(data: any) {
    return this.request<any>("/modules/auth/me", {
      method: "PUT",
      body: JSON.stringify(data),
    })
  }

  // Dashboard API methods
  async getQuickStats() {
    return this.request<any>("/modules/dashboard/quick-stats")
  }

  // Tasks API methods
  async getTasks() {
    return this.request<any[]>("/modules/tasks")
  }

  async getTask(id: string) {
    return this.request<any>(`/modules/tasks/${id}`)
  }

  async createTask(data: any) {
    return this.request<any>("/modules/tasks", {
      method: "POST",
      body: JSON.stringify(data),
    })
  }

  async updateTask(id: string, data: any) {
    return this.request<any>(`/modules/tasks/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    })
  }

  // Projects API methods
  async getProjects() {
    return this.request<any[]>("/modules/projects")
  }

  async createProject(data: any) {
    return this.request<any>("/modules/projects", {
      method: "POST",
      body: JSON.stringify(data),
    })
  }

  // Users API methods
  async getUsers() {
    return this.request<any[]>("/modules/users")
  }

  async assignRole(userId: string, role: string) {
    return this.request<any>("/modules/auth/admin/assign-role", {
      method: "POST",
      body: JSON.stringify({ userId, role }),
    })
  }

  // Admin API methods
  async getAdminStats() {
    return this.request<any>("/modules/auth/admin/stats")
  }

  async getSystemStatus() {
    return this.request<any>("/modules/system/status")
  }

  async getSystemConfig() {
    return this.request<any>("/modules/system/config")
  }

  async updateSystemConfig(data: any) {
    return this.request<any>("/modules/system/config", {
      method: "PUT",
      body: JSON.stringify(data),
    })
  }

  async restartSystem() {
    return this.request<any>("/modules/system/restart", {
      method: "POST",
    })
  }

  // Analytics API methods
  async getPerformanceAnalytics() {
    return this.request<any>("/modules/analytics/performance")
  }

  async getInsights() {
    return this.request<any>("/modules/analytics/insights")
  }

  async getAiUsage() {
    return this.request<any>("/modules/analytics/ai-usage")
  }

  async getWhatsAppStats() {
    return this.request<any>("/modules/analytics/whatsapp-stats")
  }

  // WhatsApp API methods
  async sendWhatsAppMessage(data: any) {
    return this.request<any>("/modules/whatsapp/incoming", {
      method: "POST",
      body: JSON.stringify(data),
    })
  }
}

export const apiService = new ApiService()
export default apiService

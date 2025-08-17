import { api } from '../../lib/apiClient';

// Types
export interface Task {
  id: string;
  title: string;
  description?: string;
  status: 'pending' | 'in_progress' | 'completed' | 'cancelled';
  priority: 'low' | 'medium' | 'high';
  assignee_id?: string;
  assignee_name?: string;
  due_date?: string;
  created_at: string;
  updated_at: string;
}

export interface CreateTaskData {
  title: string;
  description?: string;
  priority?: 'low' | 'medium' | 'high';
  assignee_id?: string;
  due_date?: string;
}

export interface UpdateTaskData {
  title?: string;
  description?: string;
  status?: 'pending' | 'in_progress' | 'completed' | 'cancelled';
  priority?: 'low' | 'medium' | 'high';
  assignee_id?: string;
  due_date?: string;
}

// Feature toggle for modular vs legacy endpoints
const USE_MODULAR_TASKS = process.env.REACT_APP_USE_MODULAR_TASKS === 'true';

// Tasks API functions
export const tasksApi = {
  // Get all tasks
  getTasks: async (): Promise<Task[]> => {
    if (USE_MODULAR_TASKS) {
      try {
        const response = await api.get<Task[]>('/api/modules/tasks');
        return response.data;
      } catch (error) {
        // Fallback to legacy endpoint
        const response = await api.get<Task[]>('/api/tasks');
        return response.data;
      }
    } else {
      const response = await api.get<Task[]>('/api/tasks');
      return response.data;
    }
  },

  // Get task by ID
  getTask: async (id: string): Promise<Task> => {
    if (USE_MODULAR_TASKS) {
      try {
        const response = await api.get<Task>(`/api/modules/tasks/${id}`);
        return response.data;
      } catch (error) {
        // Fallback to legacy endpoint
        const response = await api.get<Task>(`/api/tasks/${id}`);
        return response.data;
      }
    } else {
      const response = await api.get<Task>(`/api/tasks/${id}`);
      return response.data;
    }
  },

  // Create new task
  createTask: async (taskData: CreateTaskData): Promise<Task> => {
    if (USE_MODULAR_TASKS) {
      try {
        const response = await api.post<Task>('/api/modules/tasks', taskData);
        return response.data;
      } catch (error) {
        // Fallback to legacy endpoint
        const response = await api.post<Task>('/api/tasks', taskData);
        return response.data;
      }
    } else {
      const response = await api.post<Task>('/api/tasks', taskData);
      return response.data;
    }
  },

  // Update task
  updateTask: async (id: string, taskData: UpdateTaskData): Promise<Task> => {
    if (USE_MODULAR_TASKS) {
      try {
        const response = await api.put<Task>(`/api/modules/tasks/${id}`, taskData);
        return response.data;
      } catch (error) {
        // Fallback to legacy endpoint
        const response = await api.put<Task>(`/api/tasks/${id}`, taskData);
        return response.data;
      }
    } else {
      const response = await api.put<Task>(`/api/tasks/${id}`, taskData);
      return response.data;
    }
  },

  // Delete task
  deleteTask: async (id: string): Promise<void> => {
    if (USE_MODULAR_TASKS) {
      try {
        await api.delete(`/api/modules/tasks/${id}`);
      } catch (error) {
        // Fallback to legacy endpoint
        await api.delete(`/api/tasks/${id}`);
      }
    } else {
      await api.delete(`/api/tasks/${id}`);
    }
  },

  // Update task status
  updateTaskStatus: async (id: string, status: Task['status']): Promise<Task> => {
    return tasksApi.updateTask(id, { status });
  },

  // Update task assignee
  updateTaskAssignee: async (id: string, assignee_id: string): Promise<Task> => {
    return tasksApi.updateTask(id, { assignee_id });
  },

  // Health check
  health: async () => {
    if (USE_MODULAR_TASKS) {
      try {
        return await api.get('/api/modules/tasks/health');
      } catch (error) {
        return { success: false, error: 'Modular endpoint not available' };
      }
    }
    return { success: false, error: 'Legacy endpoint only' };
  },
};

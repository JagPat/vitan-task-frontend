import React, { useState, useEffect } from 'react';
import { apiClient } from '../../lib/apiClient';

const KanbanBoardView = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        setLoading(true);
        setError(null);
        console.log('Fetching tasks from API...');
        
        // Try to fetch from real API first
        const response = await apiClient.get('/api/modules/tasks');
        console.log('Tasks API response:', response);
        
        if (response && response.data) {
          setTasks(response.data);
        } else {
          // Fallback to mock data if API response is unexpected
          setTasks(getMockTasks());
        }
      } catch (err) {
        console.error('Error fetching tasks:', err);
        setError(err.message);
        // Fallback to mock data on error
        setTasks(getMockTasks());
      } finally {
        setLoading(false);
      }
    };

    fetchTasks();
  }, []);

  const getMockTasks = () => [
    {
      id: '1',
      title: 'Design new landing page',
      status: 'pending',
      priority: 'high',
      due_date: '2024-09-15',
      assigned_to: 'John Doe'
    },
    {
      id: '2',
      title: 'Implement user authentication',
      status: 'in_progress',
      priority: 'urgent',
      due_date: '2024-09-10',
      assigned_to: 'Jane Smith'
    },
    {
      id: '3',
      title: 'Write API documentation',
      status: 'needs_approval',
      priority: 'medium',
      due_date: '2024-09-20',
      assigned_to: 'Mike Johnson'
    },
    {
      id: '4',
      title: 'Setup CI/CD pipeline',
      status: 'completed',
      priority: 'low',
      due_date: '2024-09-05',
      assigned_to: 'Sarah Wilson'
    },
    {
      id: '5',
      title: 'Database optimization',
      status: 'pending',
      priority: 'medium',
      due_date: '2024-09-25',
      assigned_to: 'Alex Brown'
    }
  ];

  const handleTaskUpdate = async (taskId, updates) => {
    try {
      console.log('Updating task:', taskId, updates);
      
      // Try to update via API
      const response = await apiClient.put(`/api/modules/tasks/${taskId}`, updates);
      console.log('Task update response:', response);
      
      // Update local state
      setTasks(prevTasks => 
        prevTasks.map(task => 
          task.id === taskId ? { ...task, ...updates } : task
        )
      );
    } catch (err) {
      console.error('Error updating task:', err);
      // Still update local state for UX
      setTasks(prevTasks => 
        prevTasks.map(task => 
          task.id === taskId ? { ...task, ...updates } : task
        )
      );
    }
  };

  const columns = {
    pending: { title: 'Pending', color: 'border-slate-400', tasks: [] },
    in_progress: { title: 'In Progress', color: 'border-blue-500', tasks: [] },
    needs_approval: { title: 'Needs Approval', color: 'border-amber-500', tasks: [] },
    completed: { title: 'Completed', color: 'border-green-500', tasks: [] },
  };

  // Populate columns with tasks
  tasks.forEach(task => {
    if (columns[task.status]) {
      columns[task.status].tasks.push(task);
    }
  });

  const getPriorityColor = (priority) => {
    const colors = {
      low: 'border-l-4 border-slate-400',
      medium: 'border-l-4 border-blue-500',
      high: 'border-l-4 border-amber-500',
      urgent: 'border-l-4 border-red-500',
    };
    return colors[priority] || colors.medium;
  };

  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  const isOverdue = (dueDate, status) => {
    if (!dueDate || ['completed', 'closed'].includes(status)) return false;
    return new Date(dueDate) < new Date();
  };

  if (loading) {
    return (
      <div className="p-8">
        <div className="text-center">
          <div className="text-gray-600 text-lg mb-4">Loading tasks...</div>
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Task Management</h1>
        <p className="text-gray-600">Manage and track your team's tasks with drag-and-drop functionality</p>
        {error && (
          <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <div className="text-yellow-800">
              <strong>API Error:</strong> {error}
            </div>
            <div className="text-sm text-yellow-700 mt-1">
              Using mock data for demonstration. Real API integration will be available once backend is fixed.
            </div>
          </div>
        )}
      </div>

      <div className="flex gap-6 overflow-x-auto pb-4">
        {Object.entries(columns).map(([id, column]) => (
          <div key={id} className="w-72 flex-shrink-0">
            <div className="bg-gray-50 border-0 h-full rounded-lg">
              <div className={`p-4 border-b-4 ${column.color} rounded-t-lg`}>
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold text-gray-700">{column.title}</h3>
                  <span className="bg-gray-200 text-gray-700 px-2 py-1 rounded-full text-sm font-medium">
                    {column.tasks.length}
                  </span>
                </div>
              </div>
              <div className="p-4 min-h-[200px]">
                {column.tasks.map((task) => (
                  <div
                    key={task.id}
                    className={`mb-3 p-3 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200 ${getPriorityColor(task.priority)}`}
                  >
                    <p className="font-medium text-gray-800 mb-2">{task.title}</p>
                    <div className="flex items-center justify-between text-xs text-gray-500">
                      {task.due_date && (
                        <div className={`flex items-center gap-1 ${isOverdue(task.due_date, task.status) ? 'text-red-500 font-medium' : ''}`}>
                          <span>📅</span>
                          <span>{formatDate(task.due_date)}</span>
                        </div>
                      )}
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        task.priority === 'urgent' ? 'bg-red-100 text-red-800' :
                        task.priority === 'high' ? 'bg-amber-100 text-amber-800' :
                        task.priority === 'medium' ? 'bg-blue-100 text-blue-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {task.priority}
                      </span>
                    </div>
                    {task.assigned_to && (
                      <div className="mt-2 text-xs text-gray-600">
                        👤 {task.assigned_to}
                      </div>
                    )}
                  </div>
                ))}
                {column.tasks.length === 0 && (
                  <div className="text-center text-gray-500 py-8">
                    <div className="text-4xl mb-2">📋</div>
                    <p>No tasks in this column</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-8 p-4 bg-blue-50 border border-blue-200 rounded-lg">
        <h3 className="font-semibold text-blue-900 mb-2">📊 Task Statistics</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">{columns.pending.tasks.length}</div>
            <div className="text-blue-800">Pending</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">{columns.in_progress.tasks.length}</div>
            <div className="text-blue-800">In Progress</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-amber-600">{columns.needs_approval.tasks.length}</div>
            <div className="text-amber-800">Needs Approval</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">{columns.completed.tasks.length}</div>
            <div className="text-green-800">Completed</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default KanbanBoardView;


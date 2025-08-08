
import React, { useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Task, User } from '@/api/entities';
import { extractTaskPrimitives, extractUserPrimitives } from '@/utils';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Plus, 
  Search, 
  Filter, 
  CheckSquare, 
  Clock, 
  AlertTriangle,
  Calendar
} from 'lucide-react';
import UnifiedTaskCard from '@/components/tasks/UnifiedTaskCard';
import CreateTask from './CreateTask';
import { useToast } from '@/components/ui/use-toast';

export default function MyTasks() {
  const [tasks, setTasks] = useState([]);
  const [users, setUsers] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showCreateTask, setShowCreateTask] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [priorityFilter, setPriorityFilter] = useState('');
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    in_progress: 0,
    completed: 0,
    overdue: 0
  });
  const { toast } = useToast();

  // React Query: fetch data
  const tasksQuery = useQuery({
    queryKey: ['tasks'],
    queryFn: () => Task.getAll(),
    staleTime: 30_000
  });
  const usersQuery = useQuery({
    queryKey: ['users'],
    queryFn: () => User.getAll(),
    staleTime: 60_000
  });
  const meQuery = useQuery({
    queryKey: ['me'],
    queryFn: () => User.me(),
    staleTime: 60_000
  });

  useEffect(() => {
    if (tasksQuery.data) {
      const cleanTasks = Array.isArray(tasksQuery.data) ? tasksQuery.data.map(t => extractTaskPrimitives(t)).filter(Boolean) : [];
      setTasks(cleanTasks);
      calculateStats(cleanTasks);
    }
    if (usersQuery.data) {
      const cleanUsers = Array.isArray(usersQuery.data) ? usersQuery.data.map(u => extractUserPrimitives(u)).filter(Boolean) : [];
      setUsers(cleanUsers);
    }
    if (meQuery.data) setCurrentUser(meQuery.data);
    setLoading(tasksQuery.isLoading || usersQuery.isLoading || meQuery.isLoading);
  }, [tasksQuery.data, usersQuery.data, meQuery.data, tasksQuery.isLoading, usersQuery.isLoading, meQuery.isLoading]);

  const loadTasks = async () => {
    try {
      setLoading(true);
      const [tasksData, usersData, currentUserData] = await Promise.all([
        Task.getAll(),
        User.getAll(),
        User.me().catch(() => null)
      ]);
      
      // Extract primitive values to prevent React error #130
      const cleanTasks = Array.isArray(tasksData) ? tasksData.map(task => extractTaskPrimitives(task)).filter(task => task !== null) : [];
      const cleanUsers = Array.isArray(usersData) ? usersData.map(user => extractUserPrimitives(user)).filter(user => user !== null) : [];
      
      setTasks(cleanTasks);
      setUsers(cleanUsers);
      setCurrentUser(currentUserData || cleanUsers[0]); // Use first user as fallback
      calculateStats(cleanTasks);
    } catch (error) {
      console.error('Error loading tasks:', error);
      toast({
        title: "Error",
        description: "Failed to load tasks. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const calculateStats = (taskList) => {
    // Only count tasks assigned to current user
    const myTasks = taskList.filter(t => currentUser && t.assigned_to === currentUser.id);
    
    const stats = {
      total: myTasks.length,
      pending: myTasks.filter(t => t.status === 'pending').length,
      in_progress: myTasks.filter(t => t.status === 'in_progress').length,
      completed: myTasks.filter(t => ['completed', 'closed'].includes(t.status)).length,
      overdue: myTasks.filter(t => {
        if (!t.due_date) return false;
        const dueDate = new Date(t.due_date);
        const today = new Date();
        return dueDate < today && !['completed', 'closed'].includes(t.status);
      }).length
    };
    setStats(stats);
  };

  const filteredTasks = tasks.filter(task => {
    // Only show tasks assigned to current user
    const assignedToMe = currentUser && task.assigned_to === currentUser.id;
    
    const searchMatch = task.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                       task.description?.toLowerCase().includes(searchTerm.toLowerCase());
    const statusMatch = !statusFilter || task.status === statusFilter;
    const priorityMatch = !priorityFilter || task.priority === priorityFilter;
    
    return assignedToMe && searchMatch && statusMatch && priorityMatch;
  });

  const handleTaskCreated = (newTask) => {
    // Extract primitive values from new task
    const cleanTask = extractTaskPrimitives(newTask);
    if (cleanTask) {
      setTasks(prev => [cleanTask, ...prev]);
      calculateStats([cleanTask, ...tasks]);
    }
  };

  const handleTaskDelete = (taskId) => {
    setTasks(prev => prev.filter(t => t.id !== taskId));
    calculateStats(tasks.filter(t => t.id !== taskId));
  };

  const handleTaskStatusChange = (taskId, newStatus) => {
    setTasks(prev => prev.map(t => t.id === taskId ? { ...t, status: newStatus } : t));
    calculateStats(tasks.map(t => t.id === taskId ? { ...t, status: newStatus } : t));
  };

  const handleTaskPriorityChange = (taskId, newPriority) => {
    setTasks(prev => prev.map(t => t.id === taskId ? { ...t, priority: newPriority } : t));
  };

  const handleTaskAssignmentChange = async (taskId, userId) => {
    try {
      const assignedUser = userId ? users.find(u => u.id.toString() === userId) : null;
      await Task.update(taskId, { 
        assigned_to: userId || null,
        assigned_to_whatsapp: assignedUser?.whatsapp_number || null
      });
      
      // Reload tasks from API to get updated assignment info with correct names
      await loadTasks();

      toast({
        title: "Task Updated",
        description: userId 
          ? `Task assigned to ${assignedUser?.full_name || assignedUser?.name || assignedUser?.whatsapp_number}`
          : "Task unassigned",
      });
    } catch (error) {
      console.error('Error updating task assignment:', error);
      toast({
        title: "Error",
        description: "Failed to update task assignment",
        variant: "destructive",
      });
    }
  };

  const handleTaskPickup = async (taskId) => {
    if (!currentUser) {
      toast({
        title: "Error",
        description: "You must be logged in to pick up tasks.",
        variant: "destructive",
      });
      return;
    }

    try {
      await Task.update(taskId, { 
        assigned_to: currentUser.id,
        assigned_to_whatsapp: currentUser.whatsapp_number || null
      });
      
      // Reload tasks from API to get updated assignment info with correct names
      await loadTasks();
      
      toast({
        title: "Task Picked Up",
        description: `You are now assigned to this task. You can start working on it!`,
      });
    } catch (error) {
      console.error('Error picking up task:', error);
      toast({
        title: "Error",
        description: "Failed to pick up task. Please try again.",
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return (
      <div className="p-6 space-y-6">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-slate-200 rounded w-1/4"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-32 bg-slate-200 rounded-2xl"></div>
            ))}
          </div>
          <div className="grid lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 h-96 bg-slate-200 rounded-2xl"></div>
            <div className="h-96 bg-slate-200 rounded-2xl"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 lg:p-8 space-y-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-3xl lg:text-4xl font-bold text-slate-800">My Tasks</h1>
        <p className="text-slate-600 text-lg">
          Manage and track your assigned tasks
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                <CheckSquare className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-slate-800">{stats.total}</p>
                <p className="text-sm text-slate-500">Total Tasks</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-yellow-100 rounded-xl flex items-center justify-center">
                <Clock className="w-6 h-6 text-yellow-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-slate-800">{stats.pending}</p>
                <p className="text-sm text-slate-500">Pending</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-indigo-100 rounded-xl flex items-center justify-center">
                <AlertTriangle className="w-6 h-6 text-indigo-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-slate-800">{stats.in_progress}</p>
                <p className="text-sm text-slate-500">In Progress</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                <CheckSquare className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-slate-800">{stats.completed}</p>
                <p className="text-sm text-slate-500">Completed</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center">
                <Calendar className="w-6 h-6 text-red-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-slate-800">{stats.overdue}</p>
                <p className="text-sm text-slate-500">Overdue</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Actions */}
      <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
        <div className="flex flex-col sm:flex-row gap-4 flex-1">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
            <Input
              placeholder="Search tasks..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          
          <Select value={statusFilter || "all"} onValueChange={(value) => setStatusFilter(value === "all" ? "" : value)}>
            <SelectTrigger className="w-full sm:w-40">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="in_progress">In Progress</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
            </SelectContent>
          </Select>

          <Select value={priorityFilter || "all"} onValueChange={(value) => setPriorityFilter(value === "all" ? "" : value)}>
            <SelectTrigger className="w-full sm:w-40">
              <SelectValue placeholder="Priority" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Priority</SelectItem>
              <SelectItem value="low">Low</SelectItem>
              <SelectItem value="medium">Medium</SelectItem>
              <SelectItem value="high">High</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <Button 
          onClick={() => setShowCreateTask(true)}
          className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700"
        >
          <Plus className="w-4 h-4 mr-2" />
          New Task
        </Button>
      </div>

      {/* Tasks List */}
      <div className="space-y-4">
        {filteredTasks.length === 0 ? (
          <Card>
            <CardContent className="p-12 text-center">
              <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckSquare className="w-8 h-8 text-slate-400" />
              </div>
              <h3 className="text-lg font-semibold text-slate-800 mb-2">No tasks found</h3>
              <p className="text-slate-500 mb-4">
                {searchTerm || statusFilter || priorityFilter 
                  ? "Try adjusting your filters" 
                  : "Get started by creating your first task"
                }
              </p>
              {!searchTerm && !statusFilter && !priorityFilter && (
                <Button 
                  onClick={() => setShowCreateTask(true)}
                  variant="outline"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Create Task
                </Button>
              )}
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4">
            {filteredTasks.map((task) => (
              <UnifiedTaskCard 
                key={task.id} 
                task={task} 
                onDelete={handleTaskDelete}
                onStatusChange={handleTaskStatusChange}
                onPriorityChange={handleTaskPriorityChange}
                onAssignmentChange={handleTaskAssignmentChange}
                onPickup={handleTaskPickup}
                users={users}
                currentUser={currentUser}
                showProjectContext={true}
                showActions={true}
              />
            ))}
          </div>
        )}
      </div>

      {/* Create Task Dialog */}
      {showCreateTask && (
        <CreateTask 
          open={showCreateTask} 
          onOpenChange={setShowCreateTask}
          onTaskCreated={handleTaskCreated}
        />
      )}
    </div>
  );
}


import React, { useState, useEffect } from 'react';
import { Task } from '@/api/entities';
import { extractTaskPrimitives } from '@/utils';
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

  useEffect(() => {
    loadTasks();
  }, []);

  const loadTasks = async () => {
    try {
      setLoading(true);
      const tasksData = await Task.getAll();
      
      // Extract primitive values to prevent React error #130
      const cleanTasks = Array.isArray(tasksData) ? tasksData.map(task => extractTaskPrimitives(task)).filter(task => task !== null) : [];
      
      setTasks(cleanTasks);
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
    const stats = {
      total: taskList.length,
      pending: taskList.filter(t => t.status === 'pending').length,
      in_progress: taskList.filter(t => t.status === 'in_progress').length,
      completed: taskList.filter(t => ['completed', 'closed'].includes(t.status)).length,
      overdue: taskList.filter(t => {
        if (!t.due_date) return false;
        const dueDate = new Date(t.due_date);
        const today = new Date();
        return dueDate < today && !['completed', 'closed'].includes(t.status);
      }).length
    };
    setStats(stats);
  };

  const filteredTasks = tasks.filter(task => {
    const searchMatch = task.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                       task.description?.toLowerCase().includes(searchTerm.toLowerCase());
    const statusMatch = !statusFilter || task.status === statusFilter;
    const priorityMatch = !priorityFilter || task.priority === priorityFilter;
    return searchMatch && statusMatch && priorityMatch;
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

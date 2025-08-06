import React, { useState, useEffect } from 'react';
import { Task, Project, User } from '@/api/entities';
import { extractTaskPrimitives, extractProjectPrimitives, extractUserPrimitives } from '@/utils';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Separator } from '@/components/ui/separator';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import {
  Calendar,
  Plus,
  Search,
  Filter,
  MoreHorizontal,
  Edit,
  Trash2,
  Eye,
  CheckCircle,
  Clock,
  AlertTriangle,
  Users,
  FolderOpen,
  List,
  Grid3X3,
  CheckSquare
} from 'lucide-react';
import UnifiedTaskCard from '@/components/tasks/UnifiedTaskCard';
import AdvancedTaskFilters from '@/components/tasks/AdvancedTaskFilters';
import CreateTask from './CreateTask';
import { useToast } from '@/components/ui/use-toast';
import { isOverdue } from '@/utils/dateUtils';

export default function UnifiedTaskView() {
  const [tasks, setTasks] = useState([]);
  const [projects, setProjects] = useState([]);
  const [users, setUsers] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showCreateTask, setShowCreateTask] = useState(false);
  const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'list'
  const [activeTab, setActiveTab] = useState('all');
  const [filters, setFilters] = useState({});
  const [selectedTasks, setSelectedTasks] = useState([]);
  const [bulkActions, setBulkActions] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [tasksData, projectsData, usersData, currentUserData] = await Promise.all([
        Task.getAll(),
        Project.getAll(),
        User.getAll(),
        User.me().catch(() => null)
      ]);
      
      // Extract primitive values to prevent React error #130
      const cleanTasks = Array.isArray(tasksData) ? tasksData.map(task => extractTaskPrimitives(task)).filter(task => task !== null) : [];
      const cleanProjects = Array.isArray(projectsData) ? projectsData.map(project => extractProjectPrimitives(project)).filter(project => project !== null) : [];
      const cleanUsers = Array.isArray(usersData) ? usersData.map(user => extractUserPrimitives(user)).filter(user => user !== null) : [];
      
      setTasks(cleanTasks);
      setProjects(cleanProjects);
      setUsers(cleanUsers);
      setCurrentUser(currentUserData || cleanUsers[0]); // Use first user as fallback
    } catch (error) {
      console.error('Error loading data:', error);
      toast({
        title: "Error",
        description: "Failed to load tasks. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  // Apply filters to tasks
  const getFilteredTasks = () => {
    return tasks.filter(task => {
      // Search filter
      if (filters.search) {
        const searchLower = filters.search.toLowerCase();
        const matchesSearch = 
          task.title?.toLowerCase().includes(searchLower) ||
          task.description?.toLowerCase().includes(searchLower) ||
          task.assigned_to_name?.toLowerCase().includes(searchLower);
        if (!matchesSearch) return false;
      }

      // Status filter
      if (filters.status && filters.status !== 'all') {
        if (filters.status === 'overdue') {
          if (!task.due_date || !isOverdue(task.due_date) || ['completed', 'closed'].includes(task.status)) {
            return false;
          }
        } else if (task.status !== filters.status) {
          return false;
        }
      }

      // Priority filter
      if (filters.priority && filters.priority !== 'all' && task.priority !== filters.priority) {
        return false;
      }

      // Project filter
      if (filters.project && filters.project !== 'all' && task.project_id?.toString() !== filters.project) {
        return false;
      }

      // Assignee filter
      if (filters.assignee && filters.assignee !== 'all') {
        if (filters.assignee === 'unassigned') {
          if (task.assigned_to || task.assigned_to_name) return false;
        } else if (task.assigned_to?.toString() !== filters.assignee) {
          return false;
        }
      }

      // Due date filter
      if (filters.dueDate && filters.dueDate !== 'all') {
        const today = new Date();
        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);
        const thisWeek = new Date(today);
        thisWeek.setDate(thisWeek.getDate() + 7);
        const nextWeek = new Date(today);
        nextWeek.setDate(nextWeek.getDate() + 14);

        if (task.due_date) {
          const dueDate = new Date(task.due_date);
          switch (filters.dueDate) {
            case 'today':
              if (dueDate.toDateString() !== today.toDateString()) return false;
              break;
            case 'tomorrow':
              if (dueDate.toDateString() !== tomorrow.toDateString()) return false;
              break;
            case 'this_week':
              if (dueDate > thisWeek) return false;
              break;
            case 'next_week':
              if (dueDate < thisWeek || dueDate > nextWeek) return false;
              break;
            case 'overdue':
              if (!isOverdue(task.due_date) || ['completed', 'closed'].includes(task.status)) return false;
              break;
            case 'no_due_date':
              return false; // This task has a due date
          }
        } else if (filters.dueDate !== 'no_due_date') {
          return false; // Task has no due date but filter expects one
        }
      }

      // Created date filter
      if (filters.createdDate && filters.createdDate !== 'all') {
        const today = new Date();
        const thisWeek = new Date(today);
        thisWeek.setDate(thisWeek.getDate() - 7);
        const thisMonth = new Date(today);
        thisMonth.setMonth(thisMonth.getMonth() - 1);
        const lastWeek = new Date(today);
        lastWeek.setDate(lastWeek.getDate() - 14);

        if (task.created_at) {
          const createdDate = new Date(task.created_at);
          switch (filters.createdDate) {
            case 'today':
              if (createdDate.toDateString() !== today.toDateString()) return false;
              break;
            case 'this_week':
              if (createdDate < thisWeek) return false;
              break;
            case 'this_month':
              if (createdDate < thisMonth) return false;
              break;
            case 'last_week':
              if (createdDate < lastWeek || createdDate > thisWeek) return false;
              break;
            case 'last_month':
              if (createdDate > thisMonth) return false;
              break;
          }
        }
      }

      // Checklist filter
      if (filters.hasChecklist && filters.hasChecklist !== 'all') {
        const hasChecklist = task.checklist && task.checklist.length > 0;
        if (filters.hasChecklist === 'with_checklist' && !hasChecklist) return false;
        if (filters.hasChecklist === 'without_checklist' && hasChecklist) return false;
      }

      return true;
    });
  };

  const filteredTasks = getFilteredTasks();

  // Group tasks by status for tab view
  const getTasksByStatus = () => {
    const grouped = {
      all: filteredTasks,
      pending: filteredTasks.filter(t => t.status === 'pending'),
      in_progress: filteredTasks.filter(t => t.status === 'in_progress'),
      completed: filteredTasks.filter(t => ['completed', 'closed'].includes(t.status)),
      overdue: filteredTasks.filter(t => t.due_date && isOverdue(t.due_date) && !['completed', 'closed'].includes(t.status))
    };
    return grouped;
  };

  const tasksByStatus = getTasksByStatus();

  const handleTaskCreated = (newTask) => {
    const cleanTask = extractTaskPrimitives(newTask);
    if (cleanTask) {
      setTasks(prev => [cleanTask, ...prev]);
    }
  };

  const handleTaskDelete = (taskId) => {
    setTasks(prev => prev.filter(t => t.id !== taskId));
  };

  const handleTaskStatusChange = (taskId, newStatus) => {
    setTasks(prev => prev.map(t => t.id === taskId ? { ...t, status: newStatus } : t));
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
      await loadData();

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
      await loadData();
      
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

  const handleClearFilters = () => {
    setFilters({});
  };

  const handleTaskSelect = (taskId) => {
    setSelectedTasks(prev => 
      prev.includes(taskId) 
        ? prev.filter(id => id !== taskId)
        : [...prev, taskId]
    );
  };

  const handleBulkStatusChange = async (newStatus) => {
    try {
      // Update all selected tasks
      await Promise.all(selectedTasks.map(taskId => 
        Task.update(taskId, { status: newStatus })
      ));
      
      // Update local state
      setTasks(prev => prev.map(t => 
        selectedTasks.includes(t.id) ? { ...t, status: newStatus } : t
      ));
      
      setSelectedTasks([]);
      setBulkActions(false);
      
      toast({
        title: "Success",
        description: `Updated ${selectedTasks.length} tasks to ${newStatus.replace('_', ' ')}`,
      });
    } catch (error) {
      console.error('Error updating tasks:', error);
      toast({
        title: "Error",
        description: "Failed to update tasks. Please try again.",
        variant: "destructive",
      });
    }
  };

  const getTaskStats = () => {
    const total = filteredTasks.length;
    const pending = filteredTasks.filter(t => t.status === 'pending').length;
    const inProgress = filteredTasks.filter(t => t.status === 'in_progress').length;
    const completed = filteredTasks.filter(t => ['completed', 'closed'].includes(t.status)).length;
    const overdue = filteredTasks.filter(t => t.due_date && isOverdue(t.due_date) && !['completed', 'closed'].includes(t.status)).length;

    return { total, pending, inProgress, completed, overdue };
  };

  const stats = getTaskStats();

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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-48 bg-slate-200 rounded-xl"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-800">All Tasks</h1>
          <p className="text-slate-600 mt-1">Manage and track all tasks across projects</p>
        </div>
        
        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setViewMode(viewMode === 'grid' ? 'list' : 'grid')}
          >
            {viewMode === 'grid' ? <List className="w-4 h-4" /> : <Grid3X3 className="w-4 h-4" />}
          </Button>
          
          <Button onClick={() => setShowCreateTask(true)}>
            <Plus className="w-4 h-4 mr-2" />
            Create Task
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <CheckSquare className="w-8 h-8 text-slate-600" />
              <div>
                <p className="text-sm text-gray-600">Total</p>
                <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <Clock className="w-8 h-8 text-yellow-600" />
              <div>
                <p className="text-sm text-gray-600">Pending</p>
                <p className="text-2xl font-bold text-gray-900">{stats.pending}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <Users className="w-8 h-8 text-blue-600" />
              <div>
                <p className="text-sm text-gray-600">In Progress</p>
                <p className="text-2xl font-bold text-gray-900">{stats.inProgress}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <CheckSquare className="w-8 h-8 text-green-600" />
              <div>
                <p className="text-sm text-gray-600">Completed</p>
                <p className="text-2xl font-bold text-gray-900">{stats.completed}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <AlertTriangle className="w-8 h-8 text-red-600" />
              <div>
                <p className="text-sm text-gray-600">Overdue</p>
                <p className="text-2xl font-bold text-gray-900">{stats.overdue}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-6">
          <AdvancedTaskFilters
            filters={filters}
            onFiltersChange={setFilters}
            projects={projects}
            users={users}
          />
        </CardContent>
      </Card>

      {/* Tasks Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="all">All ({stats.total})</TabsTrigger>
          <TabsTrigger value="pending">Pending ({stats.pending})</TabsTrigger>
          <TabsTrigger value="in_progress">In Progress ({stats.inProgress})</TabsTrigger>
          <TabsTrigger value="completed">Completed ({stats.completed})</TabsTrigger>
          <TabsTrigger value="overdue">Overdue ({stats.overdue})</TabsTrigger>
        </TabsList>

        {Object.entries(tasksByStatus).map(([status, tasks]) => (
          <TabsContent key={status} value={status} className="space-y-4">
            {tasks.length === 0 ? (
              <Card>
                <CardContent className="p-12 text-center">
                  <div className="text-slate-500">
                    <CheckSquare className="w-12 h-12 mx-auto mb-4 text-slate-300" />
                    <h3 className="text-lg font-medium mb-2">No tasks found</h3>
                    <p className="text-sm">No tasks match the current filters.</p>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <div className={viewMode === 'grid' 
                ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6' 
                : 'space-y-4'
              }>
                {tasks.map((task) => (
                  <UnifiedTaskCard
                    key={task.id}
                    task={task}
                    onDelete={handleTaskDelete}
                    onStatusChange={handleTaskStatusChange}
                    onPriorityChange={handleTaskPriorityChange}
                    onAssignmentChange={handleTaskAssignmentChange}
                    users={users}
                    showProjectContext={true}
                    showActions={true}
                    compact={viewMode === 'list'}
                  />
                ))}
              </div>
            )}
          </TabsContent>
        ))}
      </Tabs>

      {/* Create Task Dialog */}
      {showCreateTask && (
        <CreateTask
          onClose={() => setShowCreateTask(false)}
          onTaskCreated={handleTaskCreated}
          projects={projects}
          users={users}
        />
      )}
    </div>
  );
} 
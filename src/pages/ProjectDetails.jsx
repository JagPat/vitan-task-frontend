import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  AlertCircle, 
  ArrowLeft, 
  Calendar, 
  CheckCircle, 
  Clock,
  Edit,
  MessageSquare,
  Plus,
  Trash2,
  Users,
} from 'lucide-react';
import CreateProjectTaskDialog from '@/components/projects/CreateProjectTaskDialog';
import ProjectTeamManager from '@/components/projects/ProjectTeamManager';
import { formatDate } from '../utils/dateUtils';

export default function ProjectDetails() {
  const { projectId } = useParams();
  const navigate = useNavigate();
  const [project, setProject] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [teamMembers, setTeamMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreateTaskDialog, setShowCreateTaskDialog] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    loadProjectDetails();
  }, [projectId]);

const loadProjectDetails = async () => {
  try {
    setLoading(true);
    const [projectResponse, tasksResponse, membersResponse] = await Promise.all([
      fetch(`https://vitan-task-production.up.railway.app/api/projects/${projectId}`, { credentials: 'include' }),
      fetch(`https://vitan-task-production.up.railway.app/api/projects/${projectId}/tasks`, { credentials: 'include' }),
      fetch(`https://vitan-task-production.up.railway.app/api/projects/${projectId}/members`, { credentials: 'include' }),
    ]);

    const projectData = await projectResponse.json();
    const tasksData = await tasksResponse.json();
    const membersData = await membersResponse.json();

    if (projectData.success) {
      setProject(projectData.data);
    } else {
      console.error('Project data error:', projectData);
    }
    if (tasksData.success) {
      setTasks(tasksData.data);
    } else {
      console.error('Tasks data error:', tasksData);
    }
    if (membersData.success) {
      setTeamMembers(membersData.data);
    } else {
      console.error('Members data error:', membersData);
    }
  } catch (error) {
    console.error('Error loading project details:', error);
  } finally {
    setLoading(false);
  }
};

  const handleTaskCreated = (newTask) => {
    setTasks(prev => [newTask, ...prev]);
  };

  const handleTaskStatusUpdate = async (taskId, newStatus) => {
    try {
      const response = await fetch(`https://vitan-task-production.up.railway.app/api/projects/tasks/${taskId}/status`, {
        credentials: 'include',
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: newStatus }),
      });

      const data = await response.json();
      if (data.success) {
        setTasks(prev => prev.map(task => 
          (task.id === taskId ? { ...task, status: newStatus } : task),
        ));
      }
    } catch (error) {
      console.error('Error updating task status:', error);
    }
  };

  const handleTeamUpdate = () => {
    // Refresh project details when team is updated
    loadProjectDetails();
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'urgent': return 'bg-red-500';
      case 'high': return 'bg-orange-500';
      case 'medium': return 'bg-yellow-500';
      case 'low': return 'bg-green-500';
      default: return 'bg-gray-500';
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800';
      case 'in_progress': return 'bg-blue-100 text-blue-800';
      case 'on_hold': return 'bg-yellow-100 text-yellow-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center py-16">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="mt-4 text-gray-500">Loading project details...</p>
        </div>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center py-16">
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Project Not Found</h2>
          <p className="text-gray-500 mb-4">The project you're looking for doesn't exist.</p>
          <Button onClick={() => navigate('/projects')}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Projects
          </Button>
        </div>
      </div>
    );
  }

  const completedTasks = tasks.filter(task => task.status === 'completed').length;
  const completionPercentage = tasks.length > 0 ? (completedTasks / tasks.length) * 100 : 0;

  return (
    <div className="container mx-auto px-4 py-8 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="outline" onClick={() => navigate('/projects')}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">{project.name}</h1>
            <p className="text-gray-600">{project.description}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button onClick={() => setShowCreateTaskDialog(true)}>
            <Plus className="w-4 h-4 mr-2" />
            Add Task
          </Button>
        </div>
      </div>

      {/* Main Content with Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="team">Team Management</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {/* Progress Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <CheckCircle className="w-8 h-8 text-green-600" />
                  <div>
                    <p className="text-sm text-gray-600">Completed</p>
                    <p className="text-2xl font-bold text-gray-900">{completedTasks}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <Clock className="w-8 h-8 text-yellow-600" />
                  <div>
                    <p className="text-sm text-gray-600">In Progress</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {tasks.filter(t => t.status === 'in_progress').length}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <Users className="w-8 h-8 text-blue-600" />
                  <div>
                    <p className="text-sm text-gray-600">Team Members</p>
                    <p className="text-2xl font-bold text-gray-900">{teamMembers.length}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <AlertCircle className="w-8 h-8 text-orange-600" />
                  <div>
                    <p className="text-sm text-gray-600">Progress</p>
                    <p className="text-2xl font-bold text-gray-900">{Math.round(completionPercentage)}%</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Project Info */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Project Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Status</span>
                  <Badge className={getStatusColor(project.status)}>
                    {project.status}
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Category</span>
                  <span className="font-medium">{project.category}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Priority</span>
                  <div className="flex items-center gap-2">
                    <div className={`w-3 h-3 rounded-full ${getPriorityColor(project.priority)}`} />
                    <span className="font-medium capitalize">{project.priority}</span>
                  </div>
                </div>
                {project.start_date && (
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Start Date</span>
                    <span className="font-medium">{formatDate(project.start_date, 'toLocaleDateString', 'Invalid date')}</span>
                  </div>
                )}
                {project.due_date && (
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Due Date</span>
                    <span className="font-medium">{formatDate(project.due_date, 'toLocaleDateString', 'Invalid date')}</span>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Progress Overview</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Completion</span>
                    <span className="font-medium">{Math.round(completionPercentage)}%</span>
                  </div>
                  <Progress value={completionPercentage} className="h-2" />
                </div>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    <span>{completedTasks} completed</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-yellow-500" />
                    <span>{tasks.length - completedTasks} remaining</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Tasks List */}
          <Card>
            <CardHeader>
              <CardTitle>Project Tasks</CardTitle>
            </CardHeader>
            <CardContent>
              {tasks.length === 0 ? (
                <div className="text-center py-8">
                  <CheckCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-700 mb-2">No tasks yet</h3>
                  <p className="text-gray-500 mb-4">Create your first task to get started</p>
                  <Button onClick={() => setShowCreateTaskDialog(true)}>
                    <Plus className="w-4 h-4 mr-2" />
                    Create First Task
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  {tasks.map((task) => (
                    <div key={task.id} className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="font-medium text-gray-900">{task.title}</h3>
                            <Badge className={getStatusColor(task.status)}>
                              {task.status}
                            </Badge>
                            <div className={`w-2 h-2 rounded-full ${getPriorityColor(task.priority)}`} />
                          </div>
                          {task.description && (
                            <p className="text-sm text-gray-600 mb-2">{task.description}</p>
                          )}
                          <div className="flex items-center gap-4 text-sm text-gray-500">
                            {task.assigned_to_whatsapp && (
                              <span>Assigned to: {task.assigned_to_whatsapp}</span>
                            )}
                            {task.due_date && (
                              <span>Due: {formatDate(task.due_date, 'toLocaleDateString', 'Invalid date')}</span>
                            )}
                            {task.estimated_hours && (
                              <span>Est. Hours: {task.estimated_hours}</span>
                            )}
                            {task.milestone && (
                              <span>Milestone: {task.milestone}</span>
                            )}
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Select 
                            value={task.status} 
                            onValueChange={(value) => handleTaskStatusUpdate(task.id, value)}
                          >
                            <SelectTrigger className="w-32">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="pending">Pending</SelectItem>
                              <SelectItem value="in_progress">In Progress</SelectItem>
                              <SelectItem value="completed">Completed</SelectItem>
                              <SelectItem value="on_hold">On Hold</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="team" className="space-y-6">
          <ProjectTeamManager 
            projectId={projectId} 
            projectName={project.name}
            onTeamUpdate={handleTeamUpdate}
          />
        </TabsContent>
      </Tabs>

      {/* Create Task Dialog */}
      <CreateProjectTaskDialog
        open={showCreateTaskDialog}
        onOpenChange={setShowCreateTaskDialog}
        onTaskCreated={handleTaskCreated}
        projectId={projectId}
        projectName={project.name}
        teamMembers={teamMembers}
      />
    </div>
  );
} 
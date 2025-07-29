import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { 
  Calendar, 
  Users, 
  CheckCircle, 
  Clock, 
  AlertCircle,
  ArrowRight,
  Edit,
  Trash2
} from 'lucide-react';

export default function ProjectCard({ project, onEdit, onDelete, onView }) {
  const navigate = useNavigate();
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
      case 'active': return 'bg-green-100 text-green-800';
      case 'completed': return 'bg-blue-100 text-blue-800';
      case 'on_hold': return 'bg-yellow-100 text-yellow-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const completionPercentage = project.completion_percentage || 0;
  const totalTasks = project.task_count || 0;
  const completedTasks = project.completed_tasks || 0;
  const memberCount = project.member_count || 0;

  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <CardTitle className="text-lg font-semibold text-gray-900">
              {project.name}
            </CardTitle>
            <p className="text-sm text-gray-600 mt-1">
              {project.description}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Badge className={getStatusColor(project.status)}>
              {project.status}
            </Badge>
            <div className={`w-3 h-3 rounded-full ${getPriorityColor(project.priority)}`} />
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Progress */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-600">Progress</span>
            <span className="font-medium">{completionPercentage}%</span>
          </div>
          <Progress value={completionPercentage} className="h-2" />
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 text-sm">
          <div className="flex items-center gap-2">
            <Users className="w-4 h-4 text-gray-500" />
            <span>{memberCount} members</span>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle className="w-4 h-4 text-gray-500" />
            <span>{totalTasks} tasks</span>
          </div>
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-gray-500" />
            <span>{completedTasks} done</span>
          </div>
        </div>

        {/* Dates */}
        <div className="flex items-center gap-4 text-sm text-gray-600">
          {project.start_date && (
            <div className="flex items-center gap-1">
              <Calendar className="w-4 h-4" />
              <span>Start: {new Date(project.start_date).toLocaleDateString()}</span>
            </div>
          )}
          {project.due_date && (
            <div className="flex items-center gap-1">
              <AlertCircle className="w-4 h-4" />
              <span>Due: {new Date(project.due_date).toLocaleDateString()}</span>
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2 pt-2">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => navigate(`/ProjectDetails/${project.id}`)}
            className="flex-1"
          >
            <ArrowRight className="w-4 h-4 mr-1" />
            View Details
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => onEdit(project)}
          >
            <Edit className="w-4 h-4" />
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => onDelete(project)}
            className="text-red-600 hover:text-red-700"
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
} 
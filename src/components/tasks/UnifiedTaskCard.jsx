import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
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
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { formatDistanceToNow, format } from 'date-fns';
import { 
  User, 
  Calendar,
  ArrowRight,
  AlertTriangle,
  Flag,
  CheckSquare,
  Trash2,
  FolderOpen,
  Clock,
  MoreVertical
} from "lucide-react";
import { isOverdue, formatDate } from '../../utils/dateUtils';
import { Task } from '@/api/entities';
import { getStatusStyle, getPriorityStyle, cardStyles } from '@/utils/designSystem';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const priorityIcons = {
  low: <Flag className="w-3 h-3" />,
  medium: <Flag className="w-3 h-3" />,
  high: <Flag className="w-3 h-3" />,
  urgent: <AlertTriangle className="w-3 h-3" />
};

export default function UnifiedTaskCard({ 
  task, 
  onDelete, 
  onEdit, 
  onStatusChange, 
  onPriorityChange,
  showProjectContext = true,
  showActions = true,
  compact = false
}) {
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteReason, setDeleteReason] = useState('');
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  
  const taskIsOverdue = task.due_date && isOverdue(task.due_date) && !['completed', 'closed'].includes(task.status);
  const statusStyle = getStatusStyle(task.status);
  const priorityStyle = getPriorityStyle(task.priority);
  const priorityIcon = priorityIcons[task.priority] || priorityIcons.medium;

  const handleDelete = async () => {
    if (!deleteReason.trim()) {
      alert('Please provide a reason for deletion');
      return;
    }

    setIsDeleting(true);
    try {
      await Task.delete(task.id, { reason: deleteReason });
      if (onDelete) {
        onDelete(task.id);
      }
      setShowDeleteDialog(false);
      setDeleteReason('');
    } catch (error) {
      console.error('Error deleting task:', error);
      alert('Failed to delete task');
    } finally {
      setIsDeleting(false);
    }
  };

  const handleStatusChange = async (newStatus) => {
    try {
      await Task.update(task.id, { status: newStatus });
      if (onStatusChange) {
        onStatusChange(task.id, newStatus);
      }
    } catch (error) {
      console.error('Error updating task status:', error);
    }
  };

  const handlePriorityChange = async (newPriority) => {
    try {
      await Task.update(task.id, { priority: newPriority });
      if (onPriorityChange) {
        onPriorityChange(task.id, newPriority);
      }
    } catch (error) {
      console.error('Error updating task priority:', error);
    }
  };

  return (
    <Card className={`${cardStyles.interactive} ${compact ? 'p-4' : 'p-6'}`}>
      <CardContent className={`${compact ? 'p-0' : 'p-0'} space-y-4`}>
        {/* Header with Project Context */}
        <div className="flex items-start justify-between">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-2">
              {showProjectContext && task.project_name && (
                <div className="flex items-center gap-1 text-xs text-slate-500">
                  <FolderOpen className="w-3 h-3" />
                  <span className="truncate">{task.project_name}</span>
                </div>
              )}
            </div>
            
            <Link to={createPageUrl(`TaskDetails?id=${task.id}`)} className="group">
              <h3 className={`font-semibold text-slate-800 group-hover:text-indigo-600 transition-colors ${compact ? 'text-sm' : 'text-base'}`}>
                {task.title}
              </h3>
            </Link>
            
            {!compact && task.description && (
              <p className="text-sm text-slate-600 line-clamp-2 mt-1">{task.description}</p>
            )}
          </div>
          
          {showActions && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                  <MoreVertical className="w-4 h-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => onEdit && onEdit(task)}>
                  Edit Task
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setShowDeleteDialog(true)}>
                  Delete Task
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>

        {/* Status and Priority Badges */}
        <div className="flex items-center gap-2 flex-wrap">
          <Badge className={`${statusStyle.bg} ${statusStyle.text} ${statusStyle.border} border`}>
            {task.status.replace('_', ' ')}
          </Badge>
          
          <Badge className={`${priorityStyle.bg} ${priorityStyle.text} ${priorityStyle.border} border flex items-center gap-1`}>
            {priorityIcon}
            {task.priority}
          </Badge>
          
          {taskIsOverdue && (
            <Badge className="bg-red-100 text-red-800 border border-red-200">
              Overdue
            </Badge>
          )}
        </div>

        {/* Task Details */}
        <div className="flex items-center gap-4 text-sm text-slate-500">
          {task.checklist && task.checklist.length > 0 && (
            <div className="flex items-center gap-1">
              <CheckSquare className="w-4 h-4" />
              <span>{task.checklist.filter(i => i.completed).length}/{task.checklist.length}</span>
            </div>
          )}

          {task.assigned_to_name && (
            <div className="flex items-center gap-1">
              <User className="w-4 h-4" />
              <span className="truncate">{task.assigned_to_name}</span>
            </div>
          )}

          {task.due_date && (
            <div className="flex items-center gap-1">
              <Calendar className="w-4 h-4" />
              <span className={taskIsOverdue ? 'text-red-600 font-medium' : ''}>
                {formatDate(task.due_date)}
              </span>
            </div>
          )}

          {task.created_at && (
            <div className="flex items-center gap-1">
              <Clock className="w-4 h-4" />
              <span>{formatDistanceToNow(new Date(task.created_at), { addSuffix: true })}</span>
            </div>
          )}
        </div>

        {/* Quick Actions */}
        {showActions && !compact && (
          <div className="flex items-center justify-between pt-2 border-t border-slate-100">
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleStatusChange('in_progress')}
                disabled={task.status === 'in_progress'}
                className="text-xs"
              >
                Start
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleStatusChange('completed')}
                disabled={task.status === 'completed'}
                className="text-xs"
              >
                Complete
              </Button>
            </div>
            
            <Link to={createPageUrl(`TaskDetails?id=${task.id}`)}>
              <Button variant="ghost" size="sm" className="text-xs">
                View Details
                <ArrowRight className="w-3 h-3 ml-1" />
              </Button>
            </Link>
          </div>
        )}
      </CardContent>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Task</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete "{task.title}"? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="space-y-2">
            <Label htmlFor="delete-reason">Reason for deletion</Label>
            <Input
              id="delete-reason"
              value={deleteReason}
              onChange={(e) => setDeleteReason(e.target.value)}
              placeholder="Enter reason for deletion..."
            />
          </div>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={isDeleting || !deleteReason.trim()}
              className="bg-red-600 hover:bg-red-700"
            >
              {isDeleting ? 'Deleting...' : 'Delete Task'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Card>
  );
} 
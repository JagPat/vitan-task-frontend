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
  Trash2
} from "lucide-react";
import { isOverdue, formatDate } from '../../utils/dateUtils';
import { Task } from '@/api/entities';

const priorityMap = {
  low: { label: 'Low', color: 'bg-slate-100 text-slate-700 border-slate-200', icon: <Flag className="w-3 h-3" /> },
  medium: { label: 'Medium', color: 'bg-blue-100 text-blue-700 border-blue-200', icon: <Flag className="w-3 h-3" /> },
  high: { label: 'High', color: 'bg-amber-100 text-amber-700 border-amber-200', icon: <Flag className="w-3 h-3" /> },
  urgent: { label: 'Urgent', color: 'bg-red-100 text-red-700 border-red-200', icon: <AlertTriangle className="w-3 h-3" /> },
};

const statusMap = {
    pending: { label: 'Pending', color: 'bg-slate-100 text-slate-600' },
    in_progress: { label: 'In Progress', color: 'bg-blue-100 text-blue-600' },
    completed: { label: 'Completed', color: 'bg-green-100 text-green-600' },
    needs_approval: { label: 'Needs Approval', color: 'bg-amber-100 text-amber-600' },
    closed: { label: 'Closed', color: 'bg-emerald-100 text-emerald-600' },
    overdue: { label: 'Overdue', color: 'bg-red-100 text-red-600' },
};


// Deprecated: use `UnifiedTaskCard` instead. This component is kept for backward compatibility
// and will be removed once all references are migrated.
export default function TaskCard({ task, onDelete }) {
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteReason, setDeleteReason] = useState('');
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  
  const taskIsOverdue = task.due_date && isOverdue(task.due_date) && !['completed', 'closed'].includes(task.status);
  const priority = priorityMap[task.priority] || priorityMap.medium;
  const status = statusMap[task.status] || statusMap.pending;

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

  return (
    <Card className="hover:shadow-md transition-shadow duration-200 border-slate-200">
      <CardContent className="p-4 flex flex-col md:flex-row md:items-center gap-4">
        <div className="flex-1 space-y-2">
          <Link to={createPageUrl(`TaskDetails?id=${task.id}`)} className="group">
            <h3 className="font-semibold text-slate-800 group-hover:text-indigo-600 transition-colors">
              {task.title}
            </h3>
          </Link>
          <p className="text-sm text-slate-600 line-clamp-1">{task.description}</p>
        </div>
        
        <div className="flex flex-wrap items-center gap-4 text-sm text-slate-500">
          {task.checklist && task.checklist.length > 0 && (
            <div className="flex items-center gap-2">
              <CheckSquare className="w-4 h-4" />
              <span>{task.checklist.filter(i => i.completed).length}/{task.checklist.length}</span>
            </div>
          )}

          <Badge variant="outline" className={`${priority.color} gap-1.5`}>
            {priority.icon}
            {priority.label}
          </Badge>
          
          <Badge className={`${status.color}`}>
            {status.label}
          </Badge>

          {task.due_date && (
            <div className={`flex items-center gap-2 ${taskIsOverdue ? 'text-red-600 font-medium' : ''}`}>
              <Calendar className="w-4 h-4" />
              <span>{formatDate(task.due_date, 'toLocaleDateString', 'Invalid date')}</span>
            </div>
          )}
          
          <div className="flex items-center gap-2">
            <Link 
              to={createPageUrl(`TaskDetails?id=${task.id}`)}
              className="text-indigo-600 hover:underline flex items-center gap-1 transition-all"
            >
              Details <ArrowRight className="w-3 h-3" />
            </Link>
            
            <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
              <AlertDialogTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-red-600 hover:text-red-700 hover:bg-red-50"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Delete Task</AlertDialogTitle>
                  <AlertDialogDescription>
                    This will move the task to trash. It can be restored later. Please provide a reason for deletion.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="delete-reason">Reason for deletion</Label>
                    <Input
                      id="delete-reason"
                      value={deleteReason}
                      onChange={(e) => setDeleteReason(e.target.value)}
                      placeholder="Enter reason for deletion..."
                    />
                  </div>
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
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
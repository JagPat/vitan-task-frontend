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
  MoreVertical,
  UserPlus,
  Play,
  CheckCircle,
  Users
} from "lucide-react";
import { isOverdue, formatDate } from '../../utils/dateUtils';
import { Task, ActivityLog } from '@/api/entities';
import { toast } from 'sonner';
import { getStatusStyle, getPriorityStyle, cardStyles } from '@/utils/designSystem';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

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
  onAssignmentChange,
  onPickup,
  users = [],
  currentUser = null,
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
  
  // Calculate assigned user name from users list
  const assignedUser = task.assigned_to ? users.find(u => u.id === task.assigned_to) : null;
  const assignedUserName =
    assignedUser?.full_name ||
    assignedUser?.name ||
    assignedUser?.whatsapp_number ||
    task.assigned_to_name ||
    task.assigned_to_whatsapp ||
    null;

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

      // Soft-delete Undo toast
      toast.success('Task moved to trash', {
        action: {
          label: 'Undo',
          onClick: async () => {
            try {
              await Task.restore(task.id);
              toast.success('Task restored');
            } catch (e) {
              toast.error('Failed to restore task');
            }
          }
        },
        duration: 30000
      });
    } catch (error) {
      console.error('Error deleting task:', error);
      alert('Failed to delete task');
    } finally {
      setIsDeleting(false);
    }
  };

  const handleStatusChange = async (newStatus) => {
    try {
      if (newStatus === 'completed' && currentUser?.id && task.assigned_to && task.assigned_to !== currentUser.id) {
        try {
          await ActivityLog.create({
            task_id: task.id,
            action: 'completion_attempt_by_non_assignee',
            notes: `Completion attempted by ${currentUser?.full_name || 'User'} (not assignee)`,
            performed_by_name: currentUser?.full_name || 'User',
            whatsapp_message_sent: false
          });
        } catch {}
        return;
      }

      await Task.update(task.id, { status: newStatus });
      if (onStatusChange) {
        onStatusChange(task.id, newStatus);
      }
      if (newStatus === 'completed' && currentUser?.id && task.assigned_to && task.assigned_to !== currentUser.id) {
        try {
          await ActivityLog.create({
            task_id: task.id,
            action: 'completed_by_admin',
            notes: `Task marked completed by admin ${currentUser?.full_name || 'Admin'}`,
            performed_by_name: currentUser?.full_name || 'Admin',
            whatsapp_message_sent: false
          });
        } catch {}
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

  const handleAssignmentChange = async (value) => {
    if (onAssignmentChange) {
      try {
        // Convert "unassigned" to null/empty
        const userId = value === "unassigned" ? null : value;
        await onAssignmentChange(task.id, userId);
      } catch (error) {
        console.error('Error updating task assignment:', error);
      }
    }
  };

  const handleAssignToMe = async () => {
    if (!currentUser?.id) return;
    try {
      await Task.update(task.id, { assigned_to: currentUser.id, status: task.status === 'pending' ? 'in_progress' : task.status });
      toast.success('Assigned to you');
    } catch (e) {
      toast.error('Failed to assign');
    }
  };

  const handleDuePreset = async (preset) => {
    const today = new Date();
    let due = new Date(today);
    if (preset === 'today') {
      // keep today
    } else if (preset === '+1') {
      due.setDate(today.getDate() + 1);
    } else if (preset === '+7') {
      due.setDate(today.getDate() + 7);
    }
    const dueIso = due.toISOString().slice(0, 10);
    try {
      await Task.update(task.id, { due_date: dueIso });
      toast.success(`Due ${preset === 'today' ? 'today' : preset}`);
    } catch (e) {
      toast.error('Failed to update due date');
    }
  };

  const showAcceptDecline = !!currentUser?.id && task.assigned_to === currentUser.id && !task.accepted_at && !task.declined_at && !['completed','closed'].includes(task.status);
  const awaitingAcceptance = task.assigned_to && !task.accepted_at && !task.declined_at;

  const handleAccept = async () => {
    try {
      await Task.update(task.id, { accepted_at: new Date().toISOString(), accepted_by: currentUser.id, status: task.status === 'pending' ? 'in_progress' : task.status });
      toast.success('Accepted');
    } catch (e) {
      toast.error('Failed to accept');
    }
  };

  const handleDecline = async () => {
    try {
      await Task.update(task.id, { declined_at: new Date().toISOString(), declined_by: currentUser.id, status: 'pending' });
      toast.success('Declined');
    } catch (e) {
      toast.error('Failed to decline');
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
                {(currentUser?.role === 'admin' || currentUser?.role === 'manager') && (
                  <DropdownMenuItem onClick={() => setShowDeleteDialog(true)}>
                    Delete Task
                  </DropdownMenuItem>
                )}
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

          {awaitingAcceptance && (
            <Badge className="bg-amber-100 text-amber-800 border border-amber-200">
              Awaiting acceptance
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

          {assignedUserName && (
            <div className="flex items-center gap-1">
              <User className="w-4 h-4" />
              <span className="truncate">{assignedUserName}</span>
            </div>
          )}

          {Array.isArray(task.watchers) && task.watchers.length > 0 && (
            <div className="flex items-center gap-1">
              <Users className="w-4 h-4" />
              <span className="truncate">{task.watchers.length} watcher{task.watchers.length === 1 ? '' : 's'}</span>
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

        {/* Quick Actions - Always visible and prominent */}
        {showActions && (
          <div className="space-y-3 pt-3 border-t border-slate-200">
            {/* Assignment Section */}
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-slate-700 flex items-center gap-2">
                <Users className="w-4 h-4" />
                {task.assigned_to ? 'Reassign:' : 'Assign to:'}
              </span>
              <div className="min-w-0 flex-1 ml-3">
                {(currentUser?.role === 'admin' || currentUser?.role === 'manager') ? (
                  <Select
                    value={task.assigned_to?.toString() || "unassigned"}
                    onValueChange={handleAssignmentChange}
                  >
                    <SelectTrigger className="h-8 text-xs">
                      <SelectValue placeholder="Assign to someone" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="unassigned">Unassigned</SelectItem>
                      {users.map((user) => (
                        <SelectItem key={user.id} value={user.id.toString()}>
                          {user.full_name || user.name || user.whatsapp_number}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                ) : (
                  <div className="flex items-center gap-2">
                    <Badge variant="outline">{assignedUserName || 'Unassigned'}</Badge>
                    {(!task.assigned_to || task.assigned_to !== currentUser?.id) && (
                      <Button variant="outline" size="sm" className="text-xs" onClick={handleAssignToMe}>
                        Assign to me
                      </Button>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Status Actions */}
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-slate-700">Status:</span>
              <div className="flex items-center gap-2">
                {/* Business Logic: Task assignment and status flow */}
                {!task.assigned_to && task.status === 'pending' && onPickup && (
                  <Button
                    variant="default"
                    size="sm"
                    onClick={() => onPickup(task.id)}
                    className="text-xs bg-indigo-600 hover:bg-indigo-700"
                  >
                    <UserPlus className="w-3 h-3 mr-1" />
                    Pick up task
                  </Button>
                )}
                
                {showAcceptDecline && (
                  <>
                    <Button variant="outline" size="sm" className="text-xs" onClick={handleDecline}>
                      Decline
                    </Button>
                    <Button variant="default" size="sm" className="text-xs bg-green-600 hover:bg-green-700" onClick={handleAccept}>
                      Accept
                    </Button>
                  </>
                )}

                {task.assigned_to && task.assigned_to === currentUser?.id && task.status === 'pending' && (
                  <Button
                    variant="default"
                    size="sm"
                    onClick={() => handleStatusChange('in_progress')}
                    className="text-xs bg-blue-600 hover:bg-blue-700"
                  >
                    <Play className="w-3 h-3 mr-1" />
                    Start Task
                  </Button>
                )}
                
                {task.assigned_to && task.assigned_to === currentUser?.id && task.status === 'in_progress' && (
                  <Button
                    variant="default"
                    size="sm"
                    onClick={() => handleStatusChange('completed')}
                    className="text-xs bg-green-600 hover:bg-green-700"
                  >
                    <CheckCircle className="w-3 h-3 mr-1" />
                    Complete
                  </Button>
                )}
                
                {task.status === 'completed' && (
                  <span className="text-xs text-green-600 font-medium flex items-center gap-1">
                    <CheckCircle className="w-3 h-3" />
                    Completed
                  </span>
                )}
                
                <Link to={createPageUrl(`TaskDetails?id=${task.id}`)}>
                  <Button variant="outline" size="sm" className="text-xs">
                    Details
                    <ArrowRight className="w-3 h-3 ml-1" />
                  </Button>
                </Link>
              </div>
            </div>

            {/* Quick action presets (limit to three due shortcuts) */}
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-slate-700">Quick actions:</span>
              <div className="flex flex-wrap items-center gap-2">
                <Button variant="outline" size="sm" className="text-xs" onClick={() => handleDuePreset('today')}>Due Today</Button>
                <Button variant="outline" size="sm" className="text-xs" onClick={() => handleDuePreset('+1')}>+1 day</Button>
                <Button variant="outline" size="sm" className="text-xs" onClick={() => handleDuePreset('+7')}>+7 days</Button>
              </div>
            </div>
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
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
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
  RotateCcw, 
  Trash2, 
  Calendar, 
  User, 
  AlertTriangle,
  Flag,
  CheckSquare,
  History
} from "lucide-react";
import { formatDate } from '../utils/dateUtils';
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

export default function DeletedTasks() {
  const [deletedTasks, setDeletedTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [restoring, setRestoring] = useState(null);

  useEffect(() => {
    loadDeletedTasks();
  }, []);

  const loadDeletedTasks = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/tasks/deleted');
      const data = await response.json();
      
      if (data.success) {
        setDeletedTasks(data.data);
      } else {
        console.error('Failed to load deleted tasks:', data.error);
      }
    } catch (error) {
      console.error('Error loading deleted tasks:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRestore = async (taskId) => {
    setRestoring(taskId);
    try {
      const response = await fetch(`/api/tasks/${taskId}/restore`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      const data = await response.json();
      
      if (data.success) {
        // Remove from deleted tasks list
        setDeletedTasks(prev => prev.filter(task => task.id !== taskId));
        alert('Task restored successfully!');
      } else {
        alert('Failed to restore task: ' + data.error);
      }
    } catch (error) {
      console.error('Error restoring task:', error);
      alert('Failed to restore task');
    } finally {
      setRestoring(null);
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 mx-auto"></div>
            <p className="mt-2 text-slate-600">Loading deleted tasks...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-4">
          <History className="w-8 h-8 text-red-600" />
          <h1 className="text-3xl font-bold text-slate-900">Deleted Tasks</h1>
        </div>
        <p className="text-slate-600">
          View and restore tasks that have been moved to trash. Deleted tasks are kept for audit purposes.
        </p>
      </div>

      {deletedTasks.length === 0 ? (
        <Card>
          <CardContent className="p-8 text-center">
            <Trash2 className="w-12 h-12 text-slate-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-slate-700 mb-2">No Deleted Tasks</h3>
            <p className="text-slate-500">
              There are no deleted tasks to display. Tasks that are deleted will appear here.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {deletedTasks.map((task) => {
            const priority = priorityMap[task.priority] || priorityMap.medium;
            const status = statusMap[task.status] || statusMap.pending;

            return (
              <Card key={task.id} className="border-red-200 bg-red-50/30">
                <CardContent className="p-6">
                  <div className="flex flex-col md:flex-row md:items-start gap-4">
                    <div className="flex-1 space-y-3">
                      <div className="flex items-start justify-between">
                        <div>
                          <h3 className="font-semibold text-slate-800 text-lg">
                            {task.title}
                          </h3>
                          <p className="text-sm text-slate-600 mt-1">
                            {task.description}
                          </p>
                        </div>
                        <Badge variant="outline" className="bg-red-100 text-red-700 border-red-200">
                          Deleted
                        </Badge>
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
                          <div className="flex items-center gap-2">
                            <Calendar className="w-4 h-4" />
                            <span>{formatDate(task.due_date, 'toLocaleDateString', 'Invalid date')}</span>
                          </div>
                        )}

                        {task.assigned_to_name && (
                          <div className="flex items-center gap-2">
                            <User className="w-4 h-4" />
                            <span>{task.assigned_to_name}</span>
                          </div>
                        )}
                      </div>

                      <div className="pt-2 border-t border-slate-200">
                        <div className="flex items-center gap-4 text-xs text-slate-500">
                          <span>Created by: {task.created_by_name || 'Unknown'}</span>
                          <span>Deleted by: {task.deleted_by_name || 'Unknown'}</span>
                          <span>Deleted: {formatDate(task.deleted_at, 'toLocaleDateString', 'Unknown')}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button
                            variant="outline"
                            size="sm"
                            disabled={restoring === task.id}
                            className="text-green-600 border-green-200 hover:bg-green-50"
                          >
                            <RotateCcw className="w-4 h-4 mr-2" />
                            {restoring === task.id ? 'Restoring...' : 'Restore'}
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Restore Task</AlertDialogTitle>
                            <AlertDialogDescription>
                              This will restore the task "{task.title}" and make it active again. 
                              The task will be available in the main task list.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => handleRestore(task.id)}
                              className="bg-green-600 hover:bg-green-700"
                            >
                              Restore Task
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
} 
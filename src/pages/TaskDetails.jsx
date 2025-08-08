import React, { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { Task, User, ActivityLog } from "@/api/entities";
import { createPageUrl } from "@/utils";
import { sendWhatsappMessage } from "@/api/functions";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { 
  ArrowLeft, 
  Edit, 
  UserCheck, 
  Clock, 
  AlertCircle,
  Calendar,
  User as UserIcon,
  Phone,
  CheckCircle2,
  X,
  MessageSquare
} from "lucide-react";
import { format } from "date-fns";
import { parseDate, formatDate } from "../utils/dateUtils";
import { toast } from "sonner";

import EditTaskDialog from "../components/tasks/EditTaskDialog";
import ReassignTaskDialog from "../components/tasks/ReassignTaskDialog";
import TaskHistory from "../components/tasks/TaskHistory";

export default function TaskDetails() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const taskId = searchParams.get("id");
  
  const [task, setTask] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);
  const [users, setUsers] = useState([]);
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [showReassignDialog, setShowReassignDialog] = useState(false);

  useEffect(() => {
    if (taskId) {
      loadTaskDetails();
    }
  }, [taskId]);

  const loadTaskDetails = async () => {
    setLoading(true);
    try {
      const [taskData, userData, usersData, activitiesData] = await Promise.all([
        Task.filter({ id: taskId }).then(tasks => tasks[0]),
        User.me().catch(() => null),
        fetch('https://vitan-task-production.up.railway.app/api/users', { credentials: 'include' }).then(res => res.json()).then(data => data.data || []),
        ActivityLog.filter({ task_id: taskId }, "-created_date")
      ]);
      
      setTask(taskData);
      setCurrentUser(userData);
      setUsers(usersData);
      setActivities(Array.isArray(activitiesData) ? activitiesData : []);
    } catch (error) {
      console.error("Error loading task details:", error);
    } finally {
      setLoading(false);
    }
  };

  const canModifyTask = () => {
    if (!currentUser || !task) return false;
    return (
      currentUser.role === 'admin' || 
      task.created_by === currentUser.id ||
      task.assigned_to === currentUser.id
    );
  };

  const canReassignTask = () => {
    if (!currentUser || !task) return false;
    return (
      currentUser.role === 'admin' || 
      task.created_by === currentUser.id ||
      task.assigned_to === currentUser.id
    );
  };

  const handleTaskUpdate = async (updatedData) => {
    try {
      console.log('Updating task with data:', updatedData);
      
      const updateResponse = await Task.update(taskId, updatedData);
      console.log('Task update response:', updateResponse);
      
      // Log the update
      try {
        await ActivityLog.create({
          task_id: taskId,
          action: "updated",
          notes: `Task updated by ${currentUser.full_name}`,
          performed_by_name: currentUser.full_name,
          whatsapp_message_sent: false
        });
        console.log('Activity log created successfully');
      } catch (logError) {
        console.error("Error creating activity log:", logError);
      }

      // Send WhatsApp notification about the update
      if (task.assigned_to_phone) {
        try {
          await sendWhatsappMessage({
            to: task.assigned_to_phone,
            name: task.assigned_to_name,
            task_title: updatedData.title || task.title,
            due_date: updatedData.due_date || task.due_date,
            priority: updatedData.priority || task.priority,
            is_external: task.is_external_assignment,
            update_type: "modified"
          });
          console.log('WhatsApp notification sent successfully');
        } catch (error) {
          console.error("Failed to send WhatsApp notification:", error);
        }
      }

      setShowEditDialog(false);
      
      // Reload task details to show updated data
      console.log('Reloading task details...');
      await loadTaskDetails();
      console.log('Task details reloaded successfully');
      
    } catch (error) {
      console.error("Error updating task:", error);
      // Don't close dialog on error, let user try again
    }
  };

  const showAcceptDecline = currentUser && task && task.assigned_to === currentUser.id && !task.accepted_at && !task.declined_at && !['completed','closed'].includes(task.status);
  const handleAccept = async () => {
    try {
      await Task.update(taskId, { accepted_at: new Date().toISOString(), accepted_by: currentUser.id, status: task.status === 'pending' ? 'in_progress' : task.status });
      toast.success('Accepted');
      await loadTaskDetails();
    } catch (e) {
      toast.error('Failed to accept');
    }
  };
  const handleDecline = async () => {
    try {
      await Task.update(taskId, { declined_at: new Date().toISOString(), declined_by: currentUser.id, status: 'pending' });
      toast.success('Declined');
      await loadTaskDetails();
    } catch (e) {
      toast.error('Failed to decline');
    }
  };

  const handleReassignment = async (newAssignee) => {
    try {
      const updateData = {
        assigned_to: newAssignee.is_external ? null : newAssignee.id,
        assigned_to_name: newAssignee.name,
        assigned_to_phone: newAssignee.phone,
        is_external_assignment: newAssignee.is_external,
        status: "pending" // Reset status when reassigning
      };

      await Task.update(taskId, updateData);
      
      // Log the reassignment
      await ActivityLog.create({
        task_id: taskId,
        action: "reassigned",
        old_value: task.assigned_to_name,
        new_value: newAssignee.name,
        notes: `Task reassigned from ${task.assigned_to_name} to ${newAssignee.name} by ${currentUser.full_name}`,
        performed_by_name: currentUser.full_name,
        whatsapp_message_sent: true
      });

      // Send WhatsApp notification to new assignee
      if (newAssignee.phone) {
        try {
          await sendWhatsappMessage({
            to: newAssignee.phone,
            name: newAssignee.name,
            task_title: task.title,
            due_date: task.due_date,
            priority: task.priority,
            is_external: newAssignee.is_external,
            created_by_name: currentUser.full_name,
            update_type: "reassigned"
          });
        } catch (error) {
          console.error("Failed to send WhatsApp notification:", error);
        }
      }

      // Notify original assignee about reassignment
      if (task.assigned_to_phone && task.assigned_to_phone !== newAssignee.phone) {
        try {
          await sendWhatsappMessage({
            to: task.assigned_to_phone,
            name: task.assigned_to_name,
            task_title: task.title,
            update_type: "reassigned_away",
            new_assignee: newAssignee.name,
            reassigned_by: currentUser.full_name
          });
        } catch (error) {
          console.error("Failed to send WhatsApp notification to original assignee:", error);
        }
      }

      setShowReassignDialog(false);
      loadTaskDetails();
    } catch (error) {
      console.error("Error reassigning task:", error);
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      pending: "bg-yellow-100 text-yellow-800",
      in_progress: "bg-blue-100 text-blue-800",
      completed: "bg-green-100 text-green-800",
      needs_approval: "bg-orange-100 text-orange-800",
      closed: "bg-gray-100 text-gray-800"
    };
    return colors[status] || "bg-gray-100 text-gray-800";
  };

  const getPriorityColor = (priority) => {
    const colors = {
      low: "bg-slate-100 text-slate-700",
      medium: "bg-blue-100 text-blue-700",
      high: "bg-amber-100 text-amber-700",
      urgent: "bg-red-100 text-red-700"
    };
    return colors[priority] || "bg-gray-100 text-gray-800";
  };

  if (loading) {
    return (
      <div className="p-8 max-w-6xl mx-auto">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-slate-200 rounded w-1/4"></div>
          <div className="h-96 bg-slate-200 rounded-2xl"></div>
        </div>
      </div>
    );
  }

  if (!task) {
    return (
      <div className="p-8 max-w-6xl mx-auto text-center">
        <h1 className="text-2xl font-bold text-slate-800 mb-4">Task Not Found</h1>
        <Button onClick={() => navigate(createPageUrl("Dashboard"))}>
          Go to Dashboard
        </Button>
      </div>
    );
  }

  return (
    <div className="p-4 lg:p-8 max-w-6xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button
          variant="outline"
          size="icon"
          onClick={() => navigate(createPageUrl("Dashboard"))}
        >
          <ArrowLeft className="w-4 h-4" />
        </Button>
        <div className="flex-1">
          <h1 className="text-2xl lg:text-3xl font-bold text-slate-800">
            {task.title}
          </h1>
          <p className="text-slate-600 mt-1">
            Created {task.created_date ? format(parseDate(task.created_date) || new Date(), 'PPP') : 'Unknown date'}
          </p>
        </div>
        <div className="flex items-center gap-2">
          {canModifyTask() && (
            <Button
              variant="outline"
              onClick={() => setShowEditDialog(true)}
              className="gap-2"
            >
              <Edit className="w-4 h-4" />
              Edit Task
            </Button>
          )}
          {canReassignTask() && (
            <Button
              variant="outline"
              onClick={() => setShowReassignDialog(true)}
              className="gap-2"
            >
              <UserCheck className="w-4 h-4" />
              Reassign
            </Button>
          )}
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Task Overview */}
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle>Task Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-4">
                <Badge className={getStatusColor(task.status)}>
                  {task.status.replace('_', ' ').toUpperCase()}
                </Badge>
                <Badge className={getPriorityColor(task.priority)}>
                  {task.priority.toUpperCase()} PRIORITY
                </Badge>
                {task.is_external_assignment && (
                  <Badge variant="outline" className="bg-amber-50 text-amber-700">
                    External Assignment
                  </Badge>
                )}
              </div>
              
              {task.description && (
                <div>
                  <h4 className="font-medium text-slate-800 mb-2">Description</h4>
                  <p className="text-slate-600">{task.description}</p>
                </div>
              )}

              {task.due_date && (
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-slate-500" />
                  <span className="text-sm text-slate-600">
                    Due: {format(parseDate(task.due_date) || new Date(), 'PPP')}
                  </span>
                </div>
              )}

              {task.tags && task.tags.length > 0 && (
                <div>
                  <h4 className="font-medium text-slate-800 mb-2">Tags</h4>
                  <div className="flex flex-wrap gap-2">
                    {task.tags.map((tag, index) => (
                      <Badge key={index} variant="secondary">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {task.checklist && task.checklist.length > 0 && (
                <div>
                  <h4 className="font-medium text-slate-800 mb-2">Checklist</h4>
                  <div className="space-y-2">
                    {task.checklist.map((item, index) => (
                      <div key={index} className="flex items-center gap-3">
                        {item.completed ? (
                          <CheckCircle2 className="w-5 h-5 text-green-500" />
                        ) : (
                          <div className="w-5 h-5 border-2 border-slate-300 rounded"></div>
                        )}
                        <span className={item.completed ? 'line-through text-slate-500' : ''}>
                          {item.item}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Activity History */}
          <TaskHistory activities={activities} />
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Assignment Info */}
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <UserIcon className="w-5 h-5" />
                Assignment
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-indigo-400 to-purple-500 rounded-full flex items-center justify-center">
                  <span className="text-white font-semibold">
                    {task.assigned_to_name?.charAt(0) || 'U'}
                  </span>
                </div>
                <div>
                  <p className="font-medium text-slate-800">
                    {task.assigned_to_name || 'Unassigned'}
                  </p>
                  {task.assigned_to_phone && (
                    <div className="flex items-center gap-1 text-sm text-slate-600">
                      <Phone className="w-3 h-3" />
                      {task.assigned_to_phone}
                    </div>
                  )}
                </div>
              </div>
              
              <Separator />
              
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-slate-600">Created by:</span>
                  <span className="font-medium">{currentUser?.full_name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600">Task Type:</span>
                  <span className="font-medium">{task.task_type?.replace('_', ' ')}</span>
                </div>
                {task.estimated_hours && (
                  <div className="flex justify-between">
                    <span className="text-slate-600">Estimated Hours:</span>
                    <span className="font-medium">{task.estimated_hours}h</span>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {showAcceptDecline && (
                <div className="flex gap-2">
                  <Button variant="outline" onClick={handleDecline}>Decline</Button>
                  <Button onClick={handleAccept}>Accept</Button>
                </div>
              )}
              {canModifyTask() && (
                <Button
                  variant="outline"
                  className="w-full justify-start gap-2"
                  onClick={() => setShowEditDialog(true)}
                >
                  <Edit className="w-4 h-4" />
                  Edit Task Details
                </Button>
              )}
              {canReassignTask() && (
                <Button
                  variant="outline"
                  className="w-full justify-start gap-2"
                  onClick={() => setShowReassignDialog(true)}
                >
                  <UserCheck className="w-4 h-4" />
                  Reassign Task
                </Button>
              )}
              <Button
                variant="outline"
                className="w-full justify-start gap-2"
                onClick={() => {/* Add comment functionality */}}
              >
                <MessageSquare className="w-4 h-4" />
                Add Comment
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Dialogs */}
      <EditTaskDialog
        open={showEditDialog}
        onOpenChange={setShowEditDialog}
        task={task}
        onSave={handleTaskUpdate}
      />
      
      <ReassignTaskDialog
        open={showReassignDialog}
        onOpenChange={setShowReassignDialog}
        task={task}
        users={users}
        onReassign={handleReassignment}
      />
    </div>
  );
}
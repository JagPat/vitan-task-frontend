
import React, { useState, useEffect } from "react";
import { Task } from "@/api/entities";
import { User } from "@/api/entities";
import { TaskTemplate } from "@/api/entities";
import { ActivityLog } from "@/api/entities";
import { UploadFile } from "@/api/integrations";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { sendWhatsappMessage } from "@/api/functions";
import { 
  ArrowLeft, 
  Plus, 
  X, 
  Upload,
  Clock,
  User as UserIcon,
  Tag,
  CheckSquare,
  Calendar,
  AlertTriangle
} from "lucide-react";

export default function CreateTask() {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [templates, setTemplates] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);

  const [taskData, setTaskData] = useState({
    title: "",
    description: "",
    due_date: "",
    priority: "medium",
    assigned_to: "",
    assigned_to_name: "",
    assigned_to_phone: "",
    task_type: "one_time",
    tags: [],
    checklist: [],
    attachments: [],
    recurring_pattern: "",
    estimated_hours: "",
    is_external_assignment: false // New field
  });

  const [newTag, setNewTag] = useState("");
  const [newChecklistItem, setNewChecklistItem] = useState("");

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [usersData, templatesData, userData] = await Promise.all([
        User.list("-created_date"),
        TaskTemplate.list("-usage_count"),
        User.me().catch(() => null)
      ]);
      
      setUsers(usersData);
      setTemplates(templatesData);
      setCurrentUser(userData);
    } catch (error) {
      console.error("Error loading data:", error);
    }
  };

  const handleInputChange = (field, value) => {
    setTaskData(prev => ({ ...prev, [field]: value }));
    
    // Auto-populate assignee details when user is selected
    if (field === 'assigned_to') {
      const selectedUser = users.find(u => u.id === value);
      if (selectedUser) {
        setTaskData(prev => ({
          ...prev,
          assigned_to_name: selectedUser.full_name,
          assigned_to_phone: selectedUser.phone_number || "",
          is_external_assignment: false
        }));
      }
    }

    // When switching to external assignment, clear internal user selection
    if (field === 'is_external_assignment' && value === true) {
      setTaskData(prev => ({
        ...prev,
        assigned_to: "",
        assigned_to_name: "",
        assigned_to_phone: ""
      }));
    }
  };

  const addTag = () => {
    if (newTag.trim() && !taskData.tags.includes(newTag.trim())) {
      setTaskData(prev => ({
        ...prev,
        tags: [...prev.tags, newTag.trim()]
      }));
      setNewTag("");
    }
  };

  const removeTag = (tagToRemove) => {
    setTaskData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };

  const addChecklistItem = () => {
    if (newChecklistItem.trim()) {
      setTaskData(prev => ({
        ...prev,
        checklist: [...prev.checklist, {
          item: newChecklistItem.trim(),
          completed: false,
          proof_url: ""
        }]
      }));
      setNewChecklistItem("");
    }
  };

  const removeChecklistItem = (index) => {
    setTaskData(prev => ({
      ...prev,
      checklist: prev.checklist.filter((_, i) => i !== index)
    }));
  };

  const handleFileUpload = async (event) => {
    const files = Array.from(event.target.files);
    setUploading(true);

    try {
      const uploadPromises = files.map(async (file) => {
        const result = await UploadFile({ file });
        return {
          url: result.file_url,
          name: file.name,
          type: file.type
        };
      });

      const uploadedFiles = await Promise.all(uploadPromises);
      setTaskData(prev => ({
        ...prev,
        attachments: [...prev.attachments, ...uploadedFiles]
      }));
    } catch (error) {
      console.error("Error uploading files:", error);
    } finally {
      setUploading(false);
    }
  };

  const removeAttachment = (index) => {
    setTaskData(prev => ({
      ...prev,
      attachments: prev.attachments.filter((_, i) => i !== index)
    }));
  };

  const applyTemplate = (template) => {
    setTaskData(prev => ({
      ...prev,
      title: template.title_template,
      description: template.description_template,
      priority: template.default_priority,
      tags: [...prev.tags, ...template.default_tags.filter(tag => !prev.tags.includes(tag))],
      checklist: template.checklist_template?.map(item => ({
        item,
        completed: false,
        proof_url: ""
      })) || [],
      estimated_hours: template.estimated_hours || ""
    }));

    // Increment template usage
    TaskTemplate.update(template.id, { usage_count: (template.usage_count || 0) + 1 });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // For external assignments, we don't need a user ID
      const taskToCreate = {
        ...taskData,
        status: "pending",
        assigned_to: taskData.is_external_assignment ? null : taskData.assigned_to
      };

      // Ensure estimated_hours is a number or null, not an empty string
      if (taskToCreate.estimated_hours !== null && taskToCreate.estimated_hours !== undefined && taskToCreate.estimated_hours !== "") {
        taskToCreate.estimated_hours = Number(taskToCreate.estimated_hours);
      } else {
        taskToCreate.estimated_hours = null;
      }

      const createdTask = await Task.create(taskToCreate);
      
      console.log('Created task response:', createdTask);

      // Send WhatsApp notification
      if (createdTask && createdTask.assigned_to_phone) {
        try {
          await sendWhatsappMessage({
            to: createdTask.assigned_to_phone,
            name: createdTask.assigned_to_name || "External Team Member",
            task_title: createdTask.title,
            due_date: createdTask.due_date ? new Date(createdTask.due_date).toLocaleDateString() : 'N/A',
            priority: createdTask.priority,
            is_external: createdTask.is_external_assignment,
            created_by_name: currentUser?.full_name, // Added this line
            attachments: createdTask.attachments || [] // Added this line
          });
          
          // Log successful notification
          await ActivityLog.create({
            task_id: createdTask.id,
            action: "created",
            notes: `Task "${taskData.title}" created and WhatsApp notification sent to ${taskData.assigned_to_name || 'External user'} (${taskData.assigned_to_phone})`,
            performed_by_name: currentUser?.full_name || "User",
            whatsapp_message_sent: true
          });
        } catch (whatsappError) {
          console.error("Failed to send WhatsApp notification:", whatsappError);
          
          // Log failed notification
          await ActivityLog.create({
            task_id: createdTask.id,
            action: "created",
            notes: `Task "${taskData.title}" created but WhatsApp notification failed: ${whatsappError.message}`,
            performed_by_name: currentUser?.full_name || "User",
            whatsapp_message_sent: false
          });
        }
      } else {
        // Log creation without WhatsApp (no phone number)
        await ActivityLog.create({
          task_id: createdTask.id,
          action: "created",
          notes: `Task "${taskData.title}" created (no phone number provided)`,
          performed_by_name: currentUser?.full_name || "User",
          whatsapp_message_sent: false
        });
      }

      // Handle internal team member assignment: send view link to internal user
      if (createdTask && !createdTask.is_external_assignment && createdTask.assigned_to) {
        const assignedUser = users.find(u => u.id === createdTask.assigned_to);
        if (assignedUser && assignedUser.phone_number) {
          try {
            await sendWhatsappMessage({
              to: assignedUser.phone_number,
              name: assignedUser.full_name,
              task_title: createdTask.title,
              due_date: createdTask.due_date ? new Date(createdTask.due_date).toLocaleDateString() : 'N/A',
              priority: createdTask.priority,
              is_external: false, // Explicitly false for internal
              created_by_name: currentUser?.full_name,
              attachments: createdTask.attachments || [],
              task_view_url: createPageUrl("ViewTask", { id: createdTask.id }) // Pass task view URL
            });

            await ActivityLog.create({
              task_id: createdTask.id,
              action: "notification_sent",
              notes: `WhatsApp notification with task view link sent to internal user ${assignedUser.full_name} (${assignedUser.phone_number})`,
              performed_by_name: currentUser?.full_name || "User"
            });
          } catch (whatsappError) {
            console.error("Failed to send internal WhatsApp notification:", whatsappError);
            await ActivityLog.create({
              task_id: createdTask.id,
              action: "notification_failed",
              notes: `WhatsApp notification to internal user failed: ${whatsappError.message}`,
              performed_by_name: currentUser?.full_name || "User"
            });
          }
        }
      }

      navigate(createPageUrl("Dashboard"));
    } catch (error) {
      console.error("Error creating task:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-white p-4 lg:p-8">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex items-center gap-4">
          <Button
            variant="outline"
            size="icon"
            onClick={() => navigate(createPageUrl("Dashboard"))}
            className="hover:bg-slate-100"
          >
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-slate-800">Create New Task</h1>
            <p className="text-slate-600">Assign and track work with your team</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Template Selection */}
          {templates.length > 0 && (
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="text-lg font-semibold text-slate-800">Quick Start with Template</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                  {templates.slice(0, 6).map((template) => (
                    <Button
                      key={template.id}
                      type="button"
                      variant="outline"
                      onClick={() => applyTemplate(template)}
                      className="h-auto p-4 flex flex-col items-start gap-2 hover:bg-slate-50"
                    >
                      <span className="font-medium">{template.name}</span>
                      <span className="text-xs text-slate-500 text-left">
                        Used {template.usage_count || 0} times
                      </span>
                    </Button>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Basic Information */}
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="text-lg font-semibold text-slate-800 flex items-center gap-2">
                <CheckSquare className="w-5 h-5" />
                Task Details
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="md:col-span-2">
                  <Label htmlFor="title">Task Title *</Label>
                  <Input
                    id="title"
                    value={taskData.title}
                    onChange={(e) => handleInputChange('title', e.target.value)}
                    placeholder="What needs to be done?"
                    className="mt-2"
                    required
                  />
                </div>
                
                <div className="md:col-span-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={taskData.description}
                    onChange={(e) => handleInputChange('description', e.target.value)}
                    placeholder="Provide additional details about the task..."
                    className="mt-2 min-h-24"
                  />
                </div>

                <div>
                  <Label htmlFor="due_date">Due Date</Label>
                  <Input
                    id="due_date"
                    type="date"
                    value={taskData.due_date}
                    onChange={(e) => handleInputChange('due_date', e.target.value)}
                    className="mt-2"
                  />
                </div>

                <div>
                  <Label htmlFor="estimated_hours">Estimated Hours</Label>
                  <Input
                    id="estimated_hours"
                    type="number"
                    min="0"
                    step="0.5"
                    value={taskData.estimated_hours}
                    onChange={(e) => handleInputChange('estimated_hours', e.target.value)}
                    placeholder="0"
                    className="mt-2"
                  />
                </div>

                <div>
                  <Label htmlFor="priority">Priority</Label>
                  <Select value={taskData.priority} onValueChange={(value) => handleInputChange('priority', value)}>
                    <SelectTrigger className="mt-2">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="low">Low Priority</SelectItem>
                      <SelectItem value="medium">Medium Priority</SelectItem>
                      <SelectItem value="high">High Priority</SelectItem>
                      <SelectItem value="urgent">Urgent</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="task_type">Task Type</Label>
                  <Select value={taskData.task_type} onValueChange={(value) => handleInputChange('task_type', value)}>
                    <SelectTrigger className="mt-2">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="one_time">One Time</SelectItem>
                      <SelectItem value="recurring">Recurring</SelectItem>
                      <SelectItem value="dependent">Dependent</SelectItem>
                      <SelectItem value="template">Template</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {taskData.task_type === "recurring" && (
                <div>
                  <Label htmlFor="recurring_pattern">Recurring Pattern</Label>
                  <Select value={taskData.recurring_pattern} onValueChange={(value) => handleInputChange('recurring_pattern', value)}>
                    <SelectTrigger className="mt-2">
                      <SelectValue placeholder="Select pattern" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="daily">Daily</SelectItem>
                      <SelectItem value="weekly">Weekly</SelectItem>
                      <SelectItem value="monthly">Monthly</SelectItem>
                      <SelectItem value="quarterly">Quarterly</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Assignment */}
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="text-lg font-semibold text-slate-800 flex items-center gap-2">
                <UserIcon className="w-5 h-5" />
                Assignment
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Assignment Type Toggle */}
              <div className="flex items-center space-x-4">
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="radio"
                    name="assignmentType"
                    checked={!taskData.is_external_assignment}
                    onChange={() => handleInputChange('is_external_assignment', false)}
                    className="text-indigo-600"
                  />
                  <span className="text-sm font-medium text-slate-700">Team Member</span>
                </label>
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="radio"
                    name="assignmentType"
                    checked={taskData.is_external_assignment}
                    onChange={() => handleInputChange('is_external_assignment', true)}
                    className="text-indigo-600"
                  />
                  <span className="text-sm font-medium text-slate-700">External Person (WhatsApp Only)</span>
                </label>
              </div>

              {/* Team Member Assignment */}
              {!taskData.is_external_assignment && (
                <div>
                  <Label htmlFor="assigned_to">Select Team Member *</Label>
                  <Select value={taskData.assigned_to} onValueChange={(value) => handleInputChange('assigned_to', value)} required={!taskData.is_external_assignment}>
                    <SelectTrigger className="mt-2">
                      <SelectValue placeholder="Select team member" />
                    </SelectTrigger>
                    <SelectContent>
                      {users.map((user) => (
                        <SelectItem key={user.id} value={user.id}>
                          <div className="flex items-center gap-2">
                            <span>{user.full_name}</span>
                            <Badge variant="outline" className="text-xs">
                              {user.role}
                            </Badge>
                            {user.is_external && (
                              <Badge variant="secondary" className="text-xs bg-blue-100 text-blue-700">
                                External
                              </Badge>
                            )}
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}

              {/* External Assignment */}
              {taskData.is_external_assignment && (
                <div className="space-y-4 p-4 bg-amber-50 rounded-lg border border-amber-200">
                  <div className="flex items-center gap-2 text-amber-800">
                    <AlertTriangle className="w-4 h-4" />
                    <span className="text-sm font-medium">External Assignment</span>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="external_name">Contact Name *</Label>
                      <Input
                        id="external_name"
                        value={taskData.assigned_to_name}
                        onChange={(e) => handleInputChange('assigned_to_name', e.target.value)}
                        placeholder="John Doe"
                        required={taskData.is_external_assignment}
                        className="mt-2"
                      />
                    </div>
                    <div>
                      <Label htmlFor="external_phone">WhatsApp Number *</Label>
                      <Input
                        id="external_phone"
                        value={taskData.assigned_to_phone}
                        onChange={(e) => handleInputChange('assigned_to_phone', e.target.value)}
                        placeholder="+1234567890"
                        required={taskData.is_external_assignment}
                        className="mt-2"
                      />
                    </div>
                  </div>
                  
                  <div className="text-xs text-amber-700 bg-amber-100 p-3 rounded">
                    <strong>Note:</strong> This person will receive WhatsApp notifications and can reply "DONE" to complete tasks, but won't have access to the web app.
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Tags */}
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="text-lg font-semibold text-slate-800 flex items-center gap-2">
                <Tag className="w-5 h-5" />
                Tags & Categories
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-2">
                <Input
                  value={newTag}
                  onChange={(e) => setNewTag(e.target.value)}
                  placeholder="Add a tag..."
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
                />
                <Button type="button" onClick={addTag} variant="outline">
                  <Plus className="w-4 h-4" />
                </Button>
              </div>
              
              {taskData.tags.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {taskData.tags.map((tag, index) => (
                    <Badge key={index} variant="secondary" className="flex items-center gap-1">
                      {tag}
                      <button
                        type="button"
                        onClick={() => removeTag(tag)}
                        className="ml-1 hover:bg-slate-200 rounded-full p-0.5"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </Badge>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Checklist */}
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="text-lg font-semibold text-slate-800">Task Checklist</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-2">
                <Input
                  value={newChecklistItem}
                  onChange={(e) => setNewChecklistItem(e.target.value)}
                  placeholder="Add checklist item..."
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addChecklistItem())}
                />
                <Button type="button" onClick={addChecklistItem} variant="outline">
                  <Plus className="w-4 h-4" />
                </Button>
              </div>
              
              {taskData.checklist.length > 0 && (
                <div className="space-y-2">
                  {taskData.checklist.map((item, index) => (
                    <div key={index} className="flex items-center gap-3 p-3 border rounded-lg">
                      <span className="flex-1">{item.item}</span>
                      <button
                        type="button"
                        onClick={() => removeChecklistItem(index)}
                        className="text-red-500 hover:bg-red-50 rounded-full p-1"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Attachments */}
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="text-lg font-semibold text-slate-800">Attachments</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <input
                  type="file"
                  multiple
                  onChange={handleFileUpload}
                  className="hidden"
                  id="file-upload"
                />
                <label htmlFor="file-upload">
                  <Button type="button" variant="outline" asChild className="cursor-pointer">
                    <span>
                      <Upload className="w-4 h-4 mr-2" />
                      {uploading ? 'Uploading...' : 'Upload Files'}
                    </span>
                  </Button>
                </label>
              </div>
              
              {taskData.attachments.length > 0 && (
                <div className="space-y-2">
                  {taskData.attachments.map((attachment, index) => (
                    <div key={index} className="flex items-center gap-3 p-3 border rounded-lg">
                      <span className="flex-1">{attachment.name}</span>
                      <button
                        type="button"
                        onClick={() => removeAttachment(index)}
                        className="text-red-500 hover:bg-red-50 rounded-full p-1"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Submit */}
          <div className="flex justify-end gap-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate(createPageUrl("Dashboard"))}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={loading || !taskData.title || (
                (!taskData.is_external_assignment && !taskData.assigned_to) || 
                (taskData.is_external_assignment && (!taskData.assigned_to_name || !taskData.assigned_to_phone))
              )}
              className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700"
            >
              {loading ? 'Creating...' : 'Create Task'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

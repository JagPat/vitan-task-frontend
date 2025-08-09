import React, { useEffect, useState } from 'react';
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
  MoreVertical,
  UserPlus,
  Plus,
  Edit,
  Trash2,
  ArchiveRestore
} from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerFooter, DrawerClose } from '@/components/ui/drawer';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { whatsTaskClient } from '@/api/whatsTaskClient';
import { ProjectMember, User } from '@/api/entities';
import CreateProjectTaskDialog from '@/components/projects/CreateProjectTaskDialog';
import { toast } from 'sonner';
import UnifiedTaskCard from '@/components/tasks/UnifiedTaskCard';

export default function ProjectCard({ project, onEdit, onDelete, onChanged, onSetFilters }) {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [members, setMembers] = useState([]);
  const [availableUsers, setAvailableUsers] = useState([]);
  const [showAddMembers, setShowAddMembers] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [showCreateTask, setShowCreateTask] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState('');
  const [selectedRole, setSelectedRole] = useState('member');
  const [editForm, setEditForm] = useState({ name: project.name, description: project.description || '', category: project.category || '', status: project.status || 'active', priority: project.priority || 'medium' });
  const [projectTasks, setProjectTasks] = useState([]);
  const [tasksLoading, setTasksLoading] = useState(false);
  const [users, setUsers] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
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
  const inProgressTasks = project.in_progress_tasks || 0;
  const pendingTasks = project.pending_tasks || 0;
  const overdueTasks = project.overdue_tasks || 0;
  const memberCount = project.member_count || 0;

  // load tasks for drawer
  const loadTasks = async () => {
    setTasksLoading(true);
    try {
      const res = await whatsTaskClient.request(`/api/projects/${project.id}/tasks`);
      setProjectTasks(res.data || []);
    } catch (e) {
      console.error('Failed to load project tasks', e);
    } finally {
      setTasksLoading(false);
    }
  };

  const loadUsers = async () => {
    try {
      const list = await User.getAll();
      setUsers(list || []);
    } catch {}
  };

  const loadMe = async () => {
    try {
      const me = await User.me();
      setCurrentUser(me);
    } catch {}
  };

  const loadMembers = async () => {
    try {
      const list = await ProjectMember.list(project.id);
      setMembers(list);
    } catch (e) {
      console.error('Failed to load members', e);
    }
  };

  const loadAvailable = async () => {
    try {
      const list = await ProjectMember.available(project.id);
      setAvailableUsers(list);
    } catch (e) {
      console.error('Failed to load available users', e);
    }
  };

  useEffect(() => {
    if (drawerOpen) {
      loadMembers();
      loadTasks();
      loadUsers();
      loadMe();
    }
  }, [drawerOpen]);

  const handleAddMember = async () => {
    if (!selectedUserId) return;
    try {
      await ProjectMember.add(project.id, parseInt(selectedUserId, 10), selectedRole);
      toast.success('Member added');
      setSelectedUserId('');
      setSelectedRole('member');
      setShowAddMembers(false);
      loadMembers();
    } catch (e) {
      toast.error(e.message || 'Failed to add member');
    }
  };

  const handleRemoveMember = async (userId) => {
    try {
      await ProjectMember.remove(project.id, userId);
      toast.success('Member removed');
      loadMembers();
    } catch (e) {
      toast.error('Failed to remove member');
    }
  };

  const handleSaveEdit = async () => {
    try {
      const res = await whatsTaskClient.updateProject(project.id, editForm);
      if (res.success) {
        toast.success('Project updated');
        setShowEditDialog(false);
      } else {
        toast.error(res.error || 'Update failed');
      }
    } catch (e) {
      toast.error('Failed to update project');
    }
  };

  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <button type="button" onClick={() => setDrawerOpen(true)} className="text-left w-full">
              <CardTitle className="text-lg font-semibold text-gray-900">
                {project.name}
              </CardTitle>
            </button>
            <p className="text-sm text-gray-600 mt-1">
              {project.description}
            </p>
            <div className="mt-2 flex items-center gap-2 flex-wrap">
              {project.category && (
                <Button size="sm" variant="secondary" className="h-6 text-xs" onClick={() => onSetFilters && onSetFilters({ category: project.category })}>
                  {project.category}
                </Button>
              )}
              <Button size="sm" variant="outline" className="h-6 text-xs" onClick={() => onSetFilters && onSetFilters({ status: project.status })}>
                {project.status}
              </Button>
            </div>
          </div>
          <div className="flex items-center gap-1">
            <Badge className={getStatusColor(project.status)}>
              {project.archived ? 'archived' : project.status}
            </Badge>
            <div className={`w-3 h-3 rounded-full ${getPriorityColor(project.priority)}`} />
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="h-8 w-8 p-0" aria-label="More actions">
                  <MoreVertical className="w-4 h-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => setDrawerOpen(true)}>View details</DropdownMenuItem>
                <DropdownMenuItem onClick={() => setShowEditDialog(true)}>Edit project</DropdownMenuItem>
                <DropdownMenuItem onClick={async () => {
                  try {
                    const desired = project.archived ? false : true;
                    const res = await whatsTaskClient.request(`/api/projects/${project.id}/archive`, { method: 'POST', body: JSON.stringify({ archived: desired }) });
                    if (res.success) {
                      toast.success(desired ? 'Project archived' : 'Project unarchived');
                      onChanged && onChanged();
                    } else {
                      toast.error(res.error || 'Archive toggle failed');
                    }
                  } catch (e) {
                    toast.error('Archive toggle failed');
                  }
                }}>
                  {project.archived ? 'Unarchive' : 'Archive'} project
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => onDelete?.(project)}>Delete project</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
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

        {/* Stats with status chips */}
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
        <div className="flex items-center gap-2 flex-wrap text-xs">
          <Badge className="bg-blue-50 text-blue-700 border border-blue-200">In progress: {inProgressTasks}</Badge>
          <Badge className="bg-amber-50 text-amber-700 border border-amber-200">Pending: {pendingTasks}</Badge>
          {overdueTasks > 0 && (
            <Badge className="bg-red-100 text-red-800 border border-red-200">Overdue: {overdueTasks}</Badge>
          )}
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

        {/* Bottom icon actions */}
        <div className="flex items-center gap-2 justify-end pt-2">
          <Button variant="outline" size="icon" title="View" onClick={() => setDrawerOpen(true)}>
            <AlertCircle className="w-4 h-4" />
          </Button>
          <Button variant="outline" size="icon" title={project.archived ? 'Unarchive' : 'Archive'} onClick={async () => {
            try {
              const desired = project.archived ? false : true;
              const res = await whatsTaskClient.request(`/api/projects/${project.id}/archive`, { method: 'POST', body: JSON.stringify({ archived: desired }) });
              if (res.success) {
                toast.success(desired ? 'Project archived' : 'Project unarchived');
                onChanged && onChanged();
              } else {
                toast.error(res.error || 'Archive toggle failed');
              }
            } catch (e) {
              toast.error('Archive toggle failed');
            }
          }}>
            <ArchiveRestore className="w-4 h-4" />
          </Button>
          <Button variant="outline" size="icon" title="Add member" onClick={async () => { await loadAvailable(); setShowAddMembers(true); }}>
            <UserPlus className="w-4 h-4" />
          </Button>
          <Button variant="outline" size="icon" title="Add task" onClick={() => setShowCreateTask(true)}>
            <Plus className="w-4 h-4" />
          </Button>
          <Button variant="outline" size="icon" title="Edit" onClick={() => setShowEditDialog(true)}>
            <Edit className="w-4 h-4" />
          </Button>
          <Button variant="destructive" size="icon" title="Delete" onClick={() => onDelete?.(project)}>
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      </CardContent>

      {/* Drawer: details + members */}
      <Drawer open={drawerOpen} onOpenChange={setDrawerOpen}>
        <DrawerContent>
          <DrawerHeader>
            <DrawerTitle className="flex items-center justify-between">
              <span className="truncate mr-3">{project.name}</span>
              <Badge className={getStatusColor(project.status)}>{project.status}</Badge>
            </DrawerTitle>
          </DrawerHeader>
          <div className="p-4 space-y-4">
            <Tabs defaultValue="overview">
              <TabsList className="grid grid-cols-3 w-full">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="members">Members</TabsTrigger>
                <TabsTrigger value="tasks">Tasks</TabsTrigger>
              </TabsList>
              <TabsContent value="overview" className="space-y-3">
                <p className="text-sm text-slate-600">{project.description}</p>
                <div className="grid grid-cols-2 gap-4 text-sm text-gray-600">
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
                <div className="flex items-center gap-2 flex-wrap text-xs">
                  <Badge className="bg-blue-50 text-blue-700 border border-blue-200">In progress: {inProgressTasks}</Badge>
                  <Badge className="bg-amber-50 text-amber-700 border border-amber-200">Pending: {pendingTasks}</Badge>
                  {overdueTasks > 0 && (
                    <Badge className="bg-red-100 text-red-800 border border-red-200">Overdue: {overdueTasks}</Badge>
                  )}
                </div>
                {project.created_by_name && (
                  <div className="text-xs text-slate-600">Owner: <span className="font-medium">{project.created_by_name}</span></div>
                )}
              </TabsContent>
              <TabsContent value="members" className="space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-medium">Members ({members.length})</h4>
                  <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm" onClick={async () => { await loadAvailable(); setShowAddMembers(true); }}>
                    <UserPlus className="w-4 h-4 mr-1" /> Add
                    </Button>
                    <Button variant="outline" size="sm" onClick={async () => {
                      try {
                        const me = await User.me();
                        if (!me?.id) { toast.error('Not signed in'); return; }
                        await ProjectMember.add(project.id, me.id, 'member');
                        toast.success('Added you as a member');
                        loadMembers();
                      } catch {
                        toast.error('Failed to add you');
                      }
                    }}>Add me</Button>
                  </div>
                </div>
                <div className="space-y-2">
                {members.map((m) => (
                  <div key={`${m.id}-${m.project_role}`} className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2">
                      <Users className="w-4 h-4 text-gray-500" />
                      <span>{m.full_name || m.email}</span>
                      <Select value={m.project_role} onValueChange={async (v) => {
                        try {
                          await ProjectMember.updateRole(project.id, m.id, v);
                          toast.success('Role updated');
                          loadMembers();
                        } catch {
                          toast.error('Failed to update role');
                        }
                      }}>
                        <SelectTrigger className="h-8 w-28">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="admin">Admin</SelectItem>
                          <SelectItem value="member">Member</SelectItem>
                          <SelectItem value="viewer">Viewer</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <Button variant="ghost" size="sm" className="text-red-600" onClick={() => handleRemoveMember(m.id)}>Remove</Button>
                  </div>
                ))}
                  {members.length === 0 && <p className="text-xs text-slate-500">No members yet.</p>}
                </div>
              </TabsContent>
              <TabsContent value="tasks" className="space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-medium">Tasks ({projectTasks.length})</h4>
                  <Button variant="outline" size="sm" onClick={() => setShowCreateTask(true)}>
                    <Plus className="w-4 h-4 mr-1" /> Create Task
                  </Button>
                </div>
                {tasksLoading ? (
                  <p className="text-xs text-slate-500">Loading tasks...</p>
                ) : (
                  <div className="space-y-2">
                    {projectTasks.map((t) => (
                      <UnifiedTaskCard
                        key={t.id}
                        task={t}
                        users={users}
                        currentUser={currentUser}
                        showProjectContext={false}
                        showActions={true}
                        compact={true}
                        onDelete={(taskId) => setProjectTasks(prev => prev.filter(x => x.id !== taskId))}
                        onStatusChange={(taskId, newStatus) => setProjectTasks(prev => prev.map(x => x.id === taskId ? { ...x, status: newStatus } : x))}
                        onPriorityChange={(taskId, newPriority) => setProjectTasks(prev => prev.map(x => x.id === taskId ? { ...x, priority: newPriority } : x))}
                        onAssignmentChange={async (taskId, userId) => {
                          try {
                            await whatsTaskClient.updateTask(taskId, { assigned_to: userId });
                            setProjectTasks(prev => prev.map(x => x.id === taskId ? { ...x, assigned_to: userId } : x));
                          } catch (e) {
                            toast.error('Failed to assign');
                          }
                        }}
                      />
                    ))}
                    {projectTasks.length === 0 && <p className="text-xs text-slate-500">No tasks yet.</p>}
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </div>
          <DrawerFooter>
            <DrawerClose asChild>
              <Button variant="outline">Close</Button>
            </DrawerClose>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>

      {/* Add Members Dialog */}
      <Dialog open={showAddMembers} onOpenChange={setShowAddMembers}>
        <DialogContent aria-describedby="add-members-desc">
          <DialogHeader>
            <DialogTitle>Add member to {project.name}</DialogTitle>
            <div id="add-members-desc" className="sr-only">Add a team member to this project</div>
          </DialogHeader>
          <div className="space-y-3">
            <div className="space-y-2">
              <Label>Users</Label>
              <div className="max-h-64 overflow-auto border rounded-md p-2 space-y-1">
                {availableUsers.map(u => (
                  <label key={u.id} className="flex items-center gap-2 text-sm">
                    <input
                      type="checkbox"
                      className="h-4 w-4"
                      checked={selectedUserId.split(',').includes(u.id.toString())}
                      onChange={(e) => {
                        const set = new Set(selectedUserId ? selectedUserId.split(',') : []);
                        if (e.target.checked) set.add(u.id.toString()); else set.delete(u.id.toString());
                        setSelectedUserId(Array.from(set).join(','));
                      }}
                    />
                    <span>{u.full_name || u.email}</span>
                  </label>
                ))}
                {availableUsers.length === 0 && <p className="text-xs text-slate-500">No available users.</p>}
              </div>
            </div>
            <div className="space-y-2">
              <Label>Role</Label>
              <Select value={selectedRole} onValueChange={setSelectedRole}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="member">Member</SelectItem>
                  <SelectItem value="admin">Admin</SelectItem>
                  <SelectItem value="viewer">Viewer</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setShowAddMembers(false)}>Cancel</Button>
              <Button onClick={async () => {
                const ids = (selectedUserId ? selectedUserId.split(',') : []).filter(Boolean);
                if (ids.length === 0) return;
                try {
                  await Promise.all(ids.map(id => ProjectMember.add(project.id, parseInt(id, 10), selectedRole)));
                  toast.success(`Added ${ids.length} member${ids.length > 1 ? 's' : ''}`);
                  setSelectedUserId('');
                  setShowAddMembers(false);
                  loadMembers();
                } catch (e) {
                  toast.error('Failed to add members');
                }
              }} disabled={!selectedUserId}>Add</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Edit Project Dialog */}
      <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
        <DialogContent aria-describedby="edit-project-desc">
          <DialogHeader>
            <DialogTitle>Edit project</DialogTitle>
            <div id="edit-project-desc" className="sr-only">Edit basic details for this project</div>
          </DialogHeader>
          <div className="space-y-3">
            <div className="space-y-2">
              <Label>Name</Label>
              <Input value={editForm.name} onChange={(e) => setEditForm(f => ({ ...f, name: e.target.value }))} />
            </div>
            <div className="space-y-2">
              <Label>Description</Label>
              <Textarea value={editForm.description} onChange={(e) => setEditForm(f => ({ ...f, description: e.target.value }))} />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Status</Label>
                <Select value={editForm.status} onValueChange={(v) => setEditForm(f => ({ ...f, status: v }))}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                    <SelectItem value="on_hold">On Hold</SelectItem>
                    <SelectItem value="cancelled">Cancelled</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Priority</Label>
                <Select value={editForm.priority} onValueChange={(v) => setEditForm(f => ({ ...f, priority: v }))}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">Low</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                    <SelectItem value="urgent">Urgent</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setShowEditDialog(false)}>Cancel</Button>
              <Button onClick={handleSaveEdit}>Save</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Create Task for Project */}
      <CreateProjectTaskDialog
        open={showCreateTask}
        onOpenChange={setShowCreateTask}
        onTaskCreated={async () => { toast.success('Task created'); await loadTasks(); }}
        projectId={project.id}
        projectName={project.name}
        teamMembers={members}
      />
    </Card>
  );
} 
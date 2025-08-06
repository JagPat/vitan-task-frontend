
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { 
  User, 
  Phone, 
  Mail, 
  Trash2, 
  AlertTriangle, 
  CheckCircle, 
  Clock,
  Users,
  Activity,
  FileText,
  MessageSquare,
  Edit,
  Eye,
  Calendar,
  Target,
  TrendingUp,
  Building,
  Briefcase
} from 'lucide-react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '../ui/alert-dialog';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '../ui/dialog';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Checkbox } from '../ui/checkbox';
import { toast } from 'sonner';
import { parseDate, formatDate } from '../../utils/dateUtils';

const TeamMemberCard = ({ user, onDelete, onUpdate }) => {
  const [isDeleting, setIsDeleting] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [showDetailsDialog, setShowDetailsDialog] = useState(false);
  const [deletionInfo, setDeletionInfo] = useState(null);
  const [forceDelete, setForceDelete] = useState(false);
  const [userStats, setUserStats] = useState(null);
  const [userProjects, setUserProjects] = useState([]);
  const [userTasks, setUserTasks] = useState([]);
  const [loadingStats, setLoadingStats] = useState(false);
  const [editForm, setEditForm] = useState({
    full_name: user?.full_name || '',
    email: user?.email || '',
    role: user?.role || 'member',
    department: user?.department || '',
    position: user?.position || '',
    phone_number: user?.phone_number || '',
    is_external: user?.is_external || false
  });

  // Load user stats and data
  useEffect(() => {
    if (user?.id) {
      loadUserData();
    }
  }, [user?.id]);

  // Update editForm when user data changes
  useEffect(() => {
    if (user) {
      setEditForm({
        full_name: user?.full_name || '',
        email: user?.email || '',
        role: user?.role || 'member',
        department: user?.department || '',
        position: user?.position || '',
        phone_number: user?.phone_number || '',
        is_external: user?.is_external || false
      });
    }
  }, [user]);

  const loadUserData = async () => {
    setLoadingStats(true);
    try {
      // Load user stats
      const statsResponse = await fetch(`https://vitan-task-production.up.railway.app/api/users/${user.id}/stats`, { credentials: 'include' });
      if (statsResponse.ok) {
        const statsData = await statsResponse.json();
        setUserStats(statsData.data);
      }

      // Load user projects
      const projectsResponse = await fetch(`https://vitan-task-production.up.railway.app/api/users/${user.id}/projects`, { credentials: 'include' });
      if (projectsResponse.ok) {
        const projectsData = await projectsResponse.json();
        setUserProjects(projectsData.data || []);
      }

      // Load user tasks
      const tasksResponse = await fetch(`https://vitan-task-production.up.railway.app/api/users/${user.id}/tasks`, { credentials: 'include' });
      if (tasksResponse.ok) {
        const tasksData = await tasksResponse.json();
        setUserTasks(tasksData.data || []);
      }
    } catch (error) {
      console.error('Error loading user data:', error);
    } finally {
      setLoadingStats(false);
    }
  };

  // Add null checking to prevent errors
  if (!user) {
    return (
      <Card className="hover:shadow-md transition-shadow">
        <CardContent className="p-4">
          <div className="flex items-center justify-center">
            <div className="text-gray-500">Loading user data...</div>
          </div>
        </CardContent>
      </Card>
    );
  }

  const handleDeleteClick = async () => {
    try {
      // Get deletion info first
      const response = await fetch(`https://vitan-task-production.up.railway.app/api/users/${user.id}/deletion-info`, { credentials: 'include' });
      const data = await response.json();
      
      if (data.success) {
        setDeletionInfo(data.data);
        setShowDeleteDialog(true);
      } else {
        toast({
          title: "Error",
          description: data.error || "Failed to get user deletion info",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to get user deletion info",
        variant: "destructive",
      });
    }
  };

const handleConfirmDelete = async () => {
  setIsDeleting(true);
  try {
    const response = await fetch(`https://vitan-task-production.up.railway.app/api/users/${user.id}`, {
      credentials: 'include',
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ forceDelete }),
    });

    const data = await response.json();

    if (data.success) {
      toast.success(data.message || "User deleted successfully");
      onDelete(user.id);
    } else {
      toast.error(data.error || "Failed to delete user");
    }
  } catch (error) {
    toast.error("Failed to delete user");
  } finally {
    setIsDeleting(false);
    setShowDeleteDialog(false);
  }
};

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`https://vitan-task-production.up.railway.app/api/users/${user.id}`, {
        credentials: 'include',
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(editForm),
      });

      const data = await response.json();

      if (data.success) {
        toast.success("User updated successfully");
        setShowEditDialog(false);
        if (onUpdate) {
          onUpdate(data.data);
        }
      } else {
        toast.error(data.error || "Failed to update user");
      }
    } catch (error) {
      toast.error("Failed to update user");
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'inactive': return 'bg-gray-100 text-gray-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'invited': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getRoleColor = (role) => {
    switch (role) {
      case 'admin': return 'bg-red-100 text-red-800';
      case 'member': return 'bg-blue-100 text-blue-800';
      case 'manager': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getTaskStatusColor = (status) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800';
      case 'in_progress': return 'bg-blue-100 text-blue-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'overdue': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };



  const pendingTasks = userTasks.filter(task => ['pending', 'in_progress'].includes(task.status));
  const completedTasks = userTasks.filter(task => ['completed', 'closed'].includes(task.status));

  return (
    <>
      <Card className="hover:shadow-md transition-shadow">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                <User className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <CardTitle className="text-lg font-semibold">{user?.full_name || 'Unknown User'}</CardTitle>
                <div className="flex items-center space-x-2 mt-1">
                  <Badge className={getRoleColor(user?.role || 'member')}>
                    {user?.role || 'member'}
                  </Badge>
                  <Badge className={getStatusColor(user?.status || 'active')}>
                    {(user?.status || 'active').replace('_', ' ')}
                  </Badge>
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowDetailsDialog(true)}
                title="View Details"
              >
                <Eye className="w-4 h-4" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  // Refresh editForm with current user data
                  setEditForm({
                    full_name: user?.full_name || '',
                    email: user?.email || '',
                    role: user?.role || 'member',
                    department: user?.department || '',
                    position: user?.position || '',
                    phone_number: user?.phone_number || '',
                    is_external: user?.is_external || false
                  });
                  setShowEditDialog(true);
                }}
                title="Edit User"
              >
                <Edit className="w-4 h-4" />
              </Button>
              <Button
                variant="destructive"
                size="sm"
                onClick={handleDeleteClick}
                disabled={isDeleting}
                title="Delete User"
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {/* Contact Information */}
            <div className="space-y-2">
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <Phone className="w-4 h-4" />
                <span>{user?.whatsapp_number || 'No phone'}</span>
              </div>
              {user?.email && (
                <div className="flex items-center space-x-2 text-sm text-gray-600">
                  <Mail className="w-4 h-4" />
                  <span>{user.email}</span>
                </div>
              )}
              {user?.department && (
                <div className="flex items-center space-x-2 text-sm text-gray-600">
                  <Building className="w-4 h-4" />
                  <span>{user.department}</span>
                </div>
              )}
              {user?.position && (
                <div className="flex items-center space-x-2 text-sm text-gray-600">
                  <Briefcase className="w-4 h-4" />
                  <span>{user.position}</span>
                </div>
              )}
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <Clock className="w-4 h-4" />
                <span>Joined: {user?.created_at ? (parseDate(user.created_at)?.toLocaleDateString() || 'Unknown') : 'Unknown'}</span>
              </div>
            </div>

            {/* Quick Stats */}
            {userStats && (
              <div className="grid grid-cols-2 gap-2 pt-2 border-t">
                <div className="text-center">
                  <div className="text-lg font-semibold text-blue-600">{pendingTasks.length}</div>
                  <div className="text-xs text-gray-500">Pending Tasks</div>
                </div>
                <div className="text-center">
                  <div className="text-lg font-semibold text-green-600">{userProjects.length}</div>
                  <div className="text-xs text-gray-500">Projects</div>
                </div>
              </div>
            )}

            {/* External Badge */}
            {user?.is_external && (
              <div className="flex items-center space-x-2 pt-2 border-t">
                <Badge variant="outline" className="bg-amber-50 text-amber-700">
                  External Collaborator
                </Badge>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Edit User Dialog */}
      <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
        <DialogContent className="sm:max-w-md" aria-describedby="edit-user-description">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Edit className="w-5 h-5" />
              Edit User
            </DialogTitle>
            <div id="edit-user-description" className="sr-only">
              Form to edit user details including name, email, role, department, position, phone number, and external collaborator status.
            </div>
          </DialogHeader>
          
          <form onSubmit={handleEditSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="full_name">Full Name *</Label>
                <Input
                  id="full_name"
                  value={editForm.full_name}
                  onChange={(e) => setEditForm(prev => ({ ...prev, full_name: e.target.value }))}
                  placeholder="John Doe"
                  required
                  className="mt-1"
                />
              </div>
              
              <div>
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={editForm.email}
                  onChange={(e) => setEditForm(prev => ({ ...prev, email: e.target.value }))}
                  placeholder="john@example.com"
                  className="mt-1"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="role">Role</Label>
                <Select value={editForm.role} onValueChange={(value) => setEditForm(prev => ({ ...prev, role: value }))}>
                  <SelectTrigger className="mt-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="member">Member</SelectItem>
                    <SelectItem value="admin">Admin</SelectItem>
                    <SelectItem value="manager">Manager</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label htmlFor="department">Department</Label>
                <Input
                  id="department"
                  value={editForm.department}
                  onChange={(e) => setEditForm(prev => ({ ...prev, department: e.target.value }))}
                  placeholder="Engineering"
                  className="mt-1"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="position">Position</Label>
                <Input
                  id="position"
                  value={editForm.position}
                  onChange={(e) => setEditForm(prev => ({ ...prev, position: e.target.value }))}
                  placeholder="Software Engineer"
                  className="mt-1"
                />
              </div>
              
              <div>
                <Label htmlFor="phone_number">Phone Number</Label>
                <Input
                  id="phone_number"
                  value={editForm.phone_number}
                  onChange={(e) => setEditForm(prev => ({ ...prev, phone_number: e.target.value }))}
                  placeholder="+1234567890"
                  className="mt-1"
                />
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="is_external"
                checked={editForm.is_external}
                onCheckedChange={(checked) => setEditForm(prev => ({ ...prev, is_external: checked }))}
              />
              <Label htmlFor="is_external">External Collaborator</Label>
            </div>
          </form>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowEditDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleEditSubmit}>
              Update User
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* User Details Dialog */}
      <Dialog open={showDetailsDialog} onOpenChange={setShowDetailsDialog}>
        <DialogContent className="sm:max-w-2xl max-h-[80vh] overflow-y-auto" aria-describedby="user-details-description">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <User className="w-5 h-5" />
              User Details - {user?.full_name}
            </DialogTitle>
            <div id="user-details-description" className="sr-only">
              Detailed view of user information including statistics, projects, recent tasks, and activity summary.
            </div>
          </DialogHeader>
          
          <div className="space-y-6">
            {/* User Stats */}
            {userStats && (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center p-3 bg-blue-50 rounded-lg">
                  <div className="text-2xl font-bold text-blue-600">{userStats.total_tasks || 0}</div>
                  <div className="text-sm text-blue-600">Total Tasks</div>
                </div>
                <div className="text-center p-3 bg-green-50 rounded-lg">
                  <div className="text-2xl font-bold text-green-600">{userStats.completed_tasks || 0}</div>
                  <div className="text-sm text-green-600">Completed</div>
                </div>
                <div className="text-center p-3 bg-yellow-50 rounded-lg">
                  <div className="text-2xl font-bold text-yellow-600">{userStats.pending_tasks || 0}</div>
                  <div className="text-sm text-yellow-600">Pending</div>
                </div>
                <div className="text-center p-3 bg-purple-50 rounded-lg">
                  <div className="text-2xl font-bold text-purple-600">{userStats.completion_rate || 0}%</div>
                  <div className="text-sm text-purple-600">Completion Rate</div>
                </div>
              </div>
            )}

            {/* User Projects */}
            {userProjects.length > 0 && (
              <div>
                <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                  <Target className="w-5 h-5" />
                  Projects ({userProjects.length})
                </h3>
                <div className="space-y-2">
                  {userProjects.map((project) => (
                    <div key={project.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div>
                        <div className="font-medium">{project.name}</div>
                        <div className="text-sm text-gray-600">{project.category}</div>
                      </div>
                      <Badge className={getRoleColor(project.role)}>
                        {project.role}
                      </Badge>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* User Tasks */}
            {userTasks.length > 0 && (
              <div>
                <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                  <FileText className="w-5 h-5" />
                  Recent Tasks ({userTasks.length})
                </h3>
                <div className="space-y-2">
                  {userTasks.slice(0, 5).map((task) => (
                    <div key={task.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex-1">
                        <div className="font-medium">{task.title}</div>
                        <div className="text-sm text-gray-600">{task.project_name}</div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Badge className={getTaskStatusColor(task.status)}>
                          {task.status.replace('_', ' ')}
                        </Badge>
                        {task.due_date && (
                          <div className="text-xs text-gray-500">
                            <Calendar className="w-3 h-3 inline mr-1" />
                            {parseDate(task.due_date)?.toLocaleDateString() || 'Invalid date'}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                  {userTasks.length > 5 && (
                    <div className="text-center text-sm text-gray-500">
                      +{userTasks.length - 5} more tasks
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Activity Summary */}
            {userStats && (
              <div>
                <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                  <Activity className="w-5 h-5" />
                  Activity Summary
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-3 bg-blue-50 rounded-lg">
                    <div className="text-lg font-semibold text-blue-600">{userStats.tasks_created || 0}</div>
                    <div className="text-sm text-blue-600">Tasks Created</div>
                  </div>
                  <div className="p-3 bg-green-50 rounded-lg">
                    <div className="text-lg font-semibold text-green-600">{userStats.status_updates || 0}</div>
                    <div className="text-sm text-green-600">Status Updates</div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent className="max-w-md">
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center space-x-2">
              <AlertTriangle className="w-5 h-5 text-red-500" />
              <span>Delete User</span>
            </AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete <strong>{user?.full_name || 'Unknown User'}</strong>?
            </AlertDialogDescription>
          </AlertDialogHeader>

          {deletionInfo && (
            <div className="space-y-3">
              {deletionInfo.canDeleteSafely ? (
                <div className="flex items-center space-x-2 p-3 bg-green-50 rounded-lg">
                  <CheckCircle className="w-5 h-5 text-green-500" />
                  <span className="text-green-700">This user can be safely deleted</span>
                </div>
              ) : (
                <div className="space-y-3">
                  <div className="flex items-center space-x-2 p-3 bg-yellow-50 rounded-lg">
                    <AlertTriangle className="w-5 h-5 text-yellow-500" />
                    <span className="text-yellow-700">This user has related data</span>
                  </div>
                  
                  <div className="space-y-2">
                    {deletionInfo.relatedData.tasks > 0 && (
                      <div className="flex items-center justify-between p-2 bg-red-50 rounded">
                        <div className="flex items-center space-x-2">
                          <FileText className="w-4 h-4 text-red-500" />
                          <span className="text-sm">Active Tasks</span>
                        </div>
                        <Badge variant="destructive">{deletionInfo.relatedData.tasks}</Badge>
                      </div>
                    )}
                    
                    {deletionInfo.relatedData.activityLogs > 0 && (
                      <div className="flex items-center justify-between p-2 bg-orange-50 rounded">
                        <div className="flex items-center space-x-2">
                          <Activity className="w-4 h-4 text-orange-500" />
                          <span className="text-sm">Activity Logs</span>
                        </div>
                        <Badge variant="secondary">{deletionInfo.relatedData.activityLogs}</Badge>
                      </div>
                    )}
                    
                    {deletionInfo.relatedData.projectMembers > 0 && (
                      <div className="flex items-center justify-between p-2 bg-blue-50 rounded">
                        <div className="flex items-center space-x-2">
                          <Users className="w-4 h-4 text-blue-500" />
                          <span className="text-sm">Project Memberships</span>
                        </div>
                        <Badge variant="secondary">{deletionInfo.relatedData.projectMembers}</Badge>
                      </div>
                    )}
                    
                    {deletionInfo.relatedData.projectCommunications > 0 && (
                      <div className="flex items-center justify-between p-2 bg-purple-50 rounded">
                        <div className="flex items-center space-x-2">
                          <MessageSquare className="w-4 h-4 text-purple-500" />
                          <span className="text-sm">Project Communications</span>
                        </div>
                        <Badge variant="secondary">{deletionInfo.relatedData.projectCommunications}</Badge>
                      </div>
                    )}
                  </div>

                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="forceDelete"
                      checked={forceDelete}
                      onCheckedChange={setForceDelete}
                    />
                    <Label htmlFor="forceDelete" className="text-sm text-gray-700">
                      Delete user and all related data
                    </Label>
                  </div>
                </div>
              )}
            </div>
          )}

          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleConfirmDelete}
              disabled={isDeleting}
              className="bg-red-500 hover:bg-red-600"
            >
              {isDeleting ? 'Deleting...' : 'Delete User'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default TeamMemberCard;

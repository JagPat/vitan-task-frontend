import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { 
  Users, 
  UserPlus, 
  UserMinus, 
  Shield, 
  User, 
  Eye,
  Mail,
  Phone,
  MapPin,
  Calendar,
  MoreVertical,
  Settings,
  Crown
} from "lucide-react";
import { toast } from "sonner";

export default function ProjectTeamManager({ projectId, projectName, onTeamUpdate }) {
  const [members, setMembers] = useState([]);
  const [availableUsers, setAvailableUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [showRemoveDialog, setShowRemoveDialog] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [selectedRole, setSelectedRole] = useState('member');
  const [memberToRemove, setMemberToRemove] = useState(null);

  useEffect(() => {
    if (projectId) {
      loadProjectMembers();
      loadAvailableUsers();
    }
  }, [projectId]);

  const loadProjectMembers = async () => {
    try {
      const response = await fetch(`https://vitan-task-production.up.railway.app/api/project-members/${projectId}/members`, { credentials: 'include' });
      const result = await response.json();
      
      if (result.success) {
        setMembers(result.data);
      } else {
        toast.error('Failed to load project members');
      }
    } catch (error) {
      console.error('Error loading project members:', error);
      toast.error('Failed to load project members');
    } finally {
      setLoading(false);
    }
  };

  const loadAvailableUsers = async () => {
    try {
      const response = await fetch(`https://vitan-task-production.up.railway.app/api/project-members/${projectId}/members/available`, { credentials: 'include' });
      const result = await response.json();
      
      if (result.success) {
        setAvailableUsers(result.data);
      }
    } catch (error) {
      console.error('Error loading available users:', error);
    }
  };

  const addMemberToProject = async () => {
    if (!selectedUser || !selectedRole) {
      toast.error('Please select a user and role');
      return;
    }

    try {
      const response = await fetch(`https://vitan-task-production.up.railway.app/api/project-members/${projectId}/members`, {
        credentials: 'include',
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          user_id: selectedUser.id,
          role: selectedRole
        }),
      });

      const result = await response.json();
      
      if (!response.ok) {
        toast.error(result.error || 'Failed to add member');
        return;
      }
      
      if (result.success) {
        toast.success(`Added ${selectedUser.full_name} to project`);
        setShowAddDialog(false);
        setSelectedUser(null);
        setSelectedRole('member');
        loadProjectMembers();
        loadAvailableUsers();
        if (onTeamUpdate) onTeamUpdate();
      } else {
        toast.error(result.error || 'Failed to add member');
      }
    } catch (error) {
      console.error('Error adding member:', error);
      toast.error('Failed to add member to project');
    }
  };

  const removeMemberFromProject = async () => {
    if (!memberToRemove) return;

    try {
      const response = await fetch(`https://vitan-task-production.up.railway.app/api/project-members/${projectId}/members/${memberToRemove.id}`, {
        credentials: 'include',
        method: 'DELETE',
      });

      const result = await response.json();
      
      if (result.success) {
        toast.success(`Removed ${memberToRemove.full_name} from project`);
        setShowRemoveDialog(false);
        setMemberToRemove(null);
        loadProjectMembers();
        loadAvailableUsers();
        if (onTeamUpdate) onTeamUpdate();
      } else {
        toast.error(result.error || 'Failed to remove member');
      }
    } catch (error) {
      console.error('Error removing member:', error);
      toast.error('Failed to remove member from project');
    }
  };

  const updateMemberRole = async (userId, newRole) => {
    try {
      const response = await fetch(`https://vitan-task-production.up.railway.app/api/project-members/${projectId}/members/${userId}/role`, {
        credentials: 'include',
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ role: newRole }),
      });

      const result = await response.json();
      
      if (result.success) {
        toast.success('Member role updated successfully');
        loadProjectMembers();
        if (onTeamUpdate) onTeamUpdate();
      } else {
        toast.error(result.error || 'Failed to update role');
      }
    } catch (error) {
      console.error('Error updating role:', error);
      toast.error('Failed to update member role');
    }
  };

  const getRoleIcon = (role) => {
    switch (role) {
      case 'admin':
        return <Crown className="w-4 h-4 text-yellow-500" />;
      case 'member':
        return <User className="w-4 h-4 text-blue-500" />;
      case 'viewer':
        return <Eye className="w-4 h-4 text-gray-500" />;
      default:
        return <User className="w-4 h-4" />;
    }
  };

  const getRoleBadge = (role) => {
    const variants = {
      admin: 'bg-yellow-100 text-yellow-800',
      member: 'bg-blue-100 text-blue-800',
      viewer: 'bg-gray-100 text-gray-800'
    };
    
    return (
      <Badge className={variants[role] || 'bg-gray-100 text-gray-800'}>
        {role.charAt(0).toUpperCase() + role.slice(1)}
      </Badge>
    );
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="w-5 h-5" />
            Project Team
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 mx-auto"></div>
            <p className="mt-2 text-sm text-gray-500">Loading team members...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Users className="w-5 h-5" />
            Project Team ({members.length} members)
          </CardTitle>
          <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
            <DialogTrigger asChild>
              <Button size="sm" className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700">
                <UserPlus className="w-4 h-4 mr-2" />
                Add Member
              </Button>
            </DialogTrigger>
            <DialogContent aria-describedby="add-member-description">
              <DialogHeader>
                <DialogTitle>Add Team Member</DialogTitle>
                <DialogDescription>
                  Add a new member to the project team.
                </DialogDescription>
                <div id="add-member-description" className="sr-only">
                  Form to add a new team member to the project by selecting a user and assigning a role.
                </div>
              </DialogHeader>
              
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium">Select User</label>
                  <Select value={selectedUser?.id?.toString()} onValueChange={(value) => {
                    const user = availableUsers.find(u => u.id.toString() === value);
                    setSelectedUser(user);
                  }}>
                    <SelectTrigger>
                      <SelectValue placeholder="Choose a user..." />
                    </SelectTrigger>
                    <SelectContent>
                      {availableUsers.map((user) => (
                        <SelectItem key={user.id} value={user.id.toString()}>
                          <div className="flex items-center gap-2">
                            <Avatar className="w-6 h-6">
                              <AvatarFallback className="text-xs">
                                {user.full_name.split(' ').map(n => n[0]).join('')}
                              </AvatarFallback>
                            </Avatar>
                            <span>{user.full_name}</span>
                            {user.department && (
                              <Badge variant="outline" className="text-xs">
                                {user.department}
                              </Badge>
                            )}
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="text-sm font-medium">Role</label>
                  <Select value={selectedRole} onValueChange={setSelectedRole}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="admin">
                        <div className="flex items-center gap-2">
                          <Crown className="w-4 h-4 text-yellow-500" />
                          Admin - Full access
                        </div>
                      </SelectItem>
                      <SelectItem value="member">
                        <div className="flex items-center gap-2">
                          <User className="w-4 h-4 text-blue-500" />
                          Member - Can edit tasks
                        </div>
                      </SelectItem>
                      <SelectItem value="viewer">
                        <div className="flex items-center gap-2">
                          <Eye className="w-4 h-4 text-gray-500" />
                          Viewer - Read only
                        </div>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <DialogFooter>
                <Button variant="outline" onClick={() => setShowAddDialog(false)}>
                  Cancel
                </Button>
                <Button onClick={addMemberToProject} disabled={!selectedUser}>
                  Add Member
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>
      
      <CardContent>
        {members.length === 0 ? (
          <div className="text-center py-8">
            <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-700 mb-2">No team members yet</h3>
            <p className="text-gray-500 mb-4">
              Add team members to start collaborating on this project.
            </p>
            <Button 
              onClick={() => setShowAddDialog(true)}
              className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700"
            >
              <UserPlus className="w-4 h-4 mr-2" />
              Add First Member
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            {members.map((member) => (
              <div key={member.member_id} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center gap-3">
                  <Avatar>
                    <AvatarFallback>
                      {member.full_name.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <h4 className="font-medium">{member.full_name}</h4>
                      {getRoleIcon(member.project_role)}
                      {getRoleBadge(member.project_role)}
                      {member.is_external && (
                        <Badge variant="outline" className="text-xs">
                          External
                        </Badge>
                      )}
                    </div>
                    
                    <div className="flex items-center gap-4 text-sm text-gray-500 mt-1">
                      {member.email && (
                        <div className="flex items-center gap-1">
                          <Mail className="w-3 h-3" />
                          {member.email}
                        </div>
                      )}
                      {member.phone_number && (
                        <div className="flex items-center gap-1">
                          <Phone className="w-3 h-3" />
                          {member.phone_number}
                        </div>
                      )}
                      {member.department && (
                        <div className="flex items-center gap-1">
                          <MapPin className="w-3 h-3" />
                          {member.department}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  <Select 
                    value={member.project_role} 
                    onValueChange={(newRole) => updateMemberRole(member.id, newRole)}
                  >
                    <SelectTrigger className="w-32">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="admin">Admin</SelectItem>
                      <SelectItem value="member">Member</SelectItem>
                      <SelectItem value="viewer">Viewer</SelectItem>
                    </SelectContent>
                  </Select>
                  
                  <Dialog open={showRemoveDialog && memberToRemove?.id === member.id} onOpenChange={setShowRemoveDialog}>
                    <DialogTrigger asChild>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => setMemberToRemove(member)}
                      >
                        <UserMinus className="w-4 h-4" />
                      </Button>
                    </DialogTrigger>
                    <DialogContent aria-describedby="remove-member-description">
                      <DialogHeader>
                        <DialogTitle>Remove Team Member</DialogTitle>
                        <DialogDescription>
                          Are you sure you want to remove {member.full_name} from this project? 
                          This action cannot be undone.
                        </DialogDescription>
                        <div id="remove-member-description" className="sr-only">
                          Confirmation dialog to remove a team member from the project. This action is irreversible.
                        </div>
                      </DialogHeader>
                      <DialogFooter>
                        <Button variant="outline" onClick={() => setShowRemoveDialog(false)}>
                          Cancel
                        </Button>
                        <Button variant="destructive" onClick={removeMemberFromProject}>
                          Remove Member
                        </Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
} 
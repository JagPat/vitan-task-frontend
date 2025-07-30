
import React, { useState, useEffect } from "react";
import { User } from "@/api/entities";
import { Task } from "@/api/entities";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Users, 
  Search, 
  UserPlus, 
  Mail, 
  Phone,
  MapPin,
  Calendar,
  TrendingUp,
  CheckCircle2,
  Clock,
  AlertTriangle,
  Star,
  Shield
} from "lucide-react";

import TeamStats from "../components/team/TeamStats";
import TeamMemberCard from "../components/team/TeamMemberCard";
import InviteUserDialog from "../components/team/InviteUserDialog";
import EditUserDialog from "../components/team/EditUserDialog";
import ContactManager from "../components/ContactManager";
import { toast } from "sonner";

export default function Team() {
  const [users, setUsers] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedRole, setSelectedRole] = useState("all");
  const [showInviteDialog, setShowInviteDialog] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [showEditDialog, setShowEditDialog] = useState(false);

  useEffect(() => {
    loadTeamData();
  }, []);

  const loadTeamData = async () => {
    setLoading(true);
    try {
      console.log('Loading team data...');
      
      const [usersData, tasksData, userData] = await Promise.all([
        User.list("-created_date"),
        Task.list("-created_date"),
        User.me().catch(() => null)
      ]);
      
      console.log('Users data:', usersData);
      console.log('Tasks data:', tasksData);
      console.log('Current user data:', userData);
      
      setUsers(usersData);
      setTasks(tasksData);
      setCurrentUser(userData);
    } catch (error) {
      console.error("Error loading team data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleManageUser = (user) => {
    setEditingUser(user);
    setShowEditDialog(true);
  };

  const handleDeleteUser = async (user) => {
    if (!user) {
      toast.error('Invalid user data');
      return;
    }

    if (!confirm(`Are you sure you want to remove ${user?.full_name || 'Unknown User'} from the team? This action cannot be undone.`)) {
      return;
    }

    try {
      const response = await fetch(`https://vitan-task-production.up.railway.app/api/users/${user.id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        toast.success(`${user?.full_name || 'User'} has been removed from the team`);
        loadTeamData();
      } else {
        const error = await response.json();
        toast.error(error.error || 'Failed to remove team member');
      }
    } catch (error) {
      console.error('Error deleting user:', error);
      toast.error('Failed to remove team member');
    }
  };

  const getTeamMembersWithStats = () => {
    return users.filter(user => user).map(user => {
      const userTasks = tasks.filter(t => t.assigned_to === user.id);
      const completedTasks = userTasks.filter(t => ['completed', 'closed'].includes(t.status));
      const overdueTasks = userTasks.filter(t => {
        if (!t.due_date) return false;
        return new Date(t.due_date) < new Date() && !['completed', 'closed'].includes(t.status);
      });
      
      return {
        ...user,
        totalTasks: userTasks.length,
        completedTasks: completedTasks.length,
        overdueTasks: overdueTasks.length,
        completionRate: userTasks.length > 0 ? (completedTasks.length / userTasks.length) * 100 : 0,
        recentTasks: userTasks.slice(0, 3)
      };
    });
  };

  const filteredUsers = getTeamMembersWithStats().filter(user => {
    if (!user) return false;
    
    const searchMatch = user?.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                       user?.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                       user?.department?.toLowerCase().includes(searchTerm.toLowerCase());
    const roleMatch = selectedRole === "all" || user?.role === selectedRole;
    return searchMatch && roleMatch;
  });

  const roleStats = {
    total: users.length,
    admin: users.filter(u => u.role === 'admin').length,
    user: users.filter(u => u.role === 'user').length,
    external: users.filter(u => u.is_external).length
  };

  if (loading) {
    return (
      <div className="p-4 lg:p-8 max-w-7xl mx-auto">
        <div className="animate-pulse space-y-6">
          <div className="h-10 bg-slate-200 rounded w-1/3"></div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-32 bg-slate-200 rounded-2xl"></div>
            ))}
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-64 bg-slate-200 rounded-2xl"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 lg:p-8 max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl lg:text-4xl font-bold text-slate-800 flex items-center gap-3">
            <Users className="w-8 h-8" />
            Team Management
          </h1>
          <p className="text-slate-600 mt-1">
            Manage your team members and track their performance
          </p>
        </div>
        <Button 
          onClick={() => setShowInviteDialog(true)}
          className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 shadow-md"
        >
          <UserPlus className="w-4 h-4 mr-2" />
          Invite Member
        </Button>
      </div>

      {/* Main Tabs */}
      <Tabs defaultValue="members" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="members">Team Members</TabsTrigger>
          <TabsTrigger value="contacts">Contact Management</TabsTrigger>
        </TabsList>

        <TabsContent value="members" className="space-y-8">
          {/* Team Stats */}
          <TeamStats stats={roleStats} tasks={tasks} />

          {/* Search and Filters */}
          <Card className="border-0 shadow-lg">
            <CardContent className="p-6">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <Input
                    placeholder="Search team members..."
                    className="pl-10"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                <Tabs value={selectedRole} onValueChange={setSelectedRole} className="w-full md:w-auto">
                  <TabsList className="grid w-full grid-cols-4 md:w-auto">
                    <TabsTrigger value="all">All</TabsTrigger>
                    <TabsTrigger value="admin">Admins</TabsTrigger>
                    <TabsTrigger value="user">Users</TabsTrigger>
                    <TabsTrigger value="external">External</TabsTrigger>
                  </TabsList>
                </Tabs>
              </div>
            </CardContent>
          </Card>

          {/* Team Members Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredUsers.map((member) => (
              <TeamMemberCard 
                key={member.id} 
                user={member} 
                onDelete={handleDeleteUser}
              />
            ))}
          </div>

          {filteredUsers.length === 0 && (
            <div className="text-center py-16">
              <Users className="w-16 h-16 text-slate-400 mx-auto mb-4" />
              <h3 className="text-xl font-medium text-slate-700 mb-2">No team members found</h3>
              <p className="text-slate-500">
                {searchTerm ? "Try adjusting your search criteria" : "Invite team members to get started"}
              </p>
            </div>
          )}
        </TabsContent>

        <TabsContent value="contacts">
          <ContactManager />
        </TabsContent>
      </Tabs>

      {/* Invite Dialog */}
      <InviteUserDialog 
        open={showInviteDialog} 
        onOpenChange={setShowInviteDialog}
        onInviteSuccess={loadTeamData}
      />

      {/* Edit Dialog */}
      {editingUser && (
        <EditUserDialog
          open={showEditDialog}
          onOpenChange={setShowEditDialog}
          user={editingUser}
          onUpdateSuccess={() => {
            loadTeamData();
            setShowEditDialog(false);
          }}
        />
      )}
    </div>
  );
}

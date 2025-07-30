
import React, { useState } from 'react';
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
  FileText
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
import { toast } from '../ui/use-toast';

const TeamMemberCard = ({ user, onDelete, onUpdate }) => {
  const [isDeleting, setIsDeleting] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [deletionInfo, setDeletionInfo] = useState(null);
  const [forceDelete, setForceDelete] = useState(false);

  const handleDeleteClick = async () => {
    try {
      // Get deletion info first
      const response = await fetch(`https://vitan-task-production.up.railway.app/api/users/${user.id}/deletion-info`);
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
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ forceDelete }),
      });

      const data = await response.json();

      if (data.success) {
        toast({
          title: "Success",
          description: data.message || "User deleted successfully",
        });
        onDelete(user.id);
      } else {
        toast({
          title: "Error",
          description: data.error || "Failed to delete user",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete user",
        variant: "destructive",
      });
    } finally {
      setIsDeleting(false);
      setShowDeleteDialog(false);
      setForceDelete(false);
      setDeletionInfo(null);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'pending_invitation':
        return 'bg-yellow-100 text-yellow-800';
      case 'inactive':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getRoleColor = (role) => {
    switch (role) {
      case 'admin':
        return 'bg-purple-100 text-purple-800';
      case 'manager':
        return 'bg-blue-100 text-blue-800';
      case 'member':
        return 'bg-green-100 text-green-800';
      case 'vendor':
        return 'bg-orange-100 text-orange-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

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
                <CardTitle className="text-lg font-semibold">{user.full_name}</CardTitle>
                <div className="flex items-center space-x-2 mt-1">
                  <Badge className={getRoleColor(user.role)}>
                    {user.role}
                  </Badge>
                  <Badge className={getStatusColor(user.status)}>
                    {user.status.replace('_', ' ')}
                  </Badge>
                </div>
              </div>
            </div>
            <Button
              variant="destructive"
              size="sm"
              onClick={handleDeleteClick}
              disabled={isDeleting}
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="flex items-center space-x-2 text-sm text-gray-600">
              <Phone className="w-4 h-4" />
              <span>{user.whatsapp_number}</span>
            </div>
            {user.email && (
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <Mail className="w-4 h-4" />
                <span>{user.email}</span>
              </div>
            )}
            <div className="flex items-center space-x-2 text-sm text-gray-600">
              <Clock className="w-4 h-4" />
              <span>Joined: {new Date(user.created_at).toLocaleDateString()}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent className="max-w-md">
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center space-x-2">
              <AlertTriangle className="w-5 h-5 text-red-500" />
              <span>Delete User</span>
            </AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete <strong>{user.full_name}</strong>?
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
                  </div>

                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="forceDelete"
                      checked={forceDelete}
                      onChange={(e) => setForceDelete(e.target.checked)}
                      className="rounded"
                    />
                    <label htmlFor="forceDelete" className="text-sm text-gray-700">
                      Delete user and all related data
                    </label>
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

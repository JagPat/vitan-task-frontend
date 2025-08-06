import React, { useState, useEffect } from "react";
import { User } from "@/api/entities";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { UserCog, AlertCircle } from "lucide-react";

export default function EditUserDialog({ open, onOpenChange, user, onUpdateSuccess }) {
  const [formData, setFormData] = useState({
    full_name: "",
    phone_number: "",
    email: "",
    department: "",
    position: "",
    role: "user",
    is_external: false,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (user) {
      setFormData({
        full_name: user.full_name || "",
        phone_number: user.phone_number || "",
        email: user.email || "",
        department: user.department || "",
        position: user.position || "",
        role: user.role || "user",
        is_external: user.is_external || false,
      });
    } else {
      // Reset form when no user is selected
      setFormData({
        full_name: "",
        phone_number: "",
        email: "",
        department: "",
        position: "",
        role: "user",
        is_external: false,
      });
    }
  }, [user]);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setError(""); // Clear error when user types
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) return;

    setLoading(true);
    setError("");

    try {
      await User.update(user.id, formData);
      onUpdateSuccess();
      onOpenChange(false);
    } catch (err) {
      setError("Failed to update user. Please try again.");
      console.error("Update user error:", err);
    } finally {
      setLoading(false);
    }
  };

  if (!user) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md" aria-describedby="edit-user-description">
        <DialogHeader>
                      <DialogTitle className="flex items-center gap-2">
              <UserCog className="w-5 h-5" />
              Edit Team Member
            </DialogTitle>
            <div id="edit-user-description" className="sr-only">
              Dialog for editing team member information including name, email, phone, and role
            </div>
          <DialogDescription>
            Update details for {user.full_name}.
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4 pt-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="full_name">Full Name *</Label>
              <Input
                id="full_name"
                value={formData.full_name}
                onChange={(e) => handleInputChange('full_name', e.target.value)}
                required
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="phone_number">Phone Number</Label>
              <Input
                id="phone_number"
                value={formData.phone_number}
                onChange={(e) => handleInputChange('phone_number', e.target.value)}
                placeholder="+1234567890"
                className="mt-1"
              />
            </div>
          </div>
          
          <div>
            <Label htmlFor="email">Email Address</Label>
            <Input
              id="email"
              type="email"
              value={formData.email || ""}
              onChange={(e) => handleInputChange('email', e.target.value)}
              className="mt-1"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="department">Department</Label>
              <Input
                id="department"
                value={formData.department}
                onChange={(e) => handleInputChange('department', e.target.value)}
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="position">Position</Label>
              <Input
                id="position"
                value={formData.position}
                onChange={(e) => handleInputChange('position', e.target.value)}
                className="mt-1"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="role">Role</Label>
              <Select value={formData.role} onValueChange={(value) => handleInputChange('role', value)}>
                <SelectTrigger className="mt-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="user">Team Member</SelectItem>
                  <SelectItem value="admin">Administrator</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-end">
              <div className="flex items-center space-x-2 h-10">
                <Checkbox
                  id="is_external"
                  checked={formData.is_external}
                  onCheckedChange={(checked) => handleInputChange('is_external', checked)}
                />
                <Label htmlFor="is_external" className="text-sm">
                  External
                </Label>
              </div>
            </div>
          </div>

          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <DialogFooter className="gap-2 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={loading || !formData.full_name}
              className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Saving...
                </>
              ) : (
                'Save Changes'
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
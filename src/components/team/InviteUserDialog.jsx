
import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Mail, UserPlus, AlertCircle, Info, MessageCircle } from "lucide-react";
import { toast } from "sonner";
import { whatsTaskClient } from '@/api/whatsTaskClient';

export default function InviteUserDialog({ open, onOpenChange, onInviteSuccess }) {
  const [formData, setFormData] = useState({
    email: "",
    full_name: "",
    role: "user",
    department: "",
    position: "",
    phone_number: "",
    is_external: false
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [invitationType, setInvitationType] = useState("whatsapp"); // "whatsapp" or "email"

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setError(""); // Clear error when user types

    if (field === 'phone_number' && value) {
      const sanitizedPhone = value.replace(/\D/g, '');
      if (sanitizedPhone) {
        setFormData(prev => ({
          ...prev,
          email: `${sanitizedPhone}@whatstask.app`
        }));
      } else {
        // If phone number becomes empty, clear auto-generated email
        setFormData(prev => ({
          ...prev,
          email: prev.email.endsWith('@whatstask.app') ? "" : prev.email // Only clear if it was auto-generated
        }));
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      let response;
      
      if (invitationType === "whatsapp") {
        // Send WhatsApp invitation
        if (!formData.phone_number) {
          throw new Error("Phone number is required for WhatsApp invitation");
        }
        
        response = await whatsTaskClient.request('/api/invitations/whatsapp', {
          method: 'POST',
          body: JSON.stringify({
            phone_number: formData.phone_number,
            full_name: formData.full_name,
            email: formData.email,
            role: formData.role,
            department: formData.department,
            position: formData.position,
            is_external: formData.is_external
          })
        });
      } else {
        // Send email invitation
        if (!formData.email) {
          throw new Error("Email is required for email invitation");
        }
        
        response = await whatsTaskClient.request('/api/invitations/email', {
          method: 'POST',
          body: JSON.stringify({
            email: formData.email,
            full_name: formData.full_name,
            role: formData.role,
            department: formData.department,
            position: formData.position,
            is_external: formData.is_external
          })
        });
      }

      const result = response;
      
      if (result.success) {
        toast.success(
          invitationType === "whatsapp" 
            ? `WhatsApp invitation sent to ${formData.phone_number}!`
            : `Email invitation prepared for ${formData.email}!`
        );
        
        onOpenChange(false);
        setFormData({
          email: "",
          full_name: "",
          role: "user",
          department: "",
          position: "",
          phone_number: "",
          is_external: false
        });
        
        if (onInviteSuccess) {
          onInviteSuccess(result.data);
        }
      } else {
        throw new Error(result.error || 'Failed to send invitation');
      }

    } catch (err) {
      setError(err.message);
      toast.error(`Failed to send invitation: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md" aria-describedby="invite-user-description">
        <DialogHeader>
                      <DialogTitle className="flex items-center gap-2">
              <UserPlus className="w-5 h-5" />
              Invite Team Member
            </DialogTitle>
            <div id="invite-user-description" className="sr-only">
              Dialog for inviting new team members via email or phone number
            </div>
        </DialogHeader>
        
        <Alert className="bg-blue-50 border-blue-200">
          <MessageCircle className="h-4 w-4" />
          <AlertDescription className="text-sm">
            Send real invitations via WhatsApp or email. Recipients can accept/decline directly.
          </AlertDescription>
        </Alert>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Invitation Type Selection */}
          <div>
            <Label>Invitation Method</Label>
            <div className="flex gap-2 mt-1">
              <Button
                type="button"
                variant={invitationType === "whatsapp" ? "default" : "outline"}
                size="sm"
                onClick={() => setInvitationType("whatsapp")}
                className="flex items-center gap-2"
              >
                <MessageCircle className="w-4 h-4" />
                WhatsApp
              </Button>
              <Button
                type="button"
                variant={invitationType === "email" ? "default" : "outline"}
                size="sm"
                onClick={() => setInvitationType("email")}
                className="flex items-center gap-2"
              >
                <Mail className="w-4 h-4" />
                Email
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="full_name">Full Name *</Label>
              <Input
                id="full_name"
                value={formData.full_name}
                onChange={(e) => handleInputChange('full_name', e.target.value)}
                placeholder="John Doe"
                required
                className="mt-1"
              />
            </div>
            
            {invitationType === "whatsapp" ? (
              <div>
                <Label htmlFor="phone_number">Phone Number *</Label>
                <Input
                  id="phone_number"
                  value={formData.phone_number}
                  onChange={(e) => handleInputChange('phone_number', e.target.value)}
                  placeholder="+1234567890"
                  className="mt-1"
                  required
                />
              </div>
            ) : (
              <div>
                <Label htmlFor="email">Email Address *</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  placeholder="john@example.com"
                  required
                  className="mt-1"
                />
              </div>
            )}
          </div>
          
          {invitationType === "whatsapp" && (
            <div>
              <Label htmlFor="email">Email Address</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                placeholder="Auto-generated from phone"
                className="mt-1"
              />
              <p className="text-xs text-slate-500 mt-1 flex items-center gap-1">
                <Info className="w-3 h-3"/>
                An email is auto-generated for the user account. You can modify it if needed.
              </p>
            </div>
          )}

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
            <div>
              <Label htmlFor="department">Department</Label>
              <Input
                id="department"
                value={formData.department}
                onChange={(e) => handleInputChange('department', e.target.value)}
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
                value={formData.position}
                onChange={(e) => handleInputChange('position', e.target.value)}
                placeholder="Software Engineer"
                className="mt-1"
              />
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox
              id="is_external"
              checked={formData.is_external}
              onCheckedChange={(checked) => handleInputChange('is_external', checked)}
            />
            <Label htmlFor="is_external" className="text-sm">
              External collaborator (contractor, vendor, etc.)
            </Label>
          </div>

          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <DialogFooter className="gap-2">
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
              disabled={loading || !formData.full_name || 
                (invitationType === "whatsapp" ? !formData.phone_number : !formData.email)}
              className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Sending...
                </>
              ) : (
                <>
                  {invitationType === "whatsapp" ? (
                    <MessageCircle className="w-4 h-4 mr-2" />
                  ) : (
                    <Mail className="w-4 h-4 mr-2" />
                  )}
                  Send {invitationType === "whatsapp" ? "WhatsApp" : "Email"} Invitation
                </>
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

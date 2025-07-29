import React, { useState } from "react";
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
import { Badge } from "@/components/ui/badge";
import { UserCheck, ExternalLink } from "lucide-react";

export default function ReassignTaskDialog({ open, onOpenChange, task, users, onReassign }) {
  const [assignmentType, setAssignmentType] = useState("team");
  const [selectedUser, setSelectedUser] = useState("");
  const [externalName, setExternalName] = useState("");
  const [externalPhone, setExternalPhone] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      let newAssignee;
      
      if (assignmentType === "team") {
        const user = users.find(u => u.id === selectedUser);
        if (!user) return;
        
        newAssignee = {
          id: user.id,
          name: user.full_name,
          phone: user.phone_number,
          is_external: false
        };
      } else {
        newAssignee = {
          id: null,
          name: externalName,
          phone: externalPhone,
          is_external: true
        };
      }
      
      await onReassign(newAssignee);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <UserCheck className="w-5 h-5" />
            Reassign Task
          </DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label>Assignment Type</Label>
            <div className="flex items-center space-x-4 mt-2">
              <label className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="radio"
                  name="assignmentType"
                  checked={assignmentType === "team"}
                  onChange={() => setAssignmentType("team")}
                  className="text-indigo-600"
                />
                <span className="text-sm font-medium">Team Member</span>
              </label>
              <label className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="radio"
                  name="assignmentType"
                  checked={assignmentType === "external"}
                  onChange={() => setAssignmentType("external")}
                  className="text-indigo-600"
                />
                <span className="text-sm font-medium">External Person</span>
              </label>
            </div>
          </div>

          {assignmentType === "team" ? (
            <div>
              <Label htmlFor="user">Select Team Member</Label>
              <Select value={selectedUser} onValueChange={setSelectedUser} required>
                <SelectTrigger className="mt-1">
                  <SelectValue placeholder="Choose a team member" />
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
                            <ExternalLink className="w-3 h-3 mr-1" />
                            External
                          </Badge>
                        )}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          ) : (
            <div className="space-y-4">
              <div>
                <Label htmlFor="external_name">Contact Name</Label>
                <Input
                  id="external_name"
                  value={externalName}
                  onChange={(e) => setExternalName(e.target.value)}
                  placeholder="John Doe"
                  required
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="external_phone">WhatsApp Number</Label>
                <Input
                  id="external_phone"
                  value={externalPhone}
                  onChange={(e) => setExternalPhone(e.target.value)}
                  placeholder="+1234567890"
                  required
                  className="mt-1"
                />
              </div>
            </div>
          )}

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button 
              type="submit" 
              disabled={loading || (assignmentType === "team" && !selectedUser) || (assignmentType === "external" && (!externalName || !externalPhone))}
            >
              {loading ? 'Reassigning...' : 'Reassign Task'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
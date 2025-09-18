"use client"

import { useState } from "react"
import { AppLayout } from "@/components/app-layout"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Checkbox } from "@/components/ui/checkbox"
import { useToast } from "@/hooks/use-toast"
import {
  Users,
  Search,
  MoreHorizontal,
  UserCheck,
  UserX,
  Shield,
  User,
  Crown,
  Settings,
  Mail,
  Calendar,
  Activity,
  Trash2,
  UserPlus,
  Download,
} from "lucide-react"

// Mock users data with activity logs
const mockUsers = [
  {
    id: "1",
    name: "John Doe",
    email: "john.doe@company.com",
    role: "user",
    status: "active",
    joinedAt: "2023-06-15",
    lastActive: "2 hours ago",
    tasksCompleted: 142,
    projectsLed: 8,
    loginCount: 245,
    lastLogin: "2024-01-15 09:30",
    activityLogs: [
      { action: "Completed task 'Review proposal'", timestamp: "2 hours ago" },
      { action: "Created new project 'Website Redesign'", timestamp: "1 day ago" },
      { action: "Updated profile information", timestamp: "3 days ago" },
    ],
  },
  {
    id: "2",
    name: "Sarah Wilson",
    email: "sarah.wilson@company.com",
    role: "admin",
    status: "active",
    joinedAt: "2023-08-22",
    lastActive: "5 minutes ago",
    tasksCompleted: 89,
    projectsLed: 3,
    loginCount: 156,
    lastLogin: "2024-01-15 14:20",
    activityLogs: [
      { action: "Modified user permissions", timestamp: "5 minutes ago" },
      { action: "Created task 'System maintenance'", timestamp: "2 hours ago" },
      { action: "Updated system settings", timestamp: "1 day ago" },
    ],
  },
  {
    id: "3",
    name: "Mike Johnson",
    email: "mike.johnson@company.com",
    role: "user",
    status: "active",
    joinedAt: "2023-09-10",
    lastActive: "1 hour ago",
    tasksCompleted: 67,
    projectsLed: 2,
    loginCount: 98,
    lastLogin: "2024-01-15 13:45",
    activityLogs: [
      { action: "Completed task 'Database backup'", timestamp: "1 hour ago" },
      { action: "Joined project 'Mobile App'", timestamp: "5 hours ago" },
      { action: "Updated task status", timestamp: "1 day ago" },
    ],
  },
  {
    id: "4",
    name: "Alice Brown",
    email: "alice.brown@company.com",
    role: "user",
    status: "inactive",
    joinedAt: "2023-07-05",
    lastActive: "3 days ago",
    tasksCompleted: 45,
    projectsLed: 1,
    loginCount: 67,
    lastLogin: "2024-01-12 16:30",
    activityLogs: [
      { action: "Completed task 'Content review'", timestamp: "3 days ago" },
      { action: "Updated profile picture", timestamp: "1 week ago" },
      { action: "Created task 'Blog post'", timestamp: "2 weeks ago" },
    ],
  },
  {
    id: "5",
    name: "Bob Davis",
    email: "bob.davis@company.com",
    role: "super_admin",
    status: "active",
    joinedAt: "2023-05-12",
    lastActive: "30 minutes ago",
    tasksCompleted: 203,
    projectsLed: 12,
    loginCount: 432,
    lastLogin: "2024-01-15 14:00",
    activityLogs: [
      { action: "Modified system configuration", timestamp: "30 minutes ago" },
      { action: "Created admin user", timestamp: "2 hours ago" },
      { action: "Updated security settings", timestamp: "4 hours ago" },
    ],
  },
]

function getRoleIcon(role: string) {
  switch (role) {
    case "super_admin":
      return <Crown className="h-4 w-4 text-yellow-600" />
    case "admin":
      return <Shield className="h-4 w-4 text-purple-600" />
    case "user":
      return <User className="h-4 w-4 text-blue-600" />
    default:
      return <User className="h-4 w-4 text-gray-600" />
  }
}

function getRoleColor(role: string) {
  switch (role) {
    case "super_admin":
      return "bg-yellow-100 text-yellow-800"
    case "admin":
      return "bg-purple-100 text-purple-800"
    case "user":
      return "bg-blue-100 text-blue-800"
    default:
      return "bg-gray-100 text-gray-800"
  }
}

function getStatusColor(status: string) {
  switch (status) {
    case "active":
      return "bg-green-100 text-green-800"
    case "inactive":
      return "bg-gray-100 text-gray-800"
    case "suspended":
      return "bg-red-100 text-red-800"
    default:
      return "bg-gray-100 text-gray-800"
  }
}

export default function UsersPage() {
  const { toast } = useToast()
  const [searchTerm, setSearchTerm] = useState("")
  const [roleFilter, setRoleFilter] = useState("all")
  const [statusFilter, setStatusFilter] = useState("all")
  const [selectedUsers, setSelectedUsers] = useState<string[]>([])
  const [selectedUser, setSelectedUser] = useState<any>(null)
  const [isInviteOpen, setIsInviteOpen] = useState(false)
  const [isUserDetailOpen, setIsUserDetailOpen] = useState(false)
  const [inviteData, setInviteData] = useState({ email: "", role: "user" })

  const filteredUsers = mockUsers.filter((user) => {
    const matchesSearch =
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesRole = roleFilter === "all" || user.role === roleFilter
    const matchesStatus = statusFilter === "all" || user.status === statusFilter

    return matchesSearch && matchesRole && matchesStatus
  })

  const handleSelectUser = (userId: string, checked: boolean) => {
    if (checked) {
      setSelectedUsers([...selectedUsers, userId])
    } else {
      setSelectedUsers(selectedUsers.filter((id) => id !== userId))
    }
  }

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedUsers(filteredUsers.map((user) => user.id))
    } else {
      setSelectedUsers([])
    }
  }

  const handleInviteUser = async () => {
    if (!inviteData.email) return

    try {
      await new Promise((resolve) => setTimeout(resolve, 1000))

      toast({
        title: "Invitation sent",
        description: `Invitation sent to ${inviteData.email} with ${inviteData.role} role.`,
      })

      setIsInviteOpen(false)
      setInviteData({ email: "", role: "user" })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to send invitation.",
        variant: "destructive",
      })
    }
  }

  const handleBulkAction = async (action: string) => {
    if (selectedUsers.length === 0) return

    try {
      await new Promise((resolve) => setTimeout(resolve, 1000))

      toast({
        title: "Bulk action completed",
        description: `${action} applied to ${selectedUsers.length} users.`,
      })

      setSelectedUsers([])
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to perform bulk action.",
        variant: "destructive",
      })
    }
  }

  const handleStatusChange = async (userId: string, newStatus: string) => {
    try {
      await new Promise((resolve) => setTimeout(resolve, 500))

      const user = mockUsers.find((u) => u.id === userId)
      toast({
        title: "Status updated",
        description: `${user?.name} has been ${newStatus === "active" ? "activated" : "deactivated"}.`,
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update user status.",
        variant: "destructive",
      })
    }
  }

  return (
    <AppLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-serif font-bold text-balance">User Management</h1>
            <p className="text-muted-foreground">Manage users, roles, and permissions</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" className="flex items-center gap-2 bg-transparent">
              <Download className="h-4 w-4" />
              Export
            </Button>
            <Dialog open={isInviteOpen} onOpenChange={setIsInviteOpen}>
              <DialogTrigger asChild>
                <Button className="flex items-center gap-2">
                  <UserPlus className="h-4 w-4" />
                  Invite User
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Invite New User</DialogTitle>
                  <DialogDescription>Send an invitation to a new user to join the platform.</DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="user@company.com"
                      value={inviteData.email}
                      onChange={(e) => setInviteData({ ...inviteData, email: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="role">Role</Label>
                    <Select
                      value={inviteData.role}
                      onValueChange={(value) => setInviteData({ ...inviteData, role: value })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="user">User</SelectItem>
                        <SelectItem value="admin">Admin</SelectItem>
                        <SelectItem value="super_admin">Super Admin</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex gap-2 pt-4">
                    <Button onClick={handleInviteUser} disabled={!inviteData.email} className="flex-1">
                      Send Invitation
                    </Button>
                    <Button variant="outline" onClick={() => setIsInviteOpen(false)} className="flex-1 bg-transparent">
                      Cancel
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        {/* Stats Overview */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Users</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{mockUsers.length}</div>
              <p className="text-xs text-muted-foreground">
                {mockUsers.filter((u) => u.status === "active").length} active
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Super Admins</CardTitle>
              <Crown className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{mockUsers.filter((u) => u.role === "super_admin").length}</div>
              <p className="text-xs text-muted-foreground">Full system access</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Administrators</CardTitle>
              <Shield className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{mockUsers.filter((u) => u.role === "admin").length}</div>
              <p className="text-xs text-muted-foreground">Admin privileges</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Regular Users</CardTitle>
              <User className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{mockUsers.filter((u) => u.role === "user").length}</div>
              <p className="text-xs text-muted-foreground">Standard access</p>
            </CardContent>
          </Card>
        </div>

        {/* Filters and Search */}
        <Card>
          <CardHeader>
            <CardTitle>Search and Filter</CardTitle>
            <CardDescription>Find and manage users across the platform</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search users by name or email..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-8"
                />
              </div>
              <Select value={roleFilter} onValueChange={setRoleFilter}>
                <SelectTrigger className="w-full sm:w-[180px]">
                  <SelectValue placeholder="Filter by role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Roles</SelectItem>
                  <SelectItem value="super_admin">Super Admin</SelectItem>
                  <SelectItem value="admin">Admin</SelectItem>
                  <SelectItem value="user">User</SelectItem>
                </SelectContent>
              </Select>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-full sm:w-[180px]">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                  <SelectItem value="suspended">Suspended</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Bulk Actions */}
        {selectedUsers.length > 0 && (
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">
                  {selectedUsers.length} user{selectedUsers.length > 1 ? "s" : ""} selected
                </span>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleBulkAction("Activate")}
                    className="bg-transparent"
                  >
                    <UserCheck className="mr-2 h-4 w-4" />
                    Activate
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleBulkAction("Deactivate")}
                    className="bg-transparent"
                  >
                    <UserX className="mr-2 h-4 w-4" />
                    Deactivate
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleBulkAction("Change Role")}
                    className="bg-transparent"
                  >
                    <Shield className="mr-2 h-4 w-4" />
                    Change Role
                  </Button>
                  <Button variant="destructive" size="sm" onClick={() => handleBulkAction("Remove")}>
                    <Trash2 className="mr-2 h-4 w-4" />
                    Remove
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Users Table */}
        <Card>
          <CardHeader>
            <CardTitle>Users ({filteredUsers.length})</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[50px]">
                      <Checkbox
                        checked={selectedUsers.length === filteredUsers.length && filteredUsers.length > 0}
                        onCheckedChange={handleSelectAll}
                      />
                    </TableHead>
                    <TableHead>User</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Last Active</TableHead>
                    <TableHead>Activity</TableHead>
                    <TableHead className="w-[50px]"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredUsers.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell>
                        <Checkbox
                          checked={selectedUsers.includes(user.id)}
                          onCheckedChange={(checked) => handleSelectUser(user.id, checked as boolean)}
                        />
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <div className="font-medium">{user.name}</div>
                          </div>
                          <div className="flex items-center gap-1 text-sm text-muted-foreground">
                            <Mail className="h-3 w-3" />
                            {user.email}
                          </div>
                          <div className="flex items-center gap-1 text-xs text-muted-foreground">
                            <Calendar className="h-3 w-3" />
                            Joined {user.joinedAt}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          {getRoleIcon(user.role)}
                          <Badge variant="outline" className={getRoleColor(user.role)}>
                            {user.role.replace("_", " ")}
                          </Badge>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className={getStatusColor(user.status)}>
                          {user.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          <div className="text-sm">{user.lastActive}</div>
                          <div className="text-xs text-muted-foreground">{user.loginCount} logins</div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          <div className="text-sm">{user.tasksCompleted} tasks</div>
                          <div className="text-xs text-muted-foreground">{user.projectsLed} projects led</div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem
                              onClick={() => {
                                setSelectedUser(user)
                                setIsUserDetailOpen(true)
                              }}
                            >
                              <Activity className="mr-2 h-4 w-4" />
                              View Activity
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Shield className="mr-2 h-4 w-4" />
                              Change Role
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() =>
                                handleStatusChange(user.id, user.status === "active" ? "inactive" : "active")
                              }
                            >
                              {user.status === "active" ? (
                                <>
                                  <UserX className="mr-2 h-4 w-4" />
                                  Deactivate
                                </>
                              ) : (
                                <>
                                  <UserCheck className="mr-2 h-4 w-4" />
                                  Activate
                                </>
                              )}
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Settings className="mr-2 h-4 w-4" />
                              Edit Profile
                            </DropdownMenuItem>
                            <DropdownMenuItem className="text-destructive">
                              <Trash2 className="mr-2 h-4 w-4" />
                              Remove User
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>

        {/* User Detail Dialog */}
        <Dialog open={isUserDetailOpen} onOpenChange={setIsUserDetailOpen}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>User Activity - {selectedUser?.name}</DialogTitle>
              <DialogDescription>Recent activity and login history for this user</DialogDescription>
            </DialogHeader>
            {selectedUser && (
              <div className="space-y-6">
                {/* User Info */}
                <div className="grid gap-4 md:grid-cols-2">
                  <Card>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-sm">User Information</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">Email:</span>
                        <span className="text-sm">{selectedUser.email}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">Role:</span>
                        <Badge variant="outline" className={getRoleColor(selectedUser.role)}>
                          {selectedUser.role.replace("_", " ")}
                        </Badge>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">Status:</span>
                        <Badge variant="outline" className={getStatusColor(selectedUser.status)}>
                          {selectedUser.status}
                        </Badge>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">Last Login:</span>
                        <span className="text-sm">{selectedUser.lastLogin}</span>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-sm">Activity Stats</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">Tasks Completed:</span>
                        <span className="text-sm font-medium">{selectedUser.tasksCompleted}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">Projects Led:</span>
                        <span className="text-sm font-medium">{selectedUser.projectsLed}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">Total Logins:</span>
                        <span className="text-sm font-medium">{selectedUser.loginCount}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">Member Since:</span>
                        <span className="text-sm font-medium">{selectedUser.joinedAt}</span>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Activity Log */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm">Recent Activity</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {selectedUser.activityLogs.map((log, index) => (
                        <div key={index} className="flex items-start gap-3 p-3 border rounded-lg">
                          <Activity className="h-4 w-4 text-muted-foreground mt-0.5" />
                          <div className="flex-1">
                            <p className="text-sm">{log.action}</p>
                            <p className="text-xs text-muted-foreground">{log.timestamp}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </AppLayout>
  )
}

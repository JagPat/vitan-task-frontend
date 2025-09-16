import { AppLayout } from "@/components/app-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Button } from "@/components/ui/button"
import {
  Users,
  CheckSquare,
  TrendingUp,
  AlertTriangle,
  Server,
  Database,
  Activity,
  Clock,
  UserCheck,
  MessageSquare,
  BarChart3,
  Settings,
} from "lucide-react"

// Mock admin dashboard data
const systemStats = {
  totalUsers: 1247,
  activeUsers: 892,
  totalTasks: 5643,
  completedTasks: 4201,
  totalProjects: 156,
  activeProjects: 89,
  systemUptime: "99.9%",
  storageUsed: 67,
  apiCalls: 125430,
  whatsappMessages: 3421,
}

const recentUsers = [
  {
    id: "1",
    name: "Alice Johnson",
    email: "alice.johnson@company.com",
    role: "user",
    status: "active",
    joinedAt: "2024-01-15",
    lastActive: "2 hours ago",
  },
  {
    id: "2",
    name: "Bob Smith",
    email: "bob.smith@company.com",
    role: "admin",
    status: "active",
    joinedAt: "2024-01-14",
    lastActive: "5 minutes ago",
  },
  {
    id: "3",
    name: "Carol Davis",
    email: "carol.davis@company.com",
    role: "user",
    status: "inactive",
    joinedAt: "2024-01-13",
    lastActive: "2 days ago",
  },
  {
    id: "4",
    name: "David Wilson",
    email: "david.wilson@company.com",
    role: "user",
    status: "active",
    joinedAt: "2024-01-12",
    lastActive: "1 hour ago",
  },
]

const systemAlerts = [
  {
    id: "1",
    type: "warning",
    title: "High API Usage",
    description: "API calls exceeded 80% of monthly limit",
    timestamp: "10 minutes ago",
  },
  {
    id: "2",
    type: "info",
    title: "Scheduled Maintenance",
    description: "System maintenance scheduled for tonight at 2 AM",
    timestamp: "2 hours ago",
  },
  {
    id: "3",
    type: "success",
    title: "Backup Completed",
    description: "Daily database backup completed successfully",
    timestamp: "6 hours ago",
  },
]

function getAlertIcon(type: string) {
  switch (type) {
    case "warning":
      return <AlertTriangle className="h-4 w-4 text-yellow-600" />
    case "error":
      return <AlertTriangle className="h-4 w-4 text-red-600" />
    case "success":
      return <CheckSquare className="h-4 w-4 text-green-600" />
    default:
      return <Activity className="h-4 w-4 text-blue-600" />
  }
}

function getAlertColor(type: string) {
  switch (type) {
    case "warning":
      return "bg-yellow-100 text-yellow-800"
    case "error":
      return "bg-red-100 text-red-800"
    case "success":
      return "bg-green-100 text-green-800"
    default:
      return "bg-blue-100 text-blue-800"
  }
}

function getRoleColor(role: string) {
  switch (role) {
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

export default function AdminDashboardPage() {
  return (
    <AppLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-serif font-bold text-balance">Admin Dashboard</h1>
            <p className="text-muted-foreground">System overview and management</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" className="flex items-center gap-2 bg-transparent">
              <BarChart3 className="h-4 w-4" />
              View Analytics
            </Button>
            <Button className="flex items-center gap-2">
              <Settings className="h-4 w-4" />
              System Settings
            </Button>
          </div>
        </div>

        {/* System Stats */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Users</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{systemStats.totalUsers.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">{systemStats.activeUsers} active users</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Tasks</CardTitle>
              <CheckSquare className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{systemStats.totalTasks.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">{systemStats.completedTasks} completed</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Projects</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{systemStats.activeProjects}</div>
              <p className="text-xs text-muted-foreground">of {systemStats.totalProjects} total</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">System Uptime</CardTitle>
              <Server className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{systemStats.systemUptime}</div>
              <p className="text-xs text-muted-foreground">Last 30 days</p>
            </CardContent>
          </Card>
        </div>

        {/* Additional Stats */}
        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Storage Usage</CardTitle>
              <Database className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="text-2xl font-bold">{systemStats.storageUsed}%</div>
              <Progress value={systemStats.storageUsed} className="h-2" />
              <p className="text-xs text-muted-foreground">67GB of 100GB used</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">API Calls</CardTitle>
              <Activity className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{systemStats.apiCalls.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">This month</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">WhatsApp Messages</CardTitle>
              <MessageSquare className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{systemStats.whatsappMessages.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">This month</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          {/* Recent Users */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <UserCheck className="h-5 w-5" />
                Recent Users
              </CardTitle>
              <CardDescription>Latest user registrations and activity</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {recentUsers.map((user) => (
                <div key={user.id} className="flex items-center justify-between space-x-4">
                  <div className="flex items-center space-x-3 flex-1 min-w-0">
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{user.name}</p>
                      <p className="text-xs text-muted-foreground truncate">{user.email}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge variant="outline" className={getRoleColor(user.role)}>
                      {user.role}
                    </Badge>
                    <Badge variant="outline" className={getStatusColor(user.status)}>
                      {user.status}
                    </Badge>
                  </div>
                </div>
              ))}
              <Button variant="outline" className="w-full bg-transparent">
                View All Users
              </Button>
            </CardContent>
          </Card>

          {/* System Alerts */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5" />
                System Alerts
              </CardTitle>
              <CardDescription>Recent system notifications and alerts</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {systemAlerts.map((alert) => (
                <div key={alert.id} className="flex items-start space-x-3">
                  <div className="flex-shrink-0 mt-0.5">{getAlertIcon(alert.type)}</div>
                  <div className="flex-1 min-w-0 space-y-1">
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-medium">{alert.title}</p>
                      <Badge variant="outline" className={getAlertColor(alert.type)}>
                        {alert.type}
                      </Badge>
                    </div>
                    <p className="text-xs text-muted-foreground">{alert.description}</p>
                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                      <Clock className="h-3 w-3" />
                      {alert.timestamp}
                    </div>
                  </div>
                </div>
              ))}
              <Button variant="outline" className="w-full bg-transparent">
                View All Alerts
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </AppLayout>
  )
}

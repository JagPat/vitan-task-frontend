import { AppLayout } from "@/components/app-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Button } from "@/components/ui/button"
import {
  Users,
  AlertTriangle,
  Server,
  Database,
  Activity,
  Clock,
  UserCheck,
  BarChart3,
  Settings,
  Crown,
  Shield,
  Globe,
  Zap,
} from "lucide-react"

// Mock super admin dashboard data
const superAdminStats = {
  totalAdmins: 12,
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
  systemHealth: 98,
  securityScore: 95,
}

const adminActivity = [
  {
    id: "1",
    name: "Jane Smith",
    email: "jane.smith@company.com",
    role: "admin",
    lastAction: "Updated user permissions",
    timestamp: "5 minutes ago",
    status: "active",
  },
  {
    id: "2",
    name: "Bob Davis",
    email: "bob.davis@company.com",
    role: "admin",
    lastAction: "Created new project",
    timestamp: "1 hour ago",
    status: "active",
  },
  {
    id: "3",
    name: "Carol Wilson",
    email: "carol.wilson@company.com",
    role: "admin",
    lastAction: "Modified system settings",
    timestamp: "2 hours ago",
    status: "active",
  },
]

const systemMetrics = [
  { name: "CPU Usage", value: 45, status: "good" },
  { name: "Memory Usage", value: 67, status: "warning" },
  { name: "Disk Usage", value: 23, status: "good" },
  { name: "Network I/O", value: 89, status: "critical" },
]

const criticalAlerts = [
  {
    id: "1",
    type: "critical",
    title: "High Memory Usage",
    description: "System memory usage exceeded 90%",
    timestamp: "5 minutes ago",
    affected: "All services",
  },
  {
    id: "2",
    type: "warning",
    title: "Admin Permission Change",
    description: "Admin role permissions were modified",
    timestamp: "15 minutes ago",
    affected: "User management",
  },
  {
    id: "3",
    type: "info",
    title: "Backup Completed",
    description: "Daily system backup completed successfully",
    timestamp: "2 hours ago",
    affected: "Database",
  },
]

function getMetricColor(status: string) {
  switch (status) {
    case "good":
      return "bg-green-100 text-green-800"
    case "warning":
      return "bg-yellow-100 text-yellow-800"
    case "critical":
      return "bg-red-100 text-red-800"
    default:
      return "bg-gray-100 text-gray-800"
  }
}

function getAlertIcon(type: string) {
  switch (type) {
    case "critical":
      return <AlertTriangle className="h-4 w-4 text-red-600" />
    case "warning":
      return <AlertTriangle className="h-4 w-4 text-yellow-600" />
    case "info":
      return <Activity className="h-4 w-4 text-blue-600" />
    default:
      return <Activity className="h-4 w-4 text-gray-600" />
  }
}

export default function SuperAdminDashboardPage() {
  return (
    <AppLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2">
              <Crown className="h-8 w-8 text-yellow-600" />
              <h1 className="text-3xl font-serif font-bold text-balance">Super Admin Dashboard</h1>
            </div>
            <p className="text-muted-foreground">Complete system oversight and administration</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" className="flex items-center gap-2 bg-transparent">
              <Shield className="h-4 w-4" />
              Security Center
            </Button>
            <Button className="flex items-center gap-2">
              <Settings className="h-4 w-4" />
              System Control
            </Button>
          </div>
        </div>

        {/* System Health Overview */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">System Health</CardTitle>
              <Zap className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{superAdminStats.systemHealth}%</div>
              <Progress value={superAdminStats.systemHealth} className="h-2 mt-2" />
              <p className="text-xs text-muted-foreground mt-1">All systems operational</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Security Score</CardTitle>
              <Shield className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{superAdminStats.securityScore}%</div>
              <Progress value={superAdminStats.securityScore} className="h-2 mt-2" />
              <p className="text-xs text-muted-foreground mt-1">Security protocols active</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Admins</CardTitle>
              <Crown className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{superAdminStats.totalAdmins}</div>
              <p className="text-xs text-muted-foreground">
                {adminActivity.filter((a) => a.status === "active").length} currently active
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Global Users</CardTitle>
              <Globe className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{superAdminStats.totalUsers.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">{superAdminStats.activeUsers} active users</p>
            </CardContent>
          </Card>
        </div>

        {/* System Metrics */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Server className="h-5 w-5" />
              System Metrics
            </CardTitle>
            <CardDescription>Real-time system performance monitoring</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              {systemMetrics.map((metric) => (
                <div key={metric.name} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">{metric.name}</span>
                    <Badge variant="outline" className={getMetricColor(metric.status)}>
                      {metric.status}
                    </Badge>
                  </div>
                  <Progress value={metric.value} className="h-2" />
                  <p className="text-xs text-muted-foreground">{metric.value}% utilized</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <div className="grid gap-6 lg:grid-cols-2">
          {/* Admin Activity */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <UserCheck className="h-5 w-5" />
                Admin Activity
              </CardTitle>
              <CardDescription>Recent administrator actions and status</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {adminActivity.map((admin) => (
                <div key={admin.id} className="flex items-center justify-between space-x-4">
                  <div className="flex items-center space-x-3 flex-1 min-w-0">
                    <div className="flex items-center justify-center w-8 h-8 rounded-full bg-purple-100 text-purple-600">
                      <Crown className="h-4 w-4" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{admin.name}</p>
                      <p className="text-xs text-muted-foreground truncate">{admin.lastAction}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="text-right">
                      <p className="text-xs text-muted-foreground">{admin.timestamp}</p>
                    </div>
                    <Badge variant="outline" className="bg-green-100 text-green-800">
                      {admin.status}
                    </Badge>
                  </div>
                </div>
              ))}
              <Button variant="outline" className="w-full bg-transparent">
                View All Admin Activity
              </Button>
            </CardContent>
          </Card>

          {/* Critical Alerts */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5" />
                Critical Alerts
              </CardTitle>
              <CardDescription>System-wide alerts requiring attention</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {criticalAlerts.map((alert) => (
                <div key={alert.id} className="flex items-start space-x-3 p-3 border rounded-lg">
                  <div className="flex-shrink-0 mt-0.5">{getAlertIcon(alert.type)}</div>
                  <div className="flex-1 min-w-0 space-y-1">
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-medium">{alert.title}</p>
                      <Badge variant="outline" className={getMetricColor(alert.type === "info" ? "good" : alert.type)}>
                        {alert.type}
                      </Badge>
                    </div>
                    <p className="text-xs text-muted-foreground">{alert.description}</p>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1 text-xs text-muted-foreground">
                        <Clock className="h-3 w-3" />
                        {alert.timestamp}
                      </div>
                      <span className="text-xs text-muted-foreground">Affects: {alert.affected}</span>
                    </div>
                  </div>
                </div>
              ))}
              <Button variant="outline" className="w-full bg-transparent">
                View Alert Center
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Super Admin Controls</CardTitle>
            <CardDescription>Quick access to critical system functions</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <Button variant="outline" className="h-20 flex-col gap-2 bg-transparent">
                <Users className="h-6 w-6" />
                Manage Admins
              </Button>
              <Button variant="outline" className="h-20 flex-col gap-2 bg-transparent">
                <Shield className="h-6 w-6" />
                Security Center
              </Button>
              <Button variant="outline" className="h-20 flex-col gap-2 bg-transparent">
                <Database className="h-6 w-6" />
                System Backup
              </Button>
              <Button variant="outline" className="h-20 flex-col gap-2 bg-transparent">
                <BarChart3 className="h-6 w-6" />
                Global Analytics
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  )
}

"use client"

import { useState, useEffect } from "react"
import { AppLayout } from "@/components/app-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { useToast } from "@/hooks/use-toast"
import { apiService } from "@/lib/api"
import { CheckSquare, Clock, Users, TrendingUp, Plus, Calendar, AlertCircle, CheckCircle2 } from "lucide-react"

interface QuickStats {
  totalTasks: number
  completedTasks: number
  activeTasks: number
  totalProjects: number
  activeProjects: number
  teamMembers: number
}

const recentTasks = [
  {
    id: "1",
    title: "Update user authentication flow",
    status: "completed",
    priority: "high",
    dueDate: "2024-01-15",
    project: "VitanTask v2.0",
  },
  {
    id: "2",
    title: "Design new dashboard layout",
    status: "in-progress",
    priority: "medium",
    dueDate: "2024-01-18",
    project: "UI Redesign",
  },
  {
    id: "3",
    title: "Fix mobile responsive issues",
    status: "open",
    priority: "high",
    dueDate: "2024-01-16",
    project: "Bug Fixes",
  },
  {
    id: "4",
    title: "Write API documentation",
    status: "overdue",
    priority: "low",
    dueDate: "2024-01-12",
    project: "Documentation",
  },
]

const activeProjects = [
  {
    id: "1",
    name: "VitanTask v2.0",
    progress: 75,
    tasksCompleted: 12,
    totalTasks: 16,
    dueDate: "2024-02-01",
    team: ["John", "Sarah", "Mike"],
  },
  {
    id: "2",
    name: "UI Redesign",
    progress: 45,
    tasksCompleted: 9,
    totalTasks: 20,
    dueDate: "2024-01-25",
    team: ["Alice", "Bob"],
  },
  {
    id: "3",
    name: "Mobile App",
    progress: 20,
    tasksCompleted: 3,
    totalTasks: 15,
    dueDate: "2024-03-15",
    team: ["Charlie", "Diana", "Eve"],
  },
]

function getStatusIcon(status: string) {
  switch (status) {
    case "completed":
      return <CheckCircle2 className="h-4 w-4 text-green-600" />
    case "in-progress":
      return <Clock className="h-4 w-4 text-blue-600" />
    case "overdue":
      return <AlertCircle className="h-4 w-4 text-red-600" />
    default:
      return <CheckSquare className="h-4 w-4 text-gray-600" />
  }
}

function getStatusColor(status: string) {
  switch (status) {
    case "completed":
      return "bg-green-100 text-green-800"
    case "in-progress":
      return "bg-blue-100 text-blue-800"
    case "overdue":
      return "bg-red-100 text-red-800"
    default:
      return "bg-gray-100 text-gray-800"
  }
}

function getPriorityColor(priority: string) {
  switch (priority) {
    case "high":
      return "bg-red-100 text-red-800"
    case "medium":
      return "bg-yellow-100 text-yellow-800"
    case "low":
      return "bg-green-100 text-green-800"
    default:
      return "bg-gray-100 text-gray-800"
  }
}

export default function DashboardPage() {
  const [stats, setStats] = useState<QuickStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const { toast } = useToast()

  useEffect(() => {
    loadDashboardData()
  }, [])

  const loadDashboardData = async () => {
    try {
      setLoading(true)
      setError(null)

      const response = await apiService.getQuickStats()

      if (response.error) {
        throw new Error(response.error)
      }

      setStats(response.data)
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to load dashboard data"
      setError(errorMessage)
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleRetry = () => {
    loadDashboardData()
  }

  if (loading) {
    return (
      <AppLayout>
        <div className="space-y-6">
          <div>
            <Skeleton className="h-8 w-48 mb-2" />
            <Skeleton className="h-4 w-96" />
          </div>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <Card key={i}>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-4 w-4" />
                </CardHeader>
                <CardContent>
                  <Skeleton className="h-8 w-16 mb-2" />
                  <Skeleton className="h-3 w-32" />
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </AppLayout>
    )
  }

  if (error) {
    return (
      <AppLayout>
        <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
          <AlertCircle className="h-12 w-12 text-muted-foreground" />
          <div className="text-center">
            <h3 className="text-lg font-semibold">Could not load dashboard</h3>
            <p className="text-muted-foreground">{error}</p>
          </div>
          <Button onClick={handleRetry}>Try Again</Button>
        </div>
      </AppLayout>
    )
  }

  if (!stats) {
    return null
  }

  const completionRate = stats.totalTasks > 0 ? (stats.completedTasks / stats.totalTasks) * 100 : 0
  const inProgressTasks = stats.activeTasks
  const overdueTasks = Math.max(0, stats.totalTasks - stats.completedTasks - stats.activeTasks)

  return (
    <AppLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-serif font-bold text-balance">Dashboard</h1>
            <p className="text-muted-foreground">Welcome back! Here's what's happening with your tasks.</p>
          </div>
          <Button className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            New Task
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Tasks</CardTitle>
              <CheckSquare className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalTasks}</div>
              <p className="text-xs text-muted-foreground">{stats.completedTasks} completed this month</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">In Progress</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{inProgressTasks}</div>
              <p className="text-xs text-muted-foreground">{overdueTasks} overdue</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Projects</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.activeProjects}</div>
              <p className="text-xs text-muted-foreground">of {stats.totalProjects} total</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Team Members</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.teamMembers}</div>
              <p className="text-xs text-muted-foreground">Active collaborators</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          {/* Recent Tasks */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CheckSquare className="h-5 w-5" />
                Recent Tasks
              </CardTitle>
              <CardDescription>Your latest task activity</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {recentTasks.map((task) => (
                <div key={task.id} className="flex items-center justify-between space-x-4">
                  <div className="flex items-center space-x-3 flex-1 min-w-0">
                    {getStatusIcon(task.status)}
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{task.title}</p>
                      <p className="text-xs text-muted-foreground">{task.project}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge variant="outline" className={getPriorityColor(task.priority)}>
                      {task.priority}
                    </Badge>
                    <Badge variant="outline" className={getStatusColor(task.status)}>
                      {task.status}
                    </Badge>
                  </div>
                </div>
              ))}
              <Button variant="outline" className="w-full bg-transparent">
                View All Tasks
              </Button>
            </CardContent>
          </Card>

          {/* Active Projects */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                Active Projects
              </CardTitle>
              <CardDescription>Track your project progress</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {activeProjects.map((project) => (
                <div key={project.id} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <h4 className="text-sm font-medium">{project.name}</h4>
                    <span className="text-sm text-muted-foreground">{project.progress}%</span>
                  </div>
                  <Progress value={project.progress} className="h-2" />
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <span>
                      {project.tasksCompleted}/{project.totalTasks} tasks
                    </span>
                    <div className="flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      {project.dueDate}
                    </div>
                  </div>
                </div>
              ))}
              <Button variant="outline" className="w-full bg-transparent">
                View All Projects
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </AppLayout>
  )
}

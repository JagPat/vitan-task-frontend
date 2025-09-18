import { AppLayout } from "@/components/app-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { PageHeader } from "@/components/page-header"
import { EmptyState } from "@/components/empty-state"
import { Calendar, Users, CheckSquare, Clock, AlertTriangle } from "lucide-react"

// Mock projects data
const mockProjects = [
  {
    id: "1",
    name: "VitanTask v2.0",
    description: "Major platform update with new features and improved performance",
    progress: 75,
    status: "active",
    tasksCompleted: 12,
    totalTasks: 16,
    dueDate: "2024-02-01",
    priority: "high",
    team: [
      { id: "1", name: "John Doe", avatar: "/diverse-user-avatars.png" },
      { id: "2", name: "Sarah Wilson", avatar: "/diverse-user-avatars.png" },
      { id: "3", name: "Mike Johnson", avatar: "/diverse-user-avatars.png" },
    ],
    createdAt: "2024-01-01",
  },
  {
    id: "2",
    name: "UI Redesign",
    description: "Complete overhaul of the user interface with modern design principles",
    progress: 45,
    status: "active",
    tasksCompleted: 9,
    totalTasks: 20,
    dueDate: "2024-01-25",
    priority: "medium",
    team: [
      { id: "4", name: "Alice Brown", avatar: "/diverse-user-avatars.png" },
      { id: "5", name: "Bob Davis", avatar: "/diverse-user-avatars.png" },
    ],
    createdAt: "2024-01-05",
  },
  {
    id: "3",
    name: "Mobile App",
    description: "Native mobile application for iOS and Android platforms",
    progress: 20,
    status: "active",
    tasksCompleted: 3,
    totalTasks: 15,
    dueDate: "2024-03-15",
    priority: "medium",
    team: [
      { id: "6", name: "Charlie Green", avatar: "/diverse-user-avatars.png" },
      { id: "7", name: "Diana White", avatar: "/diverse-user-avatars.png" },
      { id: "8", name: "Eve Black", avatar: "/diverse-user-avatars.png" },
    ],
    createdAt: "2024-01-10",
  },
  {
    id: "4",
    name: "API Documentation",
    description: "Comprehensive documentation for all API endpoints",
    progress: 90,
    status: "completed",
    tasksCompleted: 18,
    totalTasks: 20,
    dueDate: "2024-01-20",
    priority: "low",
    team: [{ id: "9", name: "Frank Gray", avatar: "/diverse-user-avatars.png" }],
    createdAt: "2024-01-03",
  },
  {
    id: "5",
    name: "Security Audit",
    description: "Complete security review and vulnerability assessment",
    progress: 10,
    status: "on-hold",
    tasksCompleted: 1,
    totalTasks: 10,
    dueDate: "2024-02-15",
    priority: "high",
    team: [
      { id: "10", name: "Grace Blue", avatar: "/diverse-user-avatars.png" },
      { id: "11", name: "Henry Red", avatar: "/diverse-user-avatars.png" },
    ],
    createdAt: "2024-01-12",
  },
]

function getStatusColor(status: string) {
  switch (status) {
    case "active":
      return "bg-blue-100 text-blue-800"
    case "completed":
      return "bg-green-100 text-green-800"
    case "on-hold":
      return "bg-yellow-100 text-yellow-800"
    case "cancelled":
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

function getStatusIcon(status: string) {
  switch (status) {
    case "active":
      return <Clock className="h-4 w-4 text-blue-600" />
    case "completed":
      return <CheckSquare className="h-4 w-4 text-green-600" />
    case "on-hold":
      return <AlertTriangle className="h-4 w-4 text-yellow-600" />
    default:
      return <Clock className="h-4 w-4 text-gray-600" />
  }
}

export default function ProjectsPage() {
  const activeProjects = mockProjects.filter((p) => p.status === "active")
  const completedProjects = mockProjects.filter((p) => p.status === "completed")
  const otherProjects = mockProjects.filter((p) => !["active", "completed"].includes(p.status))

  return (
    <AppLayout>
      <div className="space-y-6">
        <PageHeader
          title="Projects"
          description="Manage your projects and track progress"
          action={{
            label: "New Project",
            onClick: () => {},
          }}
        />

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Projects</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{activeProjects.length}</div>
              <p className="text-xs text-muted-foreground">2 due this week</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Completed</CardTitle>
              <CheckSquare className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{completedProjects.length}</div>
              <p className="text-xs text-muted-foreground">This month</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Team Members</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">11</div>
              <p className="text-xs text-muted-foreground">Across all projects</p>
            </CardContent>
          </Card>
        </div>

        {/* Active Projects */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Active Projects</h2>
          {activeProjects.length === 0 ? (
            <EmptyState
              icon={Clock}
              title="No active projects"
              description="Create your first project to get started"
              action={{
                label: "New Project",
                onClick: () => {},
              }}
            />
          ) : (
            /* Improved responsive grid for project cards */
            <div className="grid gap-4 sm:gap-6 sm:grid-cols-2 xl:grid-cols-3">
              {activeProjects.map((project) => (
                <Card key={project.id} className="cursor-pointer hover:shadow-md transition-shadow">
                  <CardHeader className="space-y-2">
                    <div className="flex items-start justify-between">
                      <div className="space-y-1 flex-1 min-w-0">
                        <CardTitle className="text-lg truncate">{project.name}</CardTitle>
                        <div className="flex items-center gap-2 flex-wrap">
                          {getStatusIcon(project.status)}
                          <Badge variant="outline" className={getStatusColor(project.status)}>
                            {project.status}
                          </Badge>
                          <Badge variant="outline" className={getPriorityColor(project.priority)}>
                            {project.priority}
                          </Badge>
                        </div>
                      </div>
                    </div>
                    <CardDescription className="line-clamp-2">{project.description}</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {/* Progress */}
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span>Progress</span>
                        <span className="font-medium">{project.progress}%</span>
                      </div>
                      <Progress value={project.progress} className="h-2" />
                      <div className="flex items-center justify-between text-xs text-muted-foreground">
                        <span>
                          {project.tasksCompleted}/{project.totalTasks} tasks completed
                        </span>
                      </div>
                    </div>

                    {/* Team */}
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">Team</span>
                        <div className="flex -space-x-2">
                          {project.team.slice(0, 3).map((member) => (
                            <Avatar key={member.id} className="h-6 w-6 border-2 border-background">
                              <AvatarImage src={member.avatar || "/placeholder.svg"} alt={member.name} />
                              <AvatarFallback className="text-xs">
                                {member.name
                                  .split(" ")
                                  .map((n) => n[0])
                                  .join("")}
                              </AvatarFallback>
                            </Avatar>
                          ))}
                          {project.team.length > 3 && (
                            <div className="flex h-6 w-6 items-center justify-center rounded-full bg-muted border-2 border-background text-xs">
                              +{project.team.length - 3}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Due Date */}
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Calendar className="h-4 w-4" />
                      <span>Due {project.dueDate}</span>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>

        {/* Other Projects */}
        {(completedProjects.length > 0 || otherProjects.length > 0) && (
          <div className="space-y-4">
            <h2 className="text-xl font-semibold">Other Projects</h2>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {[...completedProjects, ...otherProjects].map((project) => (
                <Card key={project.id} className="cursor-pointer hover:shadow-md transition-shadow">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="space-y-1 flex-1 min-w-0">
                        <CardTitle className="text-base truncate">{project.name}</CardTitle>
                        <div className="flex items-center gap-2">
                          {getStatusIcon(project.status)}
                          <Badge variant="outline" className={getStatusColor(project.status)}>
                            {project.status}
                          </Badge>
                        </div>
                      </div>
                      <div className="text-right text-sm text-muted-foreground">{project.progress}%</div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        <span>{project.dueDate}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Users className="h-4 w-4 text-muted-foreground" />
                        <span>{project.team.length} members</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}
      </div>
    </AppLayout>
  )
}

"use client"

import { useState } from "react"
import { AppLayout } from "@/components/app-layout"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { PageHeader } from "@/components/page-header"
import { EmptyState } from "@/components/empty-state"
import { ResponsiveTable } from "@/components/responsive-table"
import {
  Search,
  Filter,
  MoreHorizontal,
  CheckCircle2,
  Clock,
  AlertCircle,
  CheckSquare,
  Calendar,
  User,
} from "lucide-react"

// Mock tasks data
const mockTasks = [
  {
    id: "1",
    title: "Update user authentication flow",
    description: "Implement new OAuth 2.0 flow with better security",
    status: "completed",
    priority: "high",
    assignee: "John Doe",
    project: "VitanTask v2.0",
    dueDate: "2024-01-15",
    createdAt: "2024-01-10",
  },
  {
    id: "2",
    title: "Design new dashboard layout",
    description: "Create wireframes and mockups for the new dashboard",
    status: "in-progress",
    priority: "medium",
    assignee: "Sarah Wilson",
    project: "UI Redesign",
    dueDate: "2024-01-18",
    createdAt: "2024-01-12",
  },
  {
    id: "3",
    title: "Fix mobile responsive issues",
    description: "Address layout problems on mobile devices",
    status: "open",
    priority: "high",
    assignee: "Mike Johnson",
    project: "Bug Fixes",
    dueDate: "2024-01-16",
    createdAt: "2024-01-13",
  },
  {
    id: "4",
    title: "Write API documentation",
    description: "Document all REST API endpoints",
    status: "overdue",
    priority: "low",
    assignee: "Alice Brown",
    project: "Documentation",
    dueDate: "2024-01-12",
    createdAt: "2024-01-08",
  },
  {
    id: "5",
    title: "Implement dark mode",
    description: "Add dark theme support across the application",
    status: "open",
    priority: "medium",
    assignee: "Bob Davis",
    project: "UI Redesign",
    dueDate: "2024-01-20",
    createdAt: "2024-01-14",
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
    case "closed":
      return "bg-gray-100 text-gray-800"
    default:
      return "bg-yellow-100 text-yellow-800"
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

export default function TasksPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [priorityFilter, setPriorityFilter] = useState("all")

  const filteredTasks = mockTasks.filter((task) => {
    const matchesSearch =
      task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      task.description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === "all" || task.status === statusFilter
    const matchesPriority = priorityFilter === "all" || task.priority === priorityFilter

    return matchesSearch && matchesStatus && matchesPriority
  })

  const tableColumns = [
    {
      key: "title",
      label: "Task",
      render: (value: string, task: any) => (
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            {getStatusIcon(task.status)}
            <span className="font-medium">{task.title}</span>
          </div>
          <p className="text-sm text-muted-foreground line-clamp-1">{task.description}</p>
          <p className="text-xs text-muted-foreground">{task.project}</p>
        </div>
      ),
      mobileRender: (value: string, task: any) => (
        <div className="space-y-1">
          <div className="font-medium">{task.title}</div>
          <p className="text-xs text-muted-foreground">{task.project}</p>
        </div>
      ),
    },
    {
      key: "status",
      label: "Status",
      render: (value: string) => (
        <Badge variant="outline" className={getStatusColor(value)}>
          {value.replace("-", " ")}
        </Badge>
      ),
    },
    {
      key: "priority",
      label: "Priority",
      render: (value: string) => (
        <Badge variant="outline" className={getPriorityColor(value)}>
          {value}
        </Badge>
      ),
    },
    {
      key: "assignee",
      label: "Assignee",
      render: (value: string) => (
        <div className="flex items-center gap-2">
          <User className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm">{value}</span>
        </div>
      ),
      hideOnMobile: true,
    },
    {
      key: "dueDate",
      label: "Due Date",
      render: (value: string) => (
        <div className="flex items-center gap-2">
          <Calendar className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm">{value}</span>
        </div>
      ),
      hideOnMobile: true,
    },
    {
      key: "actions",
      label: "",
      render: (value: any, task: any) => (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem>Edit Task</DropdownMenuItem>
            <DropdownMenuItem>Duplicate</DropdownMenuItem>
            <DropdownMenuItem>Mark Complete</DropdownMenuItem>
            <DropdownMenuItem className="text-destructive">Delete Task</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ),
    },
  ]

  return (
    <AppLayout>
      <div className="space-y-6">
        <PageHeader
          title="Tasks"
          description="Manage and track all your tasks"
          action={{
            label: "Create Task",
            onClick: () => {},
          }}
        />

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Filter className="h-5 w-5" />
              Filters
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col gap-4 sm:flex-row">
              <div className="relative flex-1">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search tasks..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-8"
                />
              </div>
              <div className="grid grid-cols-2 gap-2 sm:flex sm:gap-4">
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-full sm:w-[180px]">
                    <SelectValue placeholder="Filter by status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="open">Open</SelectItem>
                    <SelectItem value="in-progress">In Progress</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                    <SelectItem value="overdue">Overdue</SelectItem>
                    <SelectItem value="closed">Closed</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={priorityFilter} onValueChange={setPriorityFilter}>
                  <SelectTrigger className="w-full sm:w-[180px]">
                    <SelectValue placeholder="Filter by priority" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Priority</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="low">Low</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>All Tasks ({filteredTasks.length})</CardTitle>
            <CardDescription>
              {filteredTasks.length === 0 ? "No tasks found matching your filters" : "Click on a task to view details"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {filteredTasks.length === 0 ? (
              <EmptyState
                icon={CheckSquare}
                title="No tasks found"
                description={
                  searchTerm || statusFilter !== "all" || priorityFilter !== "all"
                    ? "Try adjusting your filters or search terms"
                    : "Get started by creating your first task"
                }
                action={{
                  label: "Create Task",
                  onClick: () => {},
                }}
              />
            ) : (
              <ResponsiveTable data={filteredTasks} columns={tableColumns} keyField="id" />
            )}
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  )
}

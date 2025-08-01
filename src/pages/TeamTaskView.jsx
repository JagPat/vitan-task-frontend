
import React, { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { Task } from "@/api/entities";
import { User } from "@/api/entities";
import { ActivityLog } from "@/api/entities";
import { createPageUrl } from "@/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  ArrowLeft, 
  User as UserIcon, 
  Calendar, 
  CheckCircle2, 
  Clock, 
  AlertTriangle,
  Phone,
  Mail,
  MapPin,
  Star,
  TrendingUp
} from "lucide-react";
import { format } from "date-fns";
import { Link } from "react-router-dom";

import TaskCard from "../components/tasks/TaskCard";

const priorityColors = {
  low: "bg-slate-100 text-slate-700",
  medium: "bg-blue-100 text-blue-700",
  high: "bg-amber-100 text-amber-700",
  urgent: "bg-red-100 text-red-700"
};

const statusColors = {
  pending: "bg-yellow-100 text-yellow-800",
  in_progress: "bg-blue-100 text-blue-800",
  completed: "bg-green-100 text-green-800",
  needs_approval: "bg-purple-100 text-purple-800",
  closed: "bg-gray-100 text-gray-800"
};

export default function TeamTaskView() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const userId = searchParams.get("userId");
  const userName = searchParams.get("userName");
  
  const [tasks, setTasks] = useState([]);
  const [user, setUser] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("all");
  const [debugInfo, setDebugInfo] = useState(null);

  useEffect(() => {
    if (userId) {
      loadUserTasks();
    }
  }, [userId]);

  const loadUserTasks = async () => {
    setLoading(true);
    try {
      // Step 1: Get user data with proper error handling
      const userData = await User.filter({ id: userId }).then(users => users?.[0] || null).catch(err => {
        console.error("Error fetching user:", err);
        return null;
      });
      
      const currentUserData = await User.me().catch(err => {
        console.error("Error fetching current user:", err);
        return null;
      });
      
      setUser(userData);
      setCurrentUser(currentUserData);

      // Step 2: Get ALL tasks first to debug
      const allTasks = await Task.list("-created_date").catch(err => {
        console.error("Error fetching all tasks:", err);
        return [];
      });
      
          // Processing tasks and user data

      if (userData) {
        // Step 3: Filter tasks manually first to debug
        const userTasksById = allTasks.filter(task => task.assigned_to === userData.id);
        const userTasksByPhone = userData.phone_number ? 
          allTasks.filter(task => task.assigned_to_phone === userData.phone_number) : [];
        
        // Processing user tasks
        
        // Combine and deduplicate
        const allUserTasks = [...userTasksById, ...userTasksByPhone];
        const uniqueTasks = allUserTasks.filter((task, index, self) => 
          index === self.findIndex(t => t.id === task.id)
        );
        
        // Final user tasks processed
        
        setTasks(uniqueTasks);
        setDebugInfo({
          userId: userData.id,
          userPhone: userData.phone_number,
          totalTasks: allTasks.length,
          tasksByUser: userTasksById.length,
          tasksByPhone: userTasksByPhone.length,
          finalTasks: uniqueTasks.length
        });
      } else {
        // No user found for ID
        setTasks([]);
        setDebugInfo({ error: "User not found" });
      }
    } catch (error) {
      console.error("Error loading user tasks:", error);
      setTasks([]);
      setDebugInfo({ error: error?.message || "Unknown error occurred" });
    } finally {
      setLoading(false);
    }
  };

  const getTaskStats = () => {
    const total = tasks.length;
    const pending = tasks.filter(t => t.status === 'pending').length;
    const inProgress = tasks.filter(t => t.status === 'in_progress').length;
    const completed = tasks.filter(t => ['completed', 'closed'].includes(t.status)).length;
    const overdue = tasks.filter(t => {
      if (!t.due_date) return false;
      return new Date(t.due_date) < new Date() && !['completed', 'closed'].includes(t.status);
    }).length;

    return { total, pending, inProgress, completed, overdue };
  };

  const getFilteredTasks = (filter) => {
    switch (filter) {
      case "pending":
        return tasks.filter(t => t.status === 'pending');
      case "in_progress":
        return tasks.filter(t => t.status === 'in_progress');
      case "completed":
        return tasks.filter(t => ['completed', 'closed'].includes(t.status));
      case "overdue":
        return tasks.filter(t => {
          if (!t.due_date) return false;
          return new Date(t.due_date) < new Date() && !['completed', 'closed'].includes(t.status);
        });
      default:
        return tasks;
    }
  };

  const stats = getTaskStats();

  if (loading) {
    return (
      <div className="p-4 lg:p-8 max-w-7xl mx-auto">
        <div className="animate-pulse space-y-6">
          <div className="h-10 bg-slate-200 rounded w-1/3"></div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-32 bg-slate-200 rounded-2xl"></div>
            ))}
          </div>
          <div className="h-96 bg-slate-200 rounded-2xl"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 lg:p-8 max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button
          variant="outline"
          size="icon"
          onClick={() => navigate(createPageUrl("Team"))}
          className="hover:bg-slate-100"
        >
          <ArrowLeft className="w-4 h-4" />
        </Button>
        <div>
          <h1 className="text-3xl font-bold text-slate-800">
            {userName || user?.full_name || 'Team Member'}'s Tasks
          </h1>
          <p className="text-slate-600">View and manage tasks assigned to this team member</p>
        </div>
      </div>

      {/* Debug Info - Remove this after fixing */}
      {debugInfo && (
        <Card className="border-orange-200 bg-orange-50">
          <CardContent className="p-4">
            <h3 className="font-semibold text-orange-800 mb-2">Debug Information:</h3>
            <pre className="text-sm text-orange-700">{JSON.stringify(debugInfo, null, 2)}</pre>
          </CardContent>
        </Card>
      )}

      {/* User Profile Card */}
      {user && (
        <Card className="border-0 shadow-lg">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <Avatar className="w-16 h-16">
                <AvatarFallback className="bg-gradient-to-br from-indigo-400 to-purple-500 text-white font-semibold text-xl">
                  {user.full_name?.charAt(0) || 'U'}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h2 className="text-2xl font-bold text-slate-800">{user.full_name}</h2>
                  <Badge variant="outline" className={user.role === 'admin' ? 'bg-purple-100 text-purple-700' : 'bg-blue-100 text-blue-700'}>
                    {user.role === 'admin' ? 'Administrator' : 'Team Member'}
                  </Badge>
                  {user.is_external && (
                    <Badge variant="outline" className="bg-amber-100 text-amber-700">
                      External
                    </Badge>
                  )}
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-slate-600">
                  <div className="flex items-center gap-2">
                    <Mail className="w-4 h-4" />
                    <span>{user.email}</span>
                  </div>
                  {user.phone_number && (
                    <div className="flex items-center gap-2">
                      <Phone className="w-4 h-4" />
                      <span>{user.phone_number}</span>
                    </div>
                  )}
                  {user.department && (
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4" />
                      <span>{user.department}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Task Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
        <Card className="border-0 shadow-lg">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600">Total Tasks</p>
                <p className="text-3xl font-bold text-slate-800">{stats.total}</p>
              </div>
              <div className="p-3 bg-blue-100 rounded-xl">
                <CheckCircle2 className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600">Pending</p>
                <p className="text-3xl font-bold text-amber-600">{stats.pending}</p>
              </div>
              <div className="p-3 bg-amber-100 rounded-xl">
                <Clock className="w-6 h-6 text-amber-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600">In Progress</p>
                <p className="text-3xl font-bold text-blue-600">{stats.inProgress}</p>
              </div>
              <div className="p-3 bg-blue-100 rounded-xl">
                <TrendingUp className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600">Completed</p>
                <p className="text-3xl font-bold text-green-600">{stats.completed}</p>
              </div>
              <div className="p-3 bg-green-100 rounded-xl">
                <CheckCircle2 className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600">Overdue</p>
                <p className="text-3xl font-bold text-red-600">{stats.overdue}</p>
              </div>
              <div className="p-3 bg-red-100 rounded-xl">
                <AlertTriangle className="w-6 h-6 text-red-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Performance Overview */}
      {stats.total > 0 && (
        <Card className="border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-slate-800">Performance Overview</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-slate-600">Completion Rate</span>
                <span className="text-sm font-medium text-slate-800">
                  {Math.round((stats.completed / stats.total) * 100)}%
                </span>
              </div>
              <Progress value={(stats.completed / stats.total) * 100} className="h-2" />
              
              {stats.overdue > 0 && (
                <div className="p-3 bg-red-50 rounded-lg border border-red-200">
                  <div className="flex items-center gap-2 text-red-700">
                    <AlertTriangle className="w-4 h-4" />
                    <span className="text-sm font-medium">
                      {stats.overdue} overdue task{stats.overdue > 1 ? 's' : ''} need attention
                    </span>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Tasks List */}
      <Card className="border-0 shadow-lg">
        <CardHeader>
          <CardTitle className="text-xl font-bold text-slate-800">Tasks</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-5 bg-slate-100 mb-6">
              <TabsTrigger value="all">All ({stats.total})</TabsTrigger>
              <TabsTrigger value="pending">Pending ({stats.pending})</TabsTrigger>
              <TabsTrigger value="in_progress">Active ({stats.inProgress})</TabsTrigger>
              <TabsTrigger value="completed">Done ({stats.completed})</TabsTrigger>
              <TabsTrigger value="overdue">Overdue ({stats.overdue})</TabsTrigger>
            </TabsList>
            
            <TabsContent value={activeTab}>
              <div className="space-y-4">
                {getFilteredTasks(activeTab).map((task) => (
                  <TaskCard key={task.id} task={task} />
                ))}
                
                {getFilteredTasks(activeTab).length === 0 && (
                  <div className="text-center py-12">
                    <CheckCircle2 className="w-12 h-12 text-slate-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-slate-600 mb-2">
                      No {activeTab === 'all' ? '' : activeTab.replace('_', ' ')} tasks found
                    </h3>
                    <p className="text-slate-500">
                      {activeTab === 'overdue' ? 'Great! No overdue tasks.' : 'This team member has no tasks in this category.'}
                    </p>
                  </div>
                )}
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}

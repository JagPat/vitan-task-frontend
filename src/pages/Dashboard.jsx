import React, { useState, useEffect } from "react";
import { Task } from "@/api/entities";
import { User } from "@/api/entities";
import { whatsTaskClient } from "@/api/whatsTaskClient";
import { ActivityLog } from "@/api/entities";
import { Link } from "react-router-dom";
import { createPageUrl, extractTaskPrimitives, extractUserPrimitives, extractActivityPrimitives } from "@/utils";
import { 
  CheckSquare, 
  Clock, 
  AlertTriangle, 
  Users, 
  TrendingUp,
  Calendar,
  BarChart3
} from "lucide-react";

import StatsOverview from "../components/dashboard/StatsOverview";
import TaskOverview from "../components/dashboard/TaskOverview";
import RecentActivity from "../components/dashboard/RecentActivity";
import TeamPerformance from "../components/dashboard/TeamPerformance";
import QuickActions from "../components/dashboard/QuickActions";
import ApiTest from "../components/ApiTest";
import { isOverdue } from "../utils/dateUtils";

export default function Dashboard() {
  const [tasks, setTasks] = useState([]);
  const [users, setUsers] = useState([]);
  const [activities, setActivities] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showApiTest, setShowApiTest] = useState(false);
  const [performance, setPerformance] = useState(null);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      const [tasksData, usersData, me, perf] = await Promise.all([
        Task.getAll(),
        User.getAll(),
        User.me().catch(() => null),
        whatsTaskClient.request('/api/analytics/performance').catch(() => ({ data: null }))
      ]);
      
      // Extract primitive values to prevent React error #130
      const cleanTasks = Array.isArray(tasksData) ? tasksData.map(task => extractTaskPrimitives(task)).filter(task => task !== null) : [];
      const cleanUsers = Array.isArray(usersData) ? usersData.map(user => extractUserPrimitives(user)).filter(user => user !== null) : [];
      
      setTasks(cleanTasks);
      setUsers(cleanUsers);
      setActivities([]);
      setCurrentUser(me || cleanUsers.find(u => u?.role === 'admin') || cleanUsers[0] || null);
      setPerformance(perf?.data || null);
    } catch (error) {
      console.error("Error loading dashboard data:", error);
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
      return isOverdue(t.due_date) && !['completed', 'closed'].includes(t.status);
    }).length;

    return { total, pending, inProgress, completed, overdue };
  };

  const stats = getTaskStats();

  if (loading) {
    return (
      <div className="p-6 space-y-6">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-slate-200 rounded w-1/4"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-32 bg-slate-200 rounded-2xl"></div>
            ))}
          </div>
          <div className="grid lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 h-96 bg-slate-200 rounded-2xl"></div>
            <div className="h-96 bg-slate-200 rounded-2xl"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 lg:p-8 space-y-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-3xl lg:text-4xl font-bold text-slate-800">
          Good {new Date().getHours() < 12 ? 'morning' : new Date().getHours() < 17 ? 'afternoon' : 'evening'}
          {currentUser?.full_name && `, ${currentUser.full_name.split(' ')[0]}`}
        </h1>
        <p className="text-slate-600 text-lg">
          Here's what's happening with your tasks today
        </p>
      </div>

      {/* API Test Toggle */}
      <div className="flex justify-end">
        <button
          onClick={() => setShowApiTest(!showApiTest)}
          className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
        >
          {showApiTest ? 'Hide' : 'Show'} API Test
        </button>
      </div>

      {/* API Test Component */}
      {showApiTest && <ApiTest />}

      {/* Stats Overview */}
      <StatsOverview stats={stats} />

      {/* Main Content Grid */}
      <div className="grid lg:grid-cols-3 gap-8">
        {/* Left Column */}
        <div className="lg:col-span-2 space-y-8">
          <TaskOverview tasks={tasks} />
          <RecentActivity activities={activities} />
        </div>

        {/* Right Column */}
        <div className="space-y-8">
          <QuickActions />
          <TeamPerformance users={users} tasks={tasks} />
        </div>
      </div>
    </div>
  );
}
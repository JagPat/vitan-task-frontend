import React, { useState, useEffect } from "react";
import { useQuery } from '@tanstack/react-query';
import { Task } from "@/api/entities";
import { User } from "@/api/entities";
import { subDays } from "date-fns";

import AnalyticsHeader from "../components/analytics/AnalyticsHeader";
import KeyMetrics from "../components/analytics/KeyMetrics";
import TasksOverTimeChart from "../components/analytics/TasksOverTimeChart";
import TaskStatusDistributionChart from "../components/analytics/TaskStatusDistributionChart";
import PriorityBreakdown from "../components/analytics/PriorityBreakdown";
import TeamPerformanceLeaderboard from "../components/analytics/TeamPerformanceLeaderboard";

export default function Analytics() {
  const [tasks, setTasks] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dateRange, setDateRange] = useState({
    from: subDays(new Date(), 30),
    to: new Date(),
  });

  const tasksQuery = useQuery({
    queryKey: ['analytics','tasks'],
    queryFn: () => Task.list("-created_date"),
    staleTime: 60_000
  });
  const usersQuery = useQuery({
    queryKey: ['analytics','users'],
    queryFn: () => User.list("-created_date"),
    staleTime: 60_000
  });
  useEffect(() => {
    setLoading(tasksQuery.isLoading || usersQuery.isLoading);
    if (tasksQuery.data) setTasks(tasksQuery.data);
    if (usersQuery.data) setUsers(usersQuery.data);
  }, [tasksQuery.isLoading, usersQuery.isLoading, tasksQuery.data, usersQuery.data]);

  const filteredTasks = tasks.filter(task => {
    const taskDate = new Date(task.created_date);
    return taskDate >= dateRange.from && taskDate <= dateRange.to;
  });

  if (loading) {
    return (
      <div className="p-4 lg:p-8 max-w-7xl mx-auto">
        <div className="animate-pulse space-y-6">
          <div className="h-10 bg-slate-200 rounded w-1/3"></div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => <div key={`analytics-skeleton-${i}`} className="h-32 bg-slate-200 rounded-2xl"></div>)}
          </div>
          <div className="grid lg:grid-cols-2 gap-6">
            <div className="h-96 bg-slate-200 rounded-2xl"></div>
            <div className="h-96 bg-slate-200 rounded-2xl"></div>
          </div>
          <div className="h-96 bg-slate-200 rounded-2xl"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 lg:p-8 max-w-7xl mx-auto space-y-8">
      <AnalyticsHeader dateRange={dateRange} setDateRange={setDateRange} />
      <KeyMetrics tasks={filteredTasks} />
      
      <div className="grid lg:grid-cols-5 gap-8">
        <div className="lg:col-span-3">
          <TasksOverTimeChart tasks={filteredTasks} />
        </div>
        <div className="lg:col-span-2">
          <TaskStatusDistributionChart tasks={filteredTasks} />
        </div>
      </div>

      <div className="grid lg:grid-cols-5 gap-8">
        <div className="lg:col-span-2">
           <PriorityBreakdown tasks={filteredTasks} />
        </div>
        <div className="lg:col-span-3">
          <TeamPerformanceLeaderboard tasks={filteredTasks} users={users} />
        </div>
      </div>
    </div>
  );
}
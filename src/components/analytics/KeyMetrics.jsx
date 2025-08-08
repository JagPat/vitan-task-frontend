import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  CheckCircle2,
  Clock,
  AlertTriangle,
  Zap
} from "lucide-react";
import { differenceInHours } from "date-fns";

export default function KeyMetrics({ tasks, performance }) {
  const completedTasks = tasks.filter(t => ['completed', 'closed'].includes(t.status));
  const totalTasks = tasks.length;
  const completionRate = totalTasks > 0 ? (completedTasks.length / totalTasks) * 100 : 0;
  
  const overdueTasks = tasks.filter(t => {
    if (!t.due_date) return false;
    return new Date(t.due_date) < new Date() && !['completed', 'closed'].includes(t.status);
  }).length;
  
  const completionTimes = completedTasks
    .map(t => differenceInHours(new Date(t.updated_date), new Date(t.created_date)))
    .filter(t => t > 0);
  
  const avgCompletionTime = completionTimes.length > 0
    ? (completionTimes.reduce((a, b) => a + b, 0) / completionTimes.length).toFixed(1)
    : 0;

  const perf = performance?.task_performance;
  const metrics = [
    {
      title: "Completion Rate",
      value: `${(perf?.completion_rate ?? completionRate).toFixed ? (perf?.completion_rate).toFixed(1) + '%' : `${completionRate.toFixed(1)}%`}`,
      icon: CheckCircle2,
      color: "from-green-500 to-emerald-500",
      subtitle: `${completedTasks.length} of ${totalTasks} tasks`
    },
    {
      title: "Avg. Completion Time",
      value: `${avgCompletionTime} hrs`,
      icon: Clock,
      color: "from-blue-500 to-sky-500",
      subtitle: "From creation to completion"
    },
    {
      title: "Overdue Tasks",
      value: overdueTasks,
      icon: AlertTriangle,
      color: "from-red-500 to-rose-500",
      subtitle: "Need immediate attention"
    },
    {
      title: "Total Tasks",
      value: totalTasks,
      icon: Zap,
      color: "from-purple-500 to-violet-500",
      subtitle: "In selected period"
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {metrics.map((metric, index) => (
        <Card key={index} className="relative overflow-hidden border-0 shadow-lg hover:shadow-xl transition-all duration-300 group">
          <div className={`absolute inset-0 bg-gradient-to-br ${metric.color} opacity-5 group-hover:opacity-10 transition-opacity duration-300`}></div>
          <CardContent className="p-6 relative">
            <div className="flex items-start justify-between">
              <div className="space-y-2">
                <p className="text-sm font-medium text-slate-600">{metric.title}</p>
                <p className="text-3xl font-bold text-slate-800">{metric.value}</p>
                <p className="text-xs text-slate-500">{metric.subtitle}</p>
              </div>
              <div className={`p-3 rounded-2xl bg-gradient-to-br ${metric.color} shadow-lg`}>
                <metric.icon className="w-6 h-6 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { 
  CheckSquare, 
  Clock, 
  AlertTriangle, 
  TrendingUp,
  Play,
  CheckCircle2
} from "lucide-react";

const StatCard = ({ title, value, icon: Icon, color, trend, subtitle }) => (
  <Card className="relative overflow-hidden border-0 shadow-lg hover:shadow-xl transition-all duration-300 group">
    <div className={`absolute inset-0 bg-gradient-to-br ${color} opacity-5 group-hover:opacity-10 transition-opacity duration-300`}></div>
    <CardContent className="p-6 relative">
      <div className="flex items-start justify-between">
        <div className="space-y-2">
          <p className="text-sm font-medium text-slate-600">{title}</p>
          <p className="text-3xl font-bold text-slate-800">{value}</p>
          {subtitle && (
            <p className="text-xs text-slate-500">{subtitle}</p>
          )}
        </div>
        <div className={`p-3 rounded-2xl bg-gradient-to-br ${color} shadow-lg`}>
          <Icon className="w-6 h-6 text-white" />
        </div>
      </div>
      {trend && (
        <div className="flex items-center mt-4 text-sm">
          <TrendingUp className="w-4 h-4 mr-1 text-emerald-500" />
          <span className="text-emerald-600 font-medium">{trend}</span>
        </div>
      )}
    </CardContent>
  </Card>
);

export default function StatsOverview({ stats, performance }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <StatCard
        title="Total Tasks"
        value={stats.total}
        icon={CheckSquare}
        color="from-blue-500 to-blue-600"
        trend="+12% this week"
        subtitle="All time"
      />
      <StatCard
        title="In Progress"
        value={stats.inProgress}
        icon={Play}
        color="from-amber-500 to-orange-500"
        subtitle="Active now"
      />
      <StatCard
        title="Completed"
        value={stats.completed}
        icon={CheckCircle2}
        color="from-emerald-500 to-green-600"
        trend={performance?.task_performance?.completion_rate !== undefined
          ? `${performance.task_performance.completion_rate}% completion`
          : undefined}
        subtitle="This month"
      />
      <StatCard
        title="Overdue"
        value={stats.overdue}
        icon={AlertTriangle}
        color="from-red-500 to-pink-600"
        subtitle={stats.overdue > 0 ? "Needs attention" : "All caught up!"}
      />
    </div>
  );
}
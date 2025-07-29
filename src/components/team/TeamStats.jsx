import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { 
  Users, 
  Shield, 
  UserCheck, 
  ExternalLink,
  TrendingUp,
  CheckCircle2
} from "lucide-react";

const StatCard = ({ title, value, icon: Icon, color, subtitle, trend }) => (
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

export default function TeamStats({ stats, tasks }) {
  const activeTasks = tasks.filter(t => ['pending', 'in_progress'].includes(t.status)).length;
  const completedTasks = tasks.filter(t => ['completed', 'closed'].includes(t.status)).length;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <StatCard
        title="Total Members"
        value={stats.total}
        icon={Users}
        color="from-blue-500 to-blue-600"
        subtitle="Active team size"
        trend="+2 this month"
      />
      <StatCard
        title="Administrators"
        value={stats.admin}
        icon={Shield}
        color="from-purple-500 to-purple-600"
        subtitle="Full access"
      />
      <StatCard
        title="Team Members"
        value={stats.user}
        icon={UserCheck}
        color="from-green-500 to-green-600"
        subtitle="Standard access"
      />
      <StatCard
        title="External Users"
        value={stats.external}
        icon={ExternalLink}
        color="from-amber-500 to-orange-500"
        subtitle="Contractors & vendors"
      />
    </div>
  );
}
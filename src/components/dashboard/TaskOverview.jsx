import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { format } from "date-fns";
import { 
  Clock, 
  User, 
  Calendar,
  ArrowRight,
  AlertCircle,
  CheckCircle2,
  Play
} from "lucide-react";
import { isOverdue, formatDate } from '../../utils/dateUtils';

const priorityColors = {
  low: "bg-slate-100 text-slate-700 border-slate-200",
  medium: "bg-blue-100 text-blue-700 border-blue-200",
  high: "bg-amber-100 text-amber-700 border-amber-200",
  urgent: "bg-red-100 text-red-700 border-red-200"
};

const statusIcons = {
  pending: <Clock className="w-4 h-4" />,
  in_progress: <Play className="w-4 h-4" />,
  completed: <CheckCircle2 className="w-4 h-4" />,
  needs_approval: <AlertCircle className="w-4 h-4" />,
  closed: <CheckCircle2 className="w-4 h-4" />
};

const TaskCard = ({ task }) => {
  const taskIsOverdue = task.due_date && isOverdue(task.due_date) && !['completed', 'closed'].includes(task.status);
  
  return (
    <div className={`p-4 rounded-xl border transition-all duration-200 hover:shadow-md ${
      taskIsOverdue ? 'border-red-200 bg-red-50' : 'border-slate-200 bg-white hover:border-slate-300'
    }`}>
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-2">
          {statusIcons[task.status]}
          <h3 className="font-semibold text-slate-800 line-clamp-1">{task.title}</h3>
        </div>
        <Badge variant="outline" className={priorityColors[task.priority]}>
          {task.priority}
        </Badge>
      </div>
      
      <p className="text-sm text-slate-600 mb-3 line-clamp-2">{task.description}</p>
      
      <div className="flex items-center justify-between text-xs text-slate-500">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1">
            <User className="w-3 h-3" />
            <span>{task.assigned_to_name || 'Unassigned'}</span>
          </div>
          {task.due_date && (
            <div className={`flex items-center gap-1 ${taskIsOverdue ? 'text-red-600' : ''}`}>
              <Calendar className="w-3 h-3" />
              <span>{formatDate(task.due_date, 'toLocaleDateString', 'Invalid date')}</span>
            </div>
          )}
        </div>
        <Link 
          to={createPageUrl(`TaskDetails?id=${task.id}`)}
          className="text-indigo-600 hover:text-indigo-700 flex items-center gap-1 transition-colors"
        >
          View <ArrowRight className="w-3 h-3" />
        </Link>
      </div>
    </div>
  );
};

export default function TaskOverview({ tasks }) {
  const [activeTab, setActiveTab] = useState("all");

  const getFilteredTasks = (filter) => {
    switch (filter) {
      case "pending":
        return tasks.filter(t => t.status === 'pending');
      case "in_progress":
        return tasks.filter(t => t.status === 'in_progress');
      case "overdue":
        return tasks.filter(t => {
          if (!t.due_date) return false;
          return isOverdue(t.due_date) && !['completed', 'closed'].includes(t.status);
        });
      default:
        return tasks.slice(0, 12);
    }
  };

  return (
    <Card className="border-0 shadow-xl">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="text-xl font-bold text-slate-800">Task Overview</CardTitle>
          <Link to={createPageUrl("MyTasks")}>
            <Button variant="outline" size="sm" className="hover:bg-slate-50">
              View All
            </Button>
          </Link>
        </div>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
          <TabsList className="grid w-full grid-cols-4 bg-slate-100">
            <TabsTrigger value="all" className="data-[state=active]:bg-white">All</TabsTrigger>
            <TabsTrigger value="pending" className="data-[state=active]:bg-white">Pending</TabsTrigger>
            <TabsTrigger value="in_progress" className="data-[state=active]:bg-white">Active</TabsTrigger>
            <TabsTrigger value="overdue" className="data-[state=active]:bg-white">Overdue</TabsTrigger>
          </TabsList>
          
          <TabsContent value={activeTab} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {getFilteredTasks(activeTab).map((task) => (
                <TaskCard key={task.id} task={task} />
              ))}
            </div>
            {getFilteredTasks(activeTab).length === 0 && (
              <div className="text-center py-12">
                <CheckCircle2 className="w-12 h-12 text-slate-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-slate-600 mb-2">No tasks found</h3>
                <p className="text-slate-500">
                  {activeTab === "overdue" ? "Great! No overdue tasks." : "No tasks in this category."}
                </p>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
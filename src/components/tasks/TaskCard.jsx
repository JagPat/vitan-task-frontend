import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { formatDistanceToNow, format } from 'date-fns';
import { 
  User, 
  Calendar,
  ArrowRight,
  AlertTriangle,
  Flag,
  CheckSquare
} from "lucide-react";

const priorityMap = {
  low: { label: 'Low', color: 'bg-slate-100 text-slate-700 border-slate-200', icon: <Flag className="w-3 h-3" /> },
  medium: { label: 'Medium', color: 'bg-blue-100 text-blue-700 border-blue-200', icon: <Flag className="w-3 h-3" /> },
  high: { label: 'High', color: 'bg-amber-100 text-amber-700 border-amber-200', icon: <Flag className="w-3 h-3" /> },
  urgent: { label: 'Urgent', color: 'bg-red-100 text-red-700 border-red-200', icon: <AlertTriangle className="w-3 h-3" /> },
};

const statusMap = {
    pending: { label: 'Pending', color: 'bg-slate-100 text-slate-600' },
    in_progress: { label: 'In Progress', color: 'bg-blue-100 text-blue-600' },
    completed: { label: 'Completed', color: 'bg-green-100 text-green-600' },
    needs_approval: { label: 'Needs Approval', color: 'bg-amber-100 text-amber-600' },
    closed: { label: 'Closed', color: 'bg-emerald-100 text-emerald-600' },
    overdue: { label: 'Overdue', color: 'bg-red-100 text-red-600' },
};


export default function TaskCard({ task }) {
  const isOverdue = task.due_date && new Date(task.due_date) < new Date() && !['completed', 'closed'].includes(task.status);
  const priority = priorityMap[task.priority] || priorityMap.medium;
  const status = statusMap[task.status] || statusMap.pending;

  return (
    <Card className="hover:shadow-md transition-shadow duration-200 border-slate-200">
      <CardContent className="p-4 flex flex-col md:flex-row md:items-center gap-4">
        <div className="flex-1 space-y-2">
          <Link to={createPageUrl(`TaskDetails?id=${task.id}`)} className="group">
            <h3 className="font-semibold text-slate-800 group-hover:text-indigo-600 transition-colors">
              {task.title}
            </h3>
          </Link>
          <p className="text-sm text-slate-600 line-clamp-1">{task.description}</p>
        </div>
        
        <div className="flex flex-wrap items-center gap-4 text-sm text-slate-500">
          {task.checklist && task.checklist.length > 0 && (
            <div className="flex items-center gap-2">
              <CheckSquare className="w-4 h-4" />
              <span>{task.checklist.filter(i => i.completed).length}/{task.checklist.length}</span>
            </div>
          )}

          <Badge variant="outline" className={`${priority.color} gap-1.5`}>
            {priority.icon}
            {priority.label}
          </Badge>
          
          <Badge className={`${status.color}`}>
            {status.label}
          </Badge>

          {task.due_date && (
            <div className={`flex items-center gap-2 ${isOverdue ? 'text-red-600 font-medium' : ''}`}>
              <Calendar className="w-4 h-4" />
              <span>{format(new Date(task.due_date), 'MMM d, yyyy')}</span>
            </div>
          )}
          
          <Link 
            to={createPageUrl(`TaskDetails?id=${task.id}`)}
            className="text-indigo-600 hover:underline flex items-center gap-1 transition-all"
          >
            Details <ArrowRight className="w-3 h-3" />
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}
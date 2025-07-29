import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { 
  CheckCircle2, 
  UserPlus, 
  MessageSquare, 
  Clock,
  AlertTriangle,
  FileText
} from "lucide-react";

const activityIcons = {
  created: <FileText className="w-4 h-4" />,
  assigned: <UserPlus className="w-4 h-4" />,
  status_changed: <Clock className="w-4 h-4" />,
  completed: <CheckCircle2 className="w-4 h-4" />,
  approved: <CheckCircle2 className="w-4 h-4" />,
  commented: <MessageSquare className="w-4 h-4" />
};

const activityColors = {
  created: "bg-blue-100 text-blue-600",
  assigned: "bg-purple-100 text-purple-600",
  status_changed: "bg-amber-100 text-amber-600",
  completed: "bg-green-100 text-green-600",
  approved: "bg-emerald-100 text-emerald-600",
  commented: "bg-slate-100 text-slate-600"
};

export default function RecentActivity({ activities }) {
  const formatActivityMessage = (activity) => {
    switch (activity.action) {
      case 'created':
        return `created a new task`;
      case 'assigned':
        return `assigned task to ${activity.new_value}`;
      case 'status_changed':
        return `changed status from ${activity.old_value} to ${activity.new_value}`;
      case 'completed':
        return `marked task as completed`;
      case 'approved':
        return `approved task completion`;
      case 'commented':
        return `added a comment`;
      default:
        return activity.action;
    }
  };

  return (
    <Card className="border-0 shadow-xl">
      <CardHeader>
        <CardTitle className="text-xl font-bold text-slate-800">Recent Activity</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {activities.length === 0 ? (
          <div className="text-center py-8">
            <Clock className="w-12 h-12 text-slate-400 mx-auto mb-4" />
            <p className="text-slate-500">No recent activity</p>
          </div>
        ) : (
          activities.slice(0, 8).map((activity) => (
            <div key={activity.id} className="flex items-start gap-3 p-3 rounded-lg hover:bg-slate-50 transition-colors">
              <div className={`p-2 rounded-full ${activityColors[activity.action]}`}>
                {activityIcons[activity.action] || <FileText className="w-4 h-4" />}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm text-slate-800">
                  <span className="font-medium">{activity.performed_by_name || 'User'}</span>
                  {' '}
                  {formatActivityMessage(activity)}
                </p>
                {activity.notes && (
                  <p className="text-xs text-slate-500 mt-1">{activity.notes}</p>
                )}
                <p className="text-xs text-slate-400 mt-1">
                  {format(new Date(activity.created_date), 'MMM d, h:mm a')}
                </p>
              </div>
              {activity.whatsapp_message_sent && (
                <Badge variant="secondary" className="bg-green-100 text-green-700 text-xs">
                  WhatsApp
                </Badge>
              )}
            </div>
          ))
        )}
      </CardContent>
    </Card>
  );
}
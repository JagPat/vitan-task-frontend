import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { 
  FileText, 
  UserPlus, 
  Clock, 
  CheckCircle2, 
  Edit,
  MessageSquare,
  AlertTriangle
} from "lucide-react";

const activityIcons = {
  created: <FileText className="w-4 h-4" />,
  assigned: <UserPlus className="w-4 h-4" />,
  reassigned: <UserPlus className="w-4 h-4" />,
  updated: <Edit className="w-4 h-4" />,
  completed: <CheckCircle2 className="w-4 h-4" />,
  commented: <MessageSquare className="w-4 h-4" />
};

const activityColors = {
  created: "bg-blue-100 text-blue-600",
  assigned: "bg-purple-100 text-purple-600",
  reassigned: "bg-purple-100 text-purple-600",
  updated: "bg-amber-100 text-amber-600",
  completed: "bg-green-100 text-green-600",
  commented: "bg-slate-100 text-slate-600"
};

export default function TaskHistory({ activities }) {
  const formatActivityMessage = (activity) => {
    switch (activity.action) {
      case 'created':
        return 'created the task';
      case 'assigned':
        return `assigned task to ${activity.new_value}`;
      case 'reassigned':
        return `reassigned task from ${activity.old_value} to ${activity.new_value}`;
      case 'updated':
        return 'updated task details';
      case 'completed':
        return 'marked task as completed';
      case 'commented':
        return 'added a comment';
      default:
        return activity.action;
    }
  };

  return (
    <Card className="border-0 shadow-lg">
      <CardHeader>
        <CardTitle>Activity History</CardTitle>
      </CardHeader>
      <CardContent>
        {activities.length === 0 ? (
          <div className="text-center py-8">
            <Clock className="w-12 h-12 text-slate-400 mx-auto mb-4" />
            <p className="text-slate-500">No activity yet</p>
          </div>
        ) : (
          <div className="space-y-4">
            {activities.map((activity) => (
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
                  <div className="flex items-center gap-2 mt-1">
                    <p className="text-xs text-slate-400">
                      {format(new Date(activity.created_date), 'MMM d, h:mm a')}
                    </p>
                    {activity.whatsapp_message_sent && (
                      <Badge variant="secondary" className="bg-green-100 text-green-700 text-xs">
                        WhatsApp Sent
                      </Badge>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
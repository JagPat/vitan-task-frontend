
import React from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import {
  Mail,
  Phone,
  MapPin,
  Calendar,
  CheckCircle2,
  Clock,
  Star,
  Shield,
  User as UserIcon,
  ExternalLink,
  Trash2
} from "lucide-react";
import { format } from "date-fns";
import { Link } from 'react-router-dom';
import { createPageUrl } from "@/utils";

const getRoleIcon = (role, isExternal) => {
  if (role === 'admin') return <Shield className="w-3 h-3" />;
  if (isExternal) return <ExternalLink className="w-3 h-3" />;
  return <UserIcon className="w-3 h-3" />;
};

const getRoleColor = (role, isExternal) => {
  if (role === 'admin') return 'bg-purple-100 text-purple-700 border-purple-200';
  if (isExternal) return 'bg-amber-100 text-amber-700 border-amber-200';
  return 'bg-blue-100 text-blue-700 border-blue-200';
};

export default function TeamMemberCard({ member, currentUser, onManageUser, onDeleteUser }) {
  const isTopPerformer = member.completionRate > 90 && member.totalTasks > 5;

  return (
    <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 group">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="relative">
              <Avatar className="w-12 h-12">
                <AvatarFallback className="bg-gradient-to-br from-indigo-400 to-purple-500 text-white font-semibold text-lg">
                  {member.full_name?.charAt(0) || 'U'}
                </AvatarFallback>
              </Avatar>
              {isTopPerformer && (
                <div className="absolute -top-1 -right-1 w-6 h-6 bg-yellow-400 rounded-full flex items-center justify-center shadow-md">
                  <Star className="w-3 h-3 text-yellow-800" />
                </div>
              )}
              {member.whatsapp_verified && (
                <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-green-500 rounded-full flex items-center justify-center">
                  <CheckCircle2 className="w-3 h-3 text-white" />
                </div>
              )}
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-slate-800 truncate">
                {member.full_name || 'User'}
              </h3>
              <p className="text-sm text-slate-500 truncate">{member.position || 'Team Member'}</p>
            </div>
          </div>
          <Badge variant="outline" className={getRoleColor(member.role, member.is_external)}>
            {getRoleIcon(member.role, member.is_external)}
            {member.is_external ? 'External' : (member.role === 'admin' ? 'Admin' : 'Member')}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Contact Info */}
        <div className="space-y-2 text-sm">
          <div className="flex items-center gap-2 text-slate-600">
            <Mail className="w-4 h-4" />
            <span className="truncate">{member.email}</span>
          </div>
          {member.phone_number && (
            <div className="flex items-center gap-2 text-slate-600">
              <Phone className="w-4 h-4" />
              <span>{member.phone_number}</span>
            </div>
          )}
          {member.department && (
            <div className="flex items-center gap-2 text-slate-600">
              <MapPin className="w-4 h-4" />
              <span>{member.department}</span>
            </div>
          )}
        </div>

        {/* Performance Stats */}
        <div className="space-y-3">
          <div className="flex items-center justify-between text-sm">
            <span className="text-slate-600">Task Completion</span>
            <span className="font-medium">{Math.round(member.completionRate)}%</span>
          </div>
          <Progress value={member.completionRate} className="h-2" />

          <div className="grid grid-cols-3 gap-2 text-center">
            <div className="p-2 bg-slate-50 rounded-lg">
              <div className="text-lg font-bold text-slate-800">{member.totalTasks}</div>
              <div className="text-xs text-slate-500">Total</div>
            </div>
            <div className="p-2 bg-green-50 rounded-lg">
              <div className="text-lg font-bold text-green-600">{member.completedTasks}</div>
              <div className="text-xs text-slate-500">Done</div>
            </div>
            <div className="p-2 bg-red-50 rounded-lg">
              <div className="text-lg font-bold text-red-600">{member.overdueTasks}</div>
              <div className="text-xs text-slate-500">Overdue</div>
            </div>
          </div>
        </div>

        {/* Last Activity */}
        <div className="pt-3 border-t border-slate-100">
          <div className="flex items-center gap-2 text-xs text-slate-500">
            <Calendar className="w-3 h-3" />
            <span>
              Joined {member.created_date ? format(new Date(member.created_date), 'MMM yyyy') : 'Recently'}
            </span>
          </div>
          {member.last_activity && (
            <div className="flex items-center gap-2 text-xs text-slate-500 mt-1">
              <Clock className="w-3 h-3" />
              <span>
                Last active {(() => {
                  try {
                    return format(new Date(member.last_activity), 'MMM d, yyyy');
                  } catch (error) {
                    return 'Recently';
                  }
                })()}
              </span>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2">
          <Link to={createPageUrl(`TeamTaskView?userId=${member.id}&userName=${encodeURIComponent(member.full_name || 'User')}`)} className="flex-1">
            <Button variant="outline" size="sm" className="w-full hover:bg-slate-50">
              View Tasks
            </Button>
          </Link>
          {currentUser?.role === 'admin' && (
            <>
              <Button
                variant="outline"
                size="sm"
                className="flex-1 hover:bg-slate-50"
                onClick={() => onManageUser(member)}
              >
                Manage User
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="hover:bg-red-50 hover:text-red-600 hover:border-red-200"
                onClick={() => onDeleteUser(member)}
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

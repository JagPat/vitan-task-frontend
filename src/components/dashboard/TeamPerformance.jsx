import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Users, TrendingUp, Star } from "lucide-react";

export default function TeamPerformance({ users, tasks }) {
  const getTeamStats = () => {
    return users.map(user => {
      const userTasks = tasks.filter(t => t.assigned_to === user.id);
      const completedTasks = userTasks.filter(t => ['completed', 'closed'].includes(t.status));
      const completionRate = userTasks.length > 0 ? (completedTasks.length / userTasks.length) * 100 : 0;
      
      return {
        ...user,
        totalTasks: userTasks.length,
        completedTasks: completedTasks.length,
        completionRate
      };
    }).sort((a, b) => b.completionRate - a.completionRate);
  };

  const teamStats = getTeamStats();

  return (
    <Card className="border-0 shadow-xl">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-xl font-bold text-slate-800 flex items-center gap-2">
            <Users className="w-5 h-5" />
            Team Performance
          </CardTitle>
          <Badge variant="secondary" className="bg-blue-100 text-blue-700">
            {users.length} Members
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {teamStats.length === 0 ? (
          <div className="text-center py-8">
            <Users className="w-12 h-12 text-slate-400 mx-auto mb-4" />
            <p className="text-slate-500">No team members found</p>
          </div>
        ) : (
          teamStats.slice(0, 6).map((member, index) => (
            <div key={member.id} className="flex items-center gap-4 p-3 rounded-lg hover:bg-slate-50 transition-colors">
              <div className="relative">
                <Avatar className="w-10 h-10">
                  <AvatarFallback className="bg-gradient-to-br from-indigo-400 to-purple-500 text-white font-semibold">
                    {member.full_name?.charAt(0) || 'U'}
                  </AvatarFallback>
                </Avatar>
                {index === 0 && member.completionRate > 80 && (
                  <div className="absolute -top-1 -right-1 w-5 h-5 bg-yellow-400 rounded-full flex items-center justify-center">
                    <Star className="w-3 h-3 text-yellow-800" />
                  </div>
                )}
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-1">
                  <p className="font-medium text-slate-800 truncate">
                    {member.full_name || 'User'}
                  </p>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-slate-600">
                      {member.completedTasks}/{member.totalTasks}
                    </span>
                    {member.completionRate > 90 && (
                      <TrendingUp className="w-4 h-4 text-green-500" />
                    )}
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  <Progress 
                    value={member.completionRate} 
                    className="h-2 flex-1"
                  />
                  <span className="text-sm font-medium text-slate-700 min-w-12">
                    {Math.round(member.completionRate)}%
                  </span>
                </div>
                
                <div className="flex items-center gap-2 mt-1">
                  <Badge variant="outline" className="text-xs">
                    {member.role || 'Member'}
                  </Badge>
                  {member.department && (
                    <span className="text-xs text-slate-500">{member.department}</span>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </CardContent>
    </Card>
  );
}
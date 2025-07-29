import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Progress } from '@/components/ui/progress';
import { Star } from 'lucide-react';

export default function TeamPerformanceLeaderboard({ tasks, users }) {
  const leaderboardData = users
    .map(user => {
      const userTasks = tasks.filter(t => t.assigned_to === user.id);
      const completedCount = userTasks.filter(t => ['completed', 'closed'].includes(t.status)).length;
      return {
        id: user.id,
        name: user.full_name,
        totalTasks: userTasks.length,
        completedTasks: completedCount,
        completionRate: userTasks.length > 0 ? (completedCount / userTasks.length) * 100 : 0
      };
    })
    .filter(u => u.totalTasks > 0)
    .sort((a, b) => b.completionRate - a.completionRate || b.completedTasks - a.completedTasks)
    .slice(0, 5);

  return (
    <Card className="border-0 shadow-xl h-full">
      <CardHeader>
        <CardTitle>Team Leaderboard</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Rank</TableHead>
              <TableHead>Member</TableHead>
              <TableHead>Completed</TableHead>
              <TableHead>Completion Rate</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {leaderboardData.map((user, index) => (
              <TableRow key={user.id}>
                <TableCell className="font-medium">
                  <div className="flex items-center gap-2">
                    #{index + 1}
                    {index === 0 && <Star className="w-4 h-4 text-yellow-500" />}
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Avatar className="h-8 w-8">
                      <AvatarFallback>{user.name?.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <span>{user.name}</span>
                  </div>
                </TableCell>
                <TableCell>{user.completedTasks}/{user.totalTasks}</TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Progress value={user.completionRate} className="w-24 h-2" />
                    <span>{user.completionRate.toFixed(0)}%</span>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
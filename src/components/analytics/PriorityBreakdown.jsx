import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ResponsiveContainer, BarChart, CartesianGrid, XAxis, YAxis, Tooltip, Legend, Bar } from 'recharts';

export default function PriorityBreakdown({ tasks }) {
  const priorityCounts = tasks.reduce((acc, task) => {
    const priority = task.priority || 'medium';
    acc[priority] = (acc[priority] || 0) + 1;
    return acc;
  }, {});

  const data = [
    { name: 'Urgent', tasks: priorityCounts.urgent || 0 },
    { name: 'High', tasks: priorityCounts.high || 0 },
    { name: 'Medium', tasks: priorityCounts.medium || 0 },
    { name: 'Low', tasks: priorityCounts.low || 0 },
  ];

  return (
    <Card className="border-0 shadow-xl h-full">
      <CardHeader>
        <CardTitle>Task Priority Breakdown</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart
            layout="vertical"
            data={data}
            margin={{ top: 5, right: 20, left: 10, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
            <XAxis type="number" stroke="#64748b" fontSize={12} allowDecimals={false} />
            <YAxis type="category" dataKey="name" stroke="#64748b" fontSize={12} />
            <Tooltip />
            <Bar dataKey="tasks" fill="#8884d8" name="Number of Tasks" />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
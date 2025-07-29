import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip, Legend } from 'recharts';

const COLORS = {
  pending: '#a8a29e',
  in_progress: '#3b82f6',
  needs_approval: '#f59e0b',
  completed: '#22c55e',
  closed: '#10b981',
  overdue: '#ef4444'
};
const RADIAN = Math.PI / 180;
const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent, index }) => {
  const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);

  return (
    <text x={x} y={y} fill="white" textAnchor={x > cx ? 'start' : 'end'} dominantBaseline="central">
      {`${(percent * 100).toFixed(0)}%`}
    </text>
  );
};
export default function TaskStatusDistributionChart({ tasks }) {
  const statusCounts = tasks.reduce((acc, task) => {
    const status = task.status || 'pending';
    acc[status] = (acc[status] || 0) + 1;
    return acc;
  }, {});

  const data = Object.keys(statusCounts).map(status => ({
    name: status.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase()),
    value: statusCounts[status],
    color: COLORS[status] || '#71717a'
  }));

  return (
    <Card className="border-0 shadow-xl h-full">
      <CardHeader>
        <CardTitle>Task Status Distribution</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={renderCustomizedLabel}
              outerRadius={100}
              fill="#8884d8"
              dataKey="value"
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip />
            <Legend layout="vertical" align="right" verticalAlign="middle" />
          </PieChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
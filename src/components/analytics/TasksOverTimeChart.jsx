import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ResponsiveContainer, LineChart, CartesianGrid, XAxis, YAxis, Tooltip, Legend, Line } from 'recharts';
import { format, eachDayOfInterval } from 'date-fns';

export default function TasksOverTimeChart({ tasks }) {
  const getChartData = () => {
    if (tasks.length === 0) return [];
    
    const sortedTasks = tasks.sort((a, b) => new Date(a.created_date) - new Date(b.created_date));
    const startDate = new Date(sortedTasks[0].created_date);
    const endDate = new Date();
    const interval = eachDayOfInterval({ start: startDate, end: endDate });

    return interval.map(day => {
      const formattedDate = format(day, 'MMM d');
      const createdOnDay = tasks.filter(t => format(new Date(t.created_date), 'yyyy-MM-dd') === format(day, 'yyyy-MM-dd')).length;
      const completedOnDay = tasks.filter(t => 
        ['completed', 'closed'].includes(t.status) && 
        format(new Date(t.updated_date), 'yyyy-MM-dd') === format(day, 'yyyy-MM-dd')
      ).length;
      return { date: formattedDate, created: createdOnDay, completed: completedOnDay };
    }).reduce((acc, curr) => {
        // Aggregate by date
        const existing = acc.find(item => item.date === curr.date);
        if (existing) {
            existing.created += curr.created;
            existing.completed += curr.completed;
        } else {
            acc.push(curr);
        }
        return acc;
    }, []);
  };

  const data = getChartData();
  
  return (
    <Card className="border-0 shadow-xl h-full">
      <CardHeader>
        <CardTitle>Tasks Over Time</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={data} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
            <XAxis dataKey="date" stroke="#64748b" fontSize={12} />
            <YAxis stroke="#64748b" fontSize={12} allowDecimals={false} />
            <Tooltip
              contentStyle={{
                backgroundColor: 'rgba(255, 255, 255, 0.8)',
                backdropFilter: 'blur(5px)',
                border: '1px solid #e0e0e0',
                borderRadius: '0.5rem',
              }}
            />
            <Legend />
            <Line type="monotone" dataKey="created" stroke="#8884d8" strokeWidth={2} name="Created Tasks" />
            <Line type="monotone" dataKey="completed" stroke="#82ca9d" strokeWidth={2} name="Completed Tasks" />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
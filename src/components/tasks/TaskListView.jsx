import React from 'react';
import UnifiedTaskCard from '@/components/tasks/UnifiedTaskCard';

export default function TaskListView({ tasks, onDelete }) {
  if (tasks.length === 0) {
    return (
      <div className="text-center py-16">
        <h3 className="text-xl font-medium text-slate-700">No tasks found</h3>
        <p className="text-slate-500 mt-2">Try adjusting your filters or create a new task.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {tasks.map((task) => (
        <UnifiedTaskCard key={task.id} task={task} showActions={false} compact />
      ))}
    </div>
  );
}
import React, { useState } from 'react';
import { Task } from '../api';

interface TaskCardProps {
  task: Task;
  onStatusChange: (id: string, status: Task['status']) => void;
  onEdit: (task: Task) => void;
  onDelete: (id: string) => void;
}

const statusColors = {
  pending: 'bg-yellow-100 text-yellow-800',
  in_progress: 'bg-blue-100 text-blue-800',
  completed: 'bg-green-100 text-green-800',
  cancelled: 'bg-red-100 text-red-800',
};

const statusLabels = {
  pending: 'Pending',
  in_progress: 'In Progress',
  completed: 'Completed',
  cancelled: 'Cancelled',
};

const priorityColors = {
  low: 'bg-gray-100 text-gray-800',
  medium: 'bg-orange-100 text-orange-800',
  high: 'bg-red-100 text-red-800',
};

export const TaskCard: React.FC<TaskCardProps> = ({ task, onStatusChange, onEdit, onDelete }) => {
  const [isEditingStatus, setIsEditingStatus] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleStatusChange = async (newStatus: Task['status']) => {
    setIsEditingStatus(false);
    await onStatusChange(task.id, newStatus);
  };

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      setIsDeleting(true);
      await onDelete(task.id);
      setIsDeleting(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
      {/* Header Row */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          <h3 className="font-medium text-gray-900 text-sm line-clamp-2">{task.title}</h3>
          {task.description && (
            <p className="text-gray-600 text-xs mt-1 line-clamp-2">{task.description}</p>
          )}
        </div>
        
        {/* Status Dropdown */}
        <div className="relative ml-3">
          {isEditingStatus ? (
            <div className="absolute right-0 top-0 z-10 bg-white border border-gray-300 rounded-md shadow-lg">
              {Object.entries(statusLabels).map(([value, label]) => (
                <button
                  key={value}
                  onClick={() => handleStatusChange(value as Task['status'])}
                  className="block w-full text-left px-3 py-2 text-sm hover:bg-gray-100 first:rounded-t-md last:rounded-b-md"
                >
                  {label}
                </button>
              ))}
            </div>
          ) : (
            <button
              onClick={() => setIsEditingStatus(true)}
              className={`px-2 py-1 text-xs font-medium rounded-full ${statusColors[task.status]}`}
            >
              {statusLabels[task.status]}
            </button>
          )}
        </div>
      </div>

      {/* Details Row */}
      <div className="flex items-center justify-between text-xs text-gray-500">
        <div className="flex items-center space-x-4">
          {/* Priority */}
          <span className={`px-2 py-1 rounded-full ${priorityColors[task.priority]}`}>
            {task.priority}
          </span>

          {/* Due Date */}
          {task.due_date && (
            <span className="flex items-center">
              <span className="mr-1">📅</span>
              {formatDate(task.due_date)}
            </span>
          )}

          {/* Assignee */}
          {task.assignee_name && (
            <div className="flex items-center">
              <div className="w-6 h-6 bg-blue-500 text-white text-xs rounded-full flex items-center justify-center mr-1">
                {getInitials(task.assignee_name)}
              </div>
              <span>{task.assignee_name}</span>
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="flex items-center space-x-2">
          <button
            onClick={() => onEdit(task)}
            className="text-blue-600 hover:text-blue-800 text-xs"
            disabled={isDeleting}
          >
            Edit
          </button>
          <button
            onClick={handleDelete}
            className="text-red-600 hover:text-red-800 text-xs"
            disabled={isDeleting}
          >
            {isDeleting ? 'Deleting...' : 'Delete'}
          </button>
        </div>
      </div>
    </div>
  );
};

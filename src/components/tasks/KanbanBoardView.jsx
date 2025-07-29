import React, { useState, useEffect } from 'react';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { Flag, Calendar, AlertTriangle } from 'lucide-react';
import { format } from 'date-fns';

const KanbanCard = ({ task, index }) => {
  const isOverdue = task.due_date && new Date(task.due_date) < new Date() && !['completed', 'closed'].includes(task.status);
  
  const priorityStyles = {
    low: 'border-l-4 border-slate-400',
    medium: 'border-l-4 border-blue-500',
    high: 'border-l-4 border-amber-500',
    urgent: 'border-l-4 border-red-500',
  };

  return (
    <Draggable draggableId={task.id} index={index}>
      {(provided, snapshot) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          className={`mb-3 p-3 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200 ${priorityStyles[task.priority]} ${snapshot.isDragging ? 'ring-2 ring-indigo-500' : ''}`}
        >
          <Link to={createPageUrl(`TaskDetails?id=${task.id}`)}>
            <p className="font-medium text-slate-800 mb-2">{task.title}</p>
          </Link>
          <div className="flex items-center justify-between text-xs text-slate-500">
            {task.due_date && (
              <div className={`flex items-center gap-1 ${isOverdue ? 'text-red-500 font-medium' : ''}`}>
                <Calendar className="w-3 h-3" />
                <span>{format(new Date(task.due_date), 'MMM d')}</span>
              </div>
            )}
            <Badge variant="outline">{task.priority}</Badge>
          </div>
        </div>
      )}
    </Draggable>
  );
};

const KanbanColumn = ({ title, tasks, droppableId, color }) => {
  return (
    <div className="w-72 flex-shrink-0">
      <Card className="bg-slate-50 border-0 h-full">
        <CardHeader className={`p-3 border-b-4 ${color}`}>
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-slate-700">{title}</h3>
            <Badge variant="secondary">{tasks.length}</Badge>
          </div>
        </CardHeader>
        <Droppable droppableId={droppableId}>
          {(provided, snapshot) => (
            <CardContent
              ref={provided.innerRef}
              {...provided.droppableProps}
              className={`p-3 transition-colors duration-200 min-h-[200px] ${snapshot.isDraggingOver ? 'bg-indigo-50' : ''}`}
            >
              {tasks.map((task, index) => (
                <KanbanCard key={task.id} task={task} index={index} />
              ))}
              {provided.placeholder}
            </CardContent>
          )}
        </Droppable>
      </Card>
    </div>
  );
};


export default function KanbanBoardView({ tasks, onTaskUpdate }) {
  const columns = {
    pending: { title: 'Pending', color: 'border-slate-400', tasks: [] },
    in_progress: { title: 'In Progress', color: 'border-blue-500', tasks: [] },
    needs_approval: { title: 'Needs Approval', color: 'border-amber-500', tasks: [] },
    completed: { title: 'Completed', color: 'border-green-500', tasks: [] },
  };

  // Populate columns with tasks
  tasks.forEach(task => {
    if (columns[task.status]) {
      columns[task.status].tasks.push(task);
    }
  });

  const onDragEnd = (result) => {
    const { source, destination, draggableId } = result;

    if (!destination || (source.droppableId === destination.droppableId)) {
      return;
    }
    
    onTaskUpdate(draggableId, { status: destination.droppableId });
  };

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <div className="flex gap-6 overflow-x-auto pb-4">
        {Object.entries(columns).map(([id, column]) => (
          <KanbanColumn
            key={id}
            droppableId={id}
            title={column.title}
            tasks={column.tasks}
            color={column.color}
          />
        ))}
      </div>
    </DragDropContext>
  );
}
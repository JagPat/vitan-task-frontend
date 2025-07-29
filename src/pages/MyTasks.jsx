
import React, { useState, useEffect } from "react";
import { Task } from "@/api/entities";
import { User } from "@/api/entities";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Plus, LayoutGrid, List } from "lucide-react";
import TaskToolbar from "../components/tasks/TaskToolbar";
import TaskListView from "../components/tasks/TaskListView";
import KanbanBoardView from "../components/tasks/KanbanBoardView";

export default function MyTasks() {
  const [tasks, setTasks] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState("list"); // 'list' or 'board'
  const [filters, setFilters] = useState({
    search: "",
    status: "all",
    priority: "all",
  });

  useEffect(() => {
    loadUserAndTasks();
  }, []);

  const loadUserAndTasks = async () => {
    setLoading(true);
    try {
      const user = await User.me();
      setCurrentUser(user);
      if (user) {
        // Build a query to find tasks assigned to the user's ID OR their phone number
        const query = {
          $or: [
            { assigned_to: user.id },
          ]
        };

        if (user.phone_number) {
          query.$or.push({ assigned_to_phone: user.phone_number });
        }
        
        const userTasks = await Task.filter(query, "-due_date");
        setTasks(userTasks);
      }
    } catch (error) {
      console.error("Error loading user and tasks:", error);
      // It's possible the user is not logged in, so we can clear tasks.
      setTasks([]);
    } finally {
      setLoading(false);
    }
  };

  const handleTaskUpdate = async (taskId, updatedData) => {
    try {
      await Task.update(taskId, updatedData);
      // Optimistically update the local state
      setTasks(prevTasks => 
        prevTasks.map(task => 
          task.id === taskId ? { ...task, ...updatedData } : task
        )
      );
    } catch (error) {
      console.error("Failed to update task:", error);
      // Optionally, revert the state on failure
      loadUserAndTasks(); 
    }
  };

  const filteredTasks = tasks.filter((task) => {
    const searchMatch = task.title.toLowerCase().includes(filters.search.toLowerCase()) ||
                        task.description?.toLowerCase().includes(filters.search.toLowerCase());
    const statusMatch = filters.status === "all" || task.status === filters.status;
    const priorityMatch = filters.priority === "all" || task.priority === filters.priority;
    return searchMatch && statusMatch && priorityMatch;
  });

  return (
    <div className="p-4 lg:p-8 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl lg:text-4xl font-bold text-slate-800">My Tasks</h1>
          <p className="text-slate-600 mt-1">
            Here are all the tasks assigned to you.
          </p>
        </div>
        <div className="flex items-center gap-2">
           <Button
            variant={view === 'list' ? 'secondary' : 'ghost'}
            size="icon"
            onClick={() => setView('list')}
            className="hidden md:flex"
          >
            <List className="w-5 h-5" />
          </Button>
          <Button
            variant={view === 'board' ? 'secondary' : 'ghost'}
            size="icon"
            onClick={() => setView('board')}
             className="hidden md:flex"
          >
            <LayoutGrid className="w-5 h-5" />
          </Button>
          <Link to={createPageUrl("CreateTask")}>
            <Button className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 shadow-md">
              <Plus className="w-4 h-4 mr-2" />
              New Task
            </Button>
          </Link>
        </div>
      </div>

      {/* Toolbar */}
      <TaskToolbar filters={filters} onFilterChange={setFilters} />

      {/* Content */}
      {loading ? (
        <div className="text-center py-16">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="mt-4 text-slate-500">Loading your tasks...</p>
        </div>
      ) : (
        <>
          {view === 'list' && <TaskListView tasks={filteredTasks} />}
          {view === 'board' && (
            <KanbanBoardView tasks={filteredTasks} onTaskUpdate={handleTaskUpdate} />
          )}
        </>
      )}
    </div>
  );
}

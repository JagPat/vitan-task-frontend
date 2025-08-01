
import React, { useState, useEffect } from 'react';
import { Task } from '@/api/entities';
import { extractTaskPrimitives } from '@/utils';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Plus, 
  Search, 
  Filter, 
  CheckSquare, 
  Clock, 
  AlertTriangle,
  Calendar
} from 'lucide-react';
import TaskCard from '@/components/tasks/TaskCard';
import CreateTask from './CreateTask';
import { useToast } from '@/components/ui/use-toast';

export default function MyTasks() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreateTask, setShowCreateTask] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [priorityFilter, setPriorityFilter] = useState('');
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    in_progress: 0,
    completed: 0,
    overdue: 0
  });
  const { toast } = useToast();

  useEffect(() => {
    loadTasks();
  }, []);

  const loadTasks = async () => {
    try {
      setLoading(true);
      const tasksData = await Task.getAll();
      
      // Extract primitive values to prevent React error #130
      const cleanTasks = Array.isArray(tasksData) ? tasksData.map(task => extractTaskPrimitives(task)).filter(task => task !== null) : [];
      
      setTasks(cleanTasks);
      calculateStats(cleanTasks);
    } catch (error) {
      console.error('Error loading tasks:', error);
      toast({
        title: "Error",
        description: "Failed to load tasks. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const calculateStats = (taskList) => {
    const stats = {
      total: taskList.length,
      pending: taskList.filter(t => t.status === 'pending').length,
      in_progress: taskList.filter(t => t.status === 'in_progress').length,
      completed: taskList.filter(t => ['completed', 'closed'].includes(t.status)).length,
      overdue: taskList.filter(t => {
        if (!t.due_date) return false;
        const dueDate = new Date(t.due_date);
        const today = new Date();
        return dueDate < today && !['completed', 'closed'].includes(t.status);
      }).length
    };
    setStats(stats);
  };

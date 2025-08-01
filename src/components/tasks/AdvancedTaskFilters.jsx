import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Search, 
  Filter, 
  X,
  Calendar,
  User,
  FolderOpen,
  Clock,
  AlertTriangle
} from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar as CalendarIcon } from '@/components/ui/calendar';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';

export default function AdvancedTaskFilters({ 
  filters, 
  onFiltersChange, 
  projects = [], 
  users = [],
  onClearFilters 
}) {
  const [isOpen, setIsOpen] = useState(false);

  const handleFilterChange = (key, value) => {
    onFiltersChange({
      ...filters,
      [key]: value
    });
  };

  const handleClearFilter = (key) => {
    const newFilters = { ...filters };
    delete newFilters[key];
    onFiltersChange(newFilters);
  };

  const handleClearAll = () => {
    onClearFilters();
  };

  const activeFiltersCount = Object.keys(filters).filter(key => 
    filters[key] && filters[key] !== '' && filters[key] !== 'all'
  ).length;

  return (
    <div className="space-y-4">
      {/* Filter Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-slate-500" />
          <h3 className="text-sm font-medium text-slate-700">Filters</h3>
          {activeFiltersCount > 0 && (
            <Badge variant="secondary" className="text-xs">
              {activeFiltersCount} active
            </Badge>
          )}
        </div>
        
        {activeFiltersCount > 0 && (
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={handleClearAll}
            className="text-xs text-slate-500 hover:text-slate-700"
          >
            Clear all
          </Button>
        )}
      </div>

      {/* Filter Controls */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
          <Input
            placeholder="Search tasks..."
            value={filters.search || ''}
            onChange={(e) => handleFilterChange('search', e.target.value)}
            className="pl-10"
          />
        </div>

        {/* Status Filter */}
        <Select value={filters.status || 'all'} onValueChange={(value) => handleFilterChange('status', value)}>
          <SelectTrigger>
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="in_progress">In Progress</SelectItem>
            <SelectItem value="completed">Completed</SelectItem>
            <SelectItem value="needs_approval">Needs Approval</SelectItem>
            <SelectItem value="closed">Closed</SelectItem>
            <SelectItem value="overdue">Overdue</SelectItem>
          </SelectContent>
        </Select>

        {/* Priority Filter */}
        <Select value={filters.priority || 'all'} onValueChange={(value) => handleFilterChange('priority', value)}>
          <SelectTrigger>
            <SelectValue placeholder="Priority" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Priority</SelectItem>
            <SelectItem value="low">Low</SelectItem>
            <SelectItem value="medium">Medium</SelectItem>
            <SelectItem value="high">High</SelectItem>
            <SelectItem value="urgent">Urgent</SelectItem>
          </SelectContent>
        </Select>

        {/* Project Filter */}
        <Select value={filters.project || 'all'} onValueChange={(value) => handleFilterChange('project', value)}>
          <SelectTrigger>
            <SelectValue placeholder="Project" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Projects</SelectItem>
            {projects.map((project) => (
              <SelectItem key={project.id} value={project.id.toString()}>
                {project.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Advanced Filters */}
      <Popover open={isOpen} onOpenChange={setIsOpen}>
        <PopoverTrigger asChild>
          <Button variant="outline" size="sm" className="text-xs">
            <Filter className="w-4 h-4 mr-2" />
            Advanced Filters
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-80" align="start">
          <div className="space-y-4">
            <h4 className="font-medium">Advanced Filters</h4>
            
            {/* Assignee Filter */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Assignee</label>
              <Select value={filters.assignee || 'all'} onValueChange={(value) => handleFilterChange('assignee', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select assignee" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Assignees</SelectItem>
                  <SelectItem value="unassigned">Unassigned</SelectItem>
                  {users.map((user) => (
                    <SelectItem key={user.id} value={user.id.toString()}>
                      {user.full_name || user.email}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Due Date Filter */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Due Date</label>
              <Select value={filters.dueDate || 'all'} onValueChange={(value) => handleFilterChange('dueDate', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Due date" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Dates</SelectItem>
                  <SelectItem value="today">Due Today</SelectItem>
                  <SelectItem value="tomorrow">Due Tomorrow</SelectItem>
                  <SelectItem value="this_week">Due This Week</SelectItem>
                  <SelectItem value="next_week">Due Next Week</SelectItem>
                  <SelectItem value="overdue">Overdue</SelectItem>
                  <SelectItem value="no_due_date">No Due Date</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Created Date Filter */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Created Date</label>
              <Select value={filters.createdDate || 'all'} onValueChange={(value) => handleFilterChange('createdDate', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Created date" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Time</SelectItem>
                  <SelectItem value="today">Created Today</SelectItem>
                  <SelectItem value="this_week">Created This Week</SelectItem>
                  <SelectItem value="this_month">Created This Month</SelectItem>
                  <SelectItem value="last_week">Created Last Week</SelectItem>
                  <SelectItem value="last_month">Created Last Month</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Has Checklist Filter */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Checklist</label>
              <Select value={filters.hasChecklist || 'all'} onValueChange={(value) => handleFilterChange('hasChecklist', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Checklist" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Tasks</SelectItem>
                  <SelectItem value="with_checklist">With Checklist</SelectItem>
                  <SelectItem value="without_checklist">Without Checklist</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </PopoverContent>
      </Popover>

      {/* Active Filters Display */}
      {activeFiltersCount > 0 && (
        <div className="flex flex-wrap gap-2">
          {Object.entries(filters).map(([key, value]) => {
            if (!value || value === '' || value === 'all') return null;
            
            const getFilterLabel = (key, value) => {
              switch (key) {
                case 'search':
                  return `Search: "${value}"`;
                case 'status':
                  return `Status: ${value.replace('_', ' ')}`;
                case 'priority':
                  return `Priority: ${value}`;
                case 'project':
                  const project = projects.find(p => p.id.toString() === value);
                  return `Project: ${project?.name || value}`;
                case 'assignee':
                  if (value === 'unassigned') return 'Assignee: Unassigned';
                  const user = users.find(u => u.id.toString() === value);
                  return `Assignee: ${user?.full_name || user?.email || value}`;
                case 'dueDate':
                  return `Due Date: ${value.replace('_', ' ')}`;
                case 'createdDate':
                  return `Created: ${value.replace('_', ' ')}`;
                case 'hasChecklist':
                  return value === 'with_checklist' ? 'Has Checklist' : 'No Checklist';
                default:
                  return `${key}: ${value}`;
              }
            };

            return (
              <Badge 
                key={key} 
                variant="secondary" 
                className="flex items-center gap-1 text-xs"
              >
                {getFilterLabel(key, value)}
                <button
                  onClick={() => handleClearFilter(key)}
                  className="ml-1 hover:text-red-600"
                >
                  <X className="w-3 h-3" />
                </button>
              </Badge>
            );
          })}
        </div>
      )}
    </div>
  );
} 
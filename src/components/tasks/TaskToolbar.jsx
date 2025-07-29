import React from 'react';
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search } from "lucide-react";

export default function TaskToolbar({ filters, onFilterChange }) {
  const handleInputChange = (field, value) => {
    onFilterChange(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="flex flex-col md:flex-row items-center gap-4 p-4 bg-white rounded-2xl shadow-lg border border-slate-100">
      <div className="relative w-full md:flex-1">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
        <Input
          placeholder="Search tasks..."
          className="pl-10"
          value={filters.search}
          onChange={(e) => handleInputChange('search', e.target.value)}
        />
      </div>
      <div className="flex gap-4 w-full md:w-auto">
        <Select
          value={filters.status}
          onValueChange={(value) => handleInputChange('status', value)}
        >
          <SelectTrigger className="w-full md:w-40">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Statuses</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="in_progress">In Progress</SelectItem>
            <SelectItem value="needs_approval">Needs Approval</SelectItem>
            <SelectItem value="completed">Completed</SelectItem>
            <SelectItem value="closed">Closed</SelectItem>
            <SelectItem value="overdue">Overdue</SelectItem>
          </SelectContent>
        </Select>
        <Select
          value={filters.priority}
          onValueChange={(value) => handleInputChange('priority', value)}
        >
          <SelectTrigger className="w-full md:w-40">
            <SelectValue placeholder="Priority" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Priorities</SelectItem>
            <SelectItem value="low">Low</SelectItem>
            <SelectItem value="medium">Medium</SelectItem>
            <SelectItem value="high">High</SelectItem>
            <SelectItem value="urgent">Urgent</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
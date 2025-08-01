import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import UnifiedTaskCard from './tasks/UnifiedTaskCard';
import AdvancedTaskFilters from './tasks/AdvancedTaskFilters';
import { getStatusStyle, getPriorityStyle, cardStyles } from '@/utils/designSystem';

export default function TestComponents() {
  const testTask = {
    id: 1,
    title: "Test Task",
    description: "This is a test task to verify our components are working correctly",
    status: "pending",
    priority: "medium",
    due_date: "2024-12-31",
    assigned_to_name: "John Doe",
    created_at: "2024-01-01T00:00:00Z",
    project_name: "Test Project",
    checklist: [
      { text: "Test item 1", completed: false },
      { text: "Test item 2", completed: true }
    ]
  };

  const testProjects = [
    { id: 1, name: "Project A" },
    { id: 2, name: "Project B" }
  ];

  const testUsers = [
    { id: 1, full_name: "John Doe", email: "john@example.com" },
    { id: 2, full_name: "Jane Smith", email: "jane@example.com" }
  ];

  const testFilters = {
    search: "",
    status: "all",
    priority: "all",
    project: "all"
  };

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">Component Test Page</h1>
      
      {/* Test Design System */}
      <Card>
        <CardHeader>
          <CardTitle>Design System Test</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2">
            <Badge className={`${getStatusStyle('pending').bg} ${getStatusStyle('pending').text}`}>
              Pending
            </Badge>
            <Badge className={`${getStatusStyle('in_progress').bg} ${getStatusStyle('in_progress').text}`}>
              In Progress
            </Badge>
            <Badge className={`${getStatusStyle('completed').bg} ${getStatusStyle('completed').text}`}>
              Completed
            </Badge>
          </div>
          <div className="flex gap-2">
            <Badge className={`${getPriorityStyle('low').bg} ${getPriorityStyle('low').text}`}>
              Low Priority
            </Badge>
            <Badge className={`${getPriorityStyle('medium').bg} ${getPriorityStyle('medium').text}`}>
              Medium Priority
            </Badge>
            <Badge className={`${getPriorityStyle('high').bg} ${getPriorityStyle('high').text}`}>
              High Priority
            </Badge>
          </div>
        </CardContent>
      </Card>

      {/* Test Unified Task Card */}
      <Card>
        <CardHeader>
          <CardTitle>Unified Task Card Test</CardTitle>
        </CardHeader>
        <CardContent>
          <UnifiedTaskCard
            task={testTask}
            showProjectContext={true}
            showActions={true}
          />
        </CardContent>
      </Card>

      {/* Test Advanced Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Advanced Filters Test</CardTitle>
        </CardHeader>
        <CardContent>
          <AdvancedTaskFilters
            filters={testFilters}
            onFiltersChange={(filters) => console.log('Filters changed:', filters)}
            projects={testProjects}
            users={testUsers}
            onClearFilters={() => console.log('Filters cleared')}
          />
        </CardContent>
      </Card>

      <div className="text-center">
        <Button onClick={() => window.history.back()}>
          Go Back
        </Button>
      </div>
    </div>
  );
} 
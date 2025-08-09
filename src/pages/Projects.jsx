import React, { useEffect, useMemo, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Plus, 
  Search, 
  Filter, 
  FolderOpen, 
  Users, 
  CheckCircle,
  Clock,
  AlertCircle
} from 'lucide-react';
import ProjectCard from '@/components/projects/ProjectCard';
import CreateProjectDialog from '@/components/projects/CreateProjectDialog';
import { Project } from '@/api/entities';
import { extractProjectPrimitives } from '@/utils';
import { useToast } from '@/components/ui/use-toast';

export default function Projects() {
  const [projects, setProjects] = useState([]);
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [stats, setStats] = useState({
    total: 0,
    active: 0,
    completed: 0,
    on_hold: 0
  });
  const { toast } = useToast();

  // React Query: fetch projects
  const { data, isLoading, refetch, isFetching } = useQuery({
    queryKey: ['projects'],
    queryFn: async () => {
      const projectsData = await Project.getAll();
      return Array.isArray(projectsData) ? projectsData.map(p => extractProjectPrimitives(p)).filter(Boolean) : [];
    },
    staleTime: 60_000
  });

  // Sync local state when data changes
  useEffect(() => {
    // Load saved filters
    try {
      const saved = JSON.parse(localStorage.getItem('projectsFilters') || '{}');
      if (saved.searchTerm) setSearchTerm(saved.searchTerm);
      if (saved.statusFilter) setStatusFilter(saved.statusFilter);
      if (saved.categoryFilter) setCategoryFilter(saved.categoryFilter);
    } catch {}
  }, []);

  useEffect(() => {
    // Persist filters
    localStorage.setItem('projectsFilters', JSON.stringify({ searchTerm, statusFilter, categoryFilter }));
  }, [searchTerm, statusFilter, categoryFilter]);

  useEffect(() => {
    if (data) {
      setProjects(data);
      calculateStats(data);
    }
  }, [data]);

  const calculateStats = (projectList) => {
    const stats = {
      total: projectList.length,
      active: projectList.filter(p => p.status === 'active').length,
      completed: projectList.filter(p => p.status === 'completed').length,
      on_hold: projectList.filter(p => p.status === 'on_hold').length
    };
    setStats(stats);
  };

  const handleProjectCreated = (newProject) => {
    // Extract primitive values from new project
    const cleanProject = extractProjectPrimitives(newProject);
    if (cleanProject) {
      setProjects(prev => {
        const updatedProjects = [cleanProject, ...prev];
        // Calculate stats with the updated projects list
        calculateStats(updatedProjects);
        return updatedProjects;
      });
    }
  };

  const handleEditProject = (project) => {
    // TODO: Implement edit functionality
    // Edit project functionality to be implemented
  };

  const handleDeleteProject = async (project) => {
    if (!project) return;
    const proceed = confirm(`Delete project "${project.name}"? If it has members/tasks, confirm again to force delete.`);
    if (!proceed) return;
    try {
      // First try without force
      await Project.delete(project.id);
      setProjects(prev => {
        const updated = prev.filter(p => p.id !== project.id);
        calculateStats(updated);
        return updated;
      });
      toast({ title: 'Success', description: `Project "${project.name}" deleted.` });
    } catch (err) {
      const msg = err?.message || '';
      const requiresForce = /requiresForceDelete|forceDelete/i.test(msg);
      if (requiresForce) {
        const confirmForce = confirm(`This project has related items. Force delete "${project.name}"?`);
        if (!confirmForce) return;
        try {
          await Project.delete(project.id, { forceDelete: true });
          setProjects(prev => {
            const updated = prev.filter(p => p.id !== project.id);
            calculateStats(updated);
            return updated;
          });
          toast({ title: 'Deleted', description: 'Project force-deleted.' });
        } catch (e2) {
          console.error('Force delete failed:', e2);
          toast({ title: 'Error', description: 'Force delete failed.', variant: 'destructive' });
        }
      } else {
        console.error('Error deleting project:', err);
        toast({ title: 'Error', description: 'Failed to delete project.', variant: 'destructive' });
      }
    }
  };

  const handleViewProject = (project) => {
    // TODO: Navigate to project details page
    // View project functionality to be implemented
  };

  // Debounce search input
  const [debouncedSearch, setDebouncedSearch] = useState('');
  useEffect(() => {
    const id = setTimeout(() => setDebouncedSearch(searchTerm), 300);
    return () => clearTimeout(id);
  }, [searchTerm]);

  const filteredProjects = projects.filter(project => {
    const matchesSearch = project.name.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
                         project.description?.toLowerCase().includes(debouncedSearch.toLowerCase());
    const matchesStatus = statusFilter === 'all' || !statusFilter || project.status === statusFilter;
    const matchesCategory = categoryFilter === 'all' || !categoryFilter || project.category === categoryFilter;
    
    return matchesSearch && matchesStatus && matchesCategory;
  });

  if (isLoading) {
    return (
      <div className="p-4 lg:p-8 max-w-7xl mx-auto">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading projects...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 lg:p-8 max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Projects</h1>
          <p className="text-gray-600 mt-1">Manage your projects and track progress</p>
        </div>
        <Button onClick={() => setShowCreateDialog(true)} className="flex items-center gap-2">
          <Plus className="w-4 h-4" />
          Create Project
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <FolderOpen className="w-8 h-8 text-blue-600" />
              <div>
                <p className="text-sm text-gray-600">Total Projects</p>
                <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <Clock className="w-8 h-8 text-green-600" />
              <div>
                <p className="text-sm text-gray-600">Active</p>
                <p className="text-2xl font-bold text-gray-900">{stats.active}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <CheckCircle className="w-8 h-8 text-blue-600" />
              <div>
                <p className="text-sm text-gray-600">Completed</p>
                <p className="text-2xl font-bold text-gray-900">{stats.completed}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <AlertCircle className="w-8 h-8 text-yellow-600" />
              <div>
                <p className="text-sm text-gray-600">On Hold</p>
                <p className="text-2xl font-bold text-gray-900">{stats.on_hold}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Search projects..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>
        
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-full sm:w-48">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="completed">Completed</SelectItem>
            <SelectItem value="on_hold">On Hold</SelectItem>
            <SelectItem value="cancelled">Cancelled</SelectItem>
            <SelectItem value="archived">Archived</SelectItem>
          </SelectContent>
        </Select>

        <Select value={categoryFilter} onValueChange={setCategoryFilter}>
          <SelectTrigger className="w-full sm:w-48">
            <SelectValue placeholder="Filter by category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            <SelectItem value="Architecture & Design">Architecture & Design</SelectItem>
            <SelectItem value="Office Maintenance">Office Maintenance</SelectItem>
            <SelectItem value="Gadget Servicing">Gadget Servicing</SelectItem>
            <SelectItem value="Software Development">Software Development</SelectItem>
            <SelectItem value="Marketing Campaign">Marketing Campaign</SelectItem>
            <SelectItem value="Event Planning">Event Planning</SelectItem>
            <SelectItem value="Research & Analysis">Research & Analysis</SelectItem>
            <SelectItem value="Client Support">Client Support</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Projects Grid */}
      {filteredProjects.length === 0 ? (
        <div className="text-center py-16">
          <FolderOpen className="w-16 h-16 text-slate-400 mx-auto mb-4" />
          <h3 className="text-xl font-medium text-slate-700 mb-2">
            {projects.length === 0 ? 'No projects yet' : 'No projects found'}
          </h3>
          <p className="text-slate-500 mb-6">
            {projects.length === 0 
              ? 'Create your first project to get started'
              : 'Try adjusting your search criteria'
            }
          </p>
          {projects.length === 0 && (
            <Button onClick={() => setShowCreateDialog(true)}>
              <Plus className="w-4 h-4 mr-2" />
              Create Your First Project
            </Button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProjects.map((project) => (
            <ProjectCard
              key={project.id}
              project={project}
              onEdit={handleEditProject}
              onDelete={handleDeleteProject}
              onView={handleViewProject}
              onChanged={refetch}
              onSetFilters={({ status, category }) => {
                if (status) setStatusFilter(status);
                if (category) setCategoryFilter(category);
              }}
            />
          ))}
        </div>
      )}

      {/* Create Project Dialog */}
      <CreateProjectDialog
        open={showCreateDialog}
        onOpenChange={setShowCreateDialog}
        onProjectCreated={handleProjectCreated}
      />
    </div>
  );
} 
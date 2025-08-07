import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { 
  Save,
  Copy,
  Edit,
  Trash2,
  Plus,
  FolderOpen,
  Clock,
  AlertTriangle
} from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

export default function TaskTemplateManager({ 
  onTemplateSelect, 
  onTemplateSave,
  projects = [],
  users = []
}) {
  const [templates, setTemplates] = useState([
    {
      id: 1,
      name: 'Bug Report Template',
      description: 'Standard template for bug reports',
      priority: 'high',
      estimatedHours: 2,
      checklist: [
        { text: 'Reproduce the bug', completed: false },
        { text: 'Document steps to reproduce', completed: false },
        { text: 'Test on different browsers', completed: false },
        { text: 'Create fix and test', completed: false }
      ],
      tags: ['bug', 'frontend'],
      projectId: null
    },
    {
      id: 2,
      name: 'Feature Development',
      description: 'Template for new feature development',
      priority: 'medium',
      estimatedHours: 8,
      checklist: [
        { text: 'Define requirements', completed: false },
        { text: 'Create design mockups', completed: false },
        { text: 'Implement core functionality', completed: false },
        { text: 'Write tests', completed: false },
        { text: 'Document changes', completed: false }
      ],
      tags: ['feature', 'development'],
      projectId: null
    },
    {
      id: 3,
      name: 'Code Review',
      description: 'Standard code review checklist',
      priority: 'medium',
      estimatedHours: 1,
      checklist: [
        { text: 'Review code quality', completed: false },
        { text: 'Check for security issues', completed: false },
        { text: 'Verify test coverage', completed: false },
        { text: 'Ensure documentation is updated', completed: false }
      ],
      tags: ['review', 'quality'],
      projectId: null
    }
  ]);

  const [showSaveDialog, setShowSaveDialog] = useState(false);
  const [editingTemplate, setEditingTemplate] = useState(null);
  const [newTemplate, setNewTemplate] = useState({
    name: '',
    description: '',
    priority: 'medium',
    estimatedHours: 1,
    checklist: [],
    tags: [],
    projectId: null
  });
  const [newChecklistItem, setNewChecklistItem] = useState('');
  const [newTag, setNewTag] = useState('');
  const { toast } = useToast();

  const handleSaveTemplate = () => {
    if (!newTemplate.name.trim()) {
      toast({
        title: "Error",
        description: "Template name is required",
        variant: "destructive",
      });
      return;
    }

    const template = {
      ...newTemplate,
      id: Date.now(),
      checklist: newTemplate.checklist.filter(item => item.text.trim())
    };

    setTemplates(prev => [template, ...prev]);
    setShowSaveDialog(false);
    setNewTemplate({
      name: '',
      description: '',
      priority: 'medium',
      estimatedHours: 1,
      checklist: [],
      tags: [],
      projectId: null
    });

    toast({
      title: "Success",
      description: "Template saved successfully",
    });
  };

  const handleUseTemplate = (template) => {
    if (onTemplateSelect) {
      onTemplateSelect(template);
    }
  };

  const handleDeleteTemplate = (templateId) => {
    setTemplates(prev => prev.filter(t => t.id !== templateId));
    toast({
      title: "Success",
      description: "Template deleted successfully",
    });
  };

  const handleEditTemplate = (template) => {
    setEditingTemplate(template);
    setNewTemplate(template);
    setShowSaveDialog(true);
  };

  const addChecklistItem = () => {
    if (newChecklistItem.trim()) {
      setNewTemplate(prev => ({
        ...prev,
        checklist: [...prev.checklist, { text: newChecklistItem.trim(), completed: false }]
      }));
      setNewChecklistItem('');
    }
  };

  const removeChecklistItem = (index) => {
    setNewTemplate(prev => ({
      ...prev,
      checklist: prev.checklist.filter((_, i) => i !== index)
    }));
  };

  const addTag = () => {
    if (newTag.trim() && !newTemplate.tags.includes(newTag.trim())) {
      setNewTemplate(prev => ({
        ...prev,
        tags: [...prev.tags, newTag.trim()]
      }));
      setNewTag('');
    }
  };

  const removeTag = (tagToRemove) => {
    setNewTemplate(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };

  const getPriorityIcon = (priority) => {
    switch (priority) {
      case 'urgent': return <AlertTriangle className="w-4 h-4" />;
      case 'high': return <AlertTriangle className="w-4 h-4" />;
      case 'medium': return <Clock className="w-4 h-4" />;
      case 'low': return <Clock className="w-4 h-4" />;
      default: return <Clock className="w-4 h-4" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Task Templates</h2>
          <p className="text-slate-600 mt-1">Save and reuse common task configurations</p>
        </div>
        
        <Dialog open={showSaveDialog} onOpenChange={setShowSaveDialog}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Create Template
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto" aria-describedby="template-manager-description">
            <DialogHeader>
              <DialogTitle>
                {editingTemplate ? 'Edit Template' : 'Create New Template'}
              </DialogTitle>
              <DialogDescription>
                Define a reusable task template with checklist items and metadata.
              </DialogDescription>
              <div id="template-manager-description" className="sr-only">
                Form to create or edit task templates with name, priority, description, estimated hours, project assignment, checklist items, and tags.
              </div>
            </DialogHeader>
            
            <div className="space-y-4">
              {/* Basic Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Template Name</label>
                  <Input
                    value={newTemplate.name}
                    onChange={(e) => setNewTemplate(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="e.g., Bug Report Template"
                  />
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium">Priority</label>
                  <Select 
                    value={newTemplate.priority} 
                    onValueChange={(value) => setNewTemplate(prev => ({ ...prev, priority: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="low">Low</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="high">High</SelectItem>
                      <SelectItem value="urgent">Urgent</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Description</label>
                <Textarea
                  value={newTemplate.description}
                  onChange={(e) => setNewTemplate(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Describe what this template is for..."
                  rows={3}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Estimated Hours</label>
                  <Input
                    type="number"
                    value={newTemplate.estimatedHours}
                    onChange={(e) => setNewTemplate(prev => ({ ...prev, estimatedHours: parseInt(e.target.value) || 1 }))}
                    min="1"
                    max="40"
                  />
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium">Project (Optional)</label>
                  <Select 
                    value={newTemplate.projectId || 'none'} 
                    onValueChange={(value) => setNewTemplate(prev => ({ ...prev, projectId: value === "none" ? null : value }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select project" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">No Project</SelectItem>
                      {projects.map((project) => (
                        <SelectItem key={project.id} value={project.id.toString()}>
                          {project.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Checklist */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Checklist Items</label>
                <div className="space-y-2">
                  {newTemplate.checklist.map((item, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <Input
                        value={item.text}
                        onChange={(e) => {
                          const updatedChecklist = [...newTemplate.checklist];
                          updatedChecklist[index].text = e.target.value;
                          setNewTemplate(prev => ({ ...prev, checklist: updatedChecklist }));
                        }}
                        placeholder="Checklist item..."
                      />
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => removeChecklistItem(index)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  ))}
                  
                  <div className="flex gap-2">
                    <Input
                      value={newChecklistItem}
                      onChange={(e) => setNewChecklistItem(e.target.value)}
                      placeholder="Add checklist item..."
                      onKeyPress={(e) => e.key === 'Enter' && addChecklistItem()}
                    />
                    <Button variant="outline" size="sm" onClick={addChecklistItem}>
                      Add
                    </Button>
                  </div>
                </div>
              </div>

              {/* Tags */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Tags</label>
                <div className="flex flex-wrap gap-2 mb-2">
                  {newTemplate.tags.map((tag, index) => (
                    <Badge key={index} variant="secondary" className="flex items-center gap-1">
                      {tag}
                      <button
                        onClick={() => removeTag(tag)}
                        className="ml-1 hover:text-red-600"
                      >
                        ×
                      </button>
                    </Badge>
                  ))}
                </div>
                
                <div className="flex gap-2">
                  <Input
                    value={newTag}
                    onChange={(e) => setNewTag(e.target.value)}
                    placeholder="Add tag..."
                    onKeyPress={(e) => e.key === 'Enter' && addTag()}
                  />
                  <Button variant="outline" size="sm" onClick={addTag}>
                    Add
                  </Button>
                </div>
              </div>
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={() => setShowSaveDialog(false)}>
                Cancel
              </Button>
              <Button onClick={handleSaveTemplate}>
                {editingTemplate ? 'Update Template' : 'Save Template'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Templates Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {templates.map((template) => (
          <Card key={template.id} className="hover:shadow-lg transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <CardTitle className="text-lg">{template.name}</CardTitle>
                  <p className="text-sm text-slate-600 mt-1">{template.description}</p>
                </div>
                <div className="flex items-center gap-1">
                  {getPriorityIcon(template.priority)}
                </div>
              </div>
            </CardHeader>
            
            <CardContent className="space-y-4">
              {/* Metadata */}
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-slate-400" />
                  <span>{template.estimatedHours}h</span>
                </div>
                <Badge variant="secondary" className="capitalize">
                  {template.priority}
                </Badge>
              </div>

              {/* Checklist Preview */}
              {template.checklist.length > 0 && (
                <div className="space-y-1">
                  <p className="text-xs font-medium text-slate-600">Checklist ({template.checklist.length} items)</p>
                  <div className="space-y-1">
                    {template.checklist.slice(0, 3).map((item, index) => (
                      <div key={index} className="flex items-center gap-2 text-sm">
                        <div className="w-2 h-2 bg-slate-300 rounded-full"></div>
                        <span className="text-slate-600">{item.text}</span>
                      </div>
                    ))}
                    {template.checklist.length > 3 && (
                      <p className="text-xs text-slate-500">+{template.checklist.length - 3} more items</p>
                    )}
                  </div>
                </div>
              )}

              {/* Tags */}
              {template.tags.length > 0 && (
                <div className="flex flex-wrap gap-1">
                  {template.tags.map((tag, index) => (
                    <Badge key={index} variant="outline" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                </div>
              )}

              {/* Actions */}
              <div className="flex items-center gap-2 pt-2 border-t border-slate-100">
                <Button
                  size="sm"
                  onClick={() => handleUseTemplate(template)}
                  className="flex-1"
                >
                  <Copy className="w-4 h-4 mr-1" />
                  Use Template
                </Button>
                
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleEditTemplate(template)}
                >
                  <Edit className="w-4 h-4" />
                </Button>
                
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleDeleteTemplate(template.id)}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {templates.length === 0 && (
        <Card>
          <CardContent className="p-12 text-center">
            <div className="text-slate-500">
              <FolderOpen className="w-12 h-12 mx-auto mb-4 text-slate-300" />
              <h3 className="text-lg font-medium mb-2">No templates yet</h3>
              <p className="text-sm">Create your first template to get started.</p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
} 
import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Plus, X } from 'lucide-react';

const emptyTemplate = {
  name: '',
  title_template: '',
  description_template: '',
  default_priority: 'medium',
  default_tags: [],
  checklist_template: [],
  estimated_hours: '',
  category: 'other',
};

export default function TemplateFormDialog({ open, onOpenChange, template, onSave }) {
  const [formData, setFormData] = useState(emptyTemplate);
  const [newTag, setNewTag] = useState('');
  const [newChecklistItem, setNewChecklistItem] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (template) {
      setFormData({
        name: template.name || '',
        title_template: template.title_template || '',
        description_template: template.description_template || '',
        default_priority: template.default_priority || 'medium',
        default_tags: template.default_tags || [],
        checklist_template: template.checklist_template || [],
        estimated_hours: template.estimated_hours || '',
        category: template.category || 'other',
      });
    } else {
      setFormData(emptyTemplate);
    }
  }, [template, open]);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };
  
  const handleListChange = (field, item, action) => {
    setFormData(prev => {
        const currentList = prev[field] || [];
        if (action === 'add' && item && !currentList.includes(item)) {
            return { ...prev, [field]: [...currentList, item] };
        }
        if (action === 'remove') {
            return { ...prev, [field]: currentList.filter(i => i !== item) };
        }
        return prev;
    });
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    await onSave({ ...formData, estimated_hours: Number(formData.estimated_hours) || null });
    setLoading(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>{template ? 'Edit Template' : 'Create New Template'}</DialogTitle>
          <DialogDescription>
            Templates help you create tasks quickly. Use placeholders like `{'{{Location}}'}` in titles.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 max-h-[70vh] overflow-y-auto p-1 pr-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="name">Template Name *</Label>
              <Input id="name" value={formData.name} onChange={(e) => handleInputChange('name', e.target.value)} required />
            </div>
            <div>
              <Label htmlFor="title_template">Title Template *</Label>
              <Input id="title_template" value={formData.title_template} onChange={(e) => handleInputChange('title_template', e.target.value)} placeholder="e.g., Service for {{Location}}" required />
            </div>
          </div>

          <div>
            <Label htmlFor="description_template">Description Template</Label>
            <Textarea id="description_template" value={formData.description_template} onChange={(e) => handleInputChange('description_template', e.target.value)} />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="default_priority">Default Priority</Label>
              <Select value={formData.default_priority} onValueChange={(v) => handleInputChange('default_priority', v)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">Low</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                  <SelectItem value="urgent">Urgent</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="category">Category</Label>
              <Select value={formData.category} onValueChange={(v) => handleInputChange('category', v)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                    <SelectItem value="maintenance">Maintenance</SelectItem>
                    <SelectItem value="housekeeping">Housekeeping</SelectItem>
                    <SelectItem value="service">Service</SelectItem>
                    <SelectItem value="project">Project</SelectItem>
                    <SelectItem value="admin">Admin</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
                <Label htmlFor="estimated_hours">Est. Hours</Label>
                <Input id="estimated_hours" type="number" value={formData.estimated_hours} onChange={(e) => handleInputChange('estimated_hours', e.target.value)} />
            </div>
          </div>

          <div>
            <Label>Default Tags</Label>
            <div className="flex gap-2 mt-1">
                <Input value={newTag} onChange={e => setNewTag(e.target.value)} placeholder="Add a tag..." onKeyPress={e => e.key === 'Enter' && (e.preventDefault(), handleListChange('default_tags', newTag, 'add'), setNewTag(''))}/>
                <Button type="button" variant="outline" onClick={() => {handleListChange('default_tags', newTag, 'add'); setNewTag('');}}>
                    <Plus className="w-4 h-4"/>
                </Button>
            </div>
            <div className="flex flex-wrap gap-2 mt-2">
                {formData.default_tags.map((tag, index) => <Badge key={`tag-${tag}-${index}`} variant="secondary">{tag} <button type="button" onClick={() => handleListChange('default_tags', tag, 'remove')}><X className="w-3 h-3 ml-1"/></button></Badge>)}
            </div>
          </div>
          
          <div>
            <Label>Checklist Items</Label>
             <div className="flex gap-2 mt-1">
                <Input value={newChecklistItem} onChange={e => setNewChecklistItem(e.target.value)} placeholder="Add checklist item..." onKeyPress={e => e.key === 'Enter' && (e.preventDefault(), handleListChange('checklist_template', newChecklistItem, 'add'), setNewChecklistItem(''))}/>
                <Button type="button" variant="outline" onClick={() => {handleListChange('checklist_template', newChecklistItem, 'add'); setNewChecklistItem('');}}>
                    <Plus className="w-4 h-4"/>
                </Button>
            </div>
            <div className="space-y-2 mt-2">
                {formData.checklist_template.map((item, index) => <div key={`checklist-${item}-${index}`} className="flex items-center gap-2 text-sm p-2 bg-slate-50 rounded-md">{item} <button type="button" className="ml-auto" onClick={() => handleListChange('checklist_template', item, 'remove')}><X className="w-4 h-4 text-red-500"/></button></div>)}
            </div>
          </div>

        <DialogFooter>
          <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={loading}>Cancel</Button>
          <Button type="submit" disabled={loading}>{loading ? 'Saving...' : 'Save Template'}</Button>
        </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
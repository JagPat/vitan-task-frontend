import React, { useState, useEffect } from "react";
import { TaskTemplate } from "@/api/entities";
import { Button } from "@/components/ui/button";
import { Plus, ClipboardList } from "lucide-react";

import TemplateCard from "../components/templates/TemplateCard";
import TemplateFormDialog from "../components/templates/TemplateFormDialog";

export default function Templates() {
  const [templates, setTemplates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showDialog, setShowDialog] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState(null);

  useEffect(() => {
    loadTemplates();
  }, []);

  const loadTemplates = async () => {
    setLoading(true);
    try {
      const templatesData = await TaskTemplate.list("-usage_count");
      setTemplates(templatesData);
    } catch (error) {
      console.error("Error loading templates:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = () => {
    setSelectedTemplate(null);
    setShowDialog(true);
  };

  const handleEdit = (template) => {
    setSelectedTemplate(template);
    setShowDialog(true);
  };

  const handleDelete = async (templateId) => {
    try {
      await TaskTemplate.delete(templateId);
      loadTemplates(); // Refresh the list
    } catch (error) {
      console.error("Error deleting template:", error);
    }
  };

  const handleSave = async (templateData) => {
    try {
      if (selectedTemplate) {
        await TaskTemplate.update(selectedTemplate.id, templateData);
      } else {
        await TaskTemplate.create(templateData);
      }
      setShowDialog(false);
      loadTemplates(); // Refresh the list
    } catch (error) {
      console.error("Error saving template:", error);
    }
  };

  if (loading) {
    return (
      <div className="p-4 lg:p-8 max-w-7xl mx-auto">
        <div className="animate-pulse space-y-6">
          <div className="h-10 bg-slate-200 rounded w-1/3"></div>
          <div className="h-8 bg-slate-200 rounded w-1/4"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-56 bg-slate-200 rounded-2xl"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 lg:p-8 max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl lg:text-4xl font-bold text-slate-800 flex items-center gap-3">
            <ClipboardList className="w-8 h-8" />
            Task Templates
          </h1>
          <p className="text-slate-600 mt-1">
            Create and manage reusable templates for common tasks.
          </p>
        </div>
        <Button 
          onClick={handleCreate}
          className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 shadow-md"
        >
          <Plus className="w-4 h-4 mr-2" />
          Create Template
        </Button>
      </div>

      {/* Templates Grid */}
      {templates.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {templates.map((template) => (
            <TemplateCard
              key={template.id}
              template={template}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-24 border-2 border-dashed border-slate-200 rounded-2xl">
          <ClipboardList className="w-16 h-16 text-slate-400 mx-auto mb-4" />
          <h3 className="text-xl font-medium text-slate-700 mb-2">No templates yet</h3>
          <p className="text-slate-500 mb-6">Create your first template to speed up task creation.</p>
          <Button onClick={handleCreate}>
            <Plus className="w-4 h-4 mr-2" />
            Create Template
          </Button>
        </div>
      )}

      {/* Form Dialog */}
      <TemplateFormDialog
        open={showDialog}
        onOpenChange={setShowDialog}
        template={selectedTemplate}
        onSave={handleSave}
      />
    </div>
  );
}
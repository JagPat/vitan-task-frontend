import React, { useState, useEffect } from "react";
import { TaskTemplate } from "@/api/entities";
import { Button } from "@/components/ui/button";
import { Plus, ClipboardList } from "lucide-react";

import TaskTemplateManager from "@/components/tasks/TaskTemplateManager";

export default function Templates() {
  const handleTemplateSelect = (template) => {
    // This will be used when integrating with task creation
    console.log('Template selected:', template);
  };

  return (
    <div className="p-4 lg:p-8 max-w-7xl mx-auto">
      <TaskTemplateManager
        onTemplateSelect={handleTemplateSelect}
        projects={[]}
        users={[]}
      />
    </div>
  );
}
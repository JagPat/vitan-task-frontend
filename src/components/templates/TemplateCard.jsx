import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { MoreVertical, Edit, Trash2, CheckSquare, Clock, Tag } from 'lucide-react';

export default function TemplateCard({ template, onEdit, onDelete }) {
  const categoryColors = {
    maintenance: "bg-blue-100 text-blue-700",
    housekeeping: "bg-green-100 text-green-700",
    service: "bg-purple-100 text-purple-700",
    project: "bg-amber-100 text-amber-700",
    admin: "bg-slate-100 text-slate-700",
    other: "bg-gray-100 text-gray-700",
  };

  return (
    <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 flex flex-col">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <CardTitle className="text-lg font-semibold text-slate-800">{template.name}</CardTitle>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <MoreVertical className="w-4 h-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => onEdit(template)}>
                <Edit className="w-4 h-4 mr-2" />
                Edit
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onDelete(template.id)} className="text-red-600">
                <Trash2 className="w-4 h-4 mr-2" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        <p className="text-sm text-slate-500 line-clamp-2">{template.title_template}</p>
      </CardHeader>
      <CardContent className="flex-grow space-y-3">
        <div className="flex items-center gap-2">
          <Badge className={categoryColors[template.category] || categoryColors.other}>
            {template.category}
          </Badge>
          <Badge variant="secondary">Used {template.usage_count || 0} times</Badge>
        </div>
        <div className="space-y-2 text-sm text-slate-600">
          {template.checklist_template?.length > 0 && (
            <div className="flex items-center gap-2">
              <CheckSquare className="w-4 h-4 text-slate-400" />
              <span>{template.checklist_template.length} checklist items</span>
            </div>
          )}
          {template.default_tags?.length > 0 && (
            <div className="flex items-center gap-2">
              <Tag className="w-4 h-4 text-slate-400" />
              <span>{template.default_tags.length} tags</span>
            </div>
          )}
          {template.estimated_hours && (
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-slate-400" />
              <span>{template.estimated_hours} estimated hours</span>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
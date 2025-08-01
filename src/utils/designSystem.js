// Unified Design System for WhatsTask
// This ensures consistent styling across all components

export const colors = {
  // Status Colors
  status: {
    pending: { bg: 'bg-yellow-100', text: 'text-yellow-800', border: 'border-yellow-200' },
    in_progress: { bg: 'bg-blue-100', text: 'text-blue-800', border: 'border-blue-200' },
    completed: { bg: 'bg-green-100', text: 'text-green-800', border: 'border-green-200' },
    needs_approval: { bg: 'bg-purple-100', text: 'text-purple-800', border: 'border-purple-200' },
    closed: { bg: 'bg-gray-100', text: 'text-gray-800', border: 'border-gray-200' },
    overdue: { bg: 'bg-red-100', text: 'text-red-800', border: 'border-red-200' },
    on_hold: { bg: 'bg-orange-100', text: 'text-orange-800', border: 'border-orange-200' }
  },
  
  // Priority Colors
  priority: {
    low: { bg: 'bg-slate-100', text: 'text-slate-700', border: 'border-slate-200' },
    medium: { bg: 'bg-blue-100', text: 'text-blue-700', border: 'border-blue-200' },
    high: { bg: 'bg-amber-100', text: 'text-amber-700', border: 'border-amber-200' },
    urgent: { bg: 'bg-red-100', text: 'text-red-700', border: 'border-red-200' }
  },
  
  // Project Status Colors
  projectStatus: {
    active: { bg: 'bg-green-100', text: 'text-green-800', border: 'border-green-200' },
    completed: { bg: 'bg-blue-100', text: 'text-blue-800', border: 'border-blue-200' },
    on_hold: { bg: 'bg-yellow-100', text: 'text-yellow-800', border: 'border-yellow-200' },
    cancelled: { bg: 'bg-red-100', text: 'text-red-800', border: 'border-red-200' }
  }
};

export const spacing = {
  card: 'p-6',
  cardCompact: 'p-4',
  section: 'space-y-6',
  sectionCompact: 'space-y-4',
  grid: 'gap-6',
  gridCompact: 'gap-4'
};

export const shadows = {
  card: 'shadow-sm hover:shadow-md transition-shadow duration-200',
  cardElevated: 'shadow-md hover:shadow-lg transition-shadow duration-200',
  cardInteractive: 'shadow-sm hover:shadow-lg transition-all duration-200 hover:-translate-y-1'
};

export const borderRadius = {
  card: 'rounded-xl',
  button: 'rounded-lg',
  input: 'rounded-md'
};

// Helper functions for consistent styling
export const getStatusStyle = (status) => {
  return colors.status[status] || colors.status.pending;
};

export const getPriorityStyle = (priority) => {
  return colors.priority[priority] || colors.priority.medium;
};

export const getProjectStatusStyle = (status) => {
  return colors.projectStatus[status] || colors.projectStatus.active;
};

// Standard card wrapper component styles
export const cardStyles = {
  default: `bg-white border border-slate-200 ${shadows.card} ${borderRadius.card}`,
  interactive: `bg-white border border-slate-200 ${shadows.cardInteractive} ${borderRadius.card} cursor-pointer`,
  elevated: `bg-white border border-slate-200 ${shadows.cardElevated} ${borderRadius.card}`
}; 
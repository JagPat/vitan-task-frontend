import React from 'react';

const base = 'inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none';
const variants = {
  default: 'bg-blue-600 text-white hover:bg-blue-700 focus-visible:ring-blue-600',
  secondary: 'bg-gray-900 text-white hover:bg-gray-800 focus-visible:ring-gray-900',
  outline: 'border border-gray-200 hover:bg-gray-50',
  ghost: 'hover:bg-gray-50',
  destructive: 'bg-red-600 text-white hover:bg-red-700 focus-visible:ring-red-600'
};
const sizes = {
  sm: 'h-8 px-3',
  md: 'h-10 px-4',
  lg: 'h-11 px-6'
};

export function Button({ variant = 'default', size = 'md', className = '', children, ...props }) {
  const variantClass = variants[variant] || variants.default;
  const sizeClass = sizes[size] || sizes.md;
  return (
    <button className={`${base} ${variantClass} ${sizeClass} ${className}`} {...props}>
      {children}
    </button>
  );
}

export default Button;



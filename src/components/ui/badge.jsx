/* eslint-disable react-refresh/only-export-components */
/* eslint-disable react/prop-types */
import React from 'react';
import { cva } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const badgeVariants = cva(
  'inline-flex items-center border rounded-full px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2',
  {
    variants: {
      variant: {
        default: 'bg-primary text-primary-foreground',
        secondary: 'bg-secondary text-secondary-foreground',
        destructive: 'bg-destructive text-destructive-foreground',
        outline: 'text-foreground',
        muted: 'bg-muted text-muted-foreground',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  },
);

const Badge = React.forwardRef(({ className, variant, ...props }, ref) => (
  <div
    ref={ref}
    data-slot="badge"
    className={cn(badgeVariants({ variant }), className)}
    {...props}
  />
));

Badge.displayName = 'Badge';

export { Badge, badgeVariants };

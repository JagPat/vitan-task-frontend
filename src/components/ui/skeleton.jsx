/* eslint-disable react/prop-types */
import { cn } from '@/lib/utils';

const Skeleton = ({ className, ...props }) => (
  <div
    data-slot="skeleton"
    className={cn('bg-muted animate-pulse rounded-md', className)}
    {...props}
  />
);

export { Skeleton };

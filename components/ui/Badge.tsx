import * as React from 'react';
import { cn } from './utils';

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'success' | 'warning' | 'danger' | 'outline';
}

export function Badge({ className, variant = 'default', ...props }: BadgeProps) {
  return (
    <div
      className={cn(
        'inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em]',
        variant === 'default' && 'bg-slate-100 text-slate-800',
        variant === 'success' && 'bg-emerald-100 text-emerald-800',
        variant === 'warning' && 'bg-amber-100 text-amber-800',
        variant === 'danger' && 'bg-red-100 text-red-800',
        variant === 'outline' && 'border border-slate-200 bg-white text-slate-900',
        className
      )}
      {...props}
    />
  );
}

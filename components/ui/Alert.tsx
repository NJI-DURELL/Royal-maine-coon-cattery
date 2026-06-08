import * as React from 'react';
import { cn } from './utils';

export interface AlertProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'success' | 'warning' | 'danger' | 'info';
}

export const Alert = React.forwardRef<HTMLDivElement, AlertProps>(({ className, variant = 'info', children, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      'rounded-3xl border px-4 py-4 text-sm shadow-sm',
      variant === 'success' && 'border-emerald-200 bg-emerald-50 text-emerald-900',
      variant === 'warning' && 'border-amber-200 bg-amber-50 text-amber-900',
      variant === 'danger' && 'border-red-200 bg-red-50 text-red-900',
      variant === 'info' && 'border-slate-200 bg-slate-50 text-slate-900',
      className
    )}
    {...props}
  >
    {children}
  </div>
));
Alert.displayName = 'Alert';

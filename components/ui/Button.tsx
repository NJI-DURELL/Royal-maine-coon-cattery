import * as React from 'react';
import { cn } from './utils';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'secondary' | 'ghost' | 'danger';
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'default', ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(
          'inline-flex items-center justify-center rounded-full px-5 py-3 text-sm font-semibold transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-royal-400 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60',
          variant === 'default' && 'bg-royal-500 text-slate-50 hover:bg-royal-600',
          variant === 'secondary' && 'border border-slate-300 bg-white text-slate-900 hover:bg-slate-50',
          variant === 'ghost' && 'bg-transparent text-slate-900 hover:bg-slate-100',
          variant === 'danger' && 'bg-red-600 text-white hover:bg-red-700',
          className
        )}
        {...props}
      />
    );
  }
);
Button.displayName = 'Button';

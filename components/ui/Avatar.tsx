import * as React from 'react';
import { cn } from './utils';

export interface AvatarProps extends React.HTMLAttributes<HTMLDivElement> {
  src?: string;
  initials?: string;
}

export function Avatar({ className, src, initials = 'RM', ...props }: AvatarProps) {
  return (
    <div className={cn('inline-flex h-11 w-11 items-center justify-center rounded-full bg-royal-100 text-slate-900', className)} {...props}>
      {src ? <img src={src} alt="Profile avatar" className="h-full w-full rounded-full object-cover" /> : <span className="text-sm font-semibold">{initials}</span>}
    </div>
  );
}

import * as React from 'react';
import { cn } from '@/lib/utils';

/**
 * Input — text fields, per Design System §6.2.
 * Always 40px height; border subtle; focus ring brand-blue.
 */
export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: boolean;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type = 'text', error, ...props }, ref) => {
    return (
      <input
        type={type}
        ref={ref}
        className={cn(
          'flex h-10 w-full rounded-md border border-neutral-200 bg-white px-3 py-2',
          'text-body-sm font-sans text-neutral-900 placeholder:text-neutral-300',
          'transition-colors duration-150',
          'focus-visible:outline-none focus-visible:border-primary-500',
          'focus-visible:ring-2 focus-visible:ring-primary-500/20',
          'disabled:cursor-not-allowed disabled:opacity-50 disabled:bg-neutral-50',
          error && 'border-danger-500 focus-visible:border-danger-500 focus-visible:ring-danger-500/20',
          className,
        )}
        {...props}
      />
    );
  },
);
Input.displayName = 'Input';

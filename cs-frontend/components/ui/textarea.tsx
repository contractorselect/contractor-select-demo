import * as React from 'react';
import { cn } from '@/lib/utils';

export interface TextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  error?: boolean;
}

export const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, error, ...props }, ref) => {
    return (
      <textarea
        ref={ref}
        className={cn(
          'flex min-h-[96px] w-full resize-y rounded-md border border-neutral-200 bg-white px-3 py-2',
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
Textarea.displayName = 'Textarea';

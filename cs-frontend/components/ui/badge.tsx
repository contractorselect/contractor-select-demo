import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

/**
 * Badge — pill component per Design System §6.6.
 * Used for status indicators, count badges, category tags.
 *
 * Variants map to the 5 state categories (neutral / action / success / critical / info).
 */
const badgeVariants = cva(
  'inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-caption font-sans font-medium transition-colors',
  {
    variants: {
      variant: {
        neutral: 'bg-neutral-100 text-neutral-700',
        action: 'bg-warning-50 text-warning-700',
        success: 'bg-success-50 text-success-700',
        critical: 'bg-danger-50 text-danger-700',
        info: 'bg-primary-50 text-primary-700',
      },
      size: {
        sm: 'h-5 px-2 text-[11px]',
        md: 'h-6 px-2.5',
      },
    },
    defaultVariants: { variant: 'neutral', size: 'md' },
  },
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof badgeVariants> {}

export function Badge({ className, variant, size, ...props }: BadgeProps) {
  return (
    <span className={cn(badgeVariants({ variant, size }), className)} {...props} />
  );
}

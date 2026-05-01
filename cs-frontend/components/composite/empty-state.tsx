import * as React from 'react';
import { type LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface EmptyStateProps {
  icon?: LucideIcon;
  title: string;
  description?: string;
  action?: React.ReactNode;
  className?: string;
}

/**
 * EmptyState — factual, never motivational.
 * Per Design System §6.8 — three elements (icon, headline, description).
 */
export function EmptyState({
  icon: Icon,
  title,
  description,
  action,
  className,
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center text-center px-6 py-12',
        className,
      )}
    >
      {Icon && (
        <div className="mb-4 rounded-full bg-neutral-50 p-3">
          <Icon
            className="h-6 w-6 text-neutral-400"
            strokeWidth={1.75}
            aria-hidden
          />
        </div>
      )}
      <h4 className="text-h4 font-display font-semibold text-neutral-900">
        {title}
      </h4>
      {description && (
        <p className="mt-1 max-w-md text-body-sm font-sans text-neutral-400">
          {description}
        </p>
      )}
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
}

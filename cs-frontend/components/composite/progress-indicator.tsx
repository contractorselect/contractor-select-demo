'use client';

import { Check } from 'lucide-react';
import { cn } from '@/lib/utils';

/**
 * ProgressIndicator — multi-step wizard navigation.
 * Per Design System §6.6.
 */
interface Step {
  id: string;
  label: string;
}

interface ProgressIndicatorProps {
  steps: Step[];
  currentStepId: string;
  completedStepIds?: string[];
  onStepClick?: (stepId: string) => void;
  className?: string;
}

export function ProgressIndicator({
  steps,
  currentStepId,
  completedStepIds = [],
  onStepClick,
  className,
}: ProgressIndicatorProps) {
  const currentIndex = steps.findIndex((s) => s.id === currentStepId);

  return (
    <nav aria-label="Progress" className={cn('w-full', className)}>
      <ol className="flex items-center w-full">
        {steps.map((step, index) => {
          const isCompleted = completedStepIds.includes(step.id);
          const isCurrent = step.id === currentStepId;
          const isClickable = onStepClick && (isCompleted || index < currentIndex);

          return (
            <li
              key={step.id}
              className={cn(
                'flex items-center flex-1',
                index === steps.length - 1 ? 'flex-none' : '',
              )}
            >
              <button
                type="button"
                onClick={() => isClickable && onStepClick?.(step.id)}
                disabled={!isClickable}
                className={cn(
                  'flex items-center gap-3 group',
                  isClickable ? 'cursor-pointer' : 'cursor-default',
                )}
              >
                <span
                  className={cn(
                    'flex h-8 w-8 items-center justify-center rounded-full transition-colors',
                    'text-caption font-sans font-semibold tabular-nums',
                    isCompleted &&
                      'bg-success-700 text-white',
                    isCurrent &&
                      !isCompleted &&
                      'bg-primary-900 text-white ring-4 ring-primary-100',
                    !isCurrent &&
                      !isCompleted &&
                      'bg-neutral-100 text-neutral-400 group-hover:bg-neutral-200',
                  )}
                >
                  {isCompleted ? (
                    <Check className="h-4 w-4" strokeWidth={3} />
                  ) : (
                    index + 1
                  )}
                </span>
                <span
                  className={cn(
                    'text-body-sm font-sans hidden md:inline',
                    isCurrent
                      ? 'font-semibold text-neutral-900'
                      : isCompleted
                        ? 'text-neutral-700'
                        : 'text-neutral-400',
                  )}
                >
                  {step.label}
                </span>
              </button>
              {index < steps.length - 1 && (
                <span
                  className={cn(
                    'mx-3 h-0.5 flex-1 transition-colors',
                    isCompleted ? 'bg-success-700' : 'bg-neutral-100',
                  )}
                  aria-hidden
                />
              )}
            </li>
          );
        })}
      </ol>
      {/* Mobile: show "Step N of M: <label>" beneath */}
      <p className="mt-3 text-caption font-sans text-neutral-400 md:hidden">
        Step {currentIndex + 1} of {steps.length}:{' '}
        <span className="text-neutral-700 font-medium">
          {steps[currentIndex]?.label}
        </span>
      </p>
    </nav>
  );
}

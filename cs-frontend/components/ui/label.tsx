'use client';

import * as React from 'react';
import * as LabelPrimitive from '@radix-ui/react-label';
import { cn } from '@/lib/utils';

export const Label = React.forwardRef<
  React.ElementRef<typeof LabelPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof LabelPrimitive.Root> & {
    required?: boolean;
  }
>(({ className, children, required, ...props }, ref) => (
  <LabelPrimitive.Root
    ref={ref}
    className={cn(
      'text-body-sm font-medium font-sans text-neutral-900',
      'peer-disabled:cursor-not-allowed peer-disabled:opacity-50',
      className,
    )}
    {...props}
  >
    {children}
    {required && <span className="ml-1 text-neutral-400" aria-hidden>*</span>}
  </LabelPrimitive.Root>
));
Label.displayName = LabelPrimitive.Root.displayName;

/**
 * FormField — composition wrapper that bundles label + input + helper/error.
 *
 * Usage:
 *   <FormField label="Project title" htmlFor="title" required helperText="Visible to the matching team">
 *     <Input id="title" />
 *   </FormField>
 */
interface FormFieldProps {
  label: string;
  htmlFor?: string;
  required?: boolean;
  helperText?: string;
  errorText?: string;
  children: React.ReactNode;
  className?: string;
}

export function FormField({
  label,
  htmlFor,
  required,
  helperText,
  errorText,
  children,
  className,
}: FormFieldProps) {
  const showError = Boolean(errorText);
  return (
    <div className={cn('space-y-2', className)}>
      <Label htmlFor={htmlFor} required={required}>
        {label}
      </Label>
      {children}
      {showError && (
        <p className="text-caption font-sans text-danger-500">{errorText}</p>
      )}
      {!showError && helperText && (
        <p className="text-caption font-sans text-neutral-400">{helperText}</p>
      )}
    </div>
  );
}

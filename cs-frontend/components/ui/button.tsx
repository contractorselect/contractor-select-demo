import * as React from 'react';
import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

/**
 * Button — implements all variants from Design System §6.1.
 *
 * Variants:
 *   primary       — main CTAs (blue)
 *   secondary     — common but not primary (white + border)
 *   tertiary      — text-only low emphasis
 *   success       — payment + unlock actions (green) — use for "Pay & Unlock"
 *   destructive   — irreversible negative actions
 *   ghost         — toolbar / icon-only
 *
 * Sizes: sm (32), md (40, default), lg (48 — payment-class buttons)
 */
const buttonVariants = cva(
  // Base — applied to all variants
  [
    'inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md',
    'font-sans font-semibold transition-colors duration-150',
    'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-500',
    'disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none',
  ],
  {
    variants: {
      variant: {
        primary: 'bg-primary-900 text-white hover:bg-primary-700 active:bg-primary-950',
        secondary:
          'bg-white text-neutral-900 border border-neutral-200 hover:bg-neutral-50 active:bg-neutral-100',
        tertiary:
          'bg-transparent text-primary-900 hover:bg-primary-50 active:bg-primary-100',
        success: 'bg-success-700 text-white hover:bg-success-900 active:bg-success-900',
        destructive:
          'bg-white text-danger-500 border border-danger-500 hover:bg-danger-50 active:bg-danger-50',
        ghost: 'bg-transparent text-neutral-700 hover:bg-neutral-50 active:bg-neutral-100',
      },
      size: {
        sm: 'h-8 px-3 text-body-sm',
        md: 'h-10 px-4 text-body-sm',
        lg: 'h-12 px-6 text-body',
      },
    },
    defaultVariants: {
      variant: 'primary',
      size: 'md',
    },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
  loading?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, loading = false, children, disabled, ...props }, ref) => {
    const Comp = asChild ? Slot : 'button';
    return (
      <Comp
        className={cn(buttonVariants({ variant, size }), className)}
        ref={ref}
        disabled={disabled || loading}
        {...props}
      >
        {loading && (
          <svg
            className="h-4 w-4 animate-spin"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
            />
          </svg>
        )}
        {children}
      </Comp>
    );
  },
);
Button.displayName = 'Button';

export { buttonVariants };

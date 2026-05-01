import { Shield, Lock } from 'lucide-react';
import { cn } from '@/lib/utils';
import { formatCurrency } from '@/lib/format';

/**
 * LockedSection — wraps content gated by the unlock state.
 *
 * The visual treatment is deliberate per Design System §6.8:
 *   - Subtle pattern background (NOT greyed-out — that reads "disabled")
 *   - Shield icon (security, not lock-as-prison)
 *   - Clear "what unlocks this" copy
 *   - Optional inline CTA when applicable
 */
interface LockedSectionProps {
  label: string;
  description?: string;
  unlockPriceAed?: number;
  awaitingPayment?: boolean;
  className?: string;
}

export function LockedSection({
  label,
  description,
  unlockPriceAed,
  awaitingPayment,
  className,
}: LockedSectionProps) {
  return (
    <div
      className={cn(
        'locked-pattern rounded-md border border-neutral-100 px-4 py-3',
        'flex items-start gap-3',
        className,
      )}
      aria-label={`${label} — locked until payment`}
    >
      <div className="flex-shrink-0 rounded-full bg-primary-50 p-2 mt-0.5">
        <Shield className="h-4 w-4 text-primary-900" strokeWidth={2.25} />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-body-sm font-sans font-medium text-neutral-900">
          {label}
        </p>
        {description && (
          <p className="text-caption font-sans text-neutral-400 mt-0.5">
            {description}
          </p>
        )}
        {awaitingPayment && (
          <p className="text-caption font-sans text-warning-700 mt-1.5 inline-flex items-center gap-1">
            <Lock className="h-3 w-3" /> Awaiting payment
          </p>
        )}
        {unlockPriceAed !== undefined && !awaitingPayment && (
          <p className="text-caption font-sans text-neutral-600 mt-1.5">
            Unlock for{' '}
            <span className="text-handle text-primary-900">
              {formatCurrency(unlockPriceAed)}
            </span>
          </p>
        )}
      </div>
    </div>
  );
}

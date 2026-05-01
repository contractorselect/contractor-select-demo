import { cn } from '@/lib/utils';
import { formatCurrency } from '@/lib/format';

/**
 * PriceBreakdown — used on payment, award confirmation, contract pack.
 *
 * Per Design System §6.8 + §5.5 (Money is loud):
 *   - Total is the largest number on screen
 *   - VAT broken out separately, never hidden in subtotal
 *   - Service fee broken out
 *   - Tabular numerals throughout
 *   - Currency code spelled out (AED, not symbol)
 */
interface PriceBreakdownProps {
  bidTotal: number;
  vatRate: number;          // e.g. 0.05
  vatAmount: number;        // pre-computed for transparency
  serviceFee: number;
  totalPayable: number;
  currency?: string;
  emphasis?: 'normal' | 'large';
  className?: string;
}

export function PriceBreakdown({
  bidTotal,
  vatRate,
  vatAmount,
  serviceFee,
  totalPayable,
  currency = 'AED',
  emphasis = 'normal',
  className,
}: PriceBreakdownProps) {
  const isLarge = emphasis === 'large';

  return (
    <div className={cn('space-y-2', className)}>
      <Row label="Bid total" value={formatCurrency(bidTotal, currency)} />
      <Row
        label={`VAT (${(vatRate * 100).toFixed(0)}%)`}
        value={formatCurrency(vatAmount, currency)}
      />
      <Row
        label="Subtotal"
        value={formatCurrency(bidTotal + vatAmount, currency)}
        muted
      />
      <Row
        label="Platform service fee"
        value={formatCurrency(serviceFee, currency)}
      />
      <div className="border-t border-neutral-200 pt-3 mt-3">
        <div className="flex items-baseline justify-between gap-4">
          <span
            className={cn(
              'font-sans font-medium text-neutral-900',
              isLarge ? 'text-h4' : 'text-body-sm',
            )}
          >
            Total payable
          </span>
          <span
            className={cn(
              'tabular-nums font-display font-bold text-neutral-900',
              isLarge ? 'text-money-xl' : 'text-money-lg',
            )}
          >
            {formatCurrency(totalPayable, currency)}
          </span>
        </div>
      </div>
    </div>
  );
}

function Row({
  label,
  value,
  muted,
}: {
  label: string;
  value: string;
  muted?: boolean;
}) {
  return (
    <div className="flex items-baseline justify-between gap-4">
      <span
        className={cn(
          'text-body-sm font-sans',
          muted ? 'text-neutral-400' : 'text-neutral-700',
        )}
      >
        {label}
      </span>
      <span
        className={cn(
          'text-body-sm font-sans tabular-nums',
          muted ? 'text-neutral-400' : 'text-neutral-900',
        )}
      >
        {value}
      </span>
    </div>
  );
}

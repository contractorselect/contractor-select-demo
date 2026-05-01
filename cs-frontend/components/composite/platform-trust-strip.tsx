import { Shield, Scale, Lock } from 'lucide-react';
import { cn } from '@/lib/utils';

/**
 * PlatformTrustStrip — surface-agnostic component reinforcing the
 * platform's protections at moments where confidence matters.
 *
 * Used on sign-up, dashboard, and bid-comparison surfaces. Calm,
 * factual phrasing — never promotional, never urgent. Each item
 * reflects an actual platform behavior:
 *
 *   - "Funds held in escrow until kickoff" — payments held until
 *     kickoff confirmation; reverse-transfer reclaims from contractor
 *     account if needed.
 *   - "Disputes mediated" — admin team handles disputes via the
 *     reconciliation cron + manual review queue.
 *   - "Identity protected" — the Critical Rule: contractor PII
 *     remains masked server-side until award + payment.
 *
 * Per Brand Integration Validation §5.2 / §5.10. Replaces the
 * previous gap of trust language being absent on these surfaces.
 */
interface PlatformTrustStripProps {
  variant?: 'subtle' | 'prominent';
  className?: string;
}

const ITEMS = [
  {
    icon: Shield,
    label: 'Funds held in escrow',
    detail: 'Released to contractor only after kickoff confirmed',
  },
  {
    icon: Scale,
    label: 'Disputes mediated',
    detail: 'ContractorSelect compliance team handles conflicts',
  },
  {
    icon: Lock,
    label: 'Identity protected',
    detail: 'Contractor details revealed only after award + payment',
  },
] as const;

export function PlatformTrustStrip({
  variant = 'subtle',
  className,
}: PlatformTrustStripProps) {
  const isProminent = variant === 'prominent';

  return (
    <div
      className={cn(
        'rounded-md border',
        isProminent
          ? 'bg-primary-50/60 border-primary-100 px-4 py-3'
          : 'bg-neutral-50/70 border-neutral-100 px-4 py-3',
        className,
      )}
      role="region"
      aria-label="Platform protections"
    >
      <ul className="flex flex-col sm:flex-row sm:flex-wrap gap-x-6 gap-y-2.5">
        {ITEMS.map((item) => {
          const Icon = item.icon;
          return (
            <li key={item.label} className="flex items-start gap-2 min-w-0">
              <Icon
                className={cn(
                  'h-4 w-4 mt-0.5 flex-shrink-0',
                  isProminent ? 'text-primary-900' : 'text-neutral-700',
                )}
                strokeWidth={2.25}
                aria-hidden
              />
              <div className="min-w-0">
                <p className="text-body-sm font-sans font-medium text-neutral-900 leading-tight">
                  {item.label}
                </p>
                <p className="text-caption font-sans text-neutral-400 mt-0.5 leading-snug">
                  {item.detail}
                </p>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

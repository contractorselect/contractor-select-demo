import {
  ShieldCheck,
  BadgeCheck,
  FileCheck,
  Award,
  Star,
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface TrustSignalProps {
  isKycVerified: boolean;
  isInsured: boolean;
  isLicenseVerified: boolean;
  completedProjectCount?: number;
  trustScore?: number;
  reviewCount?: number;
  variant?: 'inline' | 'stacked';
  className?: string;
}

/**
 * TrustSignals — restrained badge cluster per Design System §6.6.
 *
 * Identity-NEUTRAL: never reveals legal name, license number, or
 * specific identifiers. Pre- and post-unlock both render this; the
 * unlocked variant adds licenseNumber as a separate component.
 */
export function TrustSignals({
  isKycVerified,
  isInsured,
  isLicenseVerified,
  completedProjectCount,
  trustScore,
  reviewCount,
  variant = 'inline',
  className,
}: TrustSignalProps) {
  const items = [
    isKycVerified && {
      icon: ShieldCheck,
      label: 'KYC Verified',
      tone: 'success' as const,
    },
    isInsured && {
      icon: BadgeCheck,
      label: 'Insured',
      tone: 'success' as const,
    },
    isLicenseVerified && {
      icon: FileCheck,
      label: 'License Verified',
      tone: 'success' as const,
    },
    completedProjectCount !== undefined && completedProjectCount > 0 && {
      icon: Award,
      label: `${completedProjectCount} Projects`,
      tone: 'neutral' as const,
    },
  ].filter(Boolean) as Array<{
    icon: typeof ShieldCheck;
    label: string;
    tone: 'success' | 'neutral';
  }>;

  return (
    <div
      className={cn(
        'flex',
        variant === 'inline' && 'flex-wrap items-center gap-x-4 gap-y-2',
        variant === 'stacked' && 'flex-col gap-2',
        className,
      )}
    >
      {items.map(({ icon: Icon, label, tone }) => (
        <span
          key={label}
          className={cn(
            'inline-flex items-center gap-1.5 text-caption font-sans font-medium',
            tone === 'success' && 'text-success-700',
            tone === 'neutral' && 'text-neutral-600',
          )}
        >
          <Icon
            className="h-3.5 w-3.5"
            strokeWidth={2.25}
            aria-hidden
          />
          {label}
        </span>
      ))}
      {trustScore !== undefined && (
        <span className="inline-flex items-center gap-1.5 text-caption font-sans font-medium text-neutral-700">
          <Star
            className="h-3.5 w-3.5 fill-warning-500 text-warning-500"
            strokeWidth={1.5}
            aria-hidden
          />
          <span className="tabular-nums">{trustScore.toFixed(1)}</span>
          {reviewCount !== undefined && (
            <span className="text-neutral-400">({reviewCount})</span>
          )}
        </span>
      )}
    </div>
  );
}

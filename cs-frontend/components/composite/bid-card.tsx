'use client';

import * as React from 'react';
import { Calendar, Clock, FileText, ArrowUpRight } from 'lucide-react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { StatusBadge } from './status-badge';
import { TrustSignals } from './trust-signals';
import { formatCurrency, formatHandle, formatCountdown, formatDate } from '@/lib/format';
import { type BidPublic } from '@/lib/types';
import { cn } from '@/lib/utils';

/**
 * BidCard — single-bid display for contexts outside the comparison table.
 *
 * Used in: vendor's own bid history, RFQ detail showing latest bid,
 * notification deep-links.
 *
 * Per Design System §6.3.
 */
interface BidCardProps {
  bid: BidPublic;
  onView?: () => void;
  onAward?: () => void;
  onWithdraw?: () => void;
  variant?: 'client' | 'vendor';
  className?: string;
}

export function BidCard({
  bid,
  onView,
  onAward,
  onWithdraw,
  variant = 'client',
  className,
}: BidCardProps) {
  return (
    <Card className={cn(className)}>
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-handle text-h4">
                {formatHandle(bid.pseudonymousHandle)}
              </span>
              <StatusBadge type="bid" state={bid.state} size="sm" />
            </div>
            <p className="text-caption font-sans text-neutral-400">
              Submitted {formatDate(bid.submittedAt)}
              {bid.version > 1 && ` · v${bid.version}`}
            </p>
          </div>
          <div className="text-right flex-shrink-0">
            <p className="text-money-lg font-display font-bold text-neutral-900 tabular-nums">
              {formatCurrency(bid.totalPayable, bid.currency)}
            </p>
            <p className="text-caption font-sans text-neutral-400 tabular-nums">
              total payable inc. VAT
            </p>
          </div>
        </div>

        <TrustSignals
          isKycVerified
          isInsured
          isLicenseVerified
          trustScore={bid.trustScore}
          className="mt-3"
        />
      </CardHeader>

      <Separator />

      <CardContent className="pt-4">
        <dl className="grid grid-cols-2 gap-x-4 gap-y-3 text-body-sm font-sans">
          {bid.proposedStartDate && (
            <Detail icon={Calendar} label="Start">
              {formatDate(bid.proposedStartDate)}
            </Detail>
          )}
          {bid.proposedDurationDays !== undefined && (
            <Detail icon={Clock} label="Duration">
              {bid.proposedDurationDays} days
            </Detail>
          )}
          <Detail icon={Clock} label="Bid valid for">
            <span className="tabular-nums">{formatCountdown(bid.validityUntil)}</span>
          </Detail>
          {bid.paymentTerms && (
            <Detail icon={FileText} label="Payment terms">
              {bid.paymentTerms}
            </Detail>
          )}
        </dl>

        <div className="flex flex-wrap gap-2 mt-5">
          <Button variant="secondary" size="sm" onClick={onView} className="gap-1">
            View details
            <ArrowUpRight className="h-3.5 w-3.5" />
          </Button>
          {variant === 'client' && bid.state === 'submitted' && onAward && (
            <Button variant="primary" size="sm" onClick={onAward}>
              Award this bid
            </Button>
          )}
          {variant === 'vendor' && bid.state === 'submitted' && onWithdraw && (
            <Button variant="destructive" size="sm" onClick={onWithdraw}>
              Withdraw
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

function Detail({
  icon: Icon,
  label,
  children,
}: {
  icon: typeof Calendar;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <dt className="inline-flex items-center gap-1 text-caption uppercase tracking-wide text-neutral-400">
        <Icon className="h-3 w-3" />
        {label}
      </dt>
      <dd className="text-neutral-900 mt-0.5">{children}</dd>
    </div>
  );
}

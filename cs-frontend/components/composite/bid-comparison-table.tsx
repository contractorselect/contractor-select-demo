'use client';

import * as React from 'react';
import { ArrowUpRight, ChevronDown, Star, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { TrustSignals } from './trust-signals';
import { formatHandle, formatCurrencyCompact, formatCountdown, formatDate } from '@/lib/format';
import { type BidPublic } from '@/lib/types';
import { cn } from '@/lib/utils';

/**
 * BidComparisonTable — the central comparison artifact.
 *
 * Sticky-left-column layout. Pseudonymous handles as column headers.
 * "Best in column" markers (subtle highlight where this bid is the
 * lowest price, fastest start, etc.) — small green accent, never
 * "BEST!" callouts.
 *
 * Mobile: stacks to a tabbed view via responsive utility (caller
 * detects viewport and switches to BidComparisonStacked variant).
 *
 * Per Design System §8.2.
 */
interface BidComparisonTableProps {
  bids: BidPublic[];
  rfqRef: string;
  rfqTitle: string;
  onAwardBid?: (bidId: string) => void;
  onViewBidDetails?: (bidId: string) => void;
  className?: string;
}

interface ComparisonAttribute {
  key: string;
  label: string;
  render: (bid: BidPublic) => React.ReactNode;
  highlightBest?: 'min' | 'max' | 'earliest' | null;
  numericValue?: (bid: BidPublic) => number;
  emphasis?: 'normal' | 'total';
}

const ATTRIBUTES: ComparisonAttribute[] = [
  {
    key: 'totalPrice',
    label: 'Bid total',
    render: (b) => formatCurrencyCompact(b.totalPrice, b.currency),
    highlightBest: 'min',
    numericValue: (b) => b.totalPrice,
  },
  {
    key: 'vat',
    label: 'VAT (5%)',
    render: (b) => formatCurrencyCompact(b.vatAmount, b.currency),
  },
  {
    key: 'serviceFee',
    label: 'Service fee',
    render: (b) => formatCurrencyCompact(b.serviceFee, b.currency),
  },
  {
    key: 'totalPayable',
    label: 'Total payable',
    render: (b) => formatCurrencyCompact(b.totalPayable, b.currency),
    highlightBest: 'min',
    numericValue: (b) => b.totalPayable,
    emphasis: 'total',
  },
  {
    key: 'validity',
    label: 'Bid valid for',
    render: (b) => formatCountdown(b.validityUntil),
    highlightBest: 'max',
    numericValue: (b) => new Date(b.validityUntil).getTime(),
  },
  {
    key: 'startDate',
    label: 'Proposed start',
    render: (b) => (b.proposedStartDate ? formatDate(b.proposedStartDate) : '—'),
    highlightBest: 'earliest',
    numericValue: (b) =>
      b.proposedStartDate ? new Date(b.proposedStartDate).getTime() : Infinity,
  },
  {
    key: 'duration',
    label: 'Duration',
    render: (b) =>
      b.proposedDurationDays !== undefined
        ? `${b.proposedDurationDays} days`
        : '—',
    highlightBest: 'min',
    numericValue: (b) => b.proposedDurationDays ?? Infinity,
  },
  {
    key: 'paymentTerms',
    label: 'Payment terms',
    render: (b) => b.paymentTerms ?? '—',
  },
  {
    key: 'trustScore',
    label: 'Trust score',
    render: (b) => (
      <span className="inline-flex items-center gap-1">
        <Star
          className="h-3.5 w-3.5 fill-warning-500 text-warning-500"
          strokeWidth={1.5}
        />
        <span className="tabular-nums">{b.trustScore.toFixed(1)}</span>
      </span>
    ),
    highlightBest: 'max',
    numericValue: (b) => b.trustScore,
  },
  {
    key: 'years',
    label: 'Years in business',
    render: (b) => `${b.yearsInBusiness} years`,
    highlightBest: 'max',
    numericValue: (b) => b.yearsInBusiness,
  },
];

export function BidComparisonTable({
  bids,
  rfqRef,
  rfqTitle,
  onAwardBid,
  onViewBidDetails,
  className,
}: BidComparisonTableProps) {
  // Compute best-in-column for each highlight-eligible attribute
  const bestInColumn = React.useMemo(() => {
    const result: Record<string, string | null> = {};
    for (const attr of ATTRIBUTES) {
      if (!attr.highlightBest || !attr.numericValue) continue;
      const values = bids.map((b) => ({
        id: b.id,
        v: attr.numericValue!(b),
      }));
      const best =
        attr.highlightBest === 'min' || attr.highlightBest === 'earliest'
          ? values.reduce((a, b) => (b.v < a.v ? b : a))
          : values.reduce((a, b) => (b.v > a.v ? b : a));
      result[attr.key] = best.id;
    }
    return result;
  }, [bids]);

  if (bids.length === 0) {
    return null;
  }

  return (
    <div className={cn('space-y-4', className)}>
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 className="text-h2 font-display font-semibold text-neutral-900">
            Compare bids
          </h2>
          <p className="text-body-sm font-sans text-neutral-400 mt-1">
            {rfqRef} · {rfqTitle} · {bids.length} bids received
          </p>
        </div>
      </div>

      {/* Comparison table */}
      <div className="overflow-x-auto rounded-lg border border-neutral-100 bg-white shadow-sm">
        <table className="w-full border-collapse">
          {/* Column headers: pseudonymous handles */}
          <thead>
            <tr>
              <th
                scope="col"
                className="sticky left-0 z-10 bg-neutral-50 border-b border-neutral-100 px-4 py-3 text-left"
              >
                <span className="text-overline uppercase font-sans text-neutral-400">
                  Attribute
                </span>
              </th>
              {bids.map((bid) => (
                <th
                  key={bid.id}
                  scope="col"
                  className="border-b border-neutral-100 px-4 py-3 text-left min-w-[200px]"
                >
                  <span className="text-handle text-h4 block">
                    {formatHandle(bid.pseudonymousHandle)}
                  </span>
                  <span className="text-caption font-sans text-neutral-400 mt-1 block">
                    Submitted {formatDate(bid.submittedAt)}
                  </span>
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            {ATTRIBUTES.map((attr) => (
              <tr key={attr.key} className="hover:bg-neutral-50/50">
                <th
                  scope="row"
                  className="sticky left-0 z-10 bg-neutral-50 border-b border-neutral-100 px-4 py-3 text-left"
                >
                  <span
                    className={cn(
                      'font-sans text-neutral-700',
                      attr.emphasis === 'total' ? 'text-body-sm font-semibold' : 'text-body-sm',
                    )}
                  >
                    {attr.label}
                  </span>
                </th>
                {bids.map((bid) => {
                  const isBest = bestInColumn[attr.key] === bid.id;
                  const isTotal = attr.emphasis === 'total';
                  return (
                    <td
                      key={bid.id}
                      className={cn(
                        'border-b border-neutral-100 px-4 py-3 align-top',
                        isBest && 'bg-success-50/40',
                      )}
                    >
                      <div className="flex items-center gap-2">
                        <span
                          className={cn(
                            'font-sans text-neutral-900 tabular-nums',
                            isTotal
                              ? 'text-money font-semibold'
                              : 'text-body-sm',
                          )}
                        >
                          {attr.render(bid)}
                        </span>
                        {isBest && attr.highlightBest && (
                          <span
                            className="inline-flex items-center gap-0.5 text-caption font-medium text-success-700"
                            title="Best in this row"
                          >
                            <Sparkles className="h-3 w-3" />
                          </span>
                        )}
                      </div>
                    </td>
                  );
                })}
              </tr>
            ))}

            {/* Inclusions row — link to expand */}
            <tr className="hover:bg-neutral-50/50">
              <th
                scope="row"
                className="sticky left-0 z-10 bg-neutral-50 border-b border-neutral-100 px-4 py-3 text-left"
              >
                <span className="text-body-sm font-sans text-neutral-700">
                  Inclusions / Line items
                </span>
              </th>
              {bids.map((bid) => (
                <td
                  key={bid.id}
                  className="border-b border-neutral-100 px-4 py-3 align-top"
                >
                  <button
                    type="button"
                    onClick={() => onViewBidDetails?.(bid.id)}
                    className="inline-flex items-center gap-1 text-body-sm font-sans font-medium text-primary-900 hover:text-primary-700 transition-colors"
                  >
                    View details
                    <ArrowUpRight className="h-3.5 w-3.5" />
                  </button>
                </td>
              ))}
            </tr>

            {/* Verification row */}
            <tr className="hover:bg-neutral-50/50">
              <th
                scope="row"
                className="sticky left-0 z-10 bg-neutral-50 border-b border-neutral-100 px-4 py-3 text-left"
              >
                <span className="text-body-sm font-sans text-neutral-700">
                  Verification
                </span>
              </th>
              {bids.map((bid) => (
                <td
                  key={bid.id}
                  className="border-b border-neutral-100 px-4 py-3 align-top"
                >
                  <Badge variant="success" size="sm">
                    KYC Verified
                  </Badge>
                </td>
              ))}
            </tr>
          </tbody>

          {/* Action row: Award buttons */}
          <tfoot>
            <tr>
              <td className="sticky left-0 z-10 bg-neutral-50 border-t border-neutral-100 px-4 py-4">
                <span className="text-overline uppercase font-sans text-neutral-400">
                  Decide
                </span>
              </td>
              {bids.map((bid) => (
                <td
                  key={bid.id}
                  className="border-t border-neutral-100 px-4 py-4"
                >
                  <Button
                    variant="primary"
                    size="md"
                    onClick={() => onAwardBid?.(bid.id)}
                    className="w-full"
                  >
                    Award this bid
                  </Button>
                </td>
              ))}
            </tr>
          </tfoot>
        </table>
      </div>

      {/* Footnote */}
      <p className="text-caption font-sans text-neutral-400 px-1">
        <span className="inline-flex items-center gap-1 text-success-700 font-medium">
          <Sparkles className="h-3 w-3" /> indicates the leading bid in that row.
        </span>{' '}
        All contact details remain protected until you award and complete payment.
      </p>
    </div>
  );
}

import Link from 'next/link';
import { Plus, FileText, Award, MessageCircle, ArrowUpRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { StatusBadge } from '@/components/composite/status-badge';
import { EmptyState } from '@/components/composite/empty-state';
import { PlatformTrustStrip } from '@/components/composite/platform-trust-strip';
import { formatDate, formatCurrency, formatHandle, formatCountdown } from '@/lib/format';

/**
 * Client Dashboard — main landing.
 *
 * Three primary surfaces:
 *   - Active RFQs (in flight; awaiting bids or admin review)
 *   - Awaiting payment (highest priority — clock is ticking)
 *   - Active projects (post-unlock work in progress)
 *
 * Per Design System §5 — facts over decoration.
 */

const MOCK_RFQS = [
  {
    id: 'rfq-2026-00481',
    title: 'Bathroom renovation, 3-bed apartment',
    state: 'bids_under_review' as const,
    submittedAt: '2026-04-28',
    bidCount: 3,
    location: 'JLT, Dubai',
  },
  {
    id: 'rfq-2026-00472',
    title: 'Office partition + cabling for new hire onboarding',
    state: 'matching' as const,
    submittedAt: '2026-04-26',
    bidCount: 0,
    location: 'DIFC, Dubai',
  },
  {
    id: 'rfq-2026-00465',
    title: 'AC servicing — quarterly contract for 12 units',
    state: 'qualified' as const,
    submittedAt: '2026-04-22',
    bidCount: 0,
    location: 'Marina Towers, Dubai',
  },
];

const MOCK_AWAITING_PAYMENT = {
  awardId: 'award-001',
  rfqId: 'rfq-2026-00481',
  rfqTitle: 'Bathroom renovation, 3-bed apartment',
  vendorHandle: 'VC-0427',
  totalPayable: 24592,
  currency: 'AED',
  expiresAt: '2026-05-02T14:23:00Z',
};

export default function DashboardPage() {
  return (
    <div className="space-y-8">
      {/* Page header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-h1 font-display font-semibold text-neutral-900">
            Dashboard
          </h1>
          <p className="mt-1 text-body-sm font-sans text-neutral-400">
            Welcome back, Khalid. Here's what's active.
          </p>
        </div>
        <Button variant="primary" size="md" asChild className="gap-2">
          <Link href="/rfqs/new">
            <Plus className="h-4 w-4" />
            New RFQ
          </Link>
        </Button>
      </div>

      {/* Platform trust strip — reinforces brand promise on every dashboard visit */}
      <PlatformTrustStrip variant="subtle" />

      {/* Awaiting payment — highest priority, full-width banner card */}
      {MOCK_AWAITING_PAYMENT && (
        <Card className="border-warning-500/30 bg-warning-50/30">
          <CardContent className="pt-6">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div className="flex items-start gap-4 min-w-0 flex-1">
                <div className="flex-shrink-0 rounded-full bg-warning-50 p-3">
                  <Award
                    className="h-5 w-5 text-warning-700"
                    strokeWidth={2}
                  />
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <StatusBadge type="award" state="pending_payment" />
                    <span className="text-caption font-sans text-neutral-400 tabular-nums">
                      Expires in {formatCountdown(MOCK_AWAITING_PAYMENT.expiresAt)}
                    </span>
                  </div>
                  <p className="text-body font-sans text-neutral-900">
                    Award to{' '}
                    <span className="text-handle">
                      {formatHandle(MOCK_AWAITING_PAYMENT.vendorHandle)}
                    </span>{' '}
                    ·{' '}
                    <span className="text-money font-semibold">
                      {formatCurrency(
                        MOCK_AWAITING_PAYMENT.totalPayable,
                        MOCK_AWAITING_PAYMENT.currency,
                      )}
                    </span>
                  </p>
                  <p className="text-body-sm font-sans text-neutral-600 mt-1 truncate">
                    {MOCK_AWAITING_PAYMENT.rfqTitle}
                  </p>
                </div>
              </div>
              <Button variant="success" size="lg" asChild>
                <Link href={`/awards/${MOCK_AWAITING_PAYMENT.awardId}/pay`}>
                  Continue to payment
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Active RFQs */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-h3 font-display font-semibold text-neutral-900">
            Active RFQs
          </h2>
          <Link
            href="/rfqs"
            className="inline-flex items-center gap-1 text-body-sm font-sans font-medium text-primary-900 hover:text-primary-700"
          >
            View all
            <ArrowUpRight className="h-3.5 w-3.5" />
          </Link>
        </div>

        {MOCK_RFQS.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {MOCK_RFQS.map((rfq) => (
              <Card key={rfq.id} interactive>
                <Link href={`/rfqs/${rfq.id}`} className="block">
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between gap-3 mb-2">
                      <span className="text-overline uppercase font-sans text-neutral-400 tabular-nums">
                        {rfq.id.toUpperCase()}
                      </span>
                      <StatusBadge type="rfq" state={rfq.state} size="sm" />
                    </div>
                    <CardTitle className="line-clamp-2">{rfq.title}</CardTitle>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <dl className="grid grid-cols-2 gap-3 text-body-sm font-sans">
                      <div>
                        <dt className="text-caption uppercase tracking-wide text-neutral-400">
                          Location
                        </dt>
                        <dd className="text-neutral-700 mt-0.5">
                          {rfq.location}
                        </dd>
                      </div>
                      <div>
                        <dt className="text-caption uppercase tracking-wide text-neutral-400">
                          Bids received
                        </dt>
                        <dd className="text-neutral-700 mt-0.5 tabular-nums">
                          {rfq.bidCount}
                        </dd>
                      </div>
                      <div className="col-span-2">
                        <dt className="text-caption uppercase tracking-wide text-neutral-400">
                          Submitted
                        </dt>
                        <dd className="text-neutral-700 mt-0.5">
                          {formatDate(rfq.submittedAt)}
                        </dd>
                      </div>
                    </dl>
                    {rfq.bidCount > 0 && (
                      <Button
                        variant="tertiary"
                        size="sm"
                        className="mt-4 -ml-2 gap-1"
                        asChild
                      >
                        <Link href={`/rfqs/${rfq.id}/bids`}>
                          Compare bids ({rfq.bidCount})
                          <ArrowUpRight className="h-3 w-3" />
                        </Link>
                      </Button>
                    )}
                  </CardContent>
                </Link>
              </Card>
            ))}
          </div>
        ) : (
          <Card>
            <CardContent>
              <EmptyState
                icon={FileText}
                title="No active RFQs"
                description="When you submit a request for quotes, it will appear here while in review and bidding."
                action={
                  <Button variant="primary" size="md" asChild>
                    <Link href="/rfqs/new">Create your first RFQ</Link>
                  </Button>
                }
              />
            </CardContent>
          </Card>
        )}
      </section>

      {/* Active projects (post-unlock) */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-h3 font-display font-semibold text-neutral-900">
            Active projects
          </h2>
        </div>
        <Card>
          <CardContent>
            <EmptyState
              icon={MessageCircle}
              title="No active projects yet"
              description="Once you award and pay for an RFQ, the project moves here. You'll be able to chat with your contractor and track progress."
            />
          </CardContent>
        </Card>
      </section>
    </div>
  );
}

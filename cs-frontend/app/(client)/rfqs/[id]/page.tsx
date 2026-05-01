export const dynamic = 'force-dynamic';
import Link from 'next/link';
import { ChevronLeft, MapPin, Calendar, FileText, ArrowUpRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { StatusBadge } from '@/components/composite/status-badge';
import { EmptyState } from '@/components/composite/empty-state';
import { formatDate, formatCurrency } from '@/lib/format';

const MOCK_RFQ = {
  id: 'rfq-2026-00481',
  title: 'Bathroom renovation, 3-bed apartment',
  category: 'Renovation & Fit-out',
  state: 'bids_under_review' as const,
  city: 'JLT',
  emirate: 'Dubai',
  submittedAt: '2026-04-28',
  budgetMin: 20000,
  budgetMax: 35000,
  proposedStart: '2026-05-15',
  targetCompletion: '2026-06-15',
  briefDescription:
    'Strip and replace tile flooring, vanity unit, fixtures, and re-route plumbing for new layout.',
  detailedScope: `1. Strip existing wall and floor tiles
2. Reroute plumbing for new vanity location (south wall → north wall)
3. Install new floor tiles (60x60 porcelain)
4. Install new wall tiles to ceiling (subway pattern)
5. Replace vanity unit (1.2m, dual basin)
6. Replace shower door and tray
7. Install heated towel rail
8. Repaint ceiling and door`,
  attachments: [
    { name: 'floor-plan.pdf', size: 1_245_678 },
    { name: 'inspiration-images.pdf', size: 3_456_789 },
    { name: 'fixture-spec.xlsx', size: 234_567 },
  ],
  bidCount: 3,
};

export default function RfqDetailPage({ params }: { params: { id: string } }) {
  return (
    <div className="space-y-6">
      <Link
        href="/dashboard"
        className="inline-flex items-center gap-1 text-body-sm font-sans text-neutral-600 hover:text-neutral-900"
      >
        <ChevronLeft className="h-4 w-4" />
        Back to dashboard
      </Link>

      {/* Header */}
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <span className="text-overline uppercase font-sans text-neutral-400 tabular-nums">
              {params.id.toUpperCase()}
            </span>
            <StatusBadge type="rfq" state={MOCK_RFQ.state} />
          </div>
          <h1 className="text-h1 font-display font-semibold text-neutral-900">
            {MOCK_RFQ.title}
          </h1>
          <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-2 text-body-sm font-sans text-neutral-400">
            <span className="inline-flex items-center gap-1">
              <MapPin className="h-3.5 w-3.5" />
              {MOCK_RFQ.city}, {MOCK_RFQ.emirate}
            </span>
            <span className="inline-flex items-center gap-1">
              <Calendar className="h-3.5 w-3.5" />
              Submitted {formatDate(MOCK_RFQ.submittedAt)}
            </span>
          </div>
        </div>

        {MOCK_RFQ.bidCount > 0 && (
          <Button variant="primary" size="md" asChild className="gap-2">
            <Link href={`/rfqs/${params.id}/bids`}>
              <span className="inline-flex items-center gap-2">
                Compare bids ({MOCK_RFQ.bidCount})
                <ArrowUpRight className="h-4 w-4" />
              </span>
            </Link>
          </Button>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main content */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Project details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-overline uppercase font-sans text-neutral-400">
                  Brief
                </p>
                <p className="text-body-sm font-sans text-neutral-700 mt-2 leading-relaxed">
                  {MOCK_RFQ.briefDescription}
                </p>
              </div>
              <Separator />
              <div>
                <p className="text-overline uppercase font-sans text-neutral-400">
                  Detailed scope
                </p>
                <pre className="text-body-sm font-sans text-neutral-700 mt-2 leading-relaxed whitespace-pre-wrap">
                  {MOCK_RFQ.detailedScope}
                </pre>
              </div>
            </CardContent>
          </Card>

          {MOCK_RFQ.attachments.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Attachments</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {MOCK_RFQ.attachments.map((file) => (
                    <li
                      key={file.name}
                      className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-neutral-50"
                    >
                      <FileText className="h-4 w-4 text-neutral-400 flex-shrink-0" />
                      <span className="flex-1 text-body-sm font-sans text-neutral-900 truncate">
                        {file.name}
                      </span>
                      <span className="text-caption font-sans text-neutral-400 tabular-nums">
                        {(file.size / 1024 / 1024).toFixed(1)} MB
                      </span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Side panel */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Budget & timeline</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <p className="text-caption uppercase tracking-wide font-sans text-neutral-400">
                  Budget range
                </p>
                <p className="text-body font-sans text-neutral-900 tabular-nums mt-1">
                  {formatCurrency(MOCK_RFQ.budgetMin)} – {formatCurrency(MOCK_RFQ.budgetMax)}
                </p>
              </div>
              <Separator />
              <div>
                <p className="text-caption uppercase tracking-wide font-sans text-neutral-400">
                  Proposed start
                </p>
                <p className="text-body-sm font-sans text-neutral-700 mt-1">
                  {formatDate(MOCK_RFQ.proposedStart)}
                </p>
              </div>
              <div>
                <p className="text-caption uppercase tracking-wide font-sans text-neutral-400">
                  Target completion
                </p>
                <p className="text-body-sm font-sans text-neutral-700 mt-1">
                  {formatDate(MOCK_RFQ.targetCompletion)}
                </p>
              </div>
            </CardContent>
          </Card>

          {MOCK_RFQ.bidCount === 0 && (
            <Card>
              <CardContent>
                <EmptyState
                  icon={FileText}
                  title="No bids yet"
                  description="Invitations have been sent to verified contractors. Bids typically arrive within 24 hours."
                />
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}

'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import { ChevronLeft, FileText } from 'lucide-react';
import Link from 'next/link';
import { BidComparisonTable } from '@/components/composite/bid-comparison-table';
import { AwardConfirmationModal } from '@/components/payment/award-confirmation-modal';
import { StatusBadge } from '@/components/composite/status-badge';
import { Button } from '@/components/ui/button';
import { EmptyState } from '@/components/composite/empty-state';
import { PlatformTrustStrip } from '@/components/composite/platform-trust-strip';
import { type BidPublic } from '@/lib/types';

/**
 * Bid Comparison page.
 *
 * The single most important page for clients — the comparison
 * table is the central artifact of the platform.
 *
 * Per Frontend Design v2 §8.2 + Design System §8.2.
 */

// Mock data — replace with API call in production.
// In a real Next.js app this would be a server component
// fetching from the backend. The interactive parts (modal,
// award flow) need 'use client' so we keep the page client-side.

const MOCK_BIDS: BidPublic[] = [
  {
    id: 'bid-001',
    rfqId: 'rfq-2026-00481',
    vendorOrganizationId: 'org-1',
    pseudonymousHandle: 'VC-0427',
    totalPrice: 22000,
    vatAmount: 1100,
    serviceFee: 1492,
    totalPayable: 24592,
    currency: 'AED',
    proposedStartDate: '2026-05-15',
    proposedDurationDays: 21,
    paymentTerms: '50% upfront, 50% on completion',
    inclusions: 'Materials, labor, project management',
    validityUntil: '2026-05-12T00:00:00Z',
    state: 'submitted',
    version: 1,
    submittedAt: '2026-04-29T10:23:00Z',
    trustScore: 4.8,
    yearsInBusiness: 8,
    lineItems: [],
  },
  {
    id: 'bid-002',
    rfqId: 'rfq-2026-00481',
    vendorOrganizationId: 'org-2',
    pseudonymousHandle: 'VC-0588',
    totalPrice: 24000,
    vatAmount: 1200,
    serviceFee: 1492,
    totalPayable: 26692,
    currency: 'AED',
    proposedStartDate: '2026-05-12',
    proposedDurationDays: 18,
    paymentTerms: '40/40/20 milestones',
    validityUntil: '2026-05-14T00:00:00Z',
    state: 'submitted',
    version: 1,
    submittedAt: '2026-04-30T14:15:00Z',
    trustScore: 4.9,
    yearsInBusiness: 12,
    lineItems: [],
  },
  {
    id: 'bid-003',
    rfqId: 'rfq-2026-00481',
    vendorOrganizationId: 'org-3',
    pseudonymousHandle: 'VC-0901',
    totalPrice: 19500,
    vatAmount: 975,
    serviceFee: 1492,
    totalPayable: 21967,
    currency: 'AED',
    proposedStartDate: '2026-05-20',
    proposedDurationDays: 28,
    paymentTerms: '30/40/30 milestones',
    validityUntil: '2026-05-09T00:00:00Z',
    state: 'submitted',
    version: 1,
    submittedAt: '2026-04-30T09:42:00Z',
    trustScore: 4.5,
    yearsInBusiness: 5,
    lineItems: [],
  },
];

export default function BidComparisonPage({
  params,
}: {
  params: { id: string };
}) {
  const router = useRouter();
  const [selectedBid, setSelectedBid] = React.useState<BidPublic | null>(null);
  const [confirmationOpen, setConfirmationOpen] = React.useState(false);

  const handleAwardBid = (bidId: string) => {
    const bid = MOCK_BIDS.find((b) => b.id === bidId);
    if (!bid) return;
    setSelectedBid(bid);
    setConfirmationOpen(true);
  };

  const handleConfirm = () => {
    if (!selectedBid) return;
    // After confirm: navigate to payment screen.
    // Demo: route all awards to the canonical demo award (award-001) so the
    // payment + unlock screens have stable, consistent mock state. In
    // production, the backend would return a fresh awardId per award.
    router.push(`/awards/award-001/pay`);
  };

  const handleViewDetails = (bidId: string) => {
    // Slide-out panel in a full implementation;
    // skeleton routing for now.
    console.log('View details for', bidId);
  };

  return (
    <div className="space-y-6">
      {/* Breadcrumb / back nav */}
      <Link
        href={`/rfqs/${params.id}` as never}
        className="inline-flex items-center gap-1 text-body-sm font-sans text-neutral-600 hover:text-neutral-900 transition-colors"
      >
        <ChevronLeft className="h-4 w-4" />
        Back to RFQ
      </Link>

      {/* Page header */}
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <span className="text-overline uppercase font-sans text-neutral-400">
              {params.id}
            </span>
            <StatusBadge type="rfq" state="bids_under_review" />
          </div>
          <h1 className="text-h1 font-display font-semibold text-neutral-900">
            Bathroom renovation, 3-bed apartment
          </h1>
          <p className="mt-1 text-body-sm font-sans text-neutral-400">
            JLT, Dubai · Submitted 28 April 2026 · Bidding closes 7 May 2026
          </p>
        </div>
        <Button variant="secondary" size="md" className="gap-2">
          <FileText className="h-4 w-4" />
          View RFQ details
        </Button>
      </div>

      {/* Platform protections — surfaces what the platform handles so client can focus on contractor selection */}
      <PlatformTrustStrip variant="prominent" />

      {/* Comparison table */}
      {MOCK_BIDS.length > 0 ? (
        <BidComparisonTable
          bids={MOCK_BIDS}
          rfqRef={params.id.toUpperCase()}
          rfqTitle="Bathroom renovation, 3-bed apartment"
          onAwardBid={handleAwardBid}
          onViewBidDetails={handleViewDetails}
        />
      ) : (
        <EmptyState
          icon={FileText}
          title="No bids yet"
          description="Invitations have been sent to 5 contractors. Bids typically arrive within 24 hours."
        />
      )}

      {/* Award confirmation modal */}
      {selectedBid && (
        <AwardConfirmationModal
          open={confirmationOpen}
          onOpenChange={setConfirmationOpen}
          rfqRef={params.id.toUpperCase()}
          vendorHandle={selectedBid.pseudonymousHandle}
          organizationName="Marina Towers Properties LLC"
          pricing={{
            bidTotal: selectedBid.totalPrice,
            vatRate: 0.05,
            vatAmount: selectedBid.vatAmount,
            serviceFee: selectedBid.serviceFee,
            totalPayable: selectedBid.totalPayable,
            currency: selectedBid.currency,
          }}
          onConfirm={handleConfirm}
        />
      )}
    </div>
  );
}

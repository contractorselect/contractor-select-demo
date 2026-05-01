'use client';

import * as React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  ShieldCheck,
  ChevronLeft,
  Building2,
  ArrowRight,
  Info,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { formatCurrency, formatDate, formatHandle } from '@/lib/format';

/**
 * Admin queue — payment simulation surface for Sprint 1.
 *
 * In production: lists awards in `pending_payment` state with a
 * "Simulate Payment" button that calls
 *   POST /v1/admin/awards/:id/simulate-payment
 *
 * That endpoint:
 *   1. Synthesizes a PaymentIntent row (pi_simulated_*)
 *   2. Records audit `payment.simulated` event
 *   3. Records `payment_authorization` legal acceptance
 *   4. Calls UnlockService.unlock() — creates the unlock_event row
 *   5. Triggers all post-unlock side effects (state transitions, notifications)
 *
 * Demo: clicking "Simulate Payment" navigates to /awards/:id/unlocked.
 *
 * Per cs-SPRINT_1_PAYMENT_SIMULATION.md.
 */

const MOCK_PENDING_PAYMENT_AWARDS = [
  {
    id: 'award-001',
    rfqRef: 'RFQ-2026-00481',
    rfqTitle: 'Bathroom renovation, 3-bed apartment',
    clientOrgName: 'Mansouri Properties',
    vendorHandle: 'VC-0427',
    totalPayable: 24592,
    currency: 'AED',
    awardedAt: '2026-04-30T14:23:00Z',
  },
  {
    id: 'award-002',
    rfqRef: 'RFQ-2026-00472',
    rfqTitle: 'Office partition + cabling for new hire onboarding',
    clientOrgName: 'Sphinx Capital',
    vendorHandle: 'VC-0588',
    totalPayable: 18200,
    currency: 'AED',
    awardedAt: '2026-04-30T11:08:00Z',
  },
];

export default function AdminQueuePage() {
  const router = useRouter();
  const [simulating, setSimulating] = React.useState<string | null>(null);

  const handleSimulatePayment = (awardId: string) => {
    const ok = window.confirm(
      `Trigger simulated payment for ${awardId}?\n\n` +
        `This will create the unlock_event row and reveal contractor details to the client. ` +
        `In production, this happens automatically via the Stripe webhook.\n\n` +
        `Continue?`,
    );
    if (!ok) return;

    setSimulating(awardId);
    setTimeout(() => {
      setSimulating(null);
      router.push(`/awards/${awardId}/unlocked`);
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-neutral-50">
      {/* Top bar */}
      <header className="border-b border-neutral-100 bg-white">
        <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link
            href="/"
            className="text-h5 font-display font-semibold text-neutral-900"
          >
            ContractorSelect<span className="text-success-700">.me</span>
          </Link>
          <div className="flex items-center gap-3">
            <span className="text-caption font-sans uppercase tracking-wide text-warning-700 px-2.5 py-1 rounded-md bg-warning-50 border border-warning-500/30">
              Admin / Demo
            </span>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-6 py-10">
        <Link
          href="/"
          className="inline-flex items-center gap-1 text-body-sm font-sans text-neutral-600 hover:text-neutral-900 transition-colors mb-6"
        >
          <ChevronLeft className="h-4 w-4" />
          Back to demo home
        </Link>

        <div className="mb-6">
          <h1 className="text-h1 font-display font-semibold text-neutral-900">
            Admin queue — Pending Payments
          </h1>
          <p className="mt-1 text-body-sm font-sans text-neutral-700">
            Awards awaiting payment confirmation. In production these unlock
            via Stripe webhook; in Sprint 1 the admin simulates payment here.
          </p>
        </div>

        {/* Explainer */}
        <Card className="mb-6 bg-primary-50/40 border-primary-100">
          <CardContent className="pt-5 pb-5">
            <div className="flex items-start gap-2.5">
              <Info
                className="h-4 w-4 text-primary-900 flex-shrink-0 mt-0.5"
                strokeWidth={2.25}
              />
              <div className="flex-1 min-w-0">
                <p className="text-body-sm font-sans font-medium text-neutral-900">
                  How the simulation works
                </p>
                <p className="text-caption font-sans text-neutral-700 mt-1.5 leading-relaxed">
                  Clicking &quot;Simulate Payment&quot; triggers the same{' '}
                  <code className="px-1 rounded bg-white border border-neutral-200 text-[11px]">
                    UnlockService.unlock()
                  </code>{' '}
                  function the production Stripe webhook will call. It
                  creates an{' '}
                  <code className="px-1 rounded bg-white border border-neutral-200 text-[11px]">
                    unlock_event
                  </code>{' '}
                  row, transitions the award to{' '}
                  <code className="px-1 rounded bg-white border border-neutral-200 text-[11px]">
                    paid
                  </code>
                  , and reveals the contractor to the client. The simulated
                  endpoint stays available in dev/staging for QA replay even
                  after Stripe is live.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Pending payment table */}
        <Card>
          <CardContent className="p-0">
            {MOCK_PENDING_PAYMENT_AWARDS.length === 0 ? (
              <div className="p-12 text-center">
                <p className="text-body font-sans text-neutral-700">
                  No awards pending payment.
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-neutral-100">
                      <th className="px-6 py-3 text-left text-caption font-sans uppercase tracking-wide text-neutral-400 font-medium">
                        Award
                      </th>
                      <th className="px-6 py-3 text-left text-caption font-sans uppercase tracking-wide text-neutral-400 font-medium">
                        Client
                      </th>
                      <th className="px-6 py-3 text-left text-caption font-sans uppercase tracking-wide text-neutral-400 font-medium">
                        Vendor
                      </th>
                      <th className="px-6 py-3 text-right text-caption font-sans uppercase tracking-wide text-neutral-400 font-medium">
                        Amount
                      </th>
                      <th className="px-6 py-3 text-left text-caption font-sans uppercase tracking-wide text-neutral-400 font-medium">
                        Awarded
                      </th>
                      <th className="px-6 py-3 text-right text-caption font-sans uppercase tracking-wide text-neutral-400 font-medium">
                        Action
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {MOCK_PENDING_PAYMENT_AWARDS.map((award) => (
                      <tr
                        key={award.id}
                        className="border-b border-neutral-100 last:border-0"
                      >
                        <td className="px-6 py-4">
                          <p className="text-body-sm font-sans font-medium text-neutral-900">
                            {award.id.toUpperCase()}
                          </p>
                          <p className="text-caption font-sans text-neutral-400 mt-0.5">
                            {award.rfqRef}
                          </p>
                          <p className="text-caption font-sans text-neutral-700 mt-0.5 truncate max-w-[200px]">
                            {award.rfqTitle}
                          </p>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-1.5 text-body-sm font-sans text-neutral-900">
                            <Building2
                              className="h-3.5 w-3.5 text-neutral-400"
                              strokeWidth={2}
                            />
                            {award.clientOrgName}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className="text-handle text-body-sm font-medium">
                            {formatHandle(award.vendorHandle)}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <span className="text-body-sm font-sans font-semibold text-neutral-900 tabular-nums">
                            {formatCurrency(award.totalPayable, award.currency)}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <span className="text-caption font-sans text-neutral-700">
                            {formatDate(award.awardedAt)}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <Button
                            variant="primary"
                            size="sm"
                            loading={simulating === award.id}
                            onClick={() => handleSimulatePayment(award.id)}
                            className="gap-1.5"
                          >
                            <ShieldCheck
                              className="h-3.5 w-3.5"
                              strokeWidth={2.25}
                            />
                            Simulate Payment
                            <ArrowRight className="h-3.5 w-3.5" />
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>

        <p className="mt-6 text-caption font-sans text-neutral-400">
          In production, this surface would be gated behind admin RBAC and the
          endpoint would return 404 when{' '}
          <code className="text-[11px]">PAYMENT_MODE=production</code>.
        </p>
      </main>
    </div>
  );
}

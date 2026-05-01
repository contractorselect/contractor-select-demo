'use client';

import * as React from 'react';
import Link from 'next/link';
import {
  CheckCircle2,
  Building2,
  Phone,
  Mail,
  MapPin,
  FileText,
  MessageCircle,
  ChevronLeft,
  Calendar,
  ShieldCheck,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { formatCurrency, formatDate } from '@/lib/format';

/**
 * Post-unlock award page.
 *
 * In production: GET /v1/awards/:awardId/contact-details
 *   - PaymentGateGuard verifies unlock_event row exists for (rfqId, vendorOrgId)
 *   - 402 PAYMENT_REQUIRED if not
 *   - 200 with full contractor PII if yes
 *   - Audit logs the pii_access.contact_revealed event
 *
 * Demo: the unlock is implied by reaching this URL. The page renders the
 * ContractorCard in unlocked variant (legal name + contacts visible) and
 * shows the post-payment action surface.
 */

const MOCK_UNLOCKED_AWARD = {
  id: 'award-001',
  rfqRef: 'RFQ-2026-00481',
  rfqTitle: 'Bathroom renovation, 3-bed apartment',
  paidAt: '2026-04-30T16:42:00Z',
  totalPaid: 24592,
  currency: 'AED',
};

const MOCK_REVEALED_CONTRACTOR = {
  vendorHandle: 'VC-0427',
  legalName: 'Al-Hashemi Construction LLC',
  tradeName: 'Al-Hashemi Construction',
  primaryContactName: 'Ahmad Al-Hashemi',
  contactEmail: 'projects@al-hashemi-construction.ae',
  contactPhone: '+971 50 423 8917',
  officeAddress: 'Office 1204, Boulevard Plaza Tower 2, Sheikh Mohammed bin Rashid Boulevard, Downtown Dubai',
  emirate: 'Dubai',
  yearsOperating: 12,
  primaryCategory: 'Construction & Renovation',
  trustSignals: {
    kycVerified: true,
    insured: true,
    licenseVerified: true,
    completedProjects: 47,
  },
};

const MOCK_BID = {
  totalAmount: 22000,
  proposedStartDate: '2026-05-15',
  estimatedDurationDays: 28,
  inclusions: 'Materials, labor, site cleanup, final inspection',
  exclusions: 'Permits, third-party inspections',
};

export default function UnlockedAwardPage({
  params,
}: {
  params: { id: string };
}) {
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
          <span className="text-caption font-sans uppercase tracking-wide text-neutral-400 px-2.5 py-1 rounded-md bg-neutral-100">
            Demo Mode
          </span>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-6 py-10">
        <Link
          href={`/rfqs/${MOCK_UNLOCKED_AWARD.rfqRef.toLowerCase()}` as never}
          className="inline-flex items-center gap-1 text-body-sm font-sans text-neutral-600 hover:text-neutral-900 transition-colors mb-6"
        >
          <ChevronLeft className="h-4 w-4" />
          Back to RFQ
        </Link>

        {/* Success banner */}
        <Card className="border-success-700/30 bg-success-50/40">
          <CardContent className="pt-6">
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 rounded-full bg-success-50 p-2.5 border border-success-700/30">
                <CheckCircle2
                  className="h-5 w-5 text-success-700"
                  strokeWidth={2.25}
                />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-overline uppercase tracking-wide font-sans text-success-700">
                  Payment confirmed · Contractor unlocked
                </p>
                <h1 className="mt-1 text-h2 font-display font-semibold text-neutral-900">
                  You're connected with{' '}
                  <span className="text-success-700">
                    {MOCK_REVEALED_CONTRACTOR.legalName}
                  </span>
                </h1>
                <p className="mt-2 text-body-sm font-sans text-neutral-700">
                  Award {MOCK_UNLOCKED_AWARD.id.toUpperCase()} for{' '}
                  {formatCurrency(
                    MOCK_UNLOCKED_AWARD.totalPaid,
                    MOCK_UNLOCKED_AWARD.currency,
                  )}
                  . Funds held in escrow until kickoff confirmed. The
                  contractor has been notified and will reach out within
                  24 hours.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Two column layout */}
        <div className="mt-6 grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-6">
          {/* LEFT: Contractor identity reveal */}
          <div className="space-y-6">
            {/* Revealed contractor card — in real product this uses the
                ContractorCard composite in unlocked variant */}
            <Card className="border-success-700/40 border-l-4 border-l-success-700">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <Building2
                      className="h-4 w-4 text-neutral-700"
                      strokeWidth={2}
                    />
                    <h2 className="text-overline uppercase tracking-wide font-sans text-neutral-700">
                      Contractor details (now revealed)
                    </h2>
                  </div>
                  <span className="text-caption font-sans text-neutral-400 line-through">
                    {MOCK_REVEALED_CONTRACTOR.vendorHandle}
                  </span>
                </div>

                <h3 className="text-h3 font-display font-semibold text-neutral-900">
                  {MOCK_REVEALED_CONTRACTOR.legalName}
                </h3>
                {MOCK_REVEALED_CONTRACTOR.tradeName !==
                  MOCK_REVEALED_CONTRACTOR.legalName && (
                  <p className="text-body-sm font-sans text-neutral-700">
                    Trading as: {MOCK_REVEALED_CONTRACTOR.tradeName}
                  </p>
                )}

                {/* Contact grid */}
                <dl className="mt-5 grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-4">
                  <div>
                    <dt className="flex items-center gap-1.5 text-caption font-sans uppercase tracking-wide text-neutral-400">
                      <Mail className="h-3 w-3" /> Email
                    </dt>
                    <dd className="mt-1">
                      <a
                        href={`mailto:${MOCK_REVEALED_CONTRACTOR.contactEmail}`}
                        className="text-body-sm font-sans text-primary-900 hover:underline break-all"
                      >
                        {MOCK_REVEALED_CONTRACTOR.contactEmail}
                      </a>
                    </dd>
                  </div>

                  <div>
                    <dt className="flex items-center gap-1.5 text-caption font-sans uppercase tracking-wide text-neutral-400">
                      <Phone className="h-3 w-3" /> Phone
                    </dt>
                    <dd className="mt-1">
                      <a
                        href={`tel:${MOCK_REVEALED_CONTRACTOR.contactPhone}`}
                        className="text-body-sm font-sans text-primary-900 hover:underline"
                      >
                        {MOCK_REVEALED_CONTRACTOR.contactPhone}
                      </a>
                    </dd>
                  </div>

                  <div className="sm:col-span-2">
                    <dt className="flex items-center gap-1.5 text-caption font-sans uppercase tracking-wide text-neutral-400">
                      <MapPin className="h-3 w-3" /> Office address
                    </dt>
                    <dd className="mt-1 text-body-sm font-sans text-neutral-700">
                      {MOCK_REVEALED_CONTRACTOR.officeAddress}
                    </dd>
                  </div>

                  <div>
                    <dt className="text-caption font-sans uppercase tracking-wide text-neutral-400">
                      Primary contact
                    </dt>
                    <dd className="mt-1 text-body-sm font-sans text-neutral-900 font-medium">
                      {MOCK_REVEALED_CONTRACTOR.primaryContactName}
                    </dd>
                  </div>

                  <div>
                    <dt className="text-caption font-sans uppercase tracking-wide text-neutral-400">
                      Years operating
                    </dt>
                    <dd className="mt-1 text-body-sm font-sans text-neutral-900 font-medium">
                      {MOCK_REVEALED_CONTRACTOR.yearsOperating}
                    </dd>
                  </div>
                </dl>

                {/* Trust signals */}
                <div className="mt-5 pt-5 border-t border-neutral-100">
                  <p className="text-overline uppercase tracking-wide font-sans text-neutral-400 mb-2.5">
                    Verification
                  </p>
                  <div className="flex flex-wrap gap-2">
                    <TrustChip label="KYC verified" />
                    <TrustChip label="Insurance verified" />
                    <TrustChip label="License verified" />
                    <TrustChip
                      label={`${MOCK_REVEALED_CONTRACTOR.trustSignals.completedProjects} projects completed`}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Bid summary */}
            <Card>
              <CardContent className="pt-6">
                <h2 className="text-h4 font-display font-semibold text-neutral-900 mb-4">
                  Bid summary (locked)
                </h2>
                <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-3">
                  <div>
                    <dt className="text-caption font-sans uppercase tracking-wide text-neutral-400">
                      Bid total
                    </dt>
                    <dd className="text-body font-sans font-semibold text-neutral-900 tabular-nums mt-0.5">
                      {formatCurrency(MOCK_BID.totalAmount, 'AED')}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-caption font-sans uppercase tracking-wide text-neutral-400">
                      Proposed start
                    </dt>
                    <dd className="text-body font-sans font-medium text-neutral-900 mt-0.5">
                      {formatDate(MOCK_BID.proposedStartDate)}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-caption font-sans uppercase tracking-wide text-neutral-400">
                      Estimated duration
                    </dt>
                    <dd className="text-body font-sans font-medium text-neutral-900 mt-0.5">
                      {MOCK_BID.estimatedDurationDays} days
                    </dd>
                  </div>
                  <div>
                    <dt className="text-caption font-sans uppercase tracking-wide text-neutral-400">
                      Inclusions
                    </dt>
                    <dd className="text-body-sm font-sans text-neutral-700 mt-0.5">
                      {MOCK_BID.inclusions}
                    </dd>
                  </div>
                  <div className="sm:col-span-2">
                    <dt className="text-caption font-sans uppercase tracking-wide text-neutral-400">
                      Exclusions
                    </dt>
                    <dd className="text-body-sm font-sans text-neutral-700 mt-0.5">
                      {MOCK_BID.exclusions}
                    </dd>
                  </div>
                </dl>
              </CardContent>
            </Card>
          </div>

          {/* RIGHT: Action panel */}
          <aside className="space-y-4">
            <Card>
              <CardContent className="pt-6">
                <h2 className="text-h5 font-display font-semibold text-neutral-900">
                  Next steps
                </h2>
                <ul className="mt-4 space-y-3">
                  <NextStep
                    icon={MessageCircle}
                    title="Open direct chat"
                    description="Discuss kickoff logistics with the contractor."
                    href={`/messaging/thread-${params.id}`}
                  />
                  <NextStep
                    icon={Calendar}
                    title="Confirm kickoff"
                    description="Once you've met on site, mark kickoff. Funds release."
                    disabled
                  />
                  <NextStep
                    icon={FileText}
                    title="Download project pack"
                    description="VAT invoice + signed agreement (PDF)."
                    disabled
                  />
                </ul>
              </CardContent>
            </Card>

            <Card className="bg-primary-50/40 border-primary-100">
              <CardContent className="pt-5 pb-5">
                <div className="flex items-start gap-2">
                  <ShieldCheck
                    className="h-4 w-4 text-primary-900 flex-shrink-0 mt-0.5"
                    strokeWidth={2.25}
                  />
                  <div>
                    <p className="text-body-sm font-sans font-medium text-neutral-900">
                      Funds in escrow
                    </p>
                    <p className="text-caption font-sans text-neutral-700 mt-1">
                      Payment is held until you confirm kickoff. If the
                      contractor doesn't deliver, contact our team for refund
                      mediation.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Link href="/" className="block">
              <Button variant="ghost" size="md" className="w-full">
                Back to demo home
              </Button>
            </Link>
          </aside>
        </div>
      </main>
    </div>
  );
}

function TrustChip({ label }: { label: string }) {
  return (
    <span className="inline-flex items-center gap-1 rounded-md border border-success-700/30 bg-success-50/40 px-2 py-1 text-caption font-sans font-medium text-success-700">
      <ShieldCheck className="h-3 w-3" strokeWidth={2.5} />
      {label}
    </span>
  );
}

function NextStep({
  icon: Icon,
  title,
  description,
  href,
  disabled,
}: {
  icon: React.ComponentType<{ className?: string; strokeWidth?: number }>;
  title: string;
  description: string;
  href?: string;
  disabled?: boolean;
}) {
  const content = (
    <div
      className={`flex items-start gap-3 ${
        disabled ? 'opacity-50' : 'group cursor-pointer'
      }`}
    >
      <div className="flex-shrink-0 mt-0.5 h-8 w-8 rounded-md bg-neutral-100 flex items-center justify-center">
        <Icon className="h-4 w-4 text-neutral-700" strokeWidth={2} />
      </div>
      <div className="flex-1 min-w-0">
        <p
          className={`text-body-sm font-sans font-medium text-neutral-900 ${
            !disabled && 'group-hover:text-primary-900 transition-colors'
          }`}
        >
          {title}
        </p>
        <p className="text-caption font-sans text-neutral-400 mt-0.5">
          {description}
        </p>
      </div>
    </div>
  );

  if (disabled || !href) {
    return <li>{content}</li>;
  }

  return (
    <li>
      <Link href={href as never}>{content}</Link>
    </li>
  );
}

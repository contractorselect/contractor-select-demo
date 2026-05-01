'use client';

import { Building2, MessageCircle, Calendar, FileDown } from 'lucide-react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { LockedSection } from './locked-section';
import { TrustSignals } from './trust-signals';
import { formatHandle, formatDateTime } from '@/lib/format';
import { type Contractor, isUnlocked } from '@/lib/types';
import { cn } from '@/lib/utils';

/**
 * ContractorCard — the anchor of the masked/unlocked distinction.
 *
 * Pre-unlock variant: pseudonymous handle, locked sections for
 * identity, identity-neutral trust signals, primary CTA varies
 * by viewer role.
 *
 * Post-unlock variant: legal name with verified-organization checkmark,
 * full contact section visible, action buttons appropriate to phase.
 *
 * The transition is server-driven (not a client toggle). When the
 * backend returns a Contractor with the unlock fields populated,
 * this component renders the unlocked variant. Otherwise masked.
 *
 * The visual distinction:
 *   - Unlocked card has a 4px green left-border accent
 *   - Pseudonymous handle disappears from the headline (still exists
 *     elsewhere as a stable identifier)
 *   - Action buttons evolve from "Submit Bid / View Bid" to "Open Chat"
 */
interface ContractorCardProps {
  contractor: Contractor;
  unlockPriceAed?: number;
  awaitingPayment?: boolean;
  onUnlockClick?: () => void;
  onOpenChat?: () => void;
  onScheduleKickoff?: () => void;
  onDownloadProjectPack?: () => void;
  className?: string;
}

export function ContractorCard({
  contractor,
  unlockPriceAed,
  awaitingPayment,
  onUnlockClick,
  onOpenChat,
  onScheduleKickoff,
  onDownloadProjectPack,
  className,
}: ContractorCardProps) {
  const unlocked = isUnlocked(contractor);

  return (
    <Card className={cn(unlocked && 'unlocked-accent', className)}>
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0 flex-1">
            {/* Headline area — handle pre-unlock, legal name post-unlock */}
            {unlocked ? (
              <>
                <div className="flex items-center gap-2">
                  <h3 className="text-h3 font-display font-semibold text-neutral-900 truncate">
                    {contractor.legalName}
                  </h3>
                  <span
                    className="inline-flex items-center justify-center rounded-full bg-success-50 p-1"
                    title="Verified organization"
                  >
                    <Building2
                      className="h-3.5 w-3.5 text-success-700"
                      strokeWidth={2.5}
                      aria-label="Verified organization"
                    />
                  </span>
                </div>
                <p className="text-caption font-sans text-neutral-400 mt-1">
                  Unlocked on {formatDateTime(contractor.unlockedAt)}
                </p>
              </>
            ) : (
              <>
                <span className="text-handle text-h3 tracking-wide">
                  {formatHandle(contractor.pseudonymousHandle)}
                </span>
                <p className="text-caption font-sans text-neutral-400 mt-1">
                  {contractor.primaryCategory} ·{' '}
                  {contractor.yearsInBusiness} years in business
                </p>
              </>
            )}
          </div>
        </div>

        {/* Trust signals — visible on both variants */}
        <TrustSignals
          isKycVerified={contractor.isKycVerified}
          isInsured={contractor.isInsured}
          isLicenseVerified={contractor.isLicenseVerified}
          completedProjectCount={contractor.completedProjectCount}
          trustScore={contractor.trustScore}
          reviewCount={contractor.reviewCount}
          className="mt-3"
        />
      </CardHeader>

      <Separator />

      <CardContent className="pt-4 space-y-4">
        {/* Identity section: locked or unlocked */}
        {unlocked ? (
          <UnlockedContactBlock contractor={contractor} />
        ) : (
          <LockedSection
            label="Contact details locked"
            description="Email, phone, address, and license number become available after payment."
            unlockPriceAed={unlockPriceAed}
            awaitingPayment={awaitingPayment}
          />
        )}

        {/* Action area */}
        <div className="flex flex-wrap gap-2 pt-2">
          {unlocked ? (
            <>
              <Button
                variant="primary"
                size="md"
                onClick={onOpenChat}
                className="gap-2"
              >
                <MessageCircle className="h-4 w-4" /> Open Chat
              </Button>
              <Button
                variant="secondary"
                size="md"
                onClick={onScheduleKickoff}
                className="gap-2"
              >
                <Calendar className="h-4 w-4" /> Schedule Kickoff
              </Button>
              <Button
                variant="tertiary"
                size="md"
                onClick={onDownloadProjectPack}
                className="gap-2"
              >
                <FileDown className="h-4 w-4" /> Project Pack
              </Button>
            </>
          ) : (
            !awaitingPayment && (
              <Button
                variant="success"
                size="md"
                onClick={onUnlockClick}
                className="gap-2"
              >
                Pay & Unlock
              </Button>
            )
          )}
        </div>
      </CardContent>
    </Card>
  );
}

function UnlockedContactBlock({
  contractor,
}: {
  contractor: Extract<Contractor, { legalName: string }>;
}) {
  return (
    <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
      <ContactRow label="Email" value={contractor.contactEmail} />
      <ContactRow label="Phone" value={contractor.contactPhone} />
      {contractor.contactWhatsapp && (
        <ContactRow label="WhatsApp" value={contractor.contactWhatsapp} />
      )}
      {contractor.contactAddress && (
        <ContactRow
          label="Address"
          value={contractor.contactAddress}
          fullWidth
        />
      )}
      {contractor.licenseNumber && (
        <ContactRow label="License No." value={contractor.licenseNumber} />
      )}
    </div>
  );
}

function ContactRow({
  label,
  value,
  fullWidth,
}: {
  label: string;
  value: string;
  fullWidth?: boolean;
}) {
  return (
    <div className={cn(fullWidth && 'md:col-span-2')}>
      <p className="text-caption font-sans font-medium uppercase tracking-wide text-neutral-400">
        {label}
      </p>
      <p className="text-body-sm font-sans text-neutral-900 mt-0.5 break-words">
        {value}
      </p>
    </div>
  );
}

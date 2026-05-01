'use client';

import * as React from 'react';
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { PriceBreakdown } from '@/components/composite/price-breakdown';
import { formatHandle } from '@/lib/format';

/**
 * AwardConfirmationModal — the moment of commitment.
 * Per Design System §8.3.
 *
 * Pattern: 560px modal. Slow user down enough to be sure;
 * fast enough to feel decisive.
 *
 * "Confirm & Continue to Pay" is Primary (blue), NOT Success (green).
 * Green is reserved for the actual payment moment.
 */
interface AwardConfirmationModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  rfqRef: string;
  vendorHandle: string;
  organizationName: string; // the CLIENT's org name (the user's authority)
  pricing: {
    bidTotal: number;
    vatRate: number;
    vatAmount: number;
    serviceFee: number;
    totalPayable: number;
    currency: string;
  };
  onConfirm: () => void;
}

export function AwardConfirmationModal({
  open,
  onOpenChange,
  rfqRef,
  vendorHandle,
  organizationName,
  pricing,
  onConfirm,
}: AwardConfirmationModalProps) {
  const [authorityChecked, setAuthorityChecked] = React.useState(false);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent size="md" className="p-0">
        <div className="px-6 pt-6 pb-4">
          <DialogTitle>Award this bid?</DialogTitle>
          <DialogDescription className="mt-2">
            You&apos;re awarding {rfqRef} to{' '}
            <span className="text-handle text-body font-semibold">
              {formatHandle(vendorHandle)}
            </span>
          </DialogDescription>
        </div>

        <div className="px-6 pb-4">
          <PriceBreakdown
            bidTotal={pricing.bidTotal}
            vatRate={pricing.vatRate}
            vatAmount={pricing.vatAmount}
            serviceFee={pricing.serviceFee}
            totalPayable={pricing.totalPayable}
            currency={pricing.currency}
            emphasis="large"
          />

          {/* Restraint copy: factual, brief, reinforces the value being purchased.
              Closes Brand Integration Validation §5.4 — reversibility messaging
              is the single most effective hesitation reducer per the CRO doc. */}
          <p className="mt-6 text-body-sm font-sans text-neutral-600 leading-relaxed">
            Payment is due within 48 hours of award. The contractor&apos;s identity
            is revealed only after payment is confirmed.{' '}
            <span className="text-neutral-900">
              Awards can be reversed for a refund within 24 hours of payment.
            </span>
          </p>

          {/* Authority confirmation — non-skippable */}
          <label className="mt-5 flex items-start gap-3 cursor-pointer group">
            <Checkbox
              checked={authorityChecked}
              onCheckedChange={(c) => setAuthorityChecked(c === true)}
              className="mt-0.5"
            />
            <span className="text-body-sm font-sans text-neutral-700 group-hover:text-neutral-900 transition-colors">
              I confirm: I have authority to commit on behalf of{' '}
              <span className="font-semibold text-neutral-900">
                {organizationName}
              </span>
              .
            </span>
          </label>
        </div>

        <DialogFooter className="px-6 pb-6 pt-4 mt-0">
          <Button
            variant="secondary"
            size="md"
            onClick={() => onOpenChange(false)}
          >
            Cancel
          </Button>
          <Button
            variant="primary"
            size="md"
            disabled={!authorityChecked}
            onClick={onConfirm}
          >
            Confirm & continue to pay
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

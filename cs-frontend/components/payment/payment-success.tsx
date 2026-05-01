'use client';

import * as React from 'react';
import { CheckCircle2, MessageCircle, FileDown, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { formatCurrency, formatHandle, formatDateTime } from '@/lib/format';

/**
 * PaymentSuccess — the takeover state per Design System §7.4.
 *
 * The single design exception for celebratory motion: a checkmark
 * bounce animation (400ms). Everything else stays restrained.
 *
 * No dismissal countdown. User explicitly closes when ready.
 */
interface PaymentSuccessProps {
  award: {
    id: string;
    rfqRef: string;
    rfqTitle: string;
    vendorHandle: string;
  };
  pricing: {
    totalPayable: number;
    currency: string;
  };
  // Once unlocked, the contractor's legal name is available
  vendorLegalName?: string;
  receiptId?: string;
  onClose?: () => void;
  onViewContractor?: () => void;
  onOpenChat?: () => void;
  onDownloadReceipt?: () => void;
}

export function PaymentSuccess({
  award,
  pricing,
  vendorLegalName,
  receiptId,
  onClose,
  onViewContractor,
  onOpenChat,
  onDownloadReceipt,
}: PaymentSuccessProps) {
  const now = new Date();

  return (
    <div className="px-6 py-12 text-center">
      {/* Checkmark with bounce — the one exception */}
      <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-success-50 animate-check-bounce">
        <CheckCircle2
          className="h-10 w-10 text-success-700"
          strokeWidth={2}
          aria-hidden
        />
      </div>

      {/* Headline */}
      <h2 className="text-h1 font-display font-semibold text-neutral-900">
        You're connected.
      </h2>
      <p className="mt-2 text-body font-sans text-neutral-600 max-w-md mx-auto">
        Your payment was processed and{' '}
        {vendorLegalName ? (
          <strong className="text-neutral-900">{vendorLegalName}</strong>
        ) : (
          <span className="text-handle">{formatHandle(award.vendorHandle)}</span>
        )}{' '}
        is now unlocked. Contact details and the Project Pack are ready in
        your dashboard.
      </p>

      {/* Receipt summary */}
      <div className="mt-8 mx-auto max-w-md rounded-lg border border-neutral-100 bg-neutral-50/50 p-4 text-left">
        <p className="text-overline uppercase font-sans text-neutral-400">
          Receipt
        </p>
        <dl className="mt-3 space-y-2 text-body-sm font-sans">
          <ReceiptRow label="Amount paid">
            <span className="text-money font-semibold">
              {formatCurrency(pricing.totalPayable, pricing.currency)}
            </span>
          </ReceiptRow>
          <ReceiptRow label="Project">
            <span className="text-neutral-700">{award.rfqRef}</span>
          </ReceiptRow>
          <ReceiptRow label="Paid at">
            <span className="text-neutral-700 tabular-nums">
              {formatDateTime(now)}
            </span>
          </ReceiptRow>
          {receiptId && (
            <ReceiptRow label="Transaction ID">
              <span className="font-mono text-caption text-neutral-700">
                {receiptId}
              </span>
            </ReceiptRow>
          )}
        </dl>
      </div>

      {/* Next-step CTAs */}
      <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
        <Button variant="primary" size="lg" onClick={onViewContractor} className="gap-2">
          View contractor details
          <ArrowRight className="h-4 w-4" />
        </Button>
        <Button variant="secondary" size="lg" onClick={onOpenChat} className="gap-2">
          <MessageCircle className="h-4 w-4" />
          Open chat
        </Button>
        <Button variant="tertiary" size="md" onClick={onDownloadReceipt} className="gap-2">
          <FileDown className="h-4 w-4" />
          Download receipt
        </Button>
      </div>

      {/* Quiet exit */}
      <button
        type="button"
        onClick={onClose}
        className="mt-8 text-caption font-sans text-neutral-400 hover:text-neutral-700 transition-colors"
      >
        Close and return to dashboard
      </button>
    </div>
  );
}

function ReceiptRow({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex items-baseline justify-between gap-4">
      <dt className="text-neutral-400">{label}</dt>
      <dd>{children}</dd>
    </div>
  );
}

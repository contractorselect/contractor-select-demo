'use client';

import * as React from 'react';
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { PriceBreakdown } from '@/components/composite/price-breakdown';
import { PaymentSuccess } from './payment-success';
import {
  Lock,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  ChevronRight,
  HelpCircle,
  RotateCcw,
} from 'lucide-react';
import { Elements, PaymentElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { getStripe, STRIPE_APPEARANCE, PAYMENT_ELEMENT_OPTIONS } from '@/lib/stripe';
import { formatCurrency, formatHandle, formatCountdown } from '@/lib/format';
import { cn } from '@/lib/utils';

/**
 * PaymentModal — the single most important UI in the platform.
 *
 * Goal: make the largest moment of friction in the funnel feel safe,
 * premium, and confident. Stripe Elements handles card data; the
 * surrounding UI carries the trust.
 *
 * Per Design System §8.4 — 720px modal, two-column layout:
 *   Left:  award summary, trust signals, what-unlocks-after
 *   Right: Stripe Elements PaymentElement, "Powered by Stripe", Pay button
 *
 * Trust signals (deliberate, restrained):
 *   - Lock icon next to "Held in Stripe" (NOT a generic security icon)
 *   - "PCI-DSS compliant" stated factually (one line, no badge spam)
 *   - "3D-Secure verification handled automatically"
 *   - "Funds released only after kickoff confirmed" — addresses the
 *     #1 B2B buyer concern (closes Brand Integration Validation §5.4)
 *   - "Powered by Stripe" small, near the card form
 *   - PaymentElement renders Apple Pay / Google Pay / card automatically
 *
 * What's deliberately ABSENT:
 *   - No countdown urgency timer ("offer ends in 5:00")
 *   - No competitor-comparison ("you saved AED 4,000")
 *   - No upsells, cross-sells, sponsored content
 *   - No "Save your card for next time" toggle (deferred)
 *
 * Stripe wiring (Brand Integration Validation §5.3):
 *   - <Elements> provider receives clientSecret + brand-themed appearance
 *   - PaymentElement renders inline (replaces the placeholder)
 *   - confirmPayment() called from Pay button
 *   - On 3DS challenge, Stripe handles the redirect/iframe automatically
 *
 * Mobile layout (Brand Integration Validation §5.5):
 *   - Pay button is sticky at viewport bottom on <md viewports
 *   - Modal content gets bottom padding to clear the sticky button
 */

type PaymentState =
  | 'idle'
  | 'processing'
  | 'requires_action'
  | 'succeeded'
  | 'failed';

interface PaymentModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  award: {
    id: string;
    rfqRef: string;
    rfqTitle: string;
    vendorHandle: string;
    expiresAt: string;
  };
  pricing: {
    bidTotal: number;
    vatRate: number;
    vatAmount: number;
    serviceFee: number;
    totalPayable: number;
    currency: string;
  };
  /**
   * Stripe PaymentIntent client secret. Returned by the backend's
   * createAward / createUnlockFeePaymentIntent endpoints.
   */
  clientSecret: string;
  /**
   * URL Stripe redirects to on completion (success or 3DS challenge).
   * Typically /awards/:id/success.
   */
  returnUrl: string;
  onSuccess?: () => void;
  onClose?: () => void;
}

/**
 * Public component: wraps the inner modal in <Elements> with brand theming.
 * Callers pass clientSecret; the Elements provider initializes Stripe.js
 * exactly once via the singleton in lib/stripe.ts.
 */
export function PaymentModal(props: PaymentModalProps) {
  const stripePromise = React.useMemo(() => getStripe(), []);

  // Defer rendering Elements until the modal is actually opened.
  // Avoids loading Stripe.js for users who never open the modal.
  if (!props.open) {
    return null;
  }

  return (
    <Elements
      stripe={stripePromise}
      options={{
        clientSecret: props.clientSecret,
        appearance: STRIPE_APPEARANCE,
        loader: 'auto',
      }}
    >
      <PaymentModalInner {...props} />
    </Elements>
  );
}

function PaymentModalInner({
  open,
  onOpenChange,
  award,
  pricing,
  returnUrl,
  onSuccess,
}: PaymentModalProps) {
  const stripe = useStripe();
  const elements = useElements();
  const [paymentState, setPaymentState] = React.useState<PaymentState>('idle');
  const [errorMessage, setErrorMessage] = React.useState<string | null>(null);
  const [errorCode, setErrorCode] = React.useState<string | null>(null);

  const handlePay = async () => {
    if (!stripe || !elements) {
      setErrorMessage('Payment is initializing. Try again in a moment.');
      setPaymentState('failed');
      return;
    }

    setPaymentState('processing');
    setErrorMessage(null);
    setErrorCode(null);

    try {
      const { error, paymentIntent } = await stripe.confirmPayment({
        elements,
        confirmParams: {
          return_url: returnUrl,
        },
        // 'if_required' lets Stripe handle 3DS challenges via redirect
        // when the issuing bank requires; otherwise we stay on this page
        // and reflect the state inline.
        redirect: 'if_required',
      });

      if (error) {
        setErrorMessage(
          error.message ?? 'Payment could not be processed. Try again or use a different card.',
        );
        setErrorCode(error.code ?? null);
        setPaymentState('failed');
        return;
      }

      if (paymentIntent?.status === 'succeeded') {
        setPaymentState('succeeded');
        onSuccess?.();
      } else if (paymentIntent?.status === 'requires_action') {
        // Stripe redirected to handle 3DS — we'll pick up the user via the return_url
        setPaymentState('requires_action');
      } else {
        setErrorMessage(`Unexpected payment state: ${paymentIntent?.status ?? 'unknown'}`);
        setPaymentState('failed');
      }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Payment could not be processed.';
      setErrorMessage(message);
      setPaymentState('failed');
    }
  };

  // Success state — full takeover (per design)
  if (paymentState === 'succeeded') {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent size="lg" hideClose>
          <PaymentSuccess
            award={award}
            pricing={pricing}
            onClose={() => onOpenChange(false)}
          />
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent size="lg" className="p-0 overflow-hidden">
        {/* Header */}
        <div className="px-6 pt-6 pb-4 border-b border-neutral-100">
          <DialogTitle className="text-h2">Pay & Unlock Contractor</DialogTitle>
          <DialogDescription className="mt-1">
            {award.rfqRef} · {award.rfqTitle}
          </DialogDescription>
        </div>

        {/* Two-column body */}
        <div className="grid grid-cols-1 md:grid-cols-[1fr_1fr] gap-0">
          {/* LEFT: award summary + trust panel */}
          <div className="p-6 bg-neutral-50/50">
            <SectionLabel>Award summary</SectionLabel>
            <div className="mt-3 mb-6">
              <p className="text-caption font-sans uppercase tracking-wide text-neutral-400">
                Selected contractor
              </p>
              <p className="text-handle text-h3 mt-1">
                {formatHandle(award.vendorHandle)}
              </p>
            </div>

            <PriceBreakdown
              bidTotal={pricing.bidTotal}
              vatRate={pricing.vatRate}
              vatAmount={pricing.vatAmount}
              serviceFee={pricing.serviceFee}
              totalPayable={pricing.totalPayable}
              currency={pricing.currency}
              emphasis="large"
            />

            <Separator className="my-6" />

            <SectionLabel>Security</SectionLabel>
            <ul className="mt-3 space-y-2.5">
              <TrustRow icon={Lock}>
                Held in Stripe — funds never on our servers
              </TrustRow>
              <TrustRow icon={ShieldCheck}>
                PCI-DSS compliant card processing
              </TrustRow>
              <TrustRow icon={CheckCircle2}>
                3D-Secure verification handled automatically
              </TrustRow>
              {/* Closes Brand Integration Validation §5.4 — addresses the #1
                  B2B buyer concern: "what if the contractor doesn't deliver?" */}
              <TrustRow icon={RotateCcw}>
                Funds released to contractor only after kickoff confirmed
              </TrustRow>
            </ul>

            <Separator className="my-6" />

            <SectionLabel>After payment</SectionLabel>
            <ul className="mt-3 space-y-2 text-body-sm font-sans text-neutral-700">
              <UnlockListItem>Contractor name & contact revealed</UnlockListItem>
              <UnlockListItem>Project Pack (PDF) generated</UnlockListItem>
              <UnlockListItem>Direct chat opens</UnlockListItem>
              <UnlockListItem>VAT-compliant receipt issued</UnlockListItem>
            </ul>
          </div>

          {/* RIGHT: payment form */}
          <div className="p-6 max-md:pb-24">
            <SectionLabel>Payment</SectionLabel>

            {/* Error banner — only shown on failure */}
            {paymentState === 'failed' && errorMessage && (
              <div
                role="alert"
                className="mt-3 mb-4 rounded-md border border-danger-500/30 bg-danger-50 px-4 py-3"
              >
                <div className="flex items-start gap-2">
                  <AlertCircle className="h-4 w-4 text-danger-500 flex-shrink-0 mt-0.5" />
                  <div className="flex-1 min-w-0">
                    <p className="text-body-sm font-sans font-medium text-danger-700">
                      {errorMessage}
                    </p>
                    <p className="text-caption font-sans text-danger-700/80 mt-0.5">
                      Try a different card or contact your bank.
                      {errorCode && (
                        <span className="ml-2 font-mono text-[11px] opacity-70">
                          [code: {errorCode}]
                        </span>
                      )}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Real Stripe PaymentElement (Brand Integration Validation §5.3).
                Renders Apple Pay / Google Pay / card tabs automatically based
                on device capability. Tokens and 3DS handling are Stripe-native. */}
            <div className="mt-3 space-y-4">
              <PaymentElement options={PAYMENT_ELEMENT_OPTIONS} />

              <p className="text-caption font-sans text-neutral-400 inline-flex items-center gap-1.5">
                <Lock className="h-3 w-3" /> Powered by Stripe ·
                Card details encrypted on submit
              </p>
            </div>

            {/* Pay button — Success Large variant, amount in the button.
                On mobile (<md), sticks to viewport bottom for thumb reach
                (Brand Integration Validation §5.5). Desktop: inline. */}
            <Button
              variant="success"
              size="lg"
              loading={paymentState === 'processing'}
              onClick={handlePay}
              disabled={!stripe || !elements || paymentState === 'processing'}
              className={cn(
                'w-full mt-6 gap-2',
                // Mobile sticky behavior
                'max-md:fixed max-md:bottom-0 max-md:left-0 max-md:right-0',
                'max-md:rounded-none max-md:px-6 max-md:py-4',
                'max-md:shadow-[0_-4px_12px_-2px_rgba(0,0,0,0.08)]',
                'max-md:z-50',
              )}
            >
              {paymentState === 'processing'
                ? 'Processing...'
                : `Pay ${formatCurrency(pricing.totalPayable, pricing.currency)} & Unlock`}
            </Button>

            <p className="mt-3 text-caption font-sans text-neutral-400 text-center">
              By paying, you agree to the{' '}
              <a
                href="/legal/terms"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary-900 hover:underline"
              >
                Marketplace Terms
              </a>
              .
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-neutral-100 flex items-center justify-between text-caption font-sans text-neutral-400">
          <span>
            Award expires in{' '}
            <span className="font-medium text-neutral-700 tabular-nums">
              {formatCountdown(award.expiresAt)}
            </span>
          </span>
          <a
            href="/help/payments"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 hover:text-neutral-700 transition-colors"
          >
            <HelpCircle className="h-3.5 w-3.5" /> Help & FAQ
          </a>
        </div>
      </DialogContent>
    </Dialog>
  );
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-overline uppercase font-sans text-neutral-400">
      {children}
    </p>
  );
}

function TrustRow({
  icon: Icon,
  children,
}: {
  icon: typeof Lock;
  children: React.ReactNode;
}) {
  return (
    <li className="flex items-start gap-2">
      <Icon
        className="h-4 w-4 text-success-700 flex-shrink-0 mt-0.5"
        strokeWidth={2.25}
      />
      <span className="text-body-sm font-sans text-neutral-700">
        {children}
      </span>
    </li>
  );
}

function UnlockListItem({ children }: { children: React.ReactNode }) {
  return (
    <li className="flex items-start gap-2">
      <ChevronRight
        className="h-4 w-4 text-primary-900 flex-shrink-0 mt-0.5"
        strokeWidth={2.5}
      />
      <span>{children}</span>
    </li>
  );
}

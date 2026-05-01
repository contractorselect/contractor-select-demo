'use client';
export const dynamic = 'force-dynamic';
import * as React from 'react';
import { useRouter } from 'next/navigation';
import { ChevronLeft, ShieldCheck, Lock, Sparkles } from 'lucide-react';
import Link from 'next/link';
import { PaymentModal } from '@/components/payment/payment-modal';
import { Button } from '@/components/ui/button';
import { PriceBreakdown } from '@/components/composite/price-breakdown';
import { StatusBadge } from '@/components/composite/status-badge';
import { formatHandle, formatCountdown } from '@/lib/format';

/**
 * Payment page — landing page that opens the PaymentModal.
 *
 * The page itself is contextual (shows what's being paid for and why)
 * and the modal is the actual payment surface. This split allows users
 * to be in the payment context without committing immediately.
 *
 * Per Design System §8.4.
 */

const MOCK_AWARD = {
  id: 'award-001',
  rfqRef: 'RFQ-2026-00481',
  rfqTitle: 'Bathroom renovation, 3-bed apartment',
  vendorHandle: 'VC-0427',
  expiresAt: '2026-05-02T14:23:00Z',
};

const MOCK_PRICING = {
  bidTotal: 22000,
  vatRate: 0.05,
  vatAmount: 1100,
  serviceFee: 1492,
  totalPayable: 24592,
  currency: 'AED',
};

/**
 * Dev-only stub client secret. In production this comes from the backend's
 * POST /v1/rfqs/:rfqId/awards response. Format: 'pi_xxx_secret_yyy'.
 *
 * To exercise the real Stripe flow locally:
 *   1. Set NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY in .env.local
 *   2. Replace this constant with a fetch to the real award endpoint
 *   3. Use Stripe test cards (4242... etc.) per Stripe docs
 */
const MOCK_CLIENT_SECRET = 'pi_dev_stub_secret_set_real_key_in_env';

export default function PaymentPage({
  params,
}: {
  params: { id: string };
}) {
  const router = useRouter();
  const [paymentOpen, setPaymentOpen] = React.useState(false);
  const [simulating, setSimulating] = React.useState(false);

  /**
   * Detect demo mode — when no Stripe publishable key is set, fall back
   * to a simulated payment flow that navigates directly to /unlocked.
   *
   * This is the same mechanic Sprint 1's PAYMENT_MODE=simulated uses on
   * the backend. The "Mark as Paid" admin endpoint creates the unlock_event
   * row identically to a Stripe webhook.
   */
  const stripeKey = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY;
  const demoMode = !stripeKey || stripeKey.length === 0;

  /**
   * In production, this clientSecret comes from the backend's
   * createAward / createUnlockFeePaymentIntent response. The frontend
   * passes it to <Elements> to initialize the PaymentElement.
   */
  const clientSecret = MOCK_CLIENT_SECRET;

  // Where Stripe redirects after 3DS challenge or wallet payment.
  const returnUrl =
    typeof window !== 'undefined'
      ? `${window.location.origin}/awards/${params.id}/unlocked`
      : `/awards/${params.id}/unlocked`;

  const handleSuccess = () => {
    router.push(`/awards/${params.id}/unlocked`);
  };

  const handleSimulatedPay = () => {
    setSimulating(true);
    // Simulated network delay so the loading state is visible
    setTimeout(() => {
      router.push(`/awards/${params.id}/unlocked`);
    }, 1200);
  };

  const handleClose = () => {
    setPaymentOpen(false);
    router.push(`/rfqs/${MOCK_AWARD.rfqRef}/bids` as never);
  };

  return (
    <div className="space-y-6">
      <Link
        href={`/rfqs/${MOCK_AWARD.rfqRef}/bids` as never}
        className="inline-flex items-center gap-1 text-body-sm font-sans text-neutral-600 hover:text-neutral-900"
      >
        <ChevronLeft className="h-4 w-4" />
        Back to bids
      </Link>

      {/* Page-level context (visible behind/around the modal) */}
      <div className="max-w-2xl">
        <div className="flex items-center gap-3 mb-3">
          <span className="text-overline uppercase font-sans text-neutral-400">
            {MOCK_AWARD.rfqRef}
          </span>
          <StatusBadge type="award" state="pending_payment" />
        </div>
        <h1 className="text-h1 font-display font-semibold text-neutral-900">
          Awaiting payment
        </h1>
        <p className="mt-2 text-body font-sans text-neutral-600 leading-relaxed">
          You've awarded{' '}
          <span className="text-handle font-semibold">
            {formatHandle(MOCK_AWARD.vendorHandle)}
          </span>{' '}
          for{' '}
          <span className="text-neutral-900 font-medium">{MOCK_AWARD.rfqTitle}</span>
          . Complete payment to unlock contractor details, generate the project pack,
          and open the chat.
        </p>

        {/* Time pressure but factual, not urgency-marketing */}
        <p className="mt-4 inline-flex items-center gap-1.5 text-caption font-sans text-neutral-500">
          <Lock className="h-3.5 w-3.5" />
          Your award is held for{' '}
          <span className="text-neutral-700 font-medium tabular-nums">
            {formatCountdown(MOCK_AWARD.expiresAt)}
          </span>
        </p>
      </div>

      {/* Trust + price summary, in case modal is dismissed */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 max-w-4xl">
        <div className="rounded-lg border border-neutral-100 bg-white p-6 shadow-sm">
          <p className="text-overline uppercase font-sans text-neutral-400">
            Total to pay
          </p>
          <div className="mt-4">
            <PriceBreakdown
              bidTotal={MOCK_PRICING.bidTotal}
              vatRate={MOCK_PRICING.vatRate}
              vatAmount={MOCK_PRICING.vatAmount}
              serviceFee={MOCK_PRICING.serviceFee}
              totalPayable={MOCK_PRICING.totalPayable}
              currency={MOCK_PRICING.currency}
              emphasis="large"
            />
          </div>
          <Button
            variant="success"
            size="lg"
            loading={simulating}
            onClick={demoMode ? handleSimulatedPay : () => setPaymentOpen(true)}
            className="w-full mt-6"
          >
            {demoMode
              ? simulating
                ? 'Simulating payment…'
                : 'Simulate payment & unlock (demo)'
              : 'Continue to payment'}
          </Button>
          {demoMode && (
            <p className="mt-3 inline-flex items-start gap-1.5 text-caption font-sans text-neutral-400">
              <Sparkles className="h-3.5 w-3.5 flex-shrink-0 mt-0.5" />
              Demo mode — no Stripe key set. Click to simulate payment confirmation
              and skip directly to the unlocked view.
            </p>
          )}
        </div>

        <div className="rounded-lg border border-neutral-100 bg-white p-6 shadow-sm">
          <p className="text-overline uppercase font-sans text-neutral-400">
            What happens next
          </p>
          <ol className="mt-4 space-y-4 text-body-sm font-sans text-neutral-700">
            <Step n={1} title="Complete payment">
              Your card is charged through Stripe. Funds never touch our servers.
            </Step>
            <Step n={2} title="Identity unlocked">
              Contractor name, contact details, and license info become visible.
            </Step>
            <Step n={3} title="Project Pack issued">
              VAT-compliant receipt + signed contract terms.
            </Step>
            <Step n={4} title="Direct chat opens">
              You and the contractor can communicate without redaction.
            </Step>
          </ol>
        </div>
      </div>

      {/* The actual payment modal — only when Stripe is configured.
          In demo mode (no key), the simulate button on the left card
          handles the unlock flow directly. */}
      {!demoMode && (
        <PaymentModal
          open={paymentOpen}
          onOpenChange={setPaymentOpen}
          award={MOCK_AWARD}
          pricing={MOCK_PRICING}
          clientSecret={clientSecret}
          returnUrl={returnUrl}
          onSuccess={handleSuccess}
          onClose={handleClose}
        />
      )}
    </div>
  );
}

function Step({
  n,
  title,
  children,
}: {
  n: number;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <li className="flex gap-3">
      <span className="flex-shrink-0 h-6 w-6 rounded-full bg-primary-50 text-primary-900 inline-flex items-center justify-center text-caption font-sans font-semibold tabular-nums">
        {n}
      </span>
      <div className="flex-1">
        <p className="font-medium text-neutral-900">{title}</p>
        <p className="text-caption font-sans text-neutral-400 mt-0.5">{children}</p>
      </div>
    </li>
  );
}

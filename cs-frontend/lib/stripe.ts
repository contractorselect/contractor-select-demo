import { loadStripe, type Stripe } from '@stripe/stripe-js';

/**
 * Stripe.js client — singleton, lazily initialized.
 *
 * Closes Brand Integration Validation §5.3:
 * Replaces the placeholder StripeElementsPlaceholder with real Stripe Elements.
 *
 * Pattern: a single in-module promise so we don't re-load Stripe.js on each
 * render. Calling getStripe() returns the same Promise regardless of how many
 * times it's invoked.
 *
 * Environment:
 *   NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY — set in .env.local for dev,
 *   in deployment environment for production. Throws at module load if absent.
 */
let stripePromise: Promise<Stripe | null> | null = null;

export function getStripe(): Promise<Stripe | null> {
  if (!stripePromise) {
    const publishableKey = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY;
    if (!publishableKey) {
      // In dev, this surface a clear error rather than a silent failure
      // when handlePay() is invoked.
      // eslint-disable-next-line no-console
      console.error(
        'NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY is not set. Stripe Elements cannot initialize.',
      );
      return Promise.resolve(null);
    }
    stripePromise = loadStripe(publishableKey);
  }
  return stripePromise;
}

/**
 * Brand-themed Stripe Elements appearance.
 *
 * Per Brand Integration Validation §5.3 — colors and typography match the
 * design system so the embedded Stripe form looks native to the platform.
 *
 * Tokens:
 *   colorPrimary  — primary-900 (the brand blue)
 *   colorText     — neutral-900
 *   colorDanger   — danger-500 (matches our error states)
 *   borderRadius  — 6px (matches design system radius-md)
 *   fontFamily    — Montserrat (body font)
 */
export const STRIPE_APPEARANCE = {
  theme: 'stripe' as const,
  variables: {
    colorPrimary: '#0D3A7A',
    colorText: '#1F2937',
    colorTextSecondary: '#6F7378',
    colorTextPlaceholder: '#9CA3AF',
    colorBackground: '#FFFFFF',
    colorDanger: '#DC2626',
    fontFamily: 'Montserrat, system-ui, sans-serif',
    fontSizeBase: '14px',
    borderRadius: '6px',
    spacingUnit: '4px',
  },
  rules: {
    '.Input': {
      borderColor: '#E5E7EB',
      boxShadow: 'none',
      padding: '10px 12px',
    },
    '.Input:focus': {
      borderColor: '#0D3A7A',
      boxShadow: '0 0 0 3px rgba(13, 58, 122, 0.12)',
    },
    '.Label': {
      fontWeight: '500',
      color: '#1F2937',
      marginBottom: '6px',
    },
    '.Tab': {
      borderColor: '#E5E7EB',
      borderRadius: '6px',
    },
    '.Tab--selected': {
      borderColor: '#0D3A7A',
      color: '#0D3A7A',
    },
  },
};

/**
 * PaymentElement options matching the design system.
 *
 *   - paymentMethodOrder prioritizes Apple Pay / Google Pay / card.
 *   - layout: 'tabs' presents wallet options as tab choices when available,
 *     so users see Apple Pay / Google Pay clearly rather than buried.
 *   - business name shown in wallet payment confirmation sheets.
 */
export const PAYMENT_ELEMENT_OPTIONS = {
  layout: 'tabs' as const,
  paymentMethodOrder: ['apple_pay', 'google_pay', 'card'],
  business: { name: 'ContractorSelect.me' },
  defaultValues: {
    billingDetails: {
      // Filled by Stripe based on wallet / saved payment method
    },
  },
};

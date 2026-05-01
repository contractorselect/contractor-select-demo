# ContractorSelect.me — Brand Integration Validation

**Date:** 2026-05-01
**Frontend version:** v0.1 (45 files, ~6K LOC)
**Methodology:** code-level audit — every PASS / GAP claim is backed by a specific file reference. No design-doc rubber-stamping.

**Headline finding:** the design system is well-implemented at the component layer (correct tokens, restrained typography, no anti-patterns). But the brand assets are absent (logo never integrated, no `/public/` folder, no trust messaging on key surfaces) and several screens contain placeholder code that must be replaced before backend integration. **Estimated rectification: 3-4 engineering days.**

---

## Executive Summary

| Area | Status | Gap severity |
|---|---|---|
| 1. Trust + premium B2B feel | ⚠️ PARTIAL | Tier 0 — logo placeholder + missing trust language |
| 2. Payment screen secure/clean/conversion | ⚠️ PARTIAL | **Tier 0 — Stripe Elements is placeholder code** |
| 3. Bid comparison structured/professional | ⚠️ PARTIAL | Tier 1 — mobile variant referenced but missing |
| 4. Masked/unmasked states visually clear | ✅ PASS | Tier 2 — transition animation missing |

**Bottom line:** the *design discipline* is right (tokens, typography, restraint). The *integration work* is incomplete (placeholders, missing assets, missing trust copy). Two of the three Tier 0 fixes are purely additive (logo + trust copy); the third (real Stripe Elements wiring) is non-negotiable before payments can actually work.

---

## Area 1 — Trust + Premium B2B Feel

**Question:** Does UI reflect trust and the premium B2B marketplace promise?

### Strengths verified

| Element | Implementation | File |
|---|---|---|
| Auth layout brand statement | "Building trust. Delivering quality." prominent on right column with 3 brand pillars (Verified contractors / Identity protected / Transparent pricing) | `app/(auth)/layout.tsx` |
| Brand color discipline | Zero rogue hex codes in components — all use design tokens (`primary-900`, `success-700`, etc.) | verified by `grep -rE "#[0-9a-fA-F]{3,6}" components/ app/` returning nothing relevant |
| Brand typography | Poppins (display) + Montserrat (body) wired up via `next/font/google` | `app/layout.tsx`, `tailwind.config.ts` |
| Topbar layout | 64px height, sticky, max-width 1280px, restrained right cluster (notifications + user menu) | `components/layout/topbar.tsx` |
| ".me" accent | Green `.me` suffix on logotype reinforces brand mark | `components/layout/topbar.tsx`, `app/(auth)/layout.tsx` |
| Trust signal vocabulary | TrustSignals component has KYC Verified / Insured / License Verified / X Projects — restrained badge cluster, not "BEST!" callouts | `components/composite/trust-signals.tsx` |

### Gaps verified

#### 🔴 1.1 — Logo never integrated (Tier 0 blocker)

**Evidence:** `components/layout/topbar.tsx` line 37: `{/* Logo monogram placeholder - replace with actual SVG */}`. The placeholder is a `<div>` with text "CS" inside a colored rounded square.

The brand kit assets uploaded to `/mnt/user-data/uploads/` (`Logo_Monogram.png`, `Logo_Name.jpg`, `Brand_Kit.png`) were never extracted into the frontend. There is **no `/public/` folder** in the project — meaning no logo SVG, no favicon, no OG image, no Apple touch icon, nothing.

The same placeholder is duplicated in `app/(auth)/layout.tsx` (auth pages have an identical "CS" text-block).

**Why it matters:** the first impression of every visitor is a placeholder. For a "premium B2B marketplace", this is the single most visible brand failure. It also affects sharing (no OG image when links are pasted into Slack/WhatsApp/email — the most common B2B sharing vectors).

**Fix:** §5.1.

#### 🔴 1.2 — Trust language absent on key surfaces

**Evidence:** grep across `app/(auth)/sign-up/page.tsx`, `app/(client)/dashboard/page.tsx`, `app/(client)/rfqs/[id]/bids/page.tsx` for "Trust", "verified", "secure", "escrow", "insur", "KYC" returns **zero matches** on these pages.

The brand-pillar messaging from the auth layout (Verified contractors / Identity protected / Transparent pricing) doesn't propagate to:
- Sign-up form itself (just "verification takes 1-2 business days")
- Dashboard (no platform-level trust framing)
- Bid comparison page (only contractor-level KYC badges; no platform promise)

**Why it matters:** the brand promise has to live throughout the funnel, not just on the login screen. B2B procurement teams move between screens; if the trust framing only appears once, users forget why the platform is different.

**Fix:** §5.2.

#### 🟡 1.3 — Topbar lacks user-menu dropdown

**Evidence:** `topbar.tsx` lines 84-100: the user button is a `<button>` with chevron, but no dropdown panel is wired up. Click does nothing.

This is acceptable for v0.1 (placeholder pending router integration), but must be wired before launch (sign out, settings, switch organization, support).

**Fix:** §5.3 (Tier 1).

---

## Area 2 — Payment Screen ⚠️ PARTIAL (one Tier 0 blocker)

**Question:** Is the payment screen secure, clean, and conversion-focused?

### Strengths verified

| Element | Implementation | File |
|---|---|---|
| Two-column 720px layout | Left: award summary + trust + after-payment list; Right: card form + Pay button | `payment-modal.tsx` |
| Trust signals (restrained) | "Held in Stripe — funds never on our servers" / "PCI-DSS compliant" / "3D-Secure verification handled automatically" | lines 158-166 |
| Pay button shows amount | `Pay ${formatCurrency(...)} & Unlock` — never just "Pay" | line 229 |
| Pay button color hierarchy | `success` variant (green) on payment; primary (blue) on award confirmation. Matches design system. | `payment-modal.tsx` + `award-confirmation-modal.tsx` |
| Stripe attribution | "Powered by Stripe · Card details encrypted on submit" near card form | lines 213-216 |
| What unlocks after | 4-item list: contractor revealed / project pack / direct chat / VAT receipt | lines 173-177 |
| Failure handling | Specific error code + message + "Try a different card or contact your bank" CTA | lines 184-207 |
| Anti-patterns absent | Comment block lines 42-47 explicitly excludes: countdown urgency, competitor comparison, upsells, save-card prompts | verified |
| Success animation discipline | 400ms checkmark bounce; no confetti, no auto-dismiss countdown | `payment-success.tsx` |

### Gaps verified

#### 🔴 2.1 — Stripe Elements is a placeholder (Tier 0 blocker)

**Evidence:** `payment-modal.tsx` line 211: `<StripeElementsPlaceholder />`. The actual implementation is a fake `<input>` styled to look like a Stripe field, returning hard-coded "..." values. From the docstring on line 209: "Stripe Elements would mount here. Visual scaffolding shown."

This means **payments cannot actually be taken in the current build.** The frontend doesn't import `@stripe/react-stripe-js` or `@stripe/stripe-js`. There is no `<Elements>` provider. The `clientSecret` from the backend's `createPaymentIntent` is never consumed.

**Why it matters:** this is not a brand issue — it's a functionality blocker. The backend (v0.7) creates real PaymentIntents; the frontend cannot complete them.

**Fix:** §5.4 (Tier 0).

#### 🟠 2.2 — Apple Pay / Google Pay / Stripe Link not wired

**Evidence:** zero references to wallet payment methods in any frontend file. `<PaymentElement />` (which auto-renders these on supported devices) is not used.

This was the top-priority recommendation in `cs-CONVERSION_OPTIMIZATION.md` Sprint 1 — estimated +20-35% mobile payment conversion. Tied to fix 2.1: switching from `<CardElement />` to `<PaymentElement />` enables wallets in one move.

**Fix:** §5.4 — combined with the Stripe wiring (§5.4 fixes both at once).

#### 🟠 2.3 — Reversibility messaging missing

**Evidence:** grep for "refund|reverse|cancel within|24 hours" in `payment-modal.tsx` and `award-confirmation-modal.tsx` returns nothing.

The CRO doc identified reversibility as the single most effective hesitation reducer. Currently neither modal tells the user "you can reverse within 24 hours / before kickoff confirmed".

**Fix:** §5.5.

#### 🟠 2.4 — Mobile sticky pay button missing

**Evidence:** grep for `sticky` or `fixed.*bottom` in `components/payment/*.tsx` returns nothing.

On mobile viewports, the modal's Pay button sits at the bottom of a scrollable area. Users have to scroll down to find it. CRO doc estimated +8-12% mobile payment conversion from a sticky bottom pay button.

**Fix:** §5.6.

#### 🟢 2.5 — "Funds held in escrow" framing

The trust list mentions Stripe + PCI-DSS + 3D-Secure (technical security) but not the platform's escrow / dispute mediation role. The single most-asked question in B2B marketplace UX research is "what if the contractor doesn't deliver?" — currently unanswered at the payment moment.

**Fix:** §5.7 (Tier 1).

---

## Area 3 — Bid Comparison ⚠️ PARTIAL

**Question:** Is the bid comparison structured and professional?

### Strengths verified

| Element | Implementation | File |
|---|---|---|
| Real table markup | `<table>`, `<thead>`, `<tbody>` — not divs imitating tables (correct semantics for screen readers + copy-paste behavior) | `bid-comparison-table.tsx` lines 88+ |
| Tabular-nums | Prices use `tabular-nums` Tailwind class (consistent column alignment) | line 83 |
| "Best in column" markers | Min/max/earliest highlights via `highlightBest` per attribute | lines 38, 48, 65, etc. |
| Total payable emphasis | `emphasis: 'total'` on totalPayable attribute (loud row) | line 67 |
| Pseudonymous headers | `formatHandle()` renders e.g. "VC-0427" as column headers | verified |
| Trust signals per bid | TrustSignals embedded in each bid column | verified |
| Sticky-left-column intent | Comment line 15: "Sticky-left-column layout" — matches design system §8.2 | docstring verified |

### Gaps verified

#### 🔴 3.1 — Mobile responsive variant referenced but missing (Tier 1)

**Evidence:** `bid-comparison-table.tsx` line 21-22 docstring: *"Mobile: stacks to a tabbed view via responsive utility (caller detects viewport and switches to BidComparisonStacked variant)."*

`BidComparisonStacked` is referenced but never defined anywhere in the codebase (verified by grep). Furthermore, `bid-comparison-table.tsx` itself has zero `md:` or `lg:` Tailwind classes — it doesn't adapt to viewport at all.

On mobile, the table will horizontal-scroll, which is the worst possible UX for a comparison surface. Decision-making suffers when users can't see all attributes at once.

**Fix:** §5.8.

#### 🟠 3.2 — No sort/filter controls

**Evidence:** grep for `sort|filter|onChange` on `bid-comparison-table.tsx` returns nothing. The bid order is whatever the backend returns. Users cannot re-rank by lowest price, fastest start, or highest trust.

CRO doc #2 priority: "What matters most?" dropdown to re-rank columns. Estimated +8-12% award rate.

**Fix:** §5.9.

#### 🟠 3.3 — No platform protection trust strip

**Evidence:** the bid comparison page (`app/(client)/rfqs/[id]/bids/page.tsx`) shows only contractor-level trust badges. There is no platform-level reassurance ("funds held in escrow" / "disputes mediated" / "identity protected").

CRO doc #4.6: at the comparison stage, clients evaluate multiple kinds of risk simultaneously — surfacing platform-mitigated risks lets them focus on contractor selection.

**Fix:** §5.10.

#### 🟡 3.4 — Plain-language summaries absent (Tier 2)

CRO doc #4.2: a one-paragraph plain-English summary per bid ("VC-0427: lowest total payable, longest validity, slowest start. Strong choice if budget is tight and timing is flexible."). Server-side computed; reduces cognitive load. Estimated +10-15% award rate. Deferred to Tier 2 because it requires backend logic.

---

## Area 4 — Masked/Unmasked States ✅ PASS

**Question:** Are masked/unmasked states visually clear?

### Strengths verified

| Element | Implementation | File |
|---|---|---|
| TS-level distinction | `isUnlocked()` type guard discriminates `Contractor` union; impossible to render unlocked fields on a masked variant | `lib/types.ts` |
| Unlocked accent | 4px green left-border via `.unlocked-accent` CSS class | `globals.css` lines confirmed |
| Locked pattern background | Subtle blue diagonal stripes (not greyed out — design system §6.8 explicitly forbids "disabled-looking") | `globals.css` `.locked-pattern` |
| Shield icon (not lock) | LockedSection uses Shield (security framing) not padlock (prison framing) | `locked-section.tsx` line 1 |
| Verified-org checkmark | Unlocked card shows legal name + Building2 checkmark in success-50 background | `contractor-card.tsx` lines 68-77 |
| Unlock timestamp | "Unlocked on {datetime}" — provides confidence the unlock actually happened | line 80 |
| Action button transition | Pre-unlock: "Pay & Unlock" (success/green). Post-unlock: "Open Chat / Schedule Kickoff / Project Pack" (primary/blue + secondary). Color signals state change. | lines 124-164 |
| Pseudonymous handle | `formatHandle()` renders "VC-0427" with `text-handle` class (monospace, tracking-wide) — visually distinct from legal names | verified |
| Identity-neutral trust | TrustSignals never reveals legal name or license — stays consistent across both states | `trust-signals.tsx` docstring |

### Gaps (Tier 2)

#### 🟡 4.1 — No transition animation

**Evidence:** Design system §7.3 specifies an "unlock-fade" animation (300ms) when a card transitions from masked to unlocked. The codebase has no such animation defined; `tailwind.config.ts` doesn't include `unlock-fade` keyframes.

In practice, the transition happens on next page load (after payment success). If the client is on the same page, they don't see a transition — just refresh and the card is different.

**Why it matters:** the moment the contractor's identity becomes visible should be a small moment. The current implementation fires the success modal (good) but the underlying card refresh is silent. A 300ms fade would make the "ah, that's who they are" moment feel intentional.

**Fix:** §5.11 (Tier 2 — not blocking).

#### 🟡 4.2 — No optimistic UI on unlock

**Evidence:** `payment-modal.tsx` shows `<PaymentSuccess>` after payment, but the underlying contractor card / bid row doesn't update until the page is refreshed.

For perceived performance, the success modal could pass the freshly-unlocked contractor data back to its parent, allowing the card to swap variants immediately. Current implementation requires a refetch.

**Fix:** Tier 2 — addressable during integration when backend response shapes are settled.

---

## 5 — UI Improvements Required Before Backend Integration

Severity-ranked. Tier 0 items must be fixed before integration begins (without these, the integration tests will fail or the brand will look broken in user-facing flows). Tier 1 items can ship during the first integration sprint. Tier 2 is post-pilot.

### 🔴 Tier 0 — must fix before integration starts

#### 5.1 — Integrate the actual brand logo

**Effort:** 0.5 days.
**File:** `components/layout/topbar.tsx`, `app/(auth)/layout.tsx`, new `public/` folder.

Steps:
1. Create `public/` folder in frontend root
2. Extract three SVG/PNG variants from the uploaded brand kit:
   - `public/logo-monogram.svg` (the icon-only mark, ~36×36)
   - `public/logo-full.svg` (icon + wordmark, for desktop topbar + auth pages)
   - `public/logo-monochrome-white.svg` (white version for the auth page's blue right-column)
3. Add `public/favicon.ico` (16×16, 32×32, 48×48 multi-resolution)
4. Add `public/apple-touch-icon.png` (180×180)
5. Add `public/og-image.png` (1200×630 with brand mark + tagline)
6. Replace the placeholder div in `topbar.tsx` lines 38-42:

```tsx
// Before
<div className="flex items-center justify-center h-9 w-9 rounded-md bg-primary-900 text-white">
  <span className="text-h5 font-display font-bold tracking-tighter">CS</span>
</div>

// After
<Image
  src="/logo-monogram.svg"
  alt=""
  width={36}
  height={36}
  className="h-9 w-9"
  priority
/>
```

7. Same replacement in `app/(auth)/layout.tsx` lines 23-27
8. Update `app/layout.tsx` metadata block:

```tsx
export const metadata: Metadata = {
  title: { default: 'ContractorSelect.me', template: '%s · ContractorSelect.me' },
  description: 'The high-trust marketplace for verified UAE contractors. Connect, compare, choose with confidence.',
  icons: { icon: '/favicon.ico', apple: '/apple-touch-icon.png' },
  openGraph: {
    title: 'ContractorSelect.me',
    description: 'Building trust. Delivering quality.',
    images: ['/og-image.png'],
    type: 'website',
  },
};
```

#### 5.2 — Add trust language to sign-up + dashboard + bid comparison

**Effort:** 0.5 days.
**Files:** `app/(auth)/sign-up/page.tsx`, `app/(client)/dashboard/page.tsx`, `app/(client)/rfqs/[id]/bids/page.tsx`.

**Sign-up page:** add a single subtle line below the H1:

> "All accounts go through KYC verification. Your identity is protected during bidding — contractor details only revealed after award and payment."

**Dashboard page:** add a top strip (dismissable, tracked in localStorage):

> "🛡️ Funds held in escrow until kickoff confirmed · ⚖️ Disputes mediated · 🔒 Identity protected"

**Bid comparison page:** add the same trust strip below the page header, above the comparison table.

These are factual statements of how the platform works — not promotional. They reinforce the brand promise at the moments where confidence matters.

#### 5.3 — Wire real Stripe Elements (Tier 0 functionality blocker)

**Effort:** 1 day.
**Files:** `components/payment/payment-modal.tsx`, `app/(client)/awards/[id]/pay/page.tsx`, new `lib/stripe.ts`.

Steps:
1. Install `@stripe/stripe-js` and `@stripe/react-stripe-js`
2. Create `lib/stripe.ts`:

```typescript
import { loadStripe } from '@stripe/stripe-js';

let stripePromise: Promise<any> | null = null;

export function getStripe() {
  if (!stripePromise) {
    stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);
  }
  return stripePromise;
}
```

3. In `app/(client)/awards/[id]/pay/page.tsx`, wrap the modal in `<Elements>`:

```tsx
import { Elements } from '@stripe/react-stripe-js';
import { getStripe } from '@/lib/stripe';

const stripe = getStripe();
const options = {
  clientSecret: paymentIntent.clientSecret,
  appearance: {
    theme: 'stripe',
    variables: {
      colorPrimary: '#0D3A7A',  // brand primary
      colorText: '#1F2937',     // neutral-900
      fontFamily: 'Montserrat, system-ui, sans-serif',
      borderRadius: '6px',      // matches design system radius-md
    },
  },
};

<Elements stripe={stripe} options={options}>
  <PaymentModal {...props} />
</Elements>
```

4. Replace `<StripeElementsPlaceholder />` in `payment-modal.tsx` with:

```tsx
import { PaymentElement, useStripe, useElements } from '@stripe/react-stripe-js';

// ...inside the modal:
<PaymentElement
  options={{
    layout: 'tabs',
    paymentMethodOrder: ['apple_pay', 'google_pay', 'card'],
    business: { name: 'ContractorSelect.me' },
  }}
/>
```

5. Wire the `handlePay` function:

```tsx
const stripe = useStripe();
const elements = useElements();

const handlePay = async () => {
  if (!stripe || !elements) return;
  setPaymentState('processing');

  const { error, paymentIntent } = await stripe.confirmPayment({
    elements,
    confirmParams: { return_url: `${window.location.origin}/awards/${award.id}/success` },
    redirect: 'if_required',
  });

  if (error) {
    setPaymentState('failed');
    setErrorMessage(error.message ?? 'Payment failed');
    setErrorCode(error.code ?? null);
  } else if (paymentIntent?.status === 'succeeded') {
    setPaymentState('succeeded');
  }
};
```

This single fix simultaneously:
- Makes payments actually work
- Brings in Apple Pay / Google Pay / Stripe Link automatically (item §2.2)
- Provides 3D-Secure flow handling automatically

### 🟠 Tier 1 — fix during first integration sprint

#### 5.4 — Reversibility messaging on payment + award modals

**Effort:** 0.25 days.
**Files:** `components/payment/payment-modal.tsx` (security list), `components/payment/award-confirmation-modal.tsx`.

In the payment modal trust list, add a 4th item:

```tsx
<TrustRow icon={ArrowUturnLeft}>
  Funds released to contractor only after kickoff confirmed
</TrustRow>
```

In the award confirmation modal, replace the current copy with:

> "Payment is due within 48 hours of award. The contractor's identity is revealed only after payment is confirmed. Awards can be reversed for a refund within 24 hours of payment."

(Coordinate the actual reversal policy with counsel before publishing.)

#### 5.5 — Mobile sticky pay button

**Effort:** 0.25 days.
**File:** `components/payment/payment-modal.tsx`.

On viewports `<768px`, the Pay button leaves the right column and sticks to the viewport bottom:

```tsx
<Button
  variant="success"
  size="lg"
  loading={paymentState === 'processing'}
  onClick={handlePay}
  className={cn(
    "w-full mt-6 gap-2",
    // Mobile: sticky bottom
    "max-md:fixed max-md:bottom-0 max-md:left-0 max-md:right-0",
    "max-md:rounded-none max-md:px-6 max-md:py-4",
    "max-md:border-t max-md:border-success-700/20",
    "max-md:z-50",
  )}
>
```

Add bottom padding to the modal content on mobile so content isn't hidden behind the sticky button.

#### 5.6 — Bid comparison mobile variant

**Effort:** 1.5 days.
**File:** `components/composite/bid-comparison-table.tsx`, new `bid-comparison-stacked.tsx`.

Build the `BidComparisonStacked` variant promised in the docstring:
- Mobile shows one bid at a time as a stacked card
- Tab strip at top to switch between bids ("VC-0427 · VC-0588 · VC-0901")
- Same attributes shown vertically, with "Best in column" markers preserved
- Pay button sticky at bottom of viewport

Caller switches via `useMediaQuery('(max-width: 768px)')` (or pure CSS `md:hidden` / `md:block`).

#### 5.7 — Sort control on bid comparison

**Effort:** 0.5 days.
**File:** `components/composite/bid-comparison-table.tsx`.

Add a single dropdown above the table:

```tsx
<select className="...">
  <option value="balanced">Best balance (default)</option>
  <option value="lowest_total">Lowest total cost</option>
  <option value="fastest_start">Fastest start date</option>
  <option value="highest_trust">Highest trust score</option>
</select>
```

Sort `bids` array via `useMemo` based on selection. Persist to URL query param so refreshes don't reset.

#### 5.8 — Platform trust strip on bid comparison page

**Effort:** 0.25 days.
**File:** `app/(client)/rfqs/[id]/bids/page.tsx`.

Add below the page header, above the comparison table:

```tsx
<div className="mb-6 flex flex-wrap gap-6 px-4 py-3 rounded-md bg-primary-50/50 border border-primary-100">
  <TrustStrip icon={Shield}>Funds held in escrow until kickoff</TrustStrip>
  <TrustStrip icon={Scale}>Disputes mediated by ContractorSelect</TrustStrip>
  <TrustStrip icon={Lock}>Contractor identity protected until award + payment</TrustStrip>
</div>
```

#### 5.9 — Topbar user-menu dropdown

**Effort:** 0.5 days.
**File:** `components/layout/topbar.tsx`, new `user-menu.tsx`.

Wire the chevron button to a dropdown with: Account settings, Switch organization (if multi-org), Help & support, Sign out.

### 🟡 Tier 2 — post-pilot

#### 5.10 — Unlock fade animation

**Effort:** 0.25 days.
**File:** `tailwind.config.ts`, `globals.css`, `components/composite/contractor-card.tsx`.

Add `unlock-fade` keyframes (300ms ease-out). Apply when `isUnlocked()` flips true and the card was previously masked. Requires tracking the previous state via ref.

#### 5.11 — Optimistic UI on payment success

**Effort:** 0.5 days.
**File:** `app/(client)/awards/[id]/pay/page.tsx`.

When `PaymentSuccess` modal closes, pass the unlocked contractor data back via callback to update parent state without refetch. Reduces perceived latency on the unlock moment.

#### 5.12 — Plain-language bid summaries

**Effort:** server-side; UI integration 0.25 days.
**File:** `bid-comparison-table.tsx` adds a "Summary" row.

Backend computes 1-2 sentences per bid characterizing its profile. UI renders in italic muted text. CRO doc estimated +10-15% award rate.

#### 5.13 — "Ask a question" path per bid

**Effort:** 1 day.
**File:** `bid-comparison-table.tsx` + new redacted thread integration.

Tertiary action button per bid → opens redacted message thread to that contractor. Soft-commitment step that converts hesitation into engagement.

---

## 6 — Effort Summary

| Tier | Items | Total effort |
|---|---|---|
| **Tier 0** (block integration) | 5.1 logo + 5.2 trust copy + 5.3 Stripe Elements | **~2 days** |
| **Tier 1** (during integration) | 5.4 reversibility + 5.5 sticky pay + 5.6 mobile bid table + 5.7 sort + 5.8 trust strip + 5.9 user menu | **~3 days** |
| **Tier 2** (post-pilot) | 5.10–5.13 | **~2 days** |
| **Grand total** | 13 items | **~7 engineering days** |

---

## 7 — Pre-Integration Checklist

Before backend integration kicks off, complete these:

- [ ] **5.1** — Logo SVGs in `/public/`, replace placeholders in topbar + auth layout, set up favicon + OG image, update metadata
- [ ] **5.2** — Trust copy on sign-up + dashboard + bid comparison
- [ ] **5.3** — Real Stripe Elements wired up; PaymentElement renders Apple/Google Pay automatically; placeholder removed

After Tier 0 is complete, the frontend is ready to wire to v0.7 backend. Tier 1 items continue during the integration sprint. The application is brand-coherent, functionally complete on payments, and conversion-optimized within the constraints of the brand promise.

---

## 8 — Honest Framing

The frontend's design *discipline* is consistently strong — tokens, typography, restraint, anti-pattern avoidance. The previous design-system audits were correct on those axes.

What none of the previous audits caught:
- The logo was never actually integrated (just a placeholder div with text)
- The Stripe Elements are placeholder visual scaffolding (so the modal can't actually take payments)
- The mobile bid comparison variant is referenced but not implemented
- The brand promise from the auth page doesn't propagate to other surfaces

These aren't design failures. They're integration gaps — the difference between "the design is right" and "the implementation is complete." Both questions need to be asked, and this audit is the first time the second one was asked rigorously at the brand layer.

The good news: every gap has a concrete fix, none takes more than 1.5 days, and the Tier 0 set is 2 days total. The platform is closer to launch-ready than it appears once the placeholder code is replaced.

# ContractorSelect.me — Demo App

A working Next.js 14 demo of the ContractorSelect.me marketplace. Walks through the full client journey (RFQ → bid comparison → award → payment → unlock) plus contractor onboarding with KYC document upload UI. Backend is mocked; runs with **zero configuration** out of the box.

**Live demo locally:**

```bash
npm install
npm run dev
# open http://localhost:3000
```

That's it. No database, no Stripe key, no API server required.

---

## What's included

| Surface | Route | What it shows |
|---|---|---|
| Demo landing | `/` | Role selector — pick a flow to walk through |
| Client sign-up | `/sign-up` | Sign-up form with KYC + identity-protection trust strip |
| Sign-in | `/sign-in` | Sign-in form |
| Client dashboard | `/dashboard` | Active RFQs + awaiting payment + active projects, all mock data |
| RFQ wizard | `/rfqs/new` | 6-step wizard (basics → scope → budget → attachments → site visit → review) |
| RFQ detail | `/rfqs/:id` | Read-only RFQ view |
| Bid comparison | `/rfqs/:id/bids` | The masked side-by-side comparison — three vendors, pseudonymous handles, "best in column" markers |
| Payment screen | `/awards/:id/pay` | Pre-payment context with price breakdown; either real Stripe Elements (key set) or "Simulate Payment" button (no key) |
| **Post-unlock** | `/awards/:id/unlocked` | Contractor identity revealed; bid summary; next-steps panel |
| **Contractor sign-up** | `/contractor/sign-up` | Contractor account creation (basic credentials) |
| **Contractor onboarding** | `/contractor/onboarding` | KYC document upload UI (4 file slots) — UI fully wired but files don't actually upload |
| **Admin queue** | `/admin/queue` | Awards in `pending_payment` state with "Simulate Payment" button — clicking triggers the unlock and navigates to the post-unlock view |
| Messaging | `/messaging/:threadId` | Pre-unlock messaging surface (redaction tokens visible) |

---

## File structure

```
cs-frontend/
├── README.md                            # this file
├── .env.example                         # all env vars (all optional)
├── package.json
├── next.config.js                       # security headers + typed routes
├── tsconfig.json
├── tailwind.config.ts                   # design tokens (brand colors + typography)
├── postcss.config.js
│
├── public/                              # 6 brand assets
│   ├── logo-monogram.svg                # primary mark
│   ├── logo-monogram-white.svg          # white variant for dark backgrounds
│   ├── logo-monogram.png                # Apple touch icon
│   ├── logo-full.jpg                    # full wordmark
│   ├── favicon.svg                      # simplified mark for tiny rendering
│   └── og-image.svg                     # 1200×630 social share
│
├── app/                                 # Next.js App Router
│   ├── layout.tsx                       # root layout (Poppins + Montserrat fonts)
│   ├── globals.css                      # design tokens as CSS variables
│   ├── page.tsx                         # ★ DEMO LANDING — role selector
│   │
│   ├── (auth)/                          # auth route group
│   │   ├── layout.tsx                   # left: form column; right: brand column
│   │   ├── sign-up/page.tsx             # client sign-up
│   │   └── sign-in/page.tsx
│   │
│   ├── (client)/                        # client route group
│   │   ├── layout.tsx                   # client app shell with topbar
│   │   ├── dashboard/page.tsx           # client dashboard (mock RFQs)
│   │   ├── rfqs/
│   │   │   ├── new/page.tsx             # ★ RFQ WIZARD (static)
│   │   │   ├── [id]/page.tsx            # RFQ detail
│   │   │   └── [id]/bids/page.tsx       # ★ BID COMPARISON UI
│   │   └── awards/
│   │       └── [id]/
│   │           ├── pay/page.tsx         # ★ PAYMENT SCREEN
│   │           └── unlocked/page.tsx    # ★ POST-UNLOCK SCREEN
│   │
│   ├── contractor/
│   │   ├── sign-up/page.tsx             # ★ CONTRACTOR SIGN-UP
│   │   └── onboarding/page.tsx          # ★ KYC UPLOAD UI
│   │
│   ├── admin/
│   │   └── queue/page.tsx               # ★ ADMIN PAYMENT SIMULATION
│   │
│   └── messaging/
│       └── [threadId]/page.tsx          # pre-unlock messaging
│
├── components/
│   ├── ui/                              # primitives (Button, Card, Dialog, etc)
│   ├── composite/                       # domain components (BidCard, ContractorCard, etc)
│   ├── layout/                          # AppShell, Topbar
│   └── payment/                         # PaymentModal, AwardConfirmationModal, PaymentSuccess
│
└── lib/
    ├── format.ts                        # currency, date, handle, countdown formatters
    ├── stripe.ts                        # Stripe.js singleton + brand-themed appearance
    ├── types.ts                         # shared TypeScript types
    └── utils.ts                         # cn() class-merge utility
```

`★` = the four core demo features the README leads with.

**Summary:** ~50 source files across `app/` + `components/` + `lib/`, plus 6 public brand assets.

---

## Running locally

```bash
# 1. Install dependencies
npm install

# 2. (optional) copy env template — only if you want to use real Stripe
cp .env.example .env.local

# 3. Start dev server
npm run dev

# 4. Open the demo
open http://localhost:3000
```

The demo landing at `/` lists every route. Walk the four cards in any order; flows are independent.

### Recommended walkthrough

**Client journey end-to-end (~3 min):**
1. `/dashboard` — see active RFQs (mock data)
2. Click any RFQ → `/rfqs/[id]/bids` — bid comparison
3. Click Award on a bid → confirmation modal → `/awards/award-001/pay` — payment screen
4. Click "Simulate Payment & Unlock" → `/awards/award-001/unlocked` — contractor identity revealed

**Contractor journey (~2 min):**
1. `/contractor/sign-up` — basic credentials
2. Submit → `/contractor/onboarding` — KYC document upload UI
3. Select mock files (they don't persist) → submit → "Pending review" state

**Admin payment simulation (~30 sec):**
1. `/admin/queue` — see two awards pending payment
2. Click "Simulate Payment" → confirm → routes to `/awards/[id]/unlocked`

---

## Deploying to Vercel

This app deploys to Vercel with **zero configuration**. No env vars required. No backend needed.

### Option A — One-click via the Vercel dashboard

1. Push this repo to GitHub (or GitLab / Bitbucket)
2. Go to [vercel.com/new](https://vercel.com/new)
3. Import the repository
4. Vercel auto-detects Next.js — accept the defaults
5. Click **Deploy**
6. Done — typically deploys in 60-90 seconds

No environment variables need to be set. The default `Build Command` (`next build`) and `Output Directory` (`.next`) work as-is.

### Option B — Via the Vercel CLI

```bash
# Install CLI globally (one-time)
npm install -g vercel

# From the project root
vercel

# First run prompts:
#   - Link to existing project or create new? → create
#   - Project name → contractor-select-demo
#   - Directory → ./
#   - Override defaults? → No

# Subsequent deploys
vercel --prod
```

### Option C — Add Stripe to the deployed demo (optional)

If you want the real Stripe Elements PaymentElement to render instead of the simulate button:

1. In the Vercel project dashboard, go to **Settings → Environment Variables**
2. Add: `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` = `pk_test_xxx` (your Stripe test key)
3. Redeploy

Note: with only the publishable key, Stripe Elements will render but `confirmPayment` will fail because the demo's `MOCK_CLIENT_SECRET` is not a real PaymentIntent. To exercise real Stripe end-to-end, you need a backend that issues real PaymentIntents (see "Going live" below).

### Custom domain

Vercel provides a `*.vercel.app` URL by default. To add a custom domain:

1. **Settings → Domains** in the Vercel dashboard
2. Add your domain (e.g., `demo.contractorselect.me`)
3. Update DNS as instructed (CNAME or A record)
4. Vercel auto-provisions Let's Encrypt SSL

---

## Cloud setup (when going live)

The demo is frontend-only by design. To go from demo → real product, here's the cheap-and-simple stack:

| Layer | Tool | Why | Approximate cost |
|---|---|---|---|
| Frontend | **Vercel** | Free Hobby tier; great DX; CDN included | $0 → $20/mo Pro |
| Backend API | **Railway** or **Render** | NestJS deploys via Dockerfile or Nixpacks; auto-scaling | $5-20/mo Hobby tier |
| Database | **Supabase** or **Neon** | Postgres with connection pooling; PITR backups; free tier sufficient for pilot | Free → $25/mo |
| File storage | **Supabase Storage** or **AWS S3** | Presigned URLs supported by both; Supabase simpler if also using their DB | Free → $5/mo low volume |
| Email | **Resend** | Per-template HTML; UAE deliverability acceptable | Free 100/day → $20/mo |
| Payment | **Stripe Connect (UAE)** | Required for marketplace topology with destination charges | Per-transaction fees only |

### Putting it together

```
                ┌────────────────────┐
                │  Vercel (frontend) │
                │  this repo         │
                └─────────┬──────────┘
                          │ HTTPS
                          ▼
┌─────────────┐  ┌────────────────────┐  ┌──────────────────┐
│ Stripe API  │◄─┤  Railway (backend) ├─►│ Supabase Storage │
│ + Webhooks  │  │  NestJS v0.7       │  │ (file uploads)   │
└─────────────┘  │                    │  └──────────────────┘
                 │  43 routes,        │
                 │  Prisma → Postgres │  ┌──────────────────┐
                 │                    ├─►│ Supabase / Neon  │
                 └────────────────────┘  │ (Postgres)       │
                                         └──────────────────┘
```

Wiring sequence (see `cs-INTEGRATION_PLAN.md` and `cs-SPRINT_1_PLAN.md` in the project docs):

1. **Database first** — provision Supabase or Neon, run Prisma migrations from the backend repo
2. **Backend second** — deploy NestJS to Railway, set DB URL + Stripe secret + storage credentials
3. **Frontend last** — set `NEXT_PUBLIC_API_URL` + `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` in Vercel, redeploy
4. **Webhook config** — register Stripe webhook pointing to `https://api.yourapp.com/v1/webhooks/stripe`, save signing secret to backend env

---

## How "demo mode" works

Three things make this demo runnable with zero backend:

### 1. All data is hardcoded

Every page that would normally fetch from a backend uses a `MOCK_` constant. For example, `app/(client)/dashboard/page.tsx` has `MOCK_RFQS`, `app/(client)/rfqs/[id]/bids/page.tsx` has `MOCK_BIDS`, etc. Replace these with real fetches when the backend is wired.

### 2. File uploads are visual-only

The contractor onboarding page (`/contractor/onboarding`) tracks selected files in React state but never sends them anywhere. The "selected file" UI shows the filename and a remove button, but the file never leaves the user's device. To wire real uploads, replace `onFileSelected` with a call to `POST /v1/files/upload-url` followed by a PUT to the returned S3/Supabase Storage URL.

### 3. Payment is conditionally simulated

The payment page (`/awards/[id]/pay`) checks `process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`. If unset, the CTA is "Simulate Payment & Unlock" which navigates directly to `/awards/[id]/unlocked`. If set, the real Stripe Elements PaymentModal renders. The same architecture supports the production cutover — flip the env flag, no code change.

The admin queue (`/admin/queue`) provides a parallel path: an admin-triggered "Simulate Payment" button that mimics the production Stripe webhook by navigating directly to the unlocked view. In production, this would call `POST /v1/admin/awards/:id/simulate-payment` (gated behind `PAYMENT_MODE=simulated` on the backend).

---

## Going live — what's missing

The demo is feature-complete for the four core surfaces. To take this from demo to production, you need:

| Need | Effort |
|---|---|
| Real auth — replace mocks with calls to `/v1/auth/*` | 1-2 days |
| Real data fetching — replace `MOCK_*` constants with API calls; add SWR or React Query | 2-3 days |
| Real file upload — wire upload UI to presigned-URL flow | 0.5-1 day |
| Real payment — set Stripe publishable key; backend creates real PaymentIntents | Built; just needs config |
| Real Postgres — provision via Supabase / Neon; run Prisma migrations | 0.5 day |
| Real backend deploy — deploy NestJS to Railway / Render | 0.5 day |

See `cs-INTEGRATION_PLAN.md` (15-day MVP rollout) and `cs-SPRINT_1_PLAN.md` (10-day lean Sprint 1) in the project documentation for the full execution plan.

---

## Brand specs (already integrated)

Reference values used throughout:

- **Primary blue:** `#0D3A7A`
- **Brand green:** `#0A8F4D`
- **Display font:** Poppins (400/500/600/700)
- **Body font:** Montserrat (400/500/600/700)
- **Tagline:** "Building trust. Delivering quality."
- **Promise:** "Connect. Compare. Choose with confidence."

Tokens are exported as Tailwind utilities (`bg-primary-900`, `text-success-700`, `font-display`, etc.) and as CSS custom properties via `globals.css`.

---

## Tech stack

- **Next.js 14.2** (App Router, typed routes)
- **React 18.3**
- **TypeScript 5.5**
- **Tailwind CSS 3.4**
- **Radix UI primitives** (Dialog, Checkbox, Label, Slot)
- **Stripe.js + react-stripe-js** (loaded only when key is set)
- **Lucide icons**

---

## Scripts

| Script | What it does |
|---|---|
| `npm run dev` | Start dev server with hot reload at localhost:3000 |
| `npm run build` | Production build (verifies the demo compiles cleanly) |
| `npm run start` | Run the production build locally |
| `npm run typecheck` | Run TypeScript without emitting (catches type errors) |
| `npm run lint` | Next.js ESLint |

---

## Recommended walkthrough (5 minutes)

1. Start at `/`
2. Click "View Client Dashboard"
3. Click any RFQ → view bids → award one → simulate payment → see unlock
4. Go back to `/`
5. Click "Start Contractor Signup" → fill form → upload mock KYC docs

That covers all four required features in ~5 minutes total.

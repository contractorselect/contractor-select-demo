import Link from 'next/link';
import Image from 'next/image';
import {
  Building2,
  HardHat,
  ShieldCheck,
  ArrowRight,
  Eye,
  type LucideIcon,
} from 'lucide-react';

/**
 * Demo landing page.
 *
 * Provides a guided entry into the four demo flows:
 *   1. Client journey — submit an RFQ, view bids, simulate payment, see unlock
 *   2. Contractor onboarding — sign up + KYC document upload UI
 *   3. Bid comparison surface — masked bid comparison view
 *   4. Admin queue — trigger the simulated payment unlock
 *
 * In production, this route would redirect to /dashboard or /sign-in
 * depending on auth state. For demo purposes, it's the entry point.
 */
export default function DemoLandingPage() {
  return (
    <div className="min-h-screen bg-neutral-50">
      {/* Top bar */}
      <header className="border-b border-neutral-100 bg-white">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link
            href="/"
            className="flex items-center gap-2.5"
            aria-label="ContractorSelect.me"
          >
            <Image
              src="/logo-monogram.svg"
              alt=""
              width={36}
              height={36}
              className="h-9 w-9"
              priority
            />
            <span className="text-h4 font-display font-semibold text-neutral-900">
              ContractorSelect<span className="text-success-700">.me</span>
            </span>
          </Link>
          <span className="text-caption font-sans uppercase tracking-wide text-neutral-400 px-2.5 py-1 rounded-md bg-neutral-100">
            Demo Mode
          </span>
        </div>
      </header>

      {/* Hero */}
      <section className="max-w-4xl mx-auto px-6 pt-16 pb-12 text-center">
        <h1 className="text-display-lg font-display font-semibold text-neutral-900 leading-tight">
          ContractorSelect.me
          <br />
          <span className="text-primary-900">Live Demo</span>
        </h1>
        <p className="mt-6 text-body-lg font-sans text-neutral-700 max-w-2xl mx-auto">
          Walk through the high-trust contractor marketplace. Submit an RFQ,
          compare masked bids, simulate payment, and watch the contractor&apos;s
          identity reveal — exactly as the production flow will work.
        </p>
        <p className="mt-3 text-body-sm font-sans text-neutral-400">
          Backend is mocked. No data persists between sessions.
        </p>
      </section>

      {/* Demo paths */}
      <section className="max-w-6xl mx-auto px-6 pb-16">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <DemoCard
            icon={Building2}
            iconColorClass="text-primary-900 bg-primary-50"
            title="Client Journey"
            description="Submit an RFQ, view masked bid comparison, award a contractor, simulate payment, see the post-payment unlock."
            primaryCta={{ label: 'View Client Dashboard', href: '/dashboard' }}
            secondaryLinks={[
              { label: 'New RFQ wizard', href: '/rfqs/new' },
              {
                label: 'Bid comparison example',
                href: '/rfqs/rfq-2026-00481/bids',
              },
              { label: 'Payment screen', href: '/awards/award-001/pay' },
            ]}
          />

          <DemoCard
            icon={HardHat}
            iconColorClass="text-success-700 bg-success-50"
            title="Contractor Signup"
            description="Walk through contractor account creation and KYC document upload UI. The upload form is wired but documents do not persist (demo mode)."
            primaryCta={{
              label: 'Start Contractor Signup',
              href: '/contractor/sign-up',
            }}
            secondaryLinks={[
              {
                label: 'KYC onboarding form',
                href: '/contractor/onboarding',
              },
            ]}
          />

          <DemoCard
            icon={Eye}
            iconColorClass="text-neutral-700 bg-neutral-100"
            title="Bid Comparison UI"
            description="The masked side-by-side bid comparison surface. Three vendors with pseudonymous handles. Award flow disabled in demo mode."
            primaryCta={{
              label: 'View Bid Comparison',
              href: '/rfqs/rfq-2026-00481/bids',
            }}
          />

          <DemoCard
            icon={ShieldCheck}
            iconColorClass="text-warning-700 bg-warning-50"
            title="Payment Unlock (Admin Sim)"
            description="Admin surface that simulates payment confirmation, triggering unlock_event creation and contractor identity reveal."
            primaryCta={{
              label: 'Open Admin Queue',
              href: '/admin/queue',
            }}
            secondaryLinks={[
              {
                label: 'Post-unlock view',
                href: '/awards/award-001/unlocked',
              },
            ]}
          />
        </div>

        <div className="mt-12 rounded-md border border-neutral-100 bg-white px-6 py-5">
          <h3 className="text-h5 font-display font-semibold text-neutral-900">
            What&apos;s real vs. simulated
          </h3>
          <dl className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-3">
            <div>
              <dt className="text-caption font-sans uppercase tracking-wide text-neutral-400">
                Real
              </dt>
              <dd className="text-body-sm font-sans text-neutral-700 mt-1">
                Brand integration, design system, masked/unmasked component
                logic, all UI surfaces, Stripe Elements wiring (when key
                provided).
              </dd>
            </div>
            <div>
              <dt className="text-caption font-sans uppercase tracking-wide text-neutral-400">
                Simulated
              </dt>
              <dd className="text-body-sm font-sans text-neutral-700 mt-1">
                Auth state, RFQ data, bid data, file uploads, payment
                processing, unlock_event creation. All in-memory; no DB,
                no S3, no real Stripe charges.
              </dd>
            </div>
          </dl>
        </div>
      </section>
    </div>
  );
}

function DemoCard({
  icon: Icon,
  iconColorClass,
  title,
  description,
  primaryCta,
  secondaryLinks,
}: {
  icon: LucideIcon;
  iconColorClass: string;
  title: string;
  description: string;
  primaryCta: { label: string; href: string };
  secondaryLinks?: { label: string; href: string }[];
}) {
  return (
    <div className="rounded-md border border-neutral-100 bg-white p-6 hover:border-neutral-200 transition-colors">
      <div
        className={`inline-flex h-11 w-11 items-center justify-center rounded-md ${iconColorClass}`}
      >
        <Icon className="h-5 w-5" strokeWidth={2} />
      </div>
      <h2 className="mt-4 text-h3 font-display font-semibold text-neutral-900">
        {title}
      </h2>
      <p className="mt-2 text-body-sm font-sans text-neutral-700 leading-relaxed">
        {description}
      </p>
      <Link
        href={primaryCta.href as never}
        className="mt-4 inline-flex items-center gap-1.5 text-body-sm font-sans font-medium text-primary-900 hover:text-primary-800 transition-colors"
      >
        {primaryCta.label}
        <ArrowRight className="h-4 w-4" />
      </Link>
      {secondaryLinks && secondaryLinks.length > 0 && (
        <ul className="mt-4 pt-4 border-t border-neutral-100 space-y-1.5">
          {secondaryLinks.map((link) => (
            <li key={link.href}>
              <Link
                href={link.href as never}
                className="text-caption font-sans text-neutral-400 hover:text-neutral-700 transition-colors"
              >
                · {link.label}
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

'use client';

import * as React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { ShieldCheck, ChevronLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { FormField } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';

/**
 * Contractor sign-up — credentials only. KYC is the next step.
 *
 * In production: POST /v1/auth/sign-up with role='contractor'
 * → records 2 legal acceptances (marketplace_terms, privacy_notice)
 * → returns userId
 *
 * Demo: in-memory state; submitting redirects to /contractor/onboarding.
 */
export default function ContractorSignUpPage() {
  const router = useRouter();
  const [loading, setLoading] = React.useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    // Simulated network delay so the loading state is visible
    setTimeout(() => {
      setLoading(false);
      router.push('/contractor/onboarding');
    }, 600);
  };

  return (
    <div className="min-h-screen bg-neutral-50 grid grid-cols-1 lg:grid-cols-2">
      {/* Form column */}
      <div className="flex flex-col">
        <div className="px-6 py-6 md:px-12 flex items-center justify-between">
          <Link
            href="/"
            className="inline-flex items-center gap-2.5 group"
            aria-label="ContractorSelect.me home"
          >
            <Image
              src="/logo-monogram.svg"
              alt=""
              width={36}
              height={36}
              className="h-9 w-9"
              priority
            />
            <span className="text-h4 font-display font-semibold text-neutral-900 group-hover:text-primary-900 transition-colors">
              ContractorSelect<span className="text-success-700">.me</span>
            </span>
          </Link>
          <Link
            href="/"
            className="inline-flex items-center gap-1 text-body-sm font-sans text-neutral-600 hover:text-neutral-900 transition-colors"
          >
            <ChevronLeft className="h-4 w-4" />
            Back to demo
          </Link>
        </div>

        <div className="flex-1 flex items-center justify-center px-6 pb-12">
          <div className="w-full max-w-md">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <h1 className="text-h1 font-display font-semibold text-neutral-900">
                  Join as a contractor
                </h1>
                <p className="mt-2 text-body-sm font-sans text-neutral-600">
                  Step 1 of 2 — basic account. KYC documents in the next step.
                </p>
                <div className="mt-4 flex items-start gap-2.5 rounded-md bg-success-50/60 border border-success-700/20 px-3.5 py-2.5">
                  <ShieldCheck
                    className="h-4 w-4 text-success-700 mt-0.5 flex-shrink-0"
                    strokeWidth={2.25}
                    aria-hidden
                  />
                  <p className="text-caption font-sans text-neutral-700 leading-snug">
                    Your business identity stays masked from clients during
                    bidding. They only see your verified handle until they
                    award and pay.
                  </p>
                </div>
              </div>

              {/* Account fields */}
              <div className="space-y-4">
                <FormField label="Authorized signatory — first name" htmlFor="firstName" required>
                  <Input
                    id="firstName"
                    name="firstName"
                    autoComplete="given-name"
                    placeholder="Ahmad"
                    required
                  />
                </FormField>

                <FormField label="Last name" htmlFor="lastName" required>
                  <Input
                    id="lastName"
                    name="lastName"
                    autoComplete="family-name"
                    placeholder="Al-Hashemi"
                    required
                  />
                </FormField>

                <FormField label="Work email" htmlFor="email" required>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    placeholder="ahmad@yourcompany.ae"
                    required
                  />
                  <p className="mt-1 text-caption font-sans text-neutral-400">
                    Used for invitations and notifications. We verify ownership.
                  </p>
                </FormField>

                <FormField label="Mobile" htmlFor="phone" required>
                  <Input
                    id="phone"
                    name="phone"
                    type="tel"
                    autoComplete="tel"
                    placeholder="+971 50 123 4567"
                    required
                  />
                </FormField>

                <FormField label="Password" htmlFor="password" required>
                  <Input
                    id="password"
                    name="password"
                    type="password"
                    autoComplete="new-password"
                    placeholder="Min 12 characters"
                    minLength={12}
                    required
                  />
                </FormField>
              </div>

              {/* Terms */}
              <div className="space-y-3">
                <label className="flex items-start gap-3 cursor-pointer group">
                  <Checkbox className="mt-0.5" required />
                  <span className="text-body-sm font-sans text-neutral-700 group-hover:text-neutral-900 transition-colors">
                    I agree to the{' '}
                    <a
                      href="#"
                      className="text-primary-900 underline hover:no-underline"
                    >
                      Marketplace Terms
                    </a>
                    {' '}and have read the{' '}
                    <a
                      href="#"
                      className="text-primary-900 underline hover:no-underline"
                    >
                      Privacy Notice
                    </a>
                    .
                  </span>
                </label>
              </div>

              <Button
                type="submit"
                variant="primary"
                size="lg"
                loading={loading}
                className="w-full"
              >
                {loading ? 'Creating account…' : 'Continue to KYC documents'}
              </Button>

              <p className="text-center text-body-sm font-sans text-neutral-600">
                Already have an account?{' '}
                <Link
                  href="/sign-in"
                  className="text-primary-900 font-medium hover:underline"
                >
                  Sign in
                </Link>
              </p>
            </form>
          </div>
        </div>
      </div>

      {/* Brand column */}
      <aside className="hidden lg:flex bg-primary-900 relative overflow-hidden">
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage:
              'radial-gradient(circle at 1px 1px, white 1px, transparent 0)',
            backgroundSize: '24px 24px',
          }}
          aria-hidden
        />
        <div className="relative z-10 flex flex-col justify-between p-12 text-white">
          <div className="max-w-md">
            <Image
              src="/logo-monogram-white.svg"
              alt=""
              width={56}
              height={56}
              className="h-14 w-14 mb-8"
            />
            <h2 className="text-display-lg font-display font-semibold leading-tight">
              Bid less.
              <br />
              Win more.
            </h2>
            <p className="mt-6 text-body-lg font-sans text-primary-100">
              Stop spending unpaid hours preparing quotes for clients who never
              respond. On ContractorSelect.me, every RFQ is verified and every
              shortlist is curated.
            </p>
          </div>

          <div className="space-y-4 max-w-md">
            <BrandPillar
              title="Verified clients only"
              description="Every RFQ is qualified by our admin team before being shown to contractors."
            />
            <BrandPillar
              title="Curated shortlists"
              description="You're invited to bid only when your profile matches. No spam, no firehose."
            />
            <BrandPillar
              title="Identity protected"
              description="Your business name stays masked until the client awards you and pays."
            />
          </div>
        </div>
      </aside>
    </div>
  );
}

function BrandPillar({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <div className="border-l-2 border-success-700 pl-4">
      <p className="text-body font-sans font-semibold text-white">{title}</p>
      <p className="text-body-sm font-sans text-primary-100 mt-1">{description}</p>
    </div>
  );
}

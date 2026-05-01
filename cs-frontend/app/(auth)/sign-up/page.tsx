'use client';

import * as React from 'react';
import Link from 'next/link';
import { ShieldCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { FormField } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';

export default function SignUpPage() {
  const [accountType, setAccountType] = React.useState<'client' | 'contractor'>('client');
  const [loading, setLoading] = React.useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => setLoading(false), 800);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-h1 font-display font-semibold text-neutral-900">
          Create your account
        </h1>
        <p className="mt-2 text-body-sm font-sans text-neutral-600">
          Get started — verification takes 1–2 business days.
        </p>
        {/* Trust framing — surfaces the brand promise at signup moment */}
        <div className="mt-4 flex items-start gap-2.5 rounded-md bg-primary-50/60 border border-primary-100 px-3.5 py-2.5">
          <ShieldCheck
            className="h-4 w-4 text-primary-900 mt-0.5 flex-shrink-0"
            strokeWidth={2.25}
            aria-hidden
          />
          <p className="text-caption font-sans text-neutral-700 leading-snug">
            All accounts go through KYC verification. Your identity is protected during bidding —
            <span className="font-medium text-neutral-900"> contractor details are revealed only after award and payment.</span>
          </p>
        </div>
      </div>

      {/* Account type selector */}
      <div>
        <p className="text-overline uppercase font-sans text-neutral-400 mb-3">
          I am a
        </p>
        <div className="grid grid-cols-2 gap-3">
          <AccountTypeOption
            label="Client"
            description="I need contractors for projects"
            selected={accountType === 'client'}
            onClick={() => setAccountType('client')}
          />
          <AccountTypeOption
            label="Contractor"
            description="I provide services and want to bid"
            selected={accountType === 'contractor'}
            onClick={() => setAccountType('contractor')}
          />
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <FormField label="First name" htmlFor="first" required>
            <Input id="first" required />
          </FormField>
          <FormField label="Last name" htmlFor="last" required>
            <Input id="last" required />
          </FormField>
        </div>

        <FormField label="Work email" htmlFor="email" required>
          <Input
            id="email"
            type="email"
            placeholder="you@company.ae"
            autoComplete="email"
            required
          />
        </FormField>

        <FormField label="Organization name" htmlFor="org" required>
          <Input
            id="org"
            placeholder="Your company name"
            required
          />
        </FormField>

        <FormField label="Mobile number" htmlFor="mobile" required>
          <Input
            id="mobile"
            type="tel"
            placeholder="+971 50 123 4567"
            autoComplete="tel"
            required
          />
        </FormField>

        <FormField
          label="Password"
          htmlFor="password"
          required
          helperText="At least 12 characters with a mix of letters, numbers, and symbols."
        >
          <Input
            id="password"
            type="password"
            autoComplete="new-password"
            minLength={12}
            required
          />
        </FormField>

        <label className="flex items-start gap-3 cursor-pointer pt-2">
          <Checkbox required className="mt-0.5" />
          <span className="text-body-sm font-sans text-neutral-700 leading-relaxed">
            I agree to the{' '}
            <Link
              href="/legal/terms"
              target="_blank"
              className="text-primary-900 hover:underline"
            >
              Marketplace Terms
            </Link>{' '}
            and{' '}
            <Link
              href="/legal/privacy"
              target="_blank"
              className="text-primary-900 hover:underline"
            >
              Privacy Notice
            </Link>
            .
          </span>
        </label>

        <Button
          type="submit"
          variant="primary"
          size="lg"
          loading={loading}
          className="w-full"
        >
          Create account
        </Button>
      </form>

      <p className="text-body-sm font-sans text-neutral-600 text-center">
        Already have an account?{' '}
        <Link
          href="/sign-in"
          className="font-medium text-primary-900 hover:text-primary-700"
        >
          Sign in
        </Link>
      </p>
    </div>
  );
}

function AccountTypeOption({
  label,
  description,
  selected,
  onClick,
}: {
  label: string;
  description: string;
  selected: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={
        'rounded-md border-2 px-4 py-3 text-left transition-colors ' +
        (selected
          ? 'border-primary-500 bg-primary-50/40'
          : 'border-neutral-100 hover:border-neutral-200 bg-white')
      }
    >
      <p className="text-body-sm font-sans font-semibold text-neutral-900">{label}</p>
      <p className="text-caption font-sans text-neutral-400 mt-0.5">{description}</p>
    </button>
  );
}

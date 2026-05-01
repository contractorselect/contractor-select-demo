'use client';

import * as React from 'react';
import Link from 'next/link';
import { Mail, KeyRound } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { FormField } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';

export default function SignInPage() {
  const [loading, setLoading] = React.useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    // POST /v1/auth/sign-in in production
    setTimeout(() => setLoading(false), 800);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-h1 font-display font-semibold text-neutral-900">
          Sign in
        </h1>
        <p className="mt-2 text-body-sm font-sans text-neutral-600">
          Welcome back. Sign in to manage your RFQs and projects.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <FormField label="Email" htmlFor="email" required>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-400" />
            <Input
              id="email"
              type="email"
              placeholder="you@company.ae"
              autoComplete="email"
              required
              className="pl-9"
            />
          </div>
        </FormField>

        <FormField label="Password" htmlFor="password" required>
          <div className="relative">
            <KeyRound className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-400" />
            <Input
              id="password"
              type="password"
              autoComplete="current-password"
              required
              className="pl-9"
            />
          </div>
        </FormField>

        <div className="flex items-center justify-between">
          <label className="inline-flex items-center gap-2 cursor-pointer">
            <Checkbox />
            <span className="text-body-sm font-sans text-neutral-700">
              Remember me
            </span>
          </label>
          <Link
            href="/forgot-password"
            className="text-body-sm font-sans font-medium text-primary-900 hover:text-primary-700"
          >
            Forgot password?
          </Link>
        </div>

        <Button
          type="submit"
          variant="primary"
          size="lg"
          loading={loading}
          className="w-full"
        >
          Sign in
        </Button>
      </form>

      <p className="text-body-sm font-sans text-neutral-600 text-center">
        New to ContractorSelect?{' '}
        <Link
          href="/sign-up"
          className="font-medium text-primary-900 hover:text-primary-700"
        >
          Create an account
        </Link>
      </p>
    </div>
  );
}

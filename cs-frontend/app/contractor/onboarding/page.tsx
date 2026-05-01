'use client';

import * as React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import {
  Upload,
  FileCheck2,
  ChevronLeft,
  CheckCircle2,
  X,
  Building,
  ShieldCheck,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { FormField } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils';

/**
 * Contractor onboarding — KYC document upload UI.
 *
 * In production:
 *   1. Each upload calls POST /v1/files/upload-url to get a presigned S3 URL
 *   2. Client PUTs the file directly to S3
 *   3. fileId is attached to the contractor profile via PATCH
 *   4. POST /v1/contractors/onboarding finalizes; admin reviews
 *
 * Demo: the upload UI is wired but documents do NOT persist.
 * Selected files are tracked in component state only. Submit
 * navigates to a "pending review" placeholder.
 *
 * Per Sprint 1 Plan §6.1 — single page, 3 sections stacked.
 */

interface UploadSlotProps {
  label: string;
  hint: string;
  required?: boolean;
  acceptedTypes: string;
  fileName: string | null;
  onFileSelected: (file: File | null) => void;
}

function UploadSlot({
  label,
  hint,
  required,
  acceptedTypes,
  fileName,
  onFileSelected,
}: UploadSlotProps) {
  const inputRef = React.useRef<HTMLInputElement>(null);
  const id = React.useId();

  return (
    <div>
      <label
        htmlFor={id}
        className="block text-body-sm font-sans font-medium text-neutral-900"
      >
        {label}{' '}
        {required && <span className="text-danger-500">*</span>}
      </label>
      <p className="mt-0.5 text-caption font-sans text-neutral-400">{hint}</p>

      {!fileName ? (
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          className={cn(
            'mt-2 w-full rounded-md border-2 border-dashed border-neutral-200',
            'bg-neutral-50/50 px-4 py-6',
            'flex flex-col items-center justify-center gap-1.5',
            'hover:border-primary-500 hover:bg-primary-50/30 transition-colors',
            'focus:outline-none focus:ring-2 focus:ring-primary-500/30',
          )}
        >
          <Upload className="h-5 w-5 text-neutral-400" strokeWidth={2} />
          <span className="text-body-sm font-sans text-neutral-700">
            Click to upload
          </span>
          <span className="text-caption font-sans text-neutral-400">
            {acceptedTypes} · max 10MB
          </span>
        </button>
      ) : (
        <div className="mt-2 rounded-md border border-success-700/30 bg-success-50/40 px-4 py-3 flex items-start gap-3">
          <FileCheck2
            className="h-5 w-5 text-success-700 flex-shrink-0 mt-0.5"
            strokeWidth={2}
          />
          <div className="flex-1 min-w-0">
            <p className="text-body-sm font-sans font-medium text-neutral-900 truncate">
              {fileName}
            </p>
            <p className="text-caption font-sans text-neutral-400 mt-0.5">
              Demo mode — file is not actually uploaded.
            </p>
          </div>
          <button
            type="button"
            onClick={() => onFileSelected(null)}
            className="flex-shrink-0 text-neutral-400 hover:text-neutral-700 transition-colors"
            aria-label="Remove file"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      )}

      <input
        ref={inputRef}
        id={id}
        type="file"
        accept={acceptedTypes}
        className="hidden"
        onChange={(e) => onFileSelected(e.target.files?.[0] ?? null)}
      />
    </div>
  );
}

export default function ContractorOnboardingPage() {
  const router = useRouter();
  const [submitting, setSubmitting] = React.useState(false);
  const [submitted, setSubmitted] = React.useState(false);

  // KYC document state — demo mode, not actually uploaded
  const [tradeLicenseFile, setTradeLicenseFile] = React.useState<string | null>(null);
  const [vatCertFile, setVatCertFile] = React.useState<string | null>(null);
  const [signatoryIdFile, setSignatoryIdFile] = React.useState<string | null>(null);
  const [insuranceFile, setInsuranceFile] = React.useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setTimeout(() => {
      setSubmitting(false);
      setSubmitted(true);
    }, 800);
  };

  if (submitted) {
    return <SubmittedView />;
  }

  return (
    <div className="min-h-screen bg-neutral-50">
      {/* Top bar */}
      <header className="border-b border-neutral-100 bg-white">
        <div className="max-w-3xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link
            href="/"
            className="flex items-center gap-2.5"
            aria-label="ContractorSelect.me"
          >
            <Image
              src="/logo-monogram.svg"
              alt=""
              width={32}
              height={32}
              className="h-8 w-8"
            />
            <span className="text-h5 font-display font-semibold text-neutral-900">
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
      </header>

      <main className="max-w-3xl mx-auto px-6 py-10">
        <div className="mb-8">
          <p className="text-overline uppercase font-sans tracking-wide text-neutral-400">
            Step 2 of 2
          </p>
          <h1 className="mt-1 text-h1 font-display font-semibold text-neutral-900">
            Verify your business
          </h1>
          <p className="mt-2 text-body font-sans text-neutral-700">
            We KYC every contractor before they can bid. Average review time:
            1–2 business days.
          </p>

          <div className="mt-5 flex items-start gap-2.5 rounded-md bg-primary-50/60 border border-primary-100 px-4 py-3">
            <ShieldCheck
              className="h-4 w-4 text-primary-900 mt-0.5 flex-shrink-0"
              strokeWidth={2.25}
            />
            <p className="text-body-sm font-sans text-neutral-700 leading-snug">
              Documents are encrypted at rest and only visible to our compliance
              team. <span className="font-medium">In demo mode, files are not actually uploaded</span> —
              the selection UI is functional but documents do not leave your device.
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Section 1 — Business details */}
          <section className="rounded-md border border-neutral-100 bg-white p-6">
            <div className="flex items-center gap-2.5 mb-1">
              <Building className="h-4 w-4 text-neutral-700" strokeWidth={2} />
              <h2 className="text-h4 font-display font-semibold text-neutral-900">
                Business details
              </h2>
            </div>
            <p className="text-body-sm font-sans text-neutral-400 mb-5">
              Used for verification and category matching. Not visible to clients
              pre-payment.
            </p>

            <div className="space-y-4">
              <FormField
                label="Trade license number"
                htmlFor="tradeLicense"
                required
              >
                <Input
                  id="tradeLicense"
                  name="tradeLicense"
                  placeholder="DED-1234567"
                  required
                />
              </FormField>

              <FormField label="Legal company name" htmlFor="legalName" required>
                <Input
                  id="legalName"
                  name="legalName"
                  placeholder="Al-Hashemi Construction LLC"
                  required
                />
              </FormField>

              <FormField label="Trade name (if different)" htmlFor="tradeName">
                <Input
                  id="tradeName"
                  name="tradeName"
                  placeholder="Optional"
                />
              </FormField>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <FormField label="Office emirate" htmlFor="emirate" required>
                  <select
                    id="emirate"
                    name="emirate"
                    required
                    className={cn(
                      'h-11 w-full rounded-md border border-neutral-200 bg-white px-3',
                      'text-body-sm font-sans text-neutral-900',
                      'focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20',
                    )}
                  >
                    <option value="">Select…</option>
                    <option>Abu Dhabi</option>
                    <option>Dubai</option>
                    <option>Sharjah</option>
                    <option>Ajman</option>
                    <option>Umm Al Quwain</option>
                    <option>Ras Al Khaimah</option>
                    <option>Fujairah</option>
                  </select>
                </FormField>

                <FormField
                  label="Years operating"
                  htmlFor="yearsOperating"
                  required
                >
                  <Input
                    id="yearsOperating"
                    name="yearsOperating"
                    type="number"
                    min={0}
                    max={100}
                    placeholder="8"
                    required
                  />
                </FormField>
              </div>

              <FormField label="Primary category" htmlFor="primaryCategory" required>
                <select
                  id="primaryCategory"
                  name="primaryCategory"
                  required
                  className={cn(
                    'h-11 w-full rounded-md border border-neutral-200 bg-white px-3',
                    'text-body-sm font-sans text-neutral-900',
                    'focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20',
                  )}
                >
                  <option value="">Select…</option>
                  <option>Construction & Renovation</option>
                  <option>Electrical</option>
                  <option>Plumbing</option>
                  <option>HVAC</option>
                  <option>Carpentry & Joinery</option>
                  <option>Painting & Finishing</option>
                  <option>MEP</option>
                  <option>Specialized fit-out</option>
                </select>
              </FormField>

              <FormField label="Brief description" htmlFor="description">
                <Textarea
                  id="description"
                  name="description"
                  rows={3}
                  placeholder="What kinds of projects do you specialize in?"
                  maxLength={300}
                />
                <p className="mt-1 text-caption font-sans text-neutral-400">
                  Visible to admin during matching. 300 character max.
                </p>
              </FormField>
            </div>
          </section>

          {/* Section 2 — KYC documents */}
          <section className="rounded-md border border-neutral-100 bg-white p-6">
            <div className="flex items-center gap-2.5 mb-1">
              <FileCheck2 className="h-4 w-4 text-neutral-700" strokeWidth={2} />
              <h2 className="text-h4 font-display font-semibold text-neutral-900">
                KYC documents
              </h2>
            </div>
            <p className="text-body-sm font-sans text-neutral-400 mb-5">
              PDF or image. Each file max 10MB. All required except where noted.
            </p>

            <div className="space-y-5">
              <UploadSlot
                label="Trade license"
                hint="Current, valid trade license issued by your emirate's economic department."
                required
                acceptedTypes=".pdf,.jpg,.jpeg,.png"
                fileName={tradeLicenseFile}
                onFileSelected={(f) => setTradeLicenseFile(f?.name ?? null)}
              />

              <UploadSlot
                label="VAT registration certificate"
                hint="Required if turnover exceeds AED 375,000. Skip if not VAT-registered."
                acceptedTypes=".pdf,.jpg,.jpeg,.png"
                fileName={vatCertFile}
                onFileSelected={(f) => setVatCertFile(f?.name ?? null)}
              />

              <UploadSlot
                label="Authorized signatory ID"
                hint="Emirates ID or passport of the signing officer."
                required
                acceptedTypes=".pdf,.jpg,.jpeg,.png"
                fileName={signatoryIdFile}
                onFileSelected={(f) => setSignatoryIdFile(f?.name ?? null)}
              />

              <UploadSlot
                label="Insurance certificate"
                hint="General liability or contractor's all-risk policy. Must be current."
                required
                acceptedTypes=".pdf,.jpg,.jpeg,.png"
                fileName={insuranceFile}
                onFileSelected={(f) => setInsuranceFile(f?.name ?? null)}
              />
            </div>
          </section>

          {/* Section 3 — Confirmation */}
          <section className="rounded-md border border-neutral-100 bg-white p-6">
            <h2 className="text-h4 font-display font-semibold text-neutral-900">
              Confirm and submit
            </h2>

            <div className="mt-4 space-y-3">
              <label className="flex items-start gap-3 cursor-pointer group">
                <Checkbox className="mt-0.5" required />
                <span className="text-body-sm font-sans text-neutral-700 group-hover:text-neutral-900 transition-colors">
                  I confirm all documents are current and valid, and the
                  information provided is accurate.
                </span>
              </label>
              <label className="flex items-start gap-3 cursor-pointer group">
                <Checkbox className="mt-0.5" required />
                <span className="text-body-sm font-sans text-neutral-700 group-hover:text-neutral-900 transition-colors">
                  I authorize ContractorSelect.me to verify these documents
                  with relevant authorities.
                </span>
              </label>
              <label className="flex items-start gap-3 cursor-pointer group">
                <Checkbox className="mt-0.5" required />
                <span className="text-body-sm font-sans text-neutral-700 group-hover:text-neutral-900 transition-colors">
                  I agree to the{' '}
                  <a href="#" className="text-primary-900 underline hover:no-underline">
                    Contractor Operating Agreement
                  </a>
                  .
                </span>
              </label>
            </div>
          </section>

          <div className="flex justify-end">
            <Button
              type="submit"
              variant="primary"
              size="lg"
              loading={submitting}
              className="min-w-[220px]"
            >
              {submitting ? 'Submitting…' : 'Submit for review'}
            </Button>
          </div>
        </form>
      </main>
    </div>
  );
}

function SubmittedView() {
  return (
    <div className="min-h-screen bg-neutral-50 flex items-center justify-center px-6">
      <div className="max-w-md text-center">
        <div className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-success-50">
          <CheckCircle2 className="h-8 w-8 text-success-700" strokeWidth={2} />
        </div>
        <h1 className="mt-6 text-h2 font-display font-semibold text-neutral-900">
          Submitted for review
        </h1>
        <p className="mt-3 text-body font-sans text-neutral-700 leading-relaxed">
          Our compliance team will review your documents within 1–2 business
          days. We&apos;ll email you when your account is approved and you&apos;re ready
          to receive bid invitations.
        </p>
        <p className="mt-3 text-body-sm font-sans text-neutral-400">
          (Demo: in production this state would be persisted to the backend.
          The admin team would then approve via the queue.)
        </p>
        <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link href="/">
            <Button variant="secondary" size="md">
              Back to demo home
            </Button>
          </Link>
          <Link href="/admin/queue">
            <Button variant="primary" size="md">
              View admin queue
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}

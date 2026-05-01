'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import {
  ChevronLeft,
  ChevronRight,
  Save,
  AlertCircle,
  Upload,
  X,
  CheckCircle2,
} from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { FormField } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { ProgressIndicator } from '@/components/composite/progress-indicator';
import { formatCurrency } from '@/lib/format';
import { cn } from '@/lib/utils';

/**
 * RFQ submission wizard — 6 steps per Design System §8.1.
 *
 * 1. Project basics    — title, category, location, brief description
 * 2. Detailed scope    — line items or freeform; warning about identity-leak
 * 3. Budget & timeline — range, currency, dates
 * 4. Attachments       — drawings, BoQs, reference photos
 * 5. Site visit        — toggle (currently shows soft warning)
 * 6. Review & submit   — full RFQ rendered, three legal acceptances
 *
 * Save Draft visible on every step. Each step has its own URL
 * (deep-linkable, supports browser back).
 */

type StepId =
  | 'basics'
  | 'scope'
  | 'budget'
  | 'attachments'
  | 'site_visit'
  | 'review';

const STEPS: Array<{ id: StepId; label: string }> = [
  { id: 'basics', label: 'Basics' },
  { id: 'scope', label: 'Scope' },
  { id: 'budget', label: 'Budget' },
  { id: 'attachments', label: 'Attachments' },
  { id: 'site_visit', label: 'Site visit' },
  { id: 'review', label: 'Review' },
];

interface RfqDraft {
  title: string;
  category: string;
  emirate: string;
  city: string;
  briefDescription: string;
  detailedScope: string;
  budgetMin: number | '';
  budgetMax: number | '';
  currency: string;
  proposedStart: string;
  targetCompletion: string;
  paymentPreference: string;
  attachments: Array<{ name: string; size: number }>;
  siteVisit: 'not_needed' | 'pre_bid' | 'post_award';
  acceptedTerms: boolean;
  acceptedPrivacy: boolean;
  acceptedRepresentations: boolean;
}

const INITIAL_DRAFT: RfqDraft = {
  title: '',
  category: '',
  emirate: '',
  city: '',
  briefDescription: '',
  detailedScope: '',
  budgetMin: '',
  budgetMax: '',
  currency: 'AED',
  proposedStart: '',
  targetCompletion: '',
  paymentPreference: '',
  attachments: [],
  siteVisit: 'post_award',
  acceptedTerms: false,
  acceptedPrivacy: false,
  acceptedRepresentations: false,
};

export default function NewRfqPage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = React.useState<StepId>('basics');
  const [draft, setDraft] = React.useState<RfqDraft>(INITIAL_DRAFT);
  const [completed, setCompleted] = React.useState<StepId[]>([]);

  const update = <K extends keyof RfqDraft>(key: K, value: RfqDraft[K]) => {
    setDraft((d) => ({ ...d, [key]: value }));
  };

  const stepIndex = STEPS.findIndex((s) => s.id === currentStep);

  const goToStep = (id: StepId) => {
    setCurrentStep(id);
  };

  const advance = () => {
    if (!completed.includes(currentStep)) {
      setCompleted((c) => [...c, currentStep]);
    }
    if (stepIndex < STEPS.length - 1) {
      setCurrentStep(STEPS[stepIndex + 1].id);
    }
  };

  const retreat = () => {
    if (stepIndex > 0) {
      setCurrentStep(STEPS[stepIndex - 1].id);
    }
  };

  const handleSubmit = async () => {
    // POST to /v1/rfqs in production
    console.log('Submitting RFQ', draft);
    router.push('/dashboard');
  };

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      {/* Breadcrumb */}
      <Link
        href="/dashboard"
        className="inline-flex items-center gap-1 text-body-sm font-sans text-neutral-600 hover:text-neutral-900"
      >
        <ChevronLeft className="h-4 w-4" />
        Cancel and return to dashboard
      </Link>

      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-h1 font-display font-semibold text-neutral-900">
            Submit a new RFQ
          </h1>
          <p className="mt-1 text-body-sm font-sans text-neutral-400">
            Tell us about your project. We'll qualify and match you with verified contractors.
          </p>
        </div>
        <Button variant="tertiary" size="md" className="gap-2 flex-shrink-0">
          <Save className="h-4 w-4" />
          Save draft
        </Button>
      </div>

      {/* Progress */}
      <ProgressIndicator
        steps={STEPS}
        currentStepId={currentStep}
        completedStepIds={completed}
        onStepClick={(id) => {
          if (completed.includes(id as StepId) || id === currentStep) {
            goToStep(id as StepId);
          }
        }}
      />

      <Separator />

      {/* Step body */}
      <Card>
        <CardContent className="pt-6 space-y-6">
          {currentStep === 'basics' && (
            <BasicsStep draft={draft} update={update} />
          )}
          {currentStep === 'scope' && (
            <ScopeStep draft={draft} update={update} />
          )}
          {currentStep === 'budget' && (
            <BudgetStep draft={draft} update={update} />
          )}
          {currentStep === 'attachments' && (
            <AttachmentsStep draft={draft} update={update} />
          )}
          {currentStep === 'site_visit' && (
            <SiteVisitStep draft={draft} update={update} />
          )}
          {currentStep === 'review' && (
            <ReviewStep
              draft={draft}
              update={update}
              onEditStep={(s) => goToStep(s)}
            />
          )}
        </CardContent>
      </Card>

      {/* Navigation footer */}
      <div className="flex items-center justify-between">
        <Button
          variant="secondary"
          size="md"
          onClick={retreat}
          disabled={stepIndex === 0}
        >
          <ChevronLeft className="h-4 w-4 mr-1" />
          Previous
        </Button>
        {currentStep === 'review' ? (
          <Button
            variant="primary"
            size="lg"
            disabled={
              !draft.acceptedTerms ||
              !draft.acceptedPrivacy ||
              !draft.acceptedRepresentations
            }
            onClick={handleSubmit}
          >
            Submit for qualification
          </Button>
        ) : (
          <Button variant="primary" size="md" onClick={advance}>
            Continue
            <ChevronRight className="h-4 w-4 ml-1" />
          </Button>
        )}
      </div>
    </div>
  );
}

// ============================================================
// STEP COMPONENTS
// ============================================================

function BasicsStep({
  draft,
  update,
}: {
  draft: RfqDraft;
  update: <K extends keyof RfqDraft>(k: K, v: RfqDraft[K]) => void;
}) {
  return (
    <>
      <StepHeading title="Project basics" />
      <FormField
        label="Project title"
        htmlFor="title"
        required
        helperText="Brief summary visible to contractors. Avoid building names or your company name."
      >
        <Input
          id="title"
          value={draft.title}
          onChange={(e) => update('title', e.target.value)}
          placeholder="e.g. Bathroom renovation, 3-bed apartment"
        />
      </FormField>

      <FormField label="Category" htmlFor="category" required>
        <select
          id="category"
          value={draft.category}
          onChange={(e) => update('category', e.target.value)}
          className="flex h-10 w-full rounded-md border border-neutral-200 bg-white px-3 text-body-sm font-sans text-neutral-900 focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20"
        >
          <option value="">Select a category</option>
          <option value="renovation">Renovation & Fit-out</option>
          <option value="maintenance">Maintenance</option>
          <option value="electrical">Electrical</option>
          <option value="plumbing">Plumbing</option>
          <option value="hvac">HVAC</option>
          <option value="cleaning">Cleaning</option>
          <option value="landscaping">Landscaping</option>
          <option value="construction">New Construction</option>
        </select>
      </FormField>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormField label="Emirate" htmlFor="emirate" required>
          <select
            id="emirate"
            value={draft.emirate}
            onChange={(e) => update('emirate', e.target.value)}
            className="flex h-10 w-full rounded-md border border-neutral-200 bg-white px-3 text-body-sm"
          >
            <option value="">Select</option>
            <option value="dubai">Dubai</option>
            <option value="abu_dhabi">Abu Dhabi</option>
            <option value="sharjah">Sharjah</option>
            <option value="ajman">Ajman</option>
            <option value="rak">Ras Al Khaimah</option>
            <option value="fujairah">Fujairah</option>
            <option value="uaq">Umm Al Quwain</option>
          </select>
        </FormField>
        <FormField label="Area" htmlFor="city" required>
          <Input
            id="city"
            value={draft.city}
            onChange={(e) => update('city', e.target.value)}
            placeholder="e.g. JLT, Marina, DIFC"
          />
        </FormField>
      </div>

      <FormField
        label="Brief description"
        htmlFor="brief"
        helperText="2–3 sentences. Detailed scope comes next."
      >
        <Textarea
          id="brief"
          value={draft.briefDescription}
          onChange={(e) => update('briefDescription', e.target.value)}
          placeholder="What needs to be done at a high level?"
          rows={3}
        />
      </FormField>
    </>
  );
}

function ScopeStep({
  draft,
  update,
}: {
  draft: RfqDraft;
  update: <K extends keyof RfqDraft>(k: K, v: RfqDraft[K]) => void;
}) {
  return (
    <>
      <StepHeading title="Detailed scope" />

      {/* Anti-leak warning — design-system specified */}
      <div className="rounded-md border border-warning-500/30 bg-warning-50 px-4 py-3 flex gap-3">
        <AlertCircle className="h-5 w-5 text-warning-700 flex-shrink-0 mt-0.5" />
        <div className="text-body-sm font-sans">
          <p className="font-semibold text-warning-700">
            Avoid identifying details
          </p>
          <p className="text-warning-700/90 mt-1">
            Don't include building names, street addresses, or your company name in the
            scope text. Our team reviews each RFQ before publishing — anything that
            identifies you to contractors will be flagged and returned for revision.
          </p>
        </div>
      </div>

      <FormField
        label="Scope of work"
        htmlFor="scope"
        required
        helperText="List what's needed in detail. Materials, dimensions, finishes, quality expectations."
      >
        <Textarea
          id="scope"
          value={draft.detailedScope}
          onChange={(e) => update('detailedScope', e.target.value)}
          placeholder="e.g. Strip existing tiles, install new floor tiles (porcelain, 60x60), replace vanity unit..."
          rows={10}
        />
      </FormField>
    </>
  );
}

function BudgetStep({
  draft,
  update,
}: {
  draft: RfqDraft;
  update: <K extends keyof RfqDraft>(k: K, v: RfqDraft[K]) => void;
}) {
  return (
    <>
      <StepHeading title="Budget & timeline" />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormField label="Budget minimum (AED)" htmlFor="budget-min">
          <Input
            id="budget-min"
            type="number"
            value={draft.budgetMin}
            onChange={(e) =>
              update(
                'budgetMin',
                e.target.value === '' ? '' : Number(e.target.value),
              )
            }
            placeholder="20,000"
            className="tabular-nums"
          />
        </FormField>
        <FormField label="Budget maximum (AED)" htmlFor="budget-max">
          <Input
            id="budget-max"
            type="number"
            value={draft.budgetMax}
            onChange={(e) =>
              update(
                'budgetMax',
                e.target.value === '' ? '' : Number(e.target.value),
              )
            }
            placeholder="35,000"
            className="tabular-nums"
          />
        </FormField>
      </div>

      <p className="text-caption font-sans text-neutral-400 -mt-3">
        Optional but helpful — contractors use this range as guidance when bidding.
      </p>

      <Separator />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormField label="Proposed start date" htmlFor="start">
          <Input
            id="start"
            type="date"
            value={draft.proposedStart}
            onChange={(e) => update('proposedStart', e.target.value)}
          />
        </FormField>
        <FormField label="Target completion" htmlFor="target">
          <Input
            id="target"
            type="date"
            value={draft.targetCompletion}
            onChange={(e) => update('targetCompletion', e.target.value)}
          />
        </FormField>
      </div>

      <FormField
        label="Payment preference"
        htmlFor="payment"
        helperText="Optional. e.g. 50/50 milestones, monthly progress, etc."
      >
        <Input
          id="payment"
          value={draft.paymentPreference}
          onChange={(e) => update('paymentPreference', e.target.value)}
          placeholder="e.g. 50% upfront, 50% on completion"
        />
      </FormField>
    </>
  );
}

function AttachmentsStep({
  draft,
  update,
}: {
  draft: RfqDraft;
  update: <K extends keyof RfqDraft>(k: K, v: RfqDraft[K]) => void;
}) {
  const handleAdd = () => {
    // Stub — wire to S3 signed-URL flow in production
    update('attachments', [
      ...draft.attachments,
      { name: `drawing-${draft.attachments.length + 1}.pdf`, size: 2_456_789 },
    ]);
  };

  const handleRemove = (idx: number) => {
    update(
      'attachments',
      draft.attachments.filter((_, i) => i !== idx),
    );
  };

  return (
    <>
      <StepHeading title="Attachments" />
      <p className="text-body-sm font-sans text-neutral-600 -mt-2">
        Drawings, BoQs, reference photos. PDF, DWG, DXF, DOCX, XLSX, and images
        accepted. Max 25 MB per file.
      </p>

      <button
        type="button"
        onClick={handleAdd}
        className={cn(
          'w-full rounded-lg border-2 border-dashed border-neutral-200 bg-neutral-50/50',
          'px-6 py-12 flex flex-col items-center justify-center gap-3',
          'hover:border-primary-500 hover:bg-primary-50/30 transition-colors cursor-pointer',
        )}
      >
        <Upload
          className="h-8 w-8 text-neutral-400"
          strokeWidth={1.5}
          aria-hidden
        />
        <div className="text-center">
          <p className="text-body-sm font-sans font-medium text-neutral-900">
            Drop files here or click to browse
          </p>
          <p className="text-caption font-sans text-neutral-400 mt-1">
            Up to 10 files
          </p>
        </div>
      </button>

      {draft.attachments.length > 0 && (
        <ul className="space-y-2">
          {draft.attachments.map((file, idx) => (
            <li
              key={idx}
              className="flex items-center justify-between gap-3 px-4 py-3 rounded-md border border-neutral-100 bg-white"
            >
              <div className="min-w-0">
                <p className="text-body-sm font-sans text-neutral-900 truncate">
                  {file.name}
                </p>
                <p className="text-caption font-sans text-neutral-400 tabular-nums">
                  {(file.size / 1024 / 1024).toFixed(1)} MB
                </p>
              </div>
              <button
                type="button"
                onClick={() => handleRemove(idx)}
                className="p-2 hover:bg-neutral-50 rounded-md text-neutral-400 hover:text-danger-500 transition-colors"
                aria-label="Remove file"
              >
                <X className="h-4 w-4" />
              </button>
            </li>
          ))}
        </ul>
      )}
    </>
  );
}

function SiteVisitStep({
  draft,
  update,
}: {
  draft: RfqDraft;
  update: <K extends keyof RfqDraft>(k: K, v: RfqDraft[K]) => void;
}) {
  return (
    <>
      <StepHeading title="Site visit" />
      <p className="text-body-sm font-sans text-neutral-600 -mt-2">
        Decide when (or if) contractors should visit before bidding.
      </p>

      <div className="space-y-3">
        <RadioOption
          id="not_needed"
          label="No site visit needed"
          description="Bids based on the RFQ documents alone."
          checked={draft.siteVisit === 'not_needed'}
          onChange={() => update('siteVisit', 'not_needed')}
        />
        <RadioOption
          id="post_award"
          label="Post-award site visit"
          description="Contractor visits after award and payment, before kickoff."
          checked={draft.siteVisit === 'post_award'}
          onChange={() => update('siteVisit', 'post_award')}
        />
        <RadioOption
          id="pre_bid"
          label="Pre-bid site visit"
          description="Contractors visit before submitting a bid. Currently unavailable."
          checked={draft.siteVisit === 'pre_bid'}
          onChange={() => update('siteVisit', 'pre_bid')}
          disabled
          badge="Coming soon"
        />
      </div>

      {draft.siteVisit === 'pre_bid' && (
        <div className="rounded-md border border-warning-500/30 bg-warning-50 px-4 py-3 flex gap-3">
          <AlertCircle className="h-5 w-5 text-warning-700 flex-shrink-0 mt-0.5" />
          <p className="text-body-sm font-sans text-warning-700">
            Pre-bid site visits are not yet supported. They require coordination that
            could leak your identity — we're building a managed flow that protects this.
            For now, please choose post-award visits.
          </p>
        </div>
      )}
    </>
  );
}

function ReviewStep({
  draft,
  update,
  onEditStep,
}: {
  draft: RfqDraft;
  update: <K extends keyof RfqDraft>(k: K, v: RfqDraft[K]) => void;
  onEditStep: (id: StepId) => void;
}) {
  return (
    <>
      <StepHeading title="Review & submit" />

      <ReviewSection title="Project basics" onEdit={() => onEditStep('basics')}>
        <ReviewRow label="Title" value={draft.title || '—'} />
        <ReviewRow label="Category" value={draft.category || '—'} />
        <ReviewRow
          label="Location"
          value={`${draft.city || '—'}, ${draft.emirate || '—'}`}
        />
      </ReviewSection>

      <ReviewSection title="Scope" onEdit={() => onEditStep('scope')}>
        <p className="text-body-sm font-sans text-neutral-700 whitespace-pre-wrap">
          {draft.detailedScope || '—'}
        </p>
      </ReviewSection>

      <ReviewSection title="Budget & timeline" onEdit={() => onEditStep('budget')}>
        <ReviewRow
          label="Budget"
          value={
            draft.budgetMin && draft.budgetMax
              ? `${formatCurrency(Number(draft.budgetMin))} – ${formatCurrency(Number(draft.budgetMax))}`
              : '—'
          }
        />
        <ReviewRow label="Start" value={draft.proposedStart || '—'} />
        <ReviewRow label="Target completion" value={draft.targetCompletion || '—'} />
      </ReviewSection>

      <ReviewSection title="Attachments" onEdit={() => onEditStep('attachments')}>
        <p className="text-body-sm font-sans text-neutral-700 tabular-nums">
          {draft.attachments.length} file{draft.attachments.length === 1 ? '' : 's'}
        </p>
      </ReviewSection>

      <Separator />

      {/* Three legal acceptances */}
      <div className="space-y-3">
        <p className="text-overline uppercase font-sans text-neutral-400">
          Acknowledgements
        </p>
        <LegalCheckbox
          checked={draft.acceptedTerms}
          onCheckedChange={(c) => update('acceptedTerms', c)}
        >
          I agree to the{' '}
          <Link
            href="/legal/terms"
            target="_blank"
            className="text-primary-900 hover:underline"
          >
            Marketplace Terms
          </Link>
          , including the anti-circumvention clause.
        </LegalCheckbox>
        <LegalCheckbox
          checked={draft.acceptedPrivacy}
          onCheckedChange={(c) => update('acceptedPrivacy', c)}
        >
          I have read the{' '}
          <Link
            href="/legal/privacy"
            target="_blank"
            className="text-primary-900 hover:underline"
          >
            Privacy Notice
          </Link>{' '}
          and consent to the data handling described.
        </LegalCheckbox>
        <LegalCheckbox
          checked={draft.acceptedRepresentations}
          onCheckedChange={(c) => update('acceptedRepresentations', c)}
        >
          I confirm the information in this RFQ is accurate to the best of my
          knowledge, and I have authority to commission this work on behalf of
          Marina Towers Properties LLC.
        </LegalCheckbox>
      </div>
    </>
  );
}

// ============================================================
// HELPER COMPONENTS
// ============================================================

function StepHeading({ title }: { title: string }) {
  return (
    <h2 className="text-h3 font-display font-semibold text-neutral-900">
      {title}
    </h2>
  );
}

function RadioOption({
  id,
  label,
  description,
  checked,
  onChange,
  disabled,
  badge,
}: {
  id: string;
  label: string;
  description: string;
  checked: boolean;
  onChange: () => void;
  disabled?: boolean;
  badge?: string;
}) {
  return (
    <label
      htmlFor={id}
      className={cn(
        'flex items-start gap-3 rounded-md border-2 px-4 py-3 cursor-pointer transition-colors',
        checked && !disabled
          ? 'border-primary-500 bg-primary-50/30'
          : 'border-neutral-100 hover:border-neutral-200',
        disabled && 'opacity-60 cursor-not-allowed',
      )}
    >
      <input
        type="radio"
        id={id}
        checked={checked}
        onChange={onChange}
        disabled={disabled}
        className="sr-only"
      />
      <span
        className={cn(
          'mt-0.5 h-5 w-5 rounded-full border-2 flex-shrink-0 transition-colors flex items-center justify-center',
          checked
            ? 'border-primary-900'
            : 'border-neutral-300',
        )}
        aria-hidden
      >
        {checked && <span className="h-2.5 w-2.5 rounded-full bg-primary-900" />}
      </span>
      <div className="flex-1">
        <div className="flex items-center gap-2">
          <p className="text-body-sm font-sans font-medium text-neutral-900">
            {label}
          </p>
          {badge && (
            <span className="text-caption font-sans px-1.5 py-0.5 rounded bg-neutral-100 text-neutral-600">
              {badge}
            </span>
          )}
        </div>
        <p className="text-caption font-sans text-neutral-400 mt-0.5">
          {description}
        </p>
      </div>
    </label>
  );
}

function ReviewSection({
  title,
  children,
  onEdit,
}: {
  title: string;
  children: React.ReactNode;
  onEdit: () => void;
}) {
  return (
    <div className="rounded-md border border-neutral-100 p-4 space-y-2">
      <div className="flex items-center justify-between">
        <p className="text-overline uppercase font-sans text-neutral-400">{title}</p>
        <button
          type="button"
          onClick={onEdit}
          className="text-caption font-sans font-medium text-primary-900 hover:text-primary-700"
        >
          Edit
        </button>
      </div>
      <div className="space-y-1">{children}</div>
    </div>
  );
}

function ReviewRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-baseline justify-between gap-4 text-body-sm font-sans">
      <span className="text-neutral-400">{label}</span>
      <span className="text-neutral-900 text-right">{value}</span>
    </div>
  );
}

function LegalCheckbox({
  checked,
  onCheckedChange,
  children,
}: {
  checked: boolean;
  onCheckedChange: (c: boolean) => void;
  children: React.ReactNode;
}) {
  return (
    <label className="flex items-start gap-3 cursor-pointer group">
      <Checkbox
        checked={checked}
        onCheckedChange={(c) => onCheckedChange(c === true)}
        className="mt-0.5 flex-shrink-0"
      />
      <span className="text-body-sm font-sans text-neutral-700 group-hover:text-neutral-900 transition-colors leading-relaxed">
        {children}
      </span>
    </label>
  );
}

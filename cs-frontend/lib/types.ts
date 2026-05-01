/**
 * Shared types — mirror the backend DTOs in their pre/post-unlock variants.
 *
 * The masked/unlocked distinction at the type level mirrors the
 * Critical Rule at the data level: pre-unlock types simply don't
 * have contact fields. This makes accidental leaks impossible
 * via TypeScript — the field doesn't exist to render.
 */

export type RfqState =
  | 'draft'
  | 'submitted'
  | 'in_review'
  | 'qualified'
  | 'matching'
  | 'invited'
  | 'site_visit_in_progress'
  | 'bidding'
  | 'bids_under_review'
  | 'awarded_pending_payment'
  | 'paid'
  | 'kickoff_pending'
  | 'in_progress'
  | 'completed'
  | 'rejected'
  | 'cancelled'
  | 'lapsed';

export type BidState =
  | 'draft'
  | 'submitted'
  | 'revised'
  | 'withdrawn'
  | 'selected'
  | 'awarded_pending_payment'
  | 'awarded_paid'
  | 'closed_award_lost'
  | 'expired';

export type AwardState =
  | 'pending_payment'
  | 'paid'
  | 'kickoff_pending'
  | 'in_progress'
  | 'completed'
  | 'lapsed'
  | 'cancelled';

export type PaymentIntentState =
  | 'created'
  | 'processing'
  | 'requires_payment_method'
  | 'requires_action'
  | 'succeeded'
  | 'failed';

/**
 * MASKED variant of a contractor — what the client sees pre-unlock.
 * Notice: NO contactEmail, contactPhone, legalName, address.
 */
export interface ContractorMasked {
  organizationId: string;
  pseudonymousHandle: string;
  trustScore: number;
  reviewCount: number;
  yearsInBusiness: number;
  primaryCategory: string;
  isKycVerified: boolean;
  isInsured: boolean;
  isLicenseVerified: boolean;
  completedProjectCount: number;
  // Portfolio images allowed pre-unlock (URL-randomized; EXIF stripped — tier 2 followup)
  portfolioImageUrls: string[];
}

/**
 * UNLOCKED variant — only available post-unlock_event.
 */
export interface ContractorUnlocked extends ContractorMasked {
  legalName: string;
  contactEmail: string;
  contactPhone: string;
  contactWhatsapp?: string;
  contactAddress?: string;
  licenseNumber?: string;
  unlockedAt: string;
}

export type Contractor = ContractorMasked | ContractorUnlocked;

export function isUnlocked(c: Contractor): c is ContractorUnlocked {
  return 'legalName' in c;
}

export interface BidLineItem {
  lineNumber: number;
  category?: string;
  description: string;
  quantity: number;
  unit?: string;
  unitPrice: number;
  lineTotal: number;
  notes?: string;
}

export interface BidPublic {
  id: string;
  rfqId: string;
  vendorOrganizationId: string;
  pseudonymousHandle: string;
  totalPrice: number;
  vatAmount: number;
  serviceFee: number;
  totalPayable: number;
  currency: string;
  proposedStartDate?: string;
  proposedDurationDays?: number;
  paymentTerms?: string;
  inclusions?: string;
  exclusions?: string;
  validityUntil: string;
  state: BidState;
  version: number;
  submittedAt: string;
  trustScore: number;
  yearsInBusiness: number;
  lineItems: BidLineItem[];
}

export interface Award {
  id: string;
  rfqId: string;
  bidId: string;
  state: AwardState;
  expiresAt: string;
  createdAt: string;
  paidAt?: string;
  unlockEventId?: string;
}

export interface MessageThread {
  id: string;
  rfqId: string;
  redactionEnabled: boolean;
  unlockEventId: string | null;
  participantHandles: string[];
}

export interface Message {
  id: string;
  threadId: string;
  senderUserId: string;
  senderHandle: string;
  displayedText: string;
  hadRedactions: boolean;
  sentAt: string;
}

/**
 * Maps state strings to badge categories per Design System §6.6.
 */
export type BadgeCategory =
  | 'neutral'
  | 'action'
  | 'success'
  | 'critical'
  | 'info';

export function rfqStateCategory(state: RfqState): BadgeCategory {
  switch (state) {
    case 'paid':
    case 'in_progress':
    case 'completed':
      return 'success';
    case 'awarded_pending_payment':
    case 'kickoff_pending':
      return 'action';
    case 'cancelled':
    case 'lapsed':
    case 'rejected':
      return 'critical';
    case 'qualified':
    case 'matching':
    case 'invited':
      return 'info';
    default:
      return 'neutral';
  }
}

export function bidStateCategory(state: BidState): BadgeCategory {
  switch (state) {
    case 'awarded_paid':
      return 'success';
    case 'awarded_pending_payment':
    case 'selected':
      return 'action';
    case 'withdrawn':
    case 'closed_award_lost':
    case 'expired':
      return 'critical';
    case 'submitted':
    case 'revised':
      return 'info';
    default:
      return 'neutral';
  }
}

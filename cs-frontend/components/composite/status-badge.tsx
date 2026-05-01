import { Badge } from '@/components/ui/badge';
import {
  type RfqState,
  type BidState,
  type AwardState,
  type PaymentIntentState,
  rfqStateCategory,
  bidStateCategory,
} from '@/lib/types';

/**
 * StatusBadge — maps state strings to the 5-category badge system.
 * Per Design System §6.6.
 */
const RFQ_LABELS: Record<RfqState, string> = {
  draft: 'Draft',
  submitted: 'Awaiting review',
  in_review: 'In review',
  qualified: 'Qualified',
  matching: 'Matching contractors',
  invited: 'Invitations sent',
  site_visit_in_progress: 'Site visit',
  bidding: 'Bidding',
  bids_under_review: 'Review bids',
  awarded_pending_payment: 'Awaiting payment',
  paid: 'Paid · Unlocked',
  kickoff_pending: 'Kickoff pending',
  in_progress: 'In progress',
  completed: 'Completed',
  rejected: 'Rejected',
  cancelled: 'Cancelled',
  lapsed: 'Lapsed',
};

const BID_LABELS: Record<BidState, string> = {
  draft: 'Draft',
  submitted: 'Submitted',
  revised: 'Revised',
  withdrawn: 'Withdrawn',
  selected: 'Selected',
  awarded_pending_payment: 'Awaiting payment',
  awarded_paid: 'Awarded',
  closed_award_lost: 'Closed',
  expired: 'Expired',
};

const AWARD_LABELS: Record<AwardState, string> = {
  pending_payment: 'Awaiting payment',
  paid: 'Paid · Unlocked',
  kickoff_pending: 'Kickoff pending',
  in_progress: 'In progress',
  completed: 'Completed',
  lapsed: 'Lapsed',
  cancelled: 'Cancelled',
};

const PAYMENT_LABELS: Record<PaymentIntentState, string> = {
  created: 'Created',
  processing: 'Processing',
  requires_payment_method: 'Try a different card',
  requires_action: 'Awaiting bank confirmation',
  succeeded: 'Succeeded',
  failed: 'Failed',
};

interface StatusBadgeProps {
  type: 'rfq' | 'bid' | 'award' | 'payment';
  state: string;
  size?: 'sm' | 'md';
}

export function StatusBadge({ type, state, size = 'md' }: StatusBadgeProps) {
  if (type === 'rfq') {
    const s = state as RfqState;
    return (
      <Badge variant={rfqStateCategory(s)} size={size}>
        {RFQ_LABELS[s] ?? state}
      </Badge>
    );
  }
  if (type === 'bid') {
    const s = state as BidState;
    return (
      <Badge variant={bidStateCategory(s)} size={size}>
        {BID_LABELS[s] ?? state}
      </Badge>
    );
  }
  if (type === 'award') {
    const s = state as AwardState;
    const variant =
      s === 'paid' || s === 'in_progress' || s === 'completed'
        ? 'success'
        : s === 'pending_payment' || s === 'kickoff_pending'
          ? 'action'
          : s === 'lapsed' || s === 'cancelled'
            ? 'critical'
            : 'neutral';
    return (
      <Badge variant={variant} size={size}>
        {AWARD_LABELS[s] ?? state}
      </Badge>
    );
  }
  // payment
  const s = state as PaymentIntentState;
  const variant =
    s === 'succeeded'
      ? 'success'
      : s === 'failed' || s === 'requires_payment_method'
        ? 'critical'
        : s === 'processing' || s === 'requires_action'
          ? 'action'
          : 'neutral';
  return (
    <Badge variant={variant} size={size}>
      {PAYMENT_LABELS[s] ?? state}
    </Badge>
  );
}

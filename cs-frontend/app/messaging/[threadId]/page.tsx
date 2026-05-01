'use client';

import * as React from 'react';
import Link from 'next/link';
import {
  ChevronLeft,
  Send,
  AlertTriangle,
  Lock,
  Paperclip,
  Flag,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { ContractorCard } from '@/components/composite/contractor-card';
import { Badge } from '@/components/ui/badge';
import { formatHandle, formatRelativeOrAbsolute } from '@/lib/format';
import { type Message, type ContractorMasked } from '@/lib/types';
import { cn } from '@/lib/utils';

/**
 * Messaging thread page — masking made visually clear.
 *
 * Per Design System §7 (state system) + Frontend Design v2 §11.
 *
 * Pre-unlock messages: redaction tokens replaced where contact info detected.
 * The redaction is server-applied; this UI just renders what arrives.
 *
 * Visual treatment of redactions:
 *   - "[phone redacted until unlock]" rendered as a subtle inline pill
 *   - Hover/click reveals the redaction reason
 *   - When recipient sends a message that triggered redaction, banner appears
 */

const MOCK_MESSAGES: Message[] = [
  {
    id: 'm1',
    threadId: 't1',
    senderUserId: 'u-vendor',
    senderHandle: 'VC-0427',
    displayedText:
      'Hi — thanks for the invitation. I have a few clarifying questions about the bathroom scope. The drawings show plumbing on the north wall — is that an existing fixture or a new run?',
    hadRedactions: false,
    sentAt: '2026-04-30T09:14:00Z',
  },
  {
    id: 'm2',
    threadId: 't1',
    senderUserId: 'u-client',
    senderHandle: 'CL-0033',
    displayedText:
      'New run. The current bathroom has plumbing on the south wall. We want to relocate to the north for the new layout.',
    hadRedactions: false,
    sentAt: '2026-04-30T09:42:00Z',
  },
  {
    id: 'm3',
    threadId: 't1',
    senderUserId: 'u-vendor',
    senderHandle: 'VC-0427',
    displayedText:
      "Got it. For faster discussion, you can also call me at [phone redacted until unlock]. We'd be happy to do a video call this week.",
    hadRedactions: true,
    sentAt: '2026-04-30T10:23:00Z',
  },
  {
    id: 'm4',
    threadId: 't1',
    senderUserId: 'u-client',
    senderHandle: 'CL-0033',
    displayedText:
      "We can talk after we award. For now let's keep it on the platform. Could you submit a revised quote with the relocation included?",
    hadRedactions: false,
    sentAt: '2026-04-30T10:55:00Z',
  },
];

const MOCK_VENDOR: ContractorMasked = {
  organizationId: 'org-1',
  pseudonymousHandle: 'VC-0427',
  trustScore: 4.8,
  reviewCount: 24,
  yearsInBusiness: 8,
  primaryCategory: 'Renovation & Fit-out',
  isKycVerified: true,
  isInsured: true,
  isLicenseVerified: true,
  completedProjectCount: 24,
  portfolioImageUrls: [],
};

export default function MessageThreadPage({
  params,
}: {
  params: { threadId: string };
}) {
  const [draft, setDraft] = React.useState('');
  const [showRedactionWarning, setShowRedactionWarning] = React.useState(false);

  // Crude client-side preview of what RedactionService would catch
  // (server is the source of truth — this is a UX courtesy)
  React.useEffect(() => {
    const phonePattern = /\d{8,}|\+?971|\b(?:zero|one|two|three|four|five|six|seven|eight|nine)\b.{0,20}\b(?:zero|one|two|three|four|five|six|seven|eight|nine)\b/i;
    const emailPattern = /[\w.-]+@[\w.-]+\.\w+/;
    const urlPattern = /\b(?:wa\.me|https?:\/\/|www\.)/i;
    const hasContact =
      phonePattern.test(draft) ||
      emailPattern.test(draft) ||
      urlPattern.test(draft);
    setShowRedactionWarning(hasContact);
  }, [draft]);

  const handleSend = () => {
    // Submit to backend — RedactionService will apply on server side
    console.log('Sending', draft);
    setDraft('');
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-6">
      {/* Main thread */}
      <div className="flex flex-col h-[calc(100vh-160px)] bg-white rounded-lg border border-neutral-100 shadow-sm overflow-hidden">
        {/* Thread header */}
        <div className="px-6 py-4 border-b border-neutral-100 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link
              href="/messaging"
              className="text-neutral-600 hover:text-neutral-900 lg:hidden"
            >
              <ChevronLeft className="h-5 w-5" />
            </Link>
            <div>
              <p className="text-body font-sans font-semibold text-neutral-900">
                Conversation with{' '}
                <span className="text-handle">
                  {formatHandle(MOCK_VENDOR.pseudonymousHandle)}
                </span>
              </p>
              <p className="text-caption font-sans text-neutral-400">
                RFQ-2026-00481 · Bathroom renovation
              </p>
            </div>
          </div>
          <Badge variant="info" size="sm" className="gap-1">
            <Lock className="h-3 w-3" />
            Pre-unlock — redaction active
          </Badge>
        </div>

        {/* Messages area */}
        <div className="flex-1 overflow-y-auto px-6 py-6 space-y-4">
          {MOCK_MESSAGES.map((msg) => (
            <MessageBubble
              key={msg.id}
              message={msg}
              isOwn={msg.senderUserId === 'u-client'}
            />
          ))}
        </div>

        {/* Composer */}
        <div className="border-t border-neutral-100 p-4 bg-neutral-50/50">
          {showRedactionWarning && (
            <div
              role="alert"
              className="mb-3 rounded-md border border-warning-500/30 bg-warning-50 px-3 py-2 flex items-start gap-2"
            >
              <AlertTriangle className="h-4 w-4 text-warning-700 flex-shrink-0 mt-0.5" />
              <p className="text-caption font-sans text-warning-700">
                Possible contact info detected. Phone numbers, emails, and
                external links will be replaced with redaction tokens until
                payment unlocks the conversation.
              </p>
            </div>
          )}
          <div className="flex gap-2 items-end">
            <Textarea
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              placeholder="Type your message..."
              className="resize-none flex-1 min-h-[80px]"
              rows={3}
            />
            <div className="flex flex-col gap-2">
              <Button
                variant="ghost"
                size="md"
                aria-label="Attach file"
                className="px-3"
              >
                <Paperclip className="h-4 w-4" />
              </Button>
              <Button
                variant="primary"
                size="md"
                disabled={!draft.trim()}
                onClick={handleSend}
                aria-label="Send message"
                className="gap-2"
              >
                <Send className="h-4 w-4" />
                Send
              </Button>
            </div>
          </div>
          <p className="text-caption font-sans text-neutral-400 mt-2 inline-flex items-center gap-1">
            <Lock className="h-3 w-3" /> All messages remain in the platform.
            Contact information is automatically redacted until unlock.
          </p>
        </div>
      </div>

      {/* Side panel: contractor info + report */}
      <aside className="space-y-4">
        <ContractorCard
          contractor={MOCK_VENDOR}
          unlockPriceAed={1492}
          onUnlockClick={() => {
            // Navigate to award/pay flow
          }}
        />

        <div className="rounded-lg border border-neutral-100 bg-white p-4 shadow-sm">
          <p className="text-overline uppercase font-sans text-neutral-400">
            Concerns?
          </p>
          <p className="mt-2 text-body-sm font-sans text-neutral-700 leading-relaxed">
            If this contractor is asking for off-platform contact or attempting
            to bypass the marketplace, you can report it.
          </p>
          <Button
            variant="destructive"
            size="sm"
            className="mt-3 w-full gap-2"
          >
            <Flag className="h-4 w-4" />
            Report bypass attempt
          </Button>
        </div>
      </aside>
    </div>
  );
}

function MessageBubble({
  message,
  isOwn,
}: {
  message: Message;
  isOwn: boolean;
}) {
  const parts = renderRedactedText(message.displayedText);

  return (
    <div
      className={cn(
        'flex gap-3',
        isOwn ? 'flex-row-reverse' : 'flex-row',
      )}
    >
      {/* Avatar */}
      <div
        className={cn(
          'flex-shrink-0 h-8 w-8 rounded-full inline-flex items-center justify-center',
          'text-caption font-sans font-semibold',
          isOwn
            ? 'bg-primary-100 text-primary-900'
            : 'bg-neutral-100 text-neutral-700',
        )}
      >
        {message.senderHandle.slice(0, 2)}
      </div>

      {/* Bubble */}
      <div
        className={cn(
          'max-w-[75%] flex flex-col',
          isOwn ? 'items-end' : 'items-start',
        )}
      >
        <span className="text-caption font-sans text-neutral-400 mb-1">
          {formatHandle(message.senderHandle)} ·{' '}
          {formatRelativeOrAbsolute(message.sentAt)}
        </span>
        <div
          className={cn(
            'rounded-lg px-4 py-2.5 max-w-full break-words',
            isOwn
              ? 'bg-primary-900 text-white'
              : 'bg-neutral-50 text-neutral-900',
          )}
        >
          <p className="text-body-sm font-sans leading-relaxed">{parts}</p>
        </div>
        {message.hadRedactions && (
          <p
            className={cn(
              'text-caption font-sans text-warning-700 mt-1 inline-flex items-center gap-1',
              isOwn ? 'flex-row-reverse' : '',
            )}
          >
            <Lock className="h-3 w-3" /> Contact info was redacted
          </p>
        )}
      </div>
    </div>
  );
}

/**
 * Render redaction tokens as inline pills so they're visually distinct
 * from regular prose (this is the "redacted" visual signal — it makes
 * the masking layer of the Critical Rule visible).
 */
function renderRedactedText(text: string): React.ReactNode {
  const tokenRegex = /\[(phone|email|whatsapp link|messaging link|link|social handle|address|number|contact suggestion|off-platform contact suggestion)\s+redacted[^\]]*\]/g;
  const parts: React.ReactNode[] = [];
  let lastIndex = 0;
  let match: RegExpExecArray | null;

  while ((match = tokenRegex.exec(text)) !== null) {
    if (match.index > lastIndex) {
      parts.push(text.slice(lastIndex, match.index));
    }
    parts.push(
      <span
        key={match.index}
        className="inline-flex items-center gap-1 mx-0.5 px-1.5 py-0.5 rounded bg-warning-50 text-warning-700 text-[12px] font-mono align-baseline"
        title="Contact info redacted until payment unlocks the conversation"
      >
        <Lock className="h-3 w-3" />
        {match[1]} redacted
      </span>,
    );
    lastIndex = match.index + match[0].length;
  }
  if (lastIndex < text.length) {
    parts.push(text.slice(lastIndex));
  }
  return parts.length > 0 ? <>{parts}</> : text;
}

'use client';

import * as React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Bell, ChevronDown, Building2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

/**
 * Topbar — primary app navigation. 64px height.
 * Brand logo on left, navigation in center (when applicable),
 * notification bell + user menu on right.
 *
 * Per Design System §4 (layout) + §6 (component library).
 */
interface TopbarProps {
  user?: {
    name: string;
    email: string;
    organizationName: string;
    role: 'client' | 'contractor' | 'admin';
  };
  unreadNotifications?: number;
  navigation?: Array<{ label: string; href: string; current?: boolean }>;
}

export function Topbar({ user, unreadNotifications = 0, navigation }: TopbarProps) {
  return (
    <header className="sticky top-0 z-40 h-16 bg-white border-b border-neutral-100">
      <div className="mx-auto max-w-[1280px] h-full px-4 md:px-6 flex items-center justify-between gap-6">
        {/* Logo — brand monogram (hexagonal mark with buildings + checkmark) */}
        <Link
          href="/dashboard"
          className="flex items-center gap-2.5 flex-shrink-0 group"
          aria-label="ContractorSelect.me — home"
        >
          <Image
            src="/logo-monogram.svg"
            alt=""
            width={36}
            height={36}
            className="h-9 w-9"
            priority
          />
          <span className="hidden md:inline text-h4 font-display font-semibold text-neutral-900 group-hover:text-primary-900 transition-colors">
            ContractorSelect<span className="text-success-700">.me</span>
          </span>
        </Link>

        {/* Center nav (optional) */}
        {navigation && navigation.length > 0 && (
          <nav className="hidden md:flex items-center gap-1">
            {navigation.map((item) => (
              <Link
                key={item.href}
                href={item.href as never}
                className={
                  'px-3 py-2 rounded-md text-body-sm font-sans font-medium transition-colors ' +
                  (item.current
                    ? 'bg-primary-50 text-primary-900'
                    : 'text-neutral-700 hover:bg-neutral-50 hover:text-neutral-900')
                }
              >
                {item.label}
              </Link>
            ))}
          </nav>
        )}

        {/* Right cluster */}
        <div className="flex items-center gap-2">
          {/* Notifications */}
          <button
            type="button"
            className="relative h-10 w-10 inline-flex items-center justify-center rounded-md hover:bg-neutral-50 transition-colors"
            aria-label={`Notifications (${unreadNotifications} unread)`}
          >
            <Bell className="h-5 w-5 text-neutral-700" strokeWidth={2} />
            {unreadNotifications > 0 && (
              <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-danger-500 ring-2 ring-white" />
            )}
          </button>

          {/* User menu trigger */}
          {user && (
            <button
              type="button"
              className="hidden sm:flex items-center gap-2 h-10 px-3 rounded-md hover:bg-neutral-50 transition-colors"
            >
              <div className="h-7 w-7 rounded-full bg-primary-100 inline-flex items-center justify-center">
                <Building2 className="h-3.5 w-3.5 text-primary-900" />
              </div>
              <div className="text-left hidden md:block">
                <p className="text-caption font-sans font-medium text-neutral-900 leading-tight">
                  {user.name}
                </p>
                <p className="text-[11px] font-sans text-neutral-400 leading-tight">
                  {user.organizationName}
                </p>
              </div>
              <ChevronDown className="h-4 w-4 text-neutral-400" />
            </button>
          )}
        </div>
      </div>
    </header>
  );
}

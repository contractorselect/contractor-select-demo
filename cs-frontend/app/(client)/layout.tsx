import { AppShell } from '@/components/layout/app-shell';

/**
 * (client) route-group layout.
 * In production: pulls user from session via cookies/server-action.
 * Stub here returns a placeholder user for the demonstration.
 */
export default function ClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // TODO: replace with real session lookup once auth is wired
  const user = {
    name: 'Khalid Al-Mazrouei',
    email: 'khalid@example.ae',
    organizationName: 'Marina Towers Properties LLC',
    role: 'client' as const,
  };

  const navigation = [
    { label: 'Dashboard', href: '/dashboard' },
    { label: 'My RFQs', href: '/dashboard?tab=rfqs' },
    { label: 'Awards', href: '/dashboard?tab=awards' },
    { label: 'Messages', href: '/messaging' },
  ];

  return (
    <AppShell user={user} unreadNotifications={3} navigation={navigation}>
      {children}
    </AppShell>
  );
}

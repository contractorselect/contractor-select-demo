import { Topbar } from './topbar';

interface AppShellProps {
  user?: React.ComponentProps<typeof Topbar>['user'];
  unreadNotifications?: number;
  navigation?: React.ComponentProps<typeof Topbar>['navigation'];
  children: React.ReactNode;
}

/**
 * AppShell — page-level wrapper that combines Topbar + main content.
 * Used by route group layouts; handles consistent padding and max-width.
 */
export function AppShell({
  user,
  unreadNotifications,
  navigation,
  children,
}: AppShellProps) {
  return (
    <div className="min-h-screen bg-neutral-50 flex flex-col">
      <Topbar
        user={user}
        unreadNotifications={unreadNotifications}
        navigation={navigation}
      />
      <main className="flex-1 mx-auto w-full max-w-[1280px] px-4 md:px-6 py-8">
        {children}
      </main>
    </div>
  );
}

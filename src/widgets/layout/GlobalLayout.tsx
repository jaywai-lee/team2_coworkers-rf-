import { ReactNode, useCallback, useMemo } from 'react';
import { useRouter } from 'next/router';
import { AppLayout } from './Sidebar';
import { useUserQuery } from '@/features/user/hooks/useUserQuery';
import { teamDashboardPath, ROUTES } from '@/shared/constants/routes';

interface GlobalLayoutProps {
  children: ReactNode;
}

export function GlobalLayout({ children }: GlobalLayoutProps) {
  const router = useRouter();
  const { data: user, isLoading } = useUserQuery();

  const isLoggedIn = isLoading ? undefined : !!user;

  const selectedTeamId = useMemo(() => {
    if (!router.isReady || router.pathname !== '/[teamId]') return null;
    const raw = router.query.teamId;
    return typeof raw === 'string' ? raw : Array.isArray(raw) ? (raw[0] ?? null) : null;
  }, [router.isReady, router.pathname, router.query.teamId]);

  const handleTeamSelect = useCallback(
    (id: string) => {
      void router.push(teamDashboardPath(id));
    },
    [router],
  );

  const handleAddTeam = useCallback(() => {
    void router.push(ROUTES.TEAM_CREATE);
  }, [router]);

  const handleLoginClick = useCallback(() => {
    void router.push('/login');
  }, [router]);

  const sidebarProps = useMemo(
    () => ({
      isLoggedIn: isLoggedIn ?? false,
      selectedTeamId,
      onTeamSelect: handleTeamSelect,
      onAddTeam: handleAddTeam,
      onLoginClick: handleLoginClick,
    }),
    [isLoggedIn, selectedTeamId, handleTeamSelect, handleAddTeam, handleLoginClick],
  );

  return <AppLayout sidebarProps={sidebarProps}>{children}</AppLayout>;
}

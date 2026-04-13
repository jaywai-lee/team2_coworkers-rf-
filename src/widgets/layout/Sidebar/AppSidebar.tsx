import { useCallback, useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { Sidebar, SidebarHeader, SidebarContent, SidebarNavItem } from '@/shared/ui/Sidebar';
import { cn } from '@/shared/lib/cn';
import { ROUTES } from '@/shared/constants/routes';
import type { AppSidebarProps, TeamItem } from './types';
import logoLg from '@/shared/assets/images/logo-lg.png';
import { useSidebarTeamItems } from './useSidebarTeamItems';
import { drawerToggleNoop } from './constants';
import { AuthenticatedFooter } from './AuthenticatedFooter';
import { UnauthenticatedFooter } from './UnauthenticatedFooter';
import { TeamSidebarRow } from './TeamSidebarRow';
import {
  IconArrowDown,
  IconBoard,
  IconClose,
  IconFoldLeft,
  IconFoldRight,
  IconLogo,
  IconPlus,
  IconTeam,
} from '@/shared/ui/icons';

// ==========================================
// 내부 분리 컴포넌트 1: 메인 네비게이션 링크
// ==========================================
function MainNavItems({
  expanded,
  isLoggedIn,
  isRouteActive,
}: {
  expanded: boolean;
  isLoggedIn: boolean;
  isRouteActive: (path: string, exact?: boolean) => boolean;
}) {
  return (
    <>
      <SidebarNavItem
        label="자유게시판"
        href={ROUTES.BOARD}
        isExpanded={expanded}
        isSelected={isRouteActive(ROUTES.BOARD)}
        icon={<IconBoard />}
      />
      {isLoggedIn && (
        <>
          <SidebarNavItem
            label="팀 참여하기"
            href={ROUTES.ACCEPT_INVITATION}
            isExpanded={expanded}
            isSelected={isRouteActive(ROUTES.ACCEPT_INVITATION)}
            icon={<IconTeam />}
          />
          <SidebarNavItem
            label="마이 히스토리"
            href="/myhistory"
            isExpanded={expanded}
            isSelected={isRouteActive('/myhistory', false)}
            icon={<IconBoard />}
          />
          <SidebarNavItem
            label="팀 추가하기"
            href={ROUTES.TEAM_CREATE}
            isExpanded={expanded}
            icon={<IconPlus />}
            className={cn(
              expanded &&
                'border-brand-primary bg-background-primary text-brand-primary hover:bg-brand-secondary hover:text-brand-primary min-h-13 w-full justify-center gap-1 rounded-lg border px-3 py-2 text-center',
            )}
          />
        </>
      )}
    </>
  );
}

// ==========================================
// 내부 분리 컴포넌트 2: 팀 목록 아코디언 섹션
// ==========================================
function TeamListSection({
  expanded,
  isOpen,
  teamItems,
  selectedTeamId,
  onToggle,
  onSelect,
}: {
  expanded: boolean;
  isOpen: boolean;
  teamItems: TeamItem[];
  selectedTeamId: string | null;
  onToggle: () => void;
  onSelect: (id: string) => void;
}) {
  if (teamItems.length === 0) return null;

  return (
    <>
      <div className="border-background-tertiary my-2 border-t" role="separator" />
      {expanded ? (
        <>
          <button
            type="button"
            onClick={onToggle}
            className="text-txt-default hover:bg-background-tertiary hover:text-txt-primary focus-visible:ring-brand-primary flex min-h-13 w-full items-center gap-2 rounded-lg px-3 text-left text-base font-medium transition-colors focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none"
            aria-expanded={isOpen}
          >
            <span className="flex h-5 w-5 shrink-0 items-center justify-center text-slate-300 [&>svg]:h-5 [&>svg]:w-5">
              <IconTeam className="text-slate-300" />
            </span>
            <span className="flex-1 truncate">팀 선택</span>
            <span
              className={cn('shrink-0 transition-transform duration-200', !isOpen && 'rotate-180')}
            >
              <IconArrowDown />
            </span>
          </button>
          {isOpen &&
            teamItems.map(({ id, label }) => (
              <TeamSidebarRow
                key={id}
                id={id}
                label={label}
                isSelected={selectedTeamId === id}
                expanded={expanded}
                onSelect={onSelect}
              />
            ))}
        </>
      ) : (
        teamItems.map(({ id, label }) => (
          <TeamSidebarRow
            key={id}
            id={id}
            label={label}
            isSelected={selectedTeamId === id}
            expanded={false}
            onSelect={onSelect}
          />
        ))
      )}
    </>
  );
}

// ==========================================
// 메인 레이아웃 컴포넌트
// ==========================================
export function AppSidebar({
  selectedTeamId = null,
  onTeamSelect,
  footer,
  teams,
  isLoggedIn = false,
  mobileDrawer = false,
  onClose,
  onLoginClick,
}: AppSidebarProps) {
  const router = useRouter();
  const [isExpanded, setIsExpanded] = useState(true);
  const [isTeamListOpen, setIsTeamListOpen] = useState(true);
  const teamItems = useSidebarTeamItems({ teams, isLoggedIn });

  useEffect(() => {
    const savedState = localStorage.getItem('coworkers_team_list_open');
    if (savedState !== null) {
      setIsTeamListOpen(savedState === 'true');
    }
  }, []);

  const handleToggle = useCallback(() => setIsExpanded((v) => !v), []);
  const handleTeamListToggle = useCallback(() => {
    setIsTeamListOpen((prev) => {
      const nextState = !prev;
      localStorage.setItem('coworkers_team_list_open', String(nextState));
      return nextState;
    });
  }, []);
  const handleTeamSelect = useCallback((id: string) => onTeamSelect?.(id), [onTeamSelect]);
  const expanded = mobileDrawer ? true : isExpanded;
  const isRouteActive = (path: string, exact = true) =>
    exact ? router.pathname === path : router.pathname.startsWith(path);

  return (
    <div className="border-background-tertiary bg-background-primary relative z-50 h-full shrink-0 overflow-visible border-r [&_a]:cursor-pointer [&_button]:cursor-pointer [&_button:disabled]:cursor-not-allowed">
      <Sidebar
        isExpanded={expanded}
        onToggle={mobileDrawer ? drawerToggleNoop : handleToggle}
        footer={
          footer ??
          (isLoggedIn ? (
            <AuthenticatedFooter isExpanded={expanded} />
          ) : (
            <UnauthenticatedFooter
              isExpanded={expanded}
              mobileDrawer={mobileDrawer}
              onLoginClick={onLoginClick}
            />
          ))
        }
        className={cn('overflow-visible!', mobileDrawer ? 'h-full' : undefined)}
      >
        <SidebarHeader
          isExpanded={expanded}
          onToggle={mobileDrawer ? (onClose ?? drawerToggleNoop) : handleToggle}
          showToggle={expanded}
          toggleButton={
            mobileDrawer ? (
              <IconClose className="text-slate-300" />
            ) : expanded ? (
              <IconFoldLeft className="text-slate-300" />
            ) : undefined
          }
          logo={
            mobileDrawer ? (
              <span className="flex-1" />
            ) : (
              <Link href={ROUTES.FREE_BOARD} aria-label="홈으로 이동">
                {expanded ? (
                  <Image
                    src={logoLg}
                    alt="COWORKERS"
                    width={180}
                    height={32}
                    sizes="180px"
                    className="h-8 w-auto shrink-0 object-contain object-left"
                    style={{ width: 'auto', height: '2rem' }}
                  />
                ) : (
                  <span className="text-brand-primary flex items-center justify-center">
                    <IconLogo />
                  </span>
                )}
              </Link>
            )
          }
        />

        <SidebarContent>
          <nav className="flex flex-col gap-2 px-2">
            <MainNavItems
              expanded={expanded}
              isLoggedIn={isLoggedIn}
              isRouteActive={isRouteActive}
            />
            {isLoggedIn && (
              <TeamListSection
                expanded={expanded}
                isOpen={isTeamListOpen}
                teamItems={teamItems}
                selectedTeamId={selectedTeamId}
                onToggle={handleTeamListToggle}
                onSelect={handleTeamSelect}
              />
            )}
          </nav>
        </SidebarContent>
      </Sidebar>

      {!mobileDrawer && !isExpanded && (
        <button
          type="button"
          onClick={handleToggle}
          className="bg-background-primary text-txt-default hover:bg-background-tertiary hover:text-txt-primary focus-visible:ring-brand-primary border-background-tertiary absolute top-7 right-0 z-10 flex h-8 w-8 translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border shadow-sm focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none"
          aria-label="사이드바 열기"
          aria-expanded={false}
        >
          <IconFoldRight className="h-6 w-6 text-slate-300" />
        </button>
      )}
    </div>
  );
}

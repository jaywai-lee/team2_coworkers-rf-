import Head from 'next/head';
import type { TeamDashboardViewModel } from '@/features/group/hooks/useTeamDashboard';
import { TeamDashboardApiLoading } from './TeamDashboardApiLoading';

type FallbackVm = Exclude<TeamDashboardViewModel, { phase: 'ready' }>;

type Props = {
  vm: FallbackVm;
};

export function TeamDashboardFallbackView({ vm }: Props) {
  if (vm.phase === 'router_loading') {
    return <div></div>;
  }

  if (vm.phase === 'invalid_route') {
    return (
      <div className="text-txt-secondary flex min-h-[50vh] flex-1 items-center justify-center text-sm">
        올바른 팀 주소가 아닙니다. 사이드바에서 팀을 선택해 주세요.
      </div>
    );
  }

  if (vm.phase === 'group_loading') {
    return (
      <>
        <Head>
          <title>팀 | Coworkers</title>
          <meta name="description" content="팀 대시보드" />
        </Head>
        <TeamDashboardApiLoading />
      </>
    );
  }

  return (
    <>
      <Head>
        <title>팀 | Coworkers</title>
        <meta name="description" content="팀 대시보드" />
      </Head>
      <div className="text-txt-secondary flex min-h-full flex-1 items-center justify-center text-sm">
        팀 정보를 불러오지 못했습니다.
      </div>
    </>
  );
}

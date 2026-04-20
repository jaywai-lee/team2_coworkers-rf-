import type { TeamDashboardViewModel } from '@/features/group/hooks/useTeamDashboard';
import { TeamDashboardReadyView } from './TeamDashboardReadyView';
import { TeamDashboardFallbackView } from './TeamDashboardFallbackView';

type Props = {
  vm: TeamDashboardViewModel;
};

export function TeamDashboardView({ vm }: Props) {
  return vm.phase === 'ready' ? (
    <TeamDashboardReadyView vm={vm} />
  ) : (
    <TeamDashboardFallbackView vm={vm} />
  );
}

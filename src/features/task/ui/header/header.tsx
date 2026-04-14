import { cn } from '@/shared/lib/cn';
import { ReactNode } from 'react';
import Breadcrumb from './breadcrumb';
import { useTaskParams } from '../../lib/useTaskParams';
import { useGroupQuery } from '@/features/group';
import { Skeleton } from '@/shared/ui/skeleton/Skeleton';
import { teamDashboardPath } from '@/shared/constants/routes';

type Props = {
  right?: ReactNode;
  className?: string;
};

export default function Header({ right, className }: Props) {
  const { groupId, taskListId } = useTaskParams();

  const { data: group, isLoading: isGroupLoading } = useGroupQuery(groupId);
  if (isGroupLoading) {
    return <Skeleton className="h-14 w-full rounded-xl md:h-16" />;
  }

  const teamHref = teamDashboardPath(String(groupId));
  const taskListTitle = group?.taskLists?.find((l) => l.id === taskListId)?.title ?? '할일 리스트';
  const breadcrumbItems = [{ label: group?.name ?? '', href: teamHref }, { label: taskListTitle }];

  return (
    <header
      className={cn(
        'bg-background-primary flex w-full items-center justify-between rounded-xl px-4 py-3 md:px-6 md:py-4',
        className,
      )}
    >
      <div className="flex min-w-0 items-center gap-2">
        <Breadcrumb items={breadcrumbItems} />
      </div>
      <div className="flex items-center gap-2">{right}</div>
    </header>
  );
}

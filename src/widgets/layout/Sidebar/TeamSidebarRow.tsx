import { IconTeam } from '@/shared/ui/icons';
import { SidebarNavItem } from '@/shared/ui/Sidebar';
import { memo, useCallback } from 'react';

interface TeamSidebarRowProps {
  id: string;
  label: string;
  isSelected: boolean;
  expanded: boolean;
  onSelect: (id: string) => void;
}

export const TeamSidebarRow = memo(function TeamSidebarRow({
  id,
  label,
  isSelected,
  expanded,
  onSelect,
}: TeamSidebarRowProps) {
  const handleClick = useCallback(() => {
    onSelect(id);
  }, [id, onSelect]);

  return (
    <SidebarNavItem
      label={label}
      isSelected={isSelected}
      isExpanded={expanded}
      onClick={handleClick}
      icon={<IconTeam />}
    />
  );
});

import Link from 'next/link';
import { memo } from 'react';
import { cn } from '@/shared/lib/cn';
import { useSidebarContext } from './SidebarContext';

export interface SidebarNavItemProps {
  label: string;
  icon?: React.ReactNode;
  isSelected?: boolean;
  onClick?: () => void;
  href?: string;
  isExpanded?: boolean;
  className?: string;
}

function SidebarNavItemInner({
  label,
  icon,
  isSelected = false,
  onClick,
  href,
  isExpanded: isExpandedProp,
  className,
}: SidebarNavItemProps) {
  const context = useSidebarContext();
  const isExpanded = isExpandedProp ?? context?.isExpanded ?? true;
  const isCollapsed = !isExpanded;

  const content = (
    <>
      {icon != null && (
        <span
          className={cn(
            'flex h-5 w-5 shrink-0 items-center justify-center transition-colors duration-200 [&>svg]:h-5 [&>svg]:w-5',
            isSelected ? 'text-brand-primary' : 'text-slate-300 group-hover:text-inherit',
          )}
        >
          {icon}
        </span>
      )}
      {isCollapsed ? (
        <span className="sr-only">{label}</span>
      ) : (
        <span className="truncate">{label}</span>
      )}
    </>
  );

  const itemClass = cn(
    'group flex items-center gap-2 w-full min-h-[52px] rounded-lg text-left text-base font-medium transition-colors',
    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary focus-visible:ring-offset-2',
    isCollapsed ? 'mx-auto w-10 justify-center px-0' : 'px-3',
    isSelected
      ? 'bg-[var(--color-brand-secondary)] text-brand-primary'
      : 'text-txt-secondary hover:bg-background-tertiary hover:text-txt-primary',
    className,
  );

  if (href != null) {
    return (
      <Link href={href} className={itemClass} aria-current={isSelected ? 'page' : undefined}>
        {content}
      </Link>
    );
  }

  return (
    <button
      type="button"
      onClick={onClick}
      className={itemClass}
      aria-current={isSelected ? 'true' : undefined}
    >
      {content}
    </button>
  );
}

export const SidebarNavItem = memo(SidebarNavItemInner);
SidebarNavItem.displayName = 'SidebarNavItem';

import { cn } from '@/shared/lib/cn';
import { useSidebarContext } from './SidebarContext';

export interface SidebarHeaderProps {
  logo?: React.ReactNode;
  toggleButton?: React.ReactNode;
  isExpanded?: boolean;
  onToggle?: () => void;
  showToggle?: boolean;
  className?: string;
}

function SidebarCollapseIcon() {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
    >
      <path
        d="M15 18l-6-6 6-6"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function SidebarExpandIcon() {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
    >
      <rect x="3" y="6" width="18" height="2" rx="1" fill="currentColor" />
      <rect x="3" y="11" width="18" height="2" rx="1" fill="currentColor" />
      <rect x="3" y="16" width="18" height="2" rx="1" fill="currentColor" />
    </svg>
  );
}

export function SidebarHeader({
  logo,
  toggleButton,
  isExpanded: isExpandedProp,
  onToggle: onToggleProp,
  showToggle = true,
  className,
}: SidebarHeaderProps) {
  const context = useSidebarContext();
  const isExpanded = isExpandedProp ?? context?.isExpanded ?? true;
  const onToggle = onToggleProp ?? context?.onToggle ?? (() => {});
  const ariaControls = context?.sidebarId ? { 'aria-controls': context.sidebarId } : {};

  const toggleBtnClass = cn(
    'shrink-0 flex items-center justify-center w-10 h-10 rounded-lg text-txt-default transition-colors',
    'hover:bg-background-tertiary hover:text-txt-primary',
    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary focus-visible:ring-offset-2',
  );

  return (
    <header
      className={cn(
        'flex h-14 shrink-0 items-center justify-between gap-2 border-b border-[var(--color-border-primary)] px-3',
        className,
      )}
    >
      <div
        className={cn('flex min-w-0 flex-1 items-center gap-2', !showToggle && 'justify-center')}
      >
        {logo != null && (
          <div className="flex shrink-0 items-center justify-center overflow-hidden">{logo}</div>
        )}
      </div>

      {showToggle && (
        <button
          type="button"
          onClick={onToggle}
          className={toggleBtnClass}
          aria-label={isExpanded ? '사이드바 접기' : '사이드바 열기'}
          aria-expanded={isExpanded}
          {...ariaControls}
        >
          {toggleButton ?? (isExpanded ? <SidebarCollapseIcon /> : <SidebarExpandIcon />)}
        </button>
      )}
    </header>
  );
}

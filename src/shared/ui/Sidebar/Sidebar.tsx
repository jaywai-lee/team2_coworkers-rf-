import { useId } from 'react';
import { cn } from '@/shared/lib/cn';
import { useSidebarStore } from '@/shared/store/sidebarStore';
import { SidebarContext } from './SidebarContext';

export interface SidebarProps {
  isExpanded?: boolean;
  onToggle?: () => void;
  id?: string;
  collapsedWidth?: number;
  expandedWidth?: number;
  children: React.ReactNode;
  footer?: React.ReactNode;
  className?: string;
}

const DEFAULT_COLLAPSED_WIDTH = 64;
const DEFAULT_EXPANDED_WIDTH = 270;

export function Sidebar({
  isExpanded: isExpandedProp,
  onToggle: onToggleProp,
  id: idProp,
  collapsedWidth = DEFAULT_COLLAPSED_WIDTH,
  expandedWidth = DEFAULT_EXPANDED_WIDTH,
  children,
  footer,
  className,
}: SidebarProps) {
  const generatedId = useId();
  const sidebarId = idProp ?? generatedId;

  const { isExpanded: storeExpanded, toggle: storeToggle } = useSidebarStore();
  const isExpanded = isExpandedProp ?? storeExpanded;
  const onToggle = onToggleProp ?? storeToggle;

  const width = isExpanded ? expandedWidth : collapsedWidth;

  return (
    <SidebarContext.Provider value={{ isExpanded, onToggle, sidebarId }}>
      <aside
        id={sidebarId}
        role="navigation"
        aria-label="사이드바"
        style={{ width, flexShrink: 0, boxSizing: 'border-box' }}
        className={cn(
          'bg-background-primary border-background-tertiary flex h-full flex-col overflow-hidden border-r transition-[width] duration-200 ease-out motion-reduce:transition-none',
          className,
        )}
      >
        <div className="flex min-h-0 flex-1 flex-col overflow-hidden">{children}</div>
        {footer != null && (
          <div className="shrink-0 border-t border-[var(--color-background-tertiary)]">
            {footer}
          </div>
        )}
      </aside>
    </SidebarContext.Provider>
  );
}

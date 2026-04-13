import { cn } from '@/shared/lib/cn';

export interface SidebarContentProps {
  children: React.ReactNode;
  className?: string;
}

export function SidebarContent({ children, className }: SidebarContentProps) {
  return (
    <div className={cn('no-scrollbar flex-1 overflow-x-hidden overflow-y-auto py-2', className)}>
      {children}
    </div>
  );
}

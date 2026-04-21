import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { cn } from '@/shared/lib/cn';
import Dropdown, { DropdownMenuAlign } from '@/shared/ui/dropdown';

/** 사이드바 스타일이 적용된 드롭다운 메뉴. <Dropdown> 안에서 Dropdown.Menu 대신 사용 */
export function SidebarDropdownMenu({
  children,
  className,
  align = 'top-right',
  ...props
}: {
  children: React.ReactNode;
  className?: string;
  align?: DropdownMenuAlign;
}) {
  return (
    <Dropdown.Menu
      align={align}
      className={cn(
        'bg-background-primary border-border-primary z-[9999] min-w-[200px] rounded-lg border py-2 shadow-md',
        className,
      )}
      {...props}
    >
      {children}
    </Dropdown.Menu>
  );
}

/** 사이드바 스타일이 적용된 드롭다운 아이템. <Dropdown> 안에서 Dropdown.Item 대신 사용 */
export function SidebarDropdownItem({
  children,
  icon,
  isSelected = false,
  className,
  href,
  onClick,
  ...props
}: React.ComponentProps<typeof Dropdown.Item> & {
  icon?: React.ReactNode;
  isSelected?: boolean;
  href?: string;
}) {
  const router = useRouter();

  useEffect(() => {
    if (href) router.prefetch(href);
  }, [href, router]);

  const baseClass =
    'flex items-center gap-2 w-full min-h-[52px] px-3 rounded-lg text-left text-base font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary focus-visible:ring-offset-2 cursor-pointer';
  const stateClass = isSelected
    ? 'bg-[var(--color-brand-secondary)] text-brand-primary'
    : 'text-txt-secondary hover:bg-background-tertiary hover:text-txt-primary';

  const handleClick = (e: any) => {
    if (href) router.push(href);
    onClick?.(e);
  };

  return (
    <Dropdown.Item
      align="left"
      className={cn(baseClass, stateClass, className)}
      onClick={handleClick}
      {...props}
    >
      {icon != null && (
        <span className="flex h-5 w-5 shrink-0 items-center justify-center text-inherit [&>svg]:h-5 [&>svg]:w-5">
          {icon}
        </span>
      )}
      <span className="truncate">{children}</span>
    </Dropdown.Item>
  );
}

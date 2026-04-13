import { cn } from '@/shared/lib/cn';
import { defaultProfileBgClass, defaultProfileImgSrc } from './constants';
import { SidebarFooter } from '@/shared/ui/Sidebar';

interface UnauthenticatedFooterProps {
  isExpanded: boolean;
  mobileDrawer?: boolean;
  onLoginClick?: () => void;
}

export function UnauthenticatedFooter({
  isExpanded,
  mobileDrawer = false,
  onLoginClick,
}: UnauthenticatedFooterProps) {
  const showProfileImage = isExpanded && !mobileDrawer;

  return (
    <SidebarFooter className="py-4">
      <button
        type="button"
        onClick={onLoginClick}
        className="flex w-full cursor-pointer items-center gap-3 rounded-lg text-left focus-visible:outline-none"
      >
        {showProfileImage && (
          <span
            className={cn(
              'flex h-10 w-10 shrink-0 items-center justify-center',
              defaultProfileBgClass,
            )}
            aria-hidden
          >
            <img src={defaultProfileImgSrc} alt="" className="h-full w-full object-contain" />
          </span>
        )}
        {mobileDrawer ? (
          <span className="text-txt-primary border-brand-primary min-w-0 flex-1 rounded-lg py-2 text-center text-sm font-medium transition-colors focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none">
            로그인
          </span>
        ) : (
          <span
            className={cn(
              'text-txt-primary py-2 text-sm font-medium',
              !isExpanded && 'min-w-0 flex-1 text-center',
            )}
          >
            로그인
          </span>
        )}
      </button>
    </SidebarFooter>
  );
}

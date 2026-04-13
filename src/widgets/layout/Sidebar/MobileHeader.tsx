import { useRouter } from 'next/router';
import Dropdown from '@/shared/ui/dropdown';
import { SidebarDropdownMenu, SidebarDropdownItem } from './SidebarDropdown';
import { useSignOut } from '@/features/auth/hooks/useSignOut';
import { useUserQuery } from '@/features/user/hooks/useUserQuery';
import { cn } from '@/shared/lib/cn';
import { Profile } from '@/shared/ui/profile';
import { defaultProfileImgSrc } from './constants';
import { IconHamburger, IconLogo } from '@/shared/ui/icons';

interface MobileHeaderProps {
  onMenuClick: () => void;
  isLoggedIn?: boolean;
  onLoginClick?: () => void;
  className?: string;
}

export function MobileHeader({
  onMenuClick,
  isLoggedIn = true,
  onLoginClick,
  className,
}: MobileHeaderProps) {
  const router = useRouter();
  const { mutate: signOut } = useSignOut();

  const { data: user } = useUserQuery();
  const profileImage = user?.profileImage;

  return (
    <header
      className={cn(
        'bg-background-primary border-background-tertiary sticky top-0 z-30 flex h-14 shrink-0 items-center gap-2 border-b px-3',
        className,
      )}
    >
      <button
        type="button"
        onClick={onMenuClick}
        className="text-txt-default hover:bg-background-tertiary hover:text-txt-primary focus-visible:ring-brand-primary flex h-10 w-10 shrink-0 cursor-pointer items-center justify-center rounded-lg focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none"
        aria-label="메뉴 열기"
      >
        <IconHamburger className="text-slate-300" />
      </button>
      <span
        className="text-brand-primary flex h-8 w-8 shrink-0 items-center justify-center"
        aria-hidden
      >
        <IconLogo />
      </span>
      <div className="min-w-0 flex-1" aria-hidden />
      {isLoggedIn ? (
        <Dropdown>
          <Dropdown.Trigger className="inline-flex h-8 w-8 shrink-0 items-center justify-center p-0 leading-none">
            <Profile
              size="md"
              imageSrc={profileImage ?? defaultProfileImgSrc}
              ariaLabel="프로필"
              className="bg-background-tertiary"
            />
          </Dropdown.Trigger>

          <SidebarDropdownMenu
            align="right"
            className="border-background-tertiary top-full mt-2 w-auto min-w-0 overflow-hidden rounded-xl py-0"
          >
            <SidebarDropdownItem
              onClick={() => router.push('/myhistory')}
              className="h-10 min-h-10 w-full justify-center rounded-none px-4.5 py-3 text-[13px] whitespace-nowrap"
            >
              마이 히스토리
            </SidebarDropdownItem>

            <SidebarDropdownItem
              onClick={() => router.push('/mypage')}
              className="h-10 min-h-10 w-full justify-center rounded-none px-4.5 py-3 text-[13px] whitespace-nowrap"
            >
              계정 설정
            </SidebarDropdownItem>

            <SidebarDropdownItem
              onClick={() => {
                signOut(undefined, {
                  onSuccess: () => {
                    router.push('/');
                  },
                });
              }}
              className="h-10 min-h-10 w-full justify-center rounded-none px-4.5 py-3 text-[13px] whitespace-nowrap"
            >
              로그아웃
            </SidebarDropdownItem>
          </SidebarDropdownMenu>
        </Dropdown>
      ) : (
        <button
          type="button"
          onClick={onLoginClick}
          className="text-txt-primary cursor-pointer rounded-lg px-3 py-2 text-sm font-medium transition-colors hover:opacity-70 focus-visible:outline-none"
        >
          로그인
        </button>
      )}
    </header>
  );
}

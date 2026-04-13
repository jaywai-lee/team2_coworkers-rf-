import { useSignOut } from '@/features/auth/hooks/useSignOut';
import { useUserQuery } from '@/features/user';
import { defaultProfileImgSrc } from './constants';
import { SidebarFooter } from '@/shared/ui/Sidebar';
import Dropdown from '@/shared/ui/dropdown';
import { MemberChip, Profile } from '@/shared/ui/profile';
import { SidebarDropdownItem, SidebarDropdownMenu } from './SidebarDropdown';

interface AuthenticatedFooterProps {
  isExpanded: boolean;
}

export function AuthenticatedFooter({ isExpanded }: AuthenticatedFooterProps) {
  const { data: user, isLoading } = useUserQuery();
  const { mutate: signOut } = useSignOut();

  if (isLoading || !user) {
    return (
      <SidebarFooter className="overflow-visible!">
        {isExpanded ? (
          <div className="flex w-full items-center gap-3 p-2">
            <div className="h-10 w-10 shrink-0 animate-pulse rounded-xl bg-slate-200" />
            <div className="flex flex-1 flex-col gap-1">
              <div className="h-4 w-20 animate-pulse rounded bg-slate-200" />
              <div className="h-3 w-32 animate-pulse rounded bg-slate-200" />
            </div>
          </div>
        ) : (
          <div className="mx-auto h-10 w-10 animate-pulse rounded-xl bg-slate-200" />
        )}
      </SidebarFooter>
    );
  }

  const profileImage = user?.profileImage ?? defaultProfileImgSrc;
  const displayName = user?.name?.trim() || '사용자';
  const displayEmail = user?.email ?? '';

  return (
    <SidebarFooter className="overflow-visible!">
      <Dropdown>
        <Dropdown.Trigger className="w-full text-left">
          {isExpanded ? (
            <MemberChip
              imageSrc={profileImage ?? defaultProfileImgSrc}
              name={displayName}
              email={displayEmail || undefined}
              size="lg"
              avatarClassName="bg-background-tertiary"
            />
          ) : (
            <Profile
              size="lg"
              imageSrc={profileImage ?? defaultProfileImgSrc}
              ariaLabel={`${displayName} 프로필`}
              className="bg-background-tertiary"
            />
          )}
        </Dropdown.Trigger>

        <SidebarDropdownMenu
          align="left"
          className="border-background-tertiary bottom-full z-[100] mb-2 w-21.5 min-w-0 overflow-hidden rounded-xl py-0"
        >
          <SidebarDropdownItem
            href="/mypage"
            className="min-h-10 justify-center rounded-none px-2 text-[13px]"
          >
            계정 설정
          </SidebarDropdownItem>
          <SidebarDropdownItem
            onClick={() => signOut()}
            className="min-h-10 justify-center rounded-none px-2 text-[13px]"
          >
            로그아웃
          </SidebarDropdownItem>
        </SidebarDropdownMenu>
      </Dropdown>
    </SidebarFooter>
  );
}

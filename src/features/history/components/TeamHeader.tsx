import { cn } from '@/shared/lib/cn';
import decorationImg from '@/shared/assets/images/decoration.png';
import { IconArrowRight } from '@/shared/ui/icons/IconArrowRight';
// import Dropdown from '@/shared/ui/dropdown';

interface TeamHeaderProps {
  selectedCategory: string | null;
  onResetCategory: () => void;
  // currentGroupId: string; 임시 주석 처리
  //  onGroupChange: (groupId: string) => void; 임시 주석 처리
}

export function TeamHeader({
  selectedCategory,
  onResetCategory,
  // currentGroupId,
  // onGroupChange,
}: TeamHeaderProps) {
  /* TODO: 백엔드 API에서 groupId 필터링 반영 된다면 주석 해제 예정
  const activeMembership = user?.memberships?.find((m) => String(m.group.id) === currentGroupId);

  const hasTeam = user?.memberships && user.memberships.length > 0;
  const teamName = isLoading
    ? '정보를 불러오는 중...'
    : hasTeam && activeMembership
      ? activeMembership.group.name
      : '정보를 불러오는 중...';*/

  return (
    <header
      className={cn(
        'relative z-30 flex w-full items-center justify-between overflow-visible',
        'max-w-85.75 md:max-w-155 xl:max-w-280',
        'mx-auto h-14 bg-transparent md:h-16 xl:mx-0',
        'xl:bg-background-primary xl:h-16 xl:px-6.5',
        'xl:border-border-primary xl:rounded-xl xl:border xl:shadow-sm',
      )}
    >
      <section className="relative z-40 flex min-w-0 items-center gap-2 text-[16px] font-bold md:text-[24px]">
        <button
          onClick={onResetCategory}
          className={cn(
            'cursor-pointer truncate text-[16px] font-bold transition-all duration-200 md:text-2xl',
          )}
        >
          마이 히스토리
        </button>
        {/*
        {hasTeam ? (
          <Dropdown>
            <Dropdown.Trigger className="text-txt-primary hover:text-brand-primary truncate text-[16px] font-bold transition-colors md:text-[20px]">
              {teamName}
            </Dropdown.Trigger>

            <Dropdown.Menu align="left" className="z-[100] mt-4 w-[200px]">
              {user.memberships.map((m) => (
                <Dropdown.Item
                  key={m.group.id}
                  align="left"
                  onClick={() => onGroupChange(String(m.group.id))}
                  className={cn(
                    String(m.group.id) === currentGroupId &&
                      'bg-brand-secondary text-brand-primary font-bold',
                  )}
                >
                  {m.group.name}
                </Dropdown.Item>
              ))}
            </Dropdown.Menu>
          </Dropdown>
        ) : (
          <button
            disabled
            className="text-shadow-txt-default cursor-default truncate text-[16px] font-bold transition-colors md:text-[20px]"
          >
            참여 중인 팀이 없습니다
          </button>
        )}
          */}

        {selectedCategory && (
          <>
            <span className="text-txt-tertiary text-[16px] font-bold md:text-[20px]">
              <IconArrowRight className="h-4 w-4 md:h-6 md:w-6" />
            </span>
            <span className="text-brand-primary cursor-default truncate text-[16px] font-bold md:text-[20px]">
              {selectedCategory}
            </span>
          </>
        )}
      </section>

      <div
        className={cn(
          'pointer-events-none absolute top-0 right-17 z-0 hidden h-full w-75 bg-[#a6c4ff] xl:block',
        )}
        style={{
          WebkitMaskImage: `url(${decorationImg.src})`,
          WebkitMaskSize: 'cover',
          WebkitMaskPosition: 'right center',
          maskImage: `url(${decorationImg.src})`,
          maskSize: 'cover',
          maskPosition: 'right center',
        }}
      />
    </header>
  );
}

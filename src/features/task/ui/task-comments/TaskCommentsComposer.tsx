import { Button } from '@/shared/ui/Button/Button';
import { IconCommentBtn } from '@/shared/ui/icons/IconCommentBtn';
import { Input } from '@/shared/ui/input/Input';
import { Profile } from '@/shared/ui/profile';
import { cn } from '@/shared/lib/cn';

type Props = {
  draft: string;
  onDraftChange: (value: string) => void;
  onSubmit: () => void;
  disabled: boolean;
  profileImageSrc?: string | null;
};

export function TaskCommentsComposer({
  draft,
  onDraftChange,
  onSubmit,
  disabled,
  profileImageSrc,
}: Props) {
  const canSubmit = Boolean(draft.trim()) && !disabled;

  return (
    <div className="mt-3 flex items-start gap-2">
      <div className="mt-1 shrink-0">
        <Profile size="md" imageSrc={profileImageSrc ?? undefined} decorative alt="내 프로필" />
      </div>
      <div className="min-w-0 flex-1">
        <Input
          placeholder="댓글을 달아주세요"
          value={draft}
          onChange={(e) => onDraftChange(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.nativeEvent.isComposing) {
              e.preventDefault();
              if (!canSubmit) return;
              onSubmit();
            }
          }}
          className="text-txt-default text-md font-weight-regular border-background-tertiary rounded-none border-x-0 border-t border-b"
          rightElement={
            <Button
              type="button"
              variant="ghost"
              aria-label="댓글 등록"
              disabled={!canSubmit}
              onClick={(e) => {
                e.stopPropagation();
                if (!canSubmit) return;
                onSubmit();
              }}
              className={cn(
                'h-6 w-6 shrink-0 rounded-full border-0 p-0',
                canSubmit
                  ? 'bg-primary cursor-pointer hover:opacity-90'
                  : 'bg-interaction-inactive cursor-not-allowed opacity-70',
              )}
            >
              <IconCommentBtn
                className={cn(
                  'rounded-full',
                  canSubmit ? 'bg-icon-primary text-white' : 'text-white/80',
                )}
                size={24}
              />
            </Button>
          }
        />
      </div>
    </div>
  );
}

import { formatDistanceToNow } from 'date-fns';
import { ko } from 'date-fns/locale';
import { Button } from '@/shared/ui/Button/Button';
import Dropdown from '@/shared/ui/dropdown';
import { IconKebab } from '@/shared/ui/icons/IconKebab';
import { InputBox } from '@/shared/ui/input/InputBox';
import { Profile } from '@/shared/ui/profile';
import type { TaskComment } from '../../model/entities/taskComment.model';

function formatCommentTime(date: Date) {
  return formatDistanceToNow(date, { addSuffix: true, locale: ko });
}

export type TaskCommentRowProps = {
  comment: TaskComment;
  isOwner: boolean;
  isEditing: boolean;
  editDraft: string;
  onEditDraftChange: (v: string) => void;
  onStartEdit: () => void;
  onCancelEdit: () => void;
  onSaveEdit: () => void;
  onDelete: () => void;
  isMutating: boolean;
};

export function TaskCommentRow({
  comment,
  isOwner,
  isEditing,
  editDraft,
  onEditDraftChange,
  onStartEdit,
  onCancelEdit,
  onSaveEdit,
  onDelete,
  isMutating,
}: TaskCommentRowProps) {
  return (
    <div className="border-background-tertiary border-b py-4 last:border-b-0">
      <div className="flex gap-2">
        <Profile
          size="md"
          imageSrc={comment.user.imageUrl}
          decorative
          alt={`${comment.user.nickname} 프로필`}
        />
        <div className="min-w-0 flex-1">
          <div className="relative flex items-start justify-between gap-2">
            <p className="text-txt-primary text-sm font-semibold">{comment.user.nickname}</p>
            {isOwner && !isEditing && (
              <Dropdown>
                <Dropdown.Trigger
                  onClick={(e) => e.stopPropagation()}
                  className="text-[#CBD5E1] hover:opacity-80"
                  aria-label="댓글 메뉴"
                >
                  <IconKebab size={20} />
                </Dropdown.Trigger>
                <Dropdown.Menu className="absolute right-0 z-[100] mt-1 w-28">
                  <Dropdown.Item onClick={onStartEdit} className="px-3 py-2">
                    수정하기
                  </Dropdown.Item>
                  <Dropdown.Item onClick={onDelete} className="px-3 py-2">
                    삭제하기
                  </Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
            )}
          </div>

          {isEditing ? (
            <div className="mt-2 space-y-2">
              <InputBox
                value={editDraft}
                onChange={(e) => onEditDraftChange(e.target.value)}
                className="border-background-tertiary text-txt-primary focus:ring-brand-primary min-h-[100px] w-full resize-y rounded-lg border px-3 py-2 text-sm outline-none focus:ring-2"
                disabled={isMutating}
              />
              <div className="flex justify-end gap-2">
                <Button
                  type="button"
                  variant="ghost"
                  onClick={onCancelEdit}
                  className="text-txt-default hover:text-txt-primary text-md border-none"
                  disabled={isMutating}
                >
                  취소
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="text-md"
                  disabled={isMutating || !editDraft.trim()}
                  onClick={onSaveEdit}
                >
                  수정하기
                </Button>
              </div>
            </div>
          ) : (
            <>
              <p className="text-txt-primary mt-1 text-sm leading-relaxed whitespace-pre-wrap">
                {comment.content}
              </p>
              <p className="text-txt-default mt-2 text-xs">
                {formatCommentTime(comment.createdAt)}
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

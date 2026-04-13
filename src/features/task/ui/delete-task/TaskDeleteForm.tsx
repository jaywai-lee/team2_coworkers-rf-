import { Button } from '@/shared/ui/Button/Button';
import { IconAlert } from '@/shared/ui/icons';

type Props = {
  title: string;
  onClose: () => void;
  onConfirm: () => void;
  isPending?: boolean;
};

export default function TaskDeleteForm({ title, onClose, onConfirm, isPending }: Props) {
  return (
    <div className="flex flex-col items-center text-center">
      <div className="mb-4 flex justify-center">
        <IconAlert className="text-status-danger" />
      </div>

      <h2 className="text-txt-primary text-lg font-semibold">
        '{title}' <br />할 일을 정말 삭제하시겠어요?
      </h2>
      <p className="text-txt-default mt-2 text-sm">삭제 후에는 되돌릴 수 없습니다.</p>

      <div className="mt-6 flex justify-center gap-2">
        <Button
          type="button"
          variant="secondary"
          onClick={onClose}
          disabled={isPending}
          className="h-12 w-full max-w-[136px] rounded-xl border border-[#CBD5E1] px-12 whitespace-nowrap"
        >
          닫기
        </Button>

        <Button
          type="button"
          onClick={onConfirm}
          variant="danger"
          disabled={isPending}
          className="h-12 w-full max-w-[136px] rounded-xl px-10 whitespace-nowrap"
        >
          {isPending && <span className="loading loading-spinner" />}
          삭제하기
        </Button>
      </div>
    </div>
  );
}

import { Button } from '@/shared/ui/Button/Button';
import { Modal } from '@/shared/ui/modal';

type Props = {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;

  title?: string;
  description?: string;
  confirmText?: string;
};

export function ConfirmDeleteModal({
  isOpen,
  onClose,
  onConfirm,
  title = '삭제하시겠습니까?',
  description = '삭제된 데이터는 복구할 수 없습니다.',
  confirmText = '삭제하기',
}: Props) {
  return (
    <Modal isOpen={isOpen} close={onClose}>
      <Modal.Content size="sm">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            onConfirm();
          }}
        >
          <Modal.Header className="pb-4">
            <Modal.Title>{title}</Modal.Title>
            <Modal.Description className="text-sm">{description}</Modal.Description>
          </Modal.Header>

          <Modal.Footer className="flex gap-2 pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="text-txt-secondary hover:text-txt-primary h-12 w-full rounded-xl border border-slate-300 text-sm font-semibold hover:border-slate-500!"
            >
              취소
            </Button>

            <Button
              type="submit"
              className="h-12 w-full rounded-xl bg-red-500! text-sm font-semibold text-white hover:opacity-70!"
            >
              {confirmText}
            </Button>
          </Modal.Footer>
        </form>
      </Modal.Content>
    </Modal>
  );
}

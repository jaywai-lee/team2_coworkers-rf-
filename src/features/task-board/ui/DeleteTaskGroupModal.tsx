import { Button } from '@/shared/ui/Button/Button';
import { Modal } from '@/shared/ui/modal';

type Props = {
  isOpen: boolean;
  onClose: () => void;
  onConfirmDelete: () => void;
};

export function DeleteTaskGroupModal({ isOpen, onClose, onConfirmDelete }: Props) {
  return (
    <Modal isOpen={isOpen} close={onClose}>
      <Modal.Content size="sm">
        <form
          onSubmit={(event) => {
            event.preventDefault();
            onConfirmDelete();
          }}
        >
          <Modal.Header className="pb-4">
            <Modal.Title>할 일 목록을 삭제할까요?</Modal.Title>
            <Modal.Description className="text-sm">
              삭제된 목록은 복구할 수 없습니다.
            </Modal.Description>
          </Modal.Header>
          <Modal.Footer className="pt-2">
            <Button
              variant="danger"
              type="submit"
              className="h-12 w-full rounded-xl bg-red-500 px-4 text-sm font-semibold text-white transition-opacity hover:opacity-90"
            >
              삭제하기
            </Button>
          </Modal.Footer>
        </form>
      </Modal.Content>
    </Modal>
  );
}

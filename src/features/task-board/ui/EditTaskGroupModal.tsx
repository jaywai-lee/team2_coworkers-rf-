import { Button } from '@/shared/ui/Button/Button';
import { Modal } from '@/shared/ui/modal';

type Props = {
  isOpen: boolean;
  onClose: () => void;
  editedTitle: string;
  onEditedTitleChange: (value: string) => void;
  onConfirmEdit: () => void;
};

export function EditTaskGroupModal({
  isOpen,
  onClose,
  editedTitle,
  onEditedTitleChange,
  onConfirmEdit,
}: Props) {
  return (
    <Modal isOpen={isOpen} close={onClose}>
      <Modal.Content className="px-5">
        <Modal.Header className="pt-12 pb-2">
          <Modal.Title className="text-lg">할 일 목록 수정</Modal.Title>
        </Modal.Header>
        <form
          onSubmit={(event) => {
            event.preventDefault();
            onConfirmEdit();
          }}
        >
          <Modal.Body>
            <input
              value={editedTitle}
              onChange={(event) => onEditedTitleChange(event.target.value)}
              placeholder="목록 명을 입력해주세요."
              className="border-background-tertiary focus:border-brand-primary h-12 w-full rounded-xl border px-4 text-sm outline-none"
              autoFocus
            />
          </Modal.Body>
          <Modal.Footer className="pt-2">
            <Button
              type="submit"
              className="bg-brand-primary h-12 w-full rounded-xl px-4 text-sm font-semibold text-white transition-opacity hover:opacity-90"
            >
              저장하기
            </Button>
          </Modal.Footer>
        </form>
      </Modal.Content>
    </Modal>
  );
}

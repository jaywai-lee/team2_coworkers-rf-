import { Modal } from '@/shared/ui/modal';
import { Button } from '@/shared/ui/Button/Button';
import { IconAlert } from '@/shared/ui/icons';

interface UnsavedChangesModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirmLeave: () => void;
}

export function UnsavedChangesModal({ isOpen, onClose, onConfirmLeave }: UnsavedChangesModalProps) {
  return (
    <Modal isOpen={isOpen} open={() => {}} close={onClose}>
      <Modal.Content size="sm" showCloseButton={false}>
        <Modal.Header className="flex flex-col items-center pt-10 pb-2 text-center">
          <IconAlert className="text-point-orange mb-4" />
          <Modal.Title className="text-txt-primary w-full text-center text-base leading-4.75 font-medium">
            저장하지 않은 변경사항이 있습니다
          </Modal.Title>
        </Modal.Header>

        <Modal.Body className="text-center">
          <Modal.Description className="text-txt-secondary text-md font-medium">
            변경된 내용이 저장되지 않았습니다.
            <br />
            저장하지 않고 이동하시겠습니까?
          </Modal.Description>
        </Modal.Body>

        <Modal.Footer className="flex gap-2 pt-6 pb-8">
          <Modal.Close asChild>
            <Button
              variant="outline"
              size="lg"
              className="active:text-txt-primary text-txt-secondary hover:text-txt-primary hover:border-txt-disabled flex-1 border-slate-200 active:border-slate-200"
              aria-label="저장하지 않은 변경사항 모달 닫기"
              onClick={onClose}
            >
              취소
            </Button>
          </Modal.Close>
          <Button
            variant="primary"
            size="lg"
            className="border-point-orange bg-point-orange flex-1 text-white hover:border-[#ea580c] hover:bg-[#ea580c]"
            onClick={onConfirmLeave}
          >
            저장하기
          </Button>
        </Modal.Footer>
      </Modal.Content>
    </Modal>
  );
}

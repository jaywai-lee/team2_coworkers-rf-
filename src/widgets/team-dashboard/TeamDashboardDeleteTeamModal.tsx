import { Button } from '@/shared/ui/Button/Button';
import { Modal } from '@/shared/ui/modal';

type Props = {
  isOpen: boolean;
  open: () => void;
  close: () => void;
  teamName: string;
  isDeleting: boolean;
  onConfirm: () => void;
};

const footerBtnBase =
  'h-12 w-full rounded-xl px-4 text-sm font-semibold transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60';

export function TeamDashboardDeleteTeamModal({
  isOpen,
  open,
  close,
  teamName,
  isDeleting,
  onConfirm,
}: Props) {
  return (
    <Modal isOpen={isOpen} open={open} close={close}>
      <Modal.Content
        size="sm"
        className="[&_button]:cursor-pointer [&_button:disabled]:cursor-not-allowed"
      >
        <Modal.Header className="pb-4">
          <Modal.Title className="text-txt-primary text-lg font-medium">
            팀을 삭제하시겠어요?
          </Modal.Title>
          <Modal.Description className="text-txt-secondary text-sm font-medium">
            {teamName} 팀이 삭제되며, 되돌릴 수 없습니다.
          </Modal.Description>
        </Modal.Header>
        <Modal.Footer className="flex gap-2 px-12">
          <Modal.Close asChild>
            <Button
              type="button"
              variant="secondary"
              disabled={isDeleting}
              className="h-12 w-full rounded-xl border border-[#CBD5E1] whitespace-nowrap"
            >
              닫기
            </Button>
          </Modal.Close>

          <Button
            type="button"
            onClick={onConfirm}
            variant="danger"
            disabled={isDeleting}
            className="h-12 w-full rounded-xl whitespace-nowrap"
          >
            {isDeleting && <span className="loading loading-spinner" />}
            삭제하기
          </Button>
        </Modal.Footer>
      </Modal.Content>
    </Modal>
  );
}

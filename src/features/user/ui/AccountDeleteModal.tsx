import { Modal, useModal } from '@/shared/ui/modal';
import { Button } from '@/shared/ui/Button/Button';
import { IconAlert, IconSecession } from '@/shared/ui/icons';
import { useDeleteUserMutation } from '../hooks/useDeleteUserMutation';

export function AccountDeleteModal() {
  const { isOpen, open, close } = useModal();
  const { mutate: deleteUser, isPending } = useDeleteUserMutation();

  const handleDelete = () => {
    deleteUser(undefined, {
      onSuccess: () => {
        close();
      },
    });
  };

  return (
    <Modal isOpen={isOpen} open={open} close={close}>
      <Modal.Trigger asChild>
        <Button
          variant="outline"
          className="text-md text-status-danger hover:text-status-danger border-none bg-transparent p-0 transition-colors hover:bg-transparent md:text-lg"
          leftIcon={<IconSecession className="h-4.5 w-4.5 md:h-6 md:w-6" />}
        >
          회원 탈퇴하기
        </Button>
      </Modal.Trigger>

      <Modal.Content size="sm" showCloseButton={false}>
        <Modal.Header className="flex flex-col items-center pt-10 pb-2 text-center">
          <IconAlert className="text-status-danger mb-4" />

          <Modal.Title className="text-txt-primary w-full text-center text-base leading-4.75 font-medium">
            회원 탈퇴를 진행하시겠어요?
          </Modal.Title>
        </Modal.Header>

        <Modal.Body className="text-center">
          <Modal.Description className="text-txt-secondary text-md font-medium">
            그룹장으로 있는 그룹은 자동으로 삭제되고,
            <br />
            모든 그룹에서 나가집니다.
          </Modal.Description>
        </Modal.Body>

        <Modal.Footer className="flex gap-2 pt-6 pb-8">
          <Modal.Close asChild>
            <Button
              variant="outline"
              size="lg"
              className="text-txt-secondary active:text-txt-primary hover:text-txt-primary hover:border-txt-disabled flex-1 border-slate-200 text-base font-semibold active:border-slate-200"
              aria-label="회원 탈퇴 모달 닫기"
            >
              닫기
            </Button>
          </Modal.Close>
          <Button
            variant="danger"
            size="lg"
            className="flex-1 text-base font-semibold"
            onClick={handleDelete}
            disabled={isPending}
          >
            {isPending ? '처리 중...' : '회원 탈퇴'}
          </Button>
        </Modal.Footer>
      </Modal.Content>
    </Modal>
  );
}

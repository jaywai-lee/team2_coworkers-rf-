import { Modal } from '../modal';
import { Button } from '../Button/Button';
import Image from 'next/image';
import { useCopyToClipboard } from '@/shared/hooks/useCopyToClipboard';

interface UserProfileModalProps {
  isOpen: boolean;
  close: () => void;
  user: {
    profileImageUrl: string;
    name: string;
    email: string;
  };
}

export function UserProfileModal({ isOpen, close, user }: UserProfileModalProps) {
  const { copyText } = useCopyToClipboard();

  const handleCopyEmail = async () => {
    await copyText(user.email, {
      successMessage: '이메일이 클립보드에 복사되었습니다.',
      errorMessage: '이메일 복사에 실패했습니다.',
      onSuccess: () => close(),
    });
  };

  return (
    <Modal isOpen={isOpen} close={close}>
      <Modal.Content size="md" className="px-2">
        <Modal.Header className="gap-1 pt-11">
          <div className="relative mb-3 h-10 w-10 overflow-hidden rounded-xl border border-gray-100 bg-gray-50">
            <Image
              src={user.profileImageUrl}
              alt={`${user.name}의 프로필`}
              fill
              className="object-cover"
              sizes="40px"
            />
          </div>
          <Modal.Title>{user.name}</Modal.Title>
          <Modal.Description>{user.email}</Modal.Description>
        </Modal.Header>

        <Modal.Footer>
          <Button
            type="button"
            variant="primary"
            size="lg"
            onClick={handleCopyEmail}
            className="w-full"
          >
            이메일 복사하기
          </Button>
        </Modal.Footer>
      </Modal.Content>
    </Modal>
  );
}

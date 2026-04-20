import { useState } from 'react';
import { getInvitationToken } from '@/features/group/api/getInvitationToken';
import { useModal } from '@/shared/ui/modal';
import { useCopyToClipboard } from '@/shared/hooks/useCopyToClipboard';

type Params = {
  groupId: number;
};

export function useGroupInviteActions({ groupId }: Params) {
  const {
    isOpen: isInviteModalOpen,
    open: openInviteModal,
    close: closeInviteModal,
  } = useModal(false);
  const { copyText } = useCopyToClipboard();

  const [isCopyingInviteLink, setIsCopyingInviteLink] = useState(false);

  const handleCopyInviteLink = async () => {
    setIsCopyingInviteLink(true);
    try {
      const invitationToken = await getInvitationToken({ groupId });
      const inviteUrl = `${window.location.origin}/accept-invitation?token=${encodeURIComponent(invitationToken)}`;

      const ok = await copyText(inviteUrl, {
        successMessage: '초대 링크가 복사되었습니다.',
        errorMessage: '초대 링크 복사에 실패했습니다.',
      });

      if (ok) closeInviteModal();
    } finally {
      setIsCopyingInviteLink(false);
    }
  };

  return {
    isInviteModalOpen,
    openInviteModal,
    closeInviteModal,
    isCopyingInviteLink,
    handleCopyInviteLink,
  };
}

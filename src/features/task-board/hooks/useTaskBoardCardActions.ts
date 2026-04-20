import { useState } from 'react';

/** 반환: false 실패, true 성공(캐시·프롭 등으로 이미 반영됨 → 로컬 setBoard 생략), undefined/void는 로컬 반영. */
type Params = {
  onUpdateTaskGroup?: (params: {
    taskGroupId: string;
    title: string;
  }) => Promise<boolean | void> | boolean | void;
  onDeleteTaskGroup?: (params: { taskGroupId: string }) => Promise<boolean | void> | boolean | void;
  setCardNameLocal: (taskGroupId: string, title: string) => void;
  removeCardLocal: (taskGroupId: string) => void;
};

export function useTaskBoardCardActions({
  onUpdateTaskGroup,
  onDeleteTaskGroup,
  setCardNameLocal,
  removeCardLocal,
}: Params) {
  const [editingCard, setEditingCard] = useState<{ taskGroupId: string; title: string } | null>(null);
  const [editedTitle, setEditedTitle] = useState('');
  const [deletingCardId, setDeletingCardId] = useState<string | null>(null);

  const openEditCardModal = (taskGroupId: string, currentTitle: string) => {
    setEditingCard({ taskGroupId, title: currentTitle });
    setEditedTitle(currentTitle);
  };

  const closeEditModal = () => setEditingCard(null);

  const handleConfirmEditCard = async () => {
    if (!editingCard) return;
    const trimmedTitle = editedTitle.trim();
    if (!trimmedTitle || trimmedTitle === editingCard.title) {
      closeEditModal();
      return;
    }

    const ok = await onUpdateTaskGroup?.({ taskGroupId: editingCard.taskGroupId, title: trimmedTitle });
    if (ok === false) return;

    if (ok !== true) {
      setCardNameLocal(editingCard.taskGroupId, trimmedTitle);
    }
    closeEditModal();
  };

  const openDeleteCardModal = (taskGroupId: string) => {
    setDeletingCardId(taskGroupId);
  };

  const handleConfirmDeleteCard = async () => {
    if (!deletingCardId) return;

    const ok = await onDeleteTaskGroup?.({ taskGroupId: deletingCardId });
    if (ok === false) return;

    if (ok !== true) {
      removeCardLocal(deletingCardId);
    }
    setDeletingCardId(null);
  };

  return {
    editingCard,
    editedTitle,
    setEditedTitle,
    setEditingCard,
    deletingCardId,
    setDeletingCardId,
    openEditCardModal,
    handleConfirmEditCard,
    openDeleteCardModal,
    handleConfirmDeleteCard,
  };
}

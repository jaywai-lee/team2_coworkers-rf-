import { CreateTaskBoardModal } from '@/features/task-board/ui/CreateTaskBoardModal';
import { useModal } from '@/shared/hooks/useModal';
import { Button } from '@/shared/ui/Button/Button';
import { UserProfileModal } from '@/shared/ui/profile/UserProfileModal';
import { toast } from 'sonner';

export default function ModalTestPage() {
  const todoModal = useModal();
  const profileModal = useModal();

  const dummyUser = {
    profileImageUrl: 'https://avatars.githubusercontent.com/u/99999998?v=4', // 테스트용 기본 이미지
    name: '우지은',
    email: 'jieunn@codeit.com',
  };

  const handleCreateTodo = (title: string) => {
    toast.success(`'${title}' 할 일 목록이 성공적으로 생성되었습니다! 🎉`);
    console.log('API로 전송할 데이터:', { title });
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-8 bg-gray-50 p-4">
      <div className="flex flex-col items-center gap-2">
        <h1 className="text-2xl font-bold text-gray-900">모달 UI 테스트</h1>
        <p className="text-gray-500">아래 버튼을 눌러 모달을 확인해 보세요.</p>
      </div>

      <div className="flex gap-4">
        <Button variant="primary" size="lg" onClick={todoModal.open}>
          할 일 목록 모달 띄우기
        </Button>
        <Button variant="outline" size="lg" onClick={profileModal.open}>
          유저 프로필 모달 띄우기
        </Button>
      </div>

      <CreateTaskBoardModal {...todoModal} onSubmit={handleCreateTodo} />

      <UserProfileModal {...profileModal} user={dummyUser} />
    </main>
  );
}

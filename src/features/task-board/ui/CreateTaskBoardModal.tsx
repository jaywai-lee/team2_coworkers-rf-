import { Button } from '@/shared/ui/Button/Button';
import { Input } from '@/shared/ui/input/Input';
import { Modal } from '@/shared/ui/modal';
import { useForm } from 'react-hook-form';

interface CreateTaskBoardModalProps {
  isOpen: boolean;
  close: () => void;
  onSubmit: (title: string) => void;
}

interface TaskBoardFormValues {
  title: string;
}

export function CreateTaskBoardModal({ isOpen, close, onSubmit }: CreateTaskBoardModalProps) {
  const { register, handleSubmit, reset } = useForm<TaskBoardFormValues>({
    defaultValues: { title: '' },
  });

  const handleFormSubmit = (data: TaskBoardFormValues) => {
    if (!data.title) return;
    onSubmit(data.title);
    reset();
    close();
  };

  return (
    <Modal isOpen={isOpen} close={close}>
      <Modal.Content className="px-5">
        <form onSubmit={handleSubmit(handleFormSubmit)} className="flex flex-col">
          <Modal.Header className="pt-12 pb-2">
            <Modal.Title className="text-lg">할 일 목록</Modal.Title>
          </Modal.Header>

          <Modal.Body>
            <Input {...register('title')} placeholder="목록 명을 입력해주세요." autoFocus />
          </Modal.Body>

          <Modal.Footer>
            <Button type="submit" variant="primary" size="lg" className="w-full">
              만들기
            </Button>
          </Modal.Footer>
        </form>
      </Modal.Content>
    </Modal>
  );
}

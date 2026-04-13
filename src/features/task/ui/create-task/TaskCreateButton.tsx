import { useState } from 'react';
import TaskCreateModal from './TaskCreateModal';
import type { TaskCommonParams } from '../../model/params/task.params';
import { Button } from '@/shared/ui/Button/Button';

type Props = {
  params: TaskCommonParams;
};

export default function TaskCreateButton({ params }: Props) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <Button
        onClick={() => setIsOpen(true)}
        variant="primary"
        className="w-full rounded-lg px-4 py-2.5 text-sm md:w-auto md:py-2"
      >
        할 일 생성
      </Button>

      <TaskCreateModal isOpen={isOpen} onClose={() => setIsOpen(false)} />
    </>
  );
}

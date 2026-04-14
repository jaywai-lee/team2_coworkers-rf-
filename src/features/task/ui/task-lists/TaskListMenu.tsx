import Dropdown from '@/shared/ui/dropdown';
import { IconKebab } from '@/shared/ui/icons';

type Props = {
  onEdit: () => void;
  onDelete: () => void;
};

export function TaskListMenu({ onEdit, onDelete }: Props) {
  return (
    <Dropdown useFixedMenu>
      <Dropdown.Trigger
        onClick={(e) => e.stopPropagation()}
        className="cursor-pointer rounded p-1 text-[#CBD5E1] hover:opacity-90"
        aria-label="할 일 목록 메뉴"
      >
        <IconKebab size={20} />
      </Dropdown.Trigger>
      <Dropdown.Menu className="w-30">
        <div className="flex w-full flex-col overflow-hidden rounded-xl bg-white shadow-md">
          <Dropdown.Item onClick={onEdit}>수정하기</Dropdown.Item>
          <Dropdown.Item onClick={onDelete}>삭제하기</Dropdown.Item>
        </div>
      </Dropdown.Menu>
    </Dropdown>
  );
}

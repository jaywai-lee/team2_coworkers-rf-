import { cn } from '@/shared/lib/cn';
import Dropdown from '@/shared/ui/dropdown';
import { IconKebab } from '@/shared/ui/icons';
import { MouseEvent, PointerEvent } from 'react';

export type kebabMenuAlign = 'left' | 'right' | 'side-left' | 'side-right';

interface KebabMenuProps {
  onEdit?: () => void;
  onDelete?: () => void;
  showEdit?: boolean;
  showDelete?: boolean;
  isDeleteDanger?: boolean;
  menuClassName?: string;
  disabled?: boolean;
  align?: kebabMenuAlign;
}

export default function KebabMenu({
  onEdit,
  onDelete,
  showEdit = true,
  showDelete = true,
  isDeleteDanger = false,
  menuClassName = 'w-28',
  disabled = false,
  align = 'right',
}: KebabMenuProps) {
  const stopPropagation = (e: MouseEvent | PointerEvent) => {
    e.stopPropagation();
  };

  return (
    <Dropdown>
      <Dropdown.Trigger
        onClick={stopPropagation}
        onPointerDown={stopPropagation}
        aria-label="메뉴"
        className={cn(
          'text-icon-primary hover:bg-background-secondary rounded p-1',
          disabled && 'pointer-events-none opacity-40',
        )}
      >
        <IconKebab />
      </Dropdown.Trigger>

      <Dropdown.Menu align={align} className={cn('z-100 overflow-hidden', menuClassName)}>
        {showEdit && (
          <Dropdown.Item
            onClick={(e) => {
              stopPropagation(e);
              if (disabled) return;
              onEdit?.();
            }}
            className="text-md hover:rounded-t-2xl"
          >
            수정하기
          </Dropdown.Item>
        )}

        {showDelete && (
          <Dropdown.Item
            onClick={(e) => {
              stopPropagation(e);
              if (disabled) return;
              onDelete?.();
            }}
            className={cn(
              'text-md hover:rounded-b-2xl',
              isDeleteDanger && 'text-red-500 hover:bg-red-50 hover:text-red-600',
            )}
          >
            삭제하기
          </Dropdown.Item>
        )}
      </Dropdown.Menu>
    </Dropdown>
  );
}

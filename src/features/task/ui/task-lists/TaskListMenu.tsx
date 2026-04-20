import KebabMenu from '@/features/boards/components/KebabMenu';

type Props = {
  onEdit: () => void;
  onDelete: () => void;
};

export function TaskListMenu({ onEdit, onDelete }: Props) {
  return <KebabMenu onEdit={onEdit} onDelete={onDelete} isDeleteDanger align="side-right" />;
}

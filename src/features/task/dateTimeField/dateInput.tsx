import { cn } from '@/shared/lib/cn';
import { formatDate } from '@/shared/lib/date';
import { Button } from '@/shared/ui/Button/Button';

type Props = {
  value?: Date;
  onClick: () => void;
  className?: string;
};

export default function DateInput({ value, onClick, className }: Props) {
  return (
    <Button
      onClick={onClick}
      variant="secondary"
      className={cn('text-txt-default w-full justify-start text-left', className)}
    >
      {formatDate(value) || '날짜'}
    </Button>
  );
}

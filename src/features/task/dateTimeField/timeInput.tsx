import { Button } from '@/shared/ui/Button/Button';
import { cn } from '@/shared/lib/cn';

type Props = {
  value?: string;
  onClick: () => void;
  className?: string;
};

export default function TimeInput({ value, onClick, className }: Props) {
  return (
    <Button
      onClick={onClick}
      variant="secondary"
      className={cn('w-full justify-start text-left', !value && 'text-gray-400', className)}
    >
      {value ? formatTime(value) : '시간'}
    </Button>
  );
}

function formatTime(time: string) {
  const [hour, minute] = time.split(':').map(Number);

  const isAM = hour < 12;
  const displayHour = hour % 12 === 0 ? 12 : hour % 12;

  return `${isAM ? '오전' : '오후'} ${displayHour}:${minute.toString().padStart(2, '0')}`;
}

import { cn } from '@/shared/lib/cn';
import { Button } from '@/shared/ui/Button/Button';

type Props = {
  value: Date;
  onChange: (date: Date) => void;
};

const DAYS = ['일', '월', '화', '수', '목', '금', '토'];

function getWeekDatesAroundSelected(baseDate: Date) {
  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date(baseDate);
    d.setDate(baseDate.getDate() + (i - 3));
    return d;
  });
}

export default function WeekDateSelector({ value, onChange }: Props) {
  const weekDates = getWeekDatesAroundSelected(value);

  return (
    <div className="flex w-full justify-center">
      <div className="no-scrollbar -mx-1 flex max-w-full items-stretch justify-start gap-1.5 overflow-x-auto px-1 py-1 md:gap-2 md:py-1.5 lg:gap-2">
        {weekDates.map((date) => {
          const isSelected = date.toDateString() === value.toDateString();
          return (
            <Button
              key={date.getTime()}
              onClick={() => onChange(date)}
              className={cn(
                'flex h-14 w-[62px] shrink-0 flex-col items-center justify-center gap-0.5 rounded-xl border px-2 py-2 transition md:h-16 md:w-[70px] md:gap-1 md:px-3 md:py-2.5 lg:h-[68px] lg:w-[80px] lg:px-4 lg:py-3',
                isSelected
                  ? 'bg-brand-primary text-txt-inverse hover:bg-brand-tertiary'
                  : 'border-gray-200 bg-white text-gray-700 hover:bg-gray-50',
              )}
            >
              <span
                className={cn(
                  'block text-xs font-medium md:text-sm',
                  isSelected ? 'text-txt-inverse' : 'text-txt-default',
                )}
              >
                {DAYS[date.getDay()]}
              </span>
              <span
                className={cn(
                  'block text-lg font-semibold md:text-xl',
                  isSelected ? 'text-txt-inverse' : 'text-txt-primary',
                )}
              >
                {date.getDate()}
              </span>
            </Button>
          );
        })}
      </div>
    </div>
  );
}

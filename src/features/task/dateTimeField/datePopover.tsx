import { cn } from '@/shared/lib/cn';
import type { CSSProperties } from 'react';
import { DayPicker, getDefaultClassNames, SelectSingleEventHandler } from 'react-day-picker';
import { ko } from 'react-day-picker/locale';
import 'react-day-picker/style.css';

interface CalendarProps {
  selected?: Date;
  onSelect?: SelectSingleEventHandler;
}

export default function DatePopover({ selected, onSelect }: CalendarProps) {
  const defaultClassNames = getDefaultClassNames();

  return (
    <DayPicker
      mode="single"
      selected={selected}
      onSelect={onSelect}
      locale={ko}
      showOutsideDays
      navLayout="around"
      classNames={{
        months: 'flex justify-center',
        month: 'space-y-6',
        month_caption: cn(
          defaultClassNames.month_caption,
          'flex items-center justify-between px-2 text-lg font-semibold',
        ),
        nav: 'flex items-center gap-2',
        weekdays: 'grid grid-cols-7 text-center text-sm text-gray-400',
        weekday: 'py-2',
        month_grid: 'grid gap-y-2',
        week: 'grid grid-cols-7',
        day: 'flex items-center justify-center',
        day_button: cn(
          defaultClassNames.day_button,
          'w-10 h-10 text-sm rounded-md hover:bg-gray-100',
        ),
        selected: 'text-brand-primary font-semibold bg-transparent hover:bg-transparent',
        today: 'border border-brand-primary',
        outside: 'text-gray-300',
      }}
      className="border-brand-primary w-full min-w-[320px] rounded-2xl border-2 bg-white p-6"
      style={
        {
          '--rdp-nav-height': '32px',
        } as CSSProperties
      }
    />
  );
}

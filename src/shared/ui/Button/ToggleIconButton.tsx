import { cn } from '../../lib/cn';
import { IconArrowDown } from '../icons';

interface ToggleIconButtonProps extends Omit<React.ComponentProps<'button'>, 'children'> {
  isOpen: boolean;
}

const baseStyles =
  'inline-flex items-center justify-center w-5 h-5 transition-transform duration-200 disabled:cursor-not-allowed disabled:opacity-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary rounded-sm';

export function ToggleIconButton({
  isOpen,
  className,
  disabled,
  type = 'button',
  ref,
  ...props
}: ToggleIconButtonProps) {
  return (
    <button
      ref={ref}
      type={type}
      disabled={disabled}
      className={cn(baseStyles, className)}
      aria-expanded={isOpen}
      aria-label={isOpen ? '접기' : '펼치기'}
      {...props}
    >
      <IconArrowDown
        size={20}
        className={cn('transition-transform duration-200', isOpen ? 'rotate-180' : 'rotate-0')}
      />
    </button>
  );
}

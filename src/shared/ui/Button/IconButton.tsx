import { cn } from '../../lib/cn';

export type IconButtonVariant = 'surface';

export interface IconButtonProps extends Omit<React.ComponentProps<'button'>, 'children'> {
  variant?: IconButtonVariant;
  children: React.ReactNode;
}

const variantStyles: Record<IconButtonVariant, string> = {
  surface:
    'inline-flex min-h-0 min-w-0 items-center justify-center gap-0 rounded-full border border-background-tertiary bg-white p-0 font-normal text-icon-primary shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary focus-visible:ring-offset-2 enabled:cursor-pointer enabled:hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-60',
};

export function IconButton({
  variant = 'surface',
  className,
  type = 'button',
  children,
  ref,
  ...props
}: IconButtonProps) {
  return (
    <button ref={ref} type={type} className={cn(variantStyles[variant], className)} {...props}>
      <span className="inline-flex items-center justify-center [&_svg]:shrink-0" aria-hidden="true">
        {children}
      </span>
    </button>
  );
}

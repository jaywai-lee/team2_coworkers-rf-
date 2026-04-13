import { ReactNode } from 'react';
import { cn } from '../../lib/cn';
import { motion, HTMLMotionProps } from 'framer-motion';

export type ButtonVariant = 'primary' | 'danger' | 'outline' | 'ghost' | 'secondary';
export type ButtonSize = 'sm' | 'md' | 'lg';

export interface ButtonProps extends Omit<HTMLMotionProps<'button'>, 'children'> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  leftIcon?: React.ReactNode;
  children?: ReactNode;
}

const baseStyles =
  'inline-flex items-center cursor-pointer justify-center gap-1 font-semibold transition-colors disabled:cursor-not-allowed focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary focus-visible:ring-offset-2';

const variantStyles: Record<ButtonVariant, string> = {
  primary:
    'bg-brand-primary text-white hover:bg-interaction-hover active:bg-interaction-pressed disabled:bg-interaction-inactive',
  outline:
    'bg-transparent border border-brand-primary text-brand-primary hover:border-interaction-hover hover:text-interaction-hover active:border-interaction-pressed active:text-interaction-pressed disabled:border-interaction-inactive disabled:text-interaction-inactive',
  danger: 'bg-status-danger text-white hover:opacity-80 active:opacity-60 disabled:opacity-50',
  ghost:
    'bg-background-primary border border-brand-primary text-brand-primary hover:border-interaction-hover hover:text-interaction-hover active:border-interaction-pressed active:text-interaction-pressed disabled:border-interaction-inactive disabled:text-interaction-inactive',
  secondary:
    'bg-transparent border border-txt-secondary text-txt-primary hover:opacity-80 active:opacity-60 disabled:opacity-50 disabled:border-interaction-inactive disabled:text-interaction-inactive',
};

const sizeStyles: Record<ButtonSize, string> = {
  sm: 'h-[33px] px-3 rounded-lg',
  md: 'h-10 px-4 rounded-[40px]',
  lg: 'h-12 px-8 rounded-xl',
};

export function Button({
  variant = 'primary',
  size = 'md',
  leftIcon,
  children,
  className,
  disabled,
  type = 'button',
  ref,
  ...props
}: ButtonProps) {
  const combinedClassName = cn(baseStyles, variantStyles[variant], sizeStyles[size], className);

  return (
    <motion.button
      ref={ref}
      type={type}
      className={combinedClassName}
      disabled={disabled}
      whileTap={disabled ? undefined : { scale: 0.99 }}
      transition={{ type: 'tween', ease: 'easeOut', duration: 0.1 }}
      {...props}
    >
      {leftIcon && (
        <span className="shrink-0" aria-hidden="true">
          {leftIcon}
        </span>
      )}
      {children}
    </motion.button>
  );
}

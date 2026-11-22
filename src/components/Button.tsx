import { type ButtonHTMLAttributes } from 'react';

type Variant = 'primary' | 'ghost' | 'danger';
type Size = 'sm' | 'md' | 'lg';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
  disabled?: boolean;
  className?: string;
  children: React.ReactNode;
}

const variantStyles: Record<Variant, string> = {
  primary: 'bg-accent text-white hover:bg-red-700 transition-colors',
  ghost: 'bg-transparent border border-border text-text hover:bg-card transition-colors',
  danger: 'bg-accent text-white border border-accent hover:bg-red-700 transition-colors',
};

const sizeStyles: Record<Size, string> = {
  sm: 'px-2 py-1 text-xs',
  md: 'px-4 py-2 text-sm',
  lg: 'px-6 py-3 text-base',
};

export function Button({
  variant = 'primary',
  size = 'md',
  disabled = false,
  className,
  children,
  ...props
}: ButtonProps) {
  return (
    <button
      className={[
        'font-mono uppercase tracking-wide rounded-none outline-none focus-visible:ring-2 focus-visible:ring-accent active:scale-95 transition-transform',
        disabled ? 'opacity-50 cursor-not-allowed' : '',
        variantStyles[variant],
        sizeStyles[size],
        className,
      ].filter(Boolean).join(' ')}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  );
}

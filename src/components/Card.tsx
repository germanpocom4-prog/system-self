import { type HTMLAttributes } from 'react';

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
}

export function Card({
  children,
  className,
  onClick,
  ...props
}: CardProps) {
  return (
    <div
      className={[
        'bg-card border border-border rounded-sm p-4',
        className,
      ].filter(Boolean).join(' ')}
      onClick={onClick}
      {...(onClick ? { role: 'button', tabIndex: 0, cursor: 'pointer' } : {})}
      {...props}
    >
      {children}
    </div>
  );
}

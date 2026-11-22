import { type HTMLAttributes } from 'react';

type Status = 'active' | 'critical' | 'idle';

interface StatusBadgeProps extends HTMLAttributes<HTMLSpanElement> {
  status: Status;
  children: React.ReactNode;
}

const statusStyles: Record<Status, string> = {
  active: 'border-green text-green',
  critical: 'border-accent text-accent',
  idle: 'border-border text-muted',
};

export function StatusBadge({ status, children, ...props }: StatusBadgeProps) {
  return (
    <span
      className={[
        'font-mono uppercase text-xs px-2 py-0.5 border rounded-sm',
        statusStyles[status],
      ].join(' ')}
      {...props}
    >
      {children}
    </span>
  );
}

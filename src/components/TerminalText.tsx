import { type HTMLAttributes } from 'react';

type Color = 'default' | 'green' | 'red' | 'muted';

interface TerminalTextProps extends Omit<HTMLAttributes<HTMLSpanElement>, 'prefix'> {
  children: React.ReactNode;
  color?: Color;
  cursor?: boolean;
  showPrefix?: boolean;
  className?: string;
}

const colorStyles: Record<Color, string> = {
  default: 'text-text',
  green: 'text-green',
  red: 'text-accent',
  muted: 'text-muted',
};

export function TerminalText({
  children,
  color = 'default',
  cursor = false,
  showPrefix = true,
  className,
  ...props
}: TerminalTextProps) {
  return (
    <span
      className={[
        'font-mono',
        colorStyles[color],
        className,
      ].filter(Boolean).join(' ')}
      {...props}
    >
      {showPrefix ? '> ' : ''}
      {children}
      {cursor ? <span className="animate-blink">▊</span> : null}
    </span>
  );
}

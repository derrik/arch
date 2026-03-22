import { type ButtonHTMLAttributes } from 'react';

interface IconButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  active?: boolean;
  danger?: boolean;
  size?: number;
}

export function IconButton({
  active,
  danger,
  size = 32,
  style,
  children,
  ...props
}: IconButtonProps) {
  return (
    <button
      style={{
        width: size,
        height: size,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: active ? 'var(--accent-purple)' : 'transparent',
        color: danger
          ? 'var(--danger)'
          : active
          ? '#fff'
          : 'var(--text-secondary)',
        border: 'none',
        borderRadius: 8,
        cursor: 'pointer',
        transition: 'all 0.15s ease',
        ...style,
      }}
      onMouseEnter={(e) => {
        if (!active) {
          (e.currentTarget as HTMLButtonElement).style.background =
            'var(--bg-elevated)';
        }
      }}
      onMouseLeave={(e) => {
        if (!active) {
          (e.currentTarget as HTMLButtonElement).style.background = 'transparent';
        }
      }}
      {...props}
    >
      {children}
    </button>
  );
}

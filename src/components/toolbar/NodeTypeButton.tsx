import { ICON_REGISTRY } from '@/icons';
import { NodeKind } from '@/types/node-types';

interface NodeTypeButtonProps {
  kind: NodeKind;
  label: string;
  shortcut: string;
  active: boolean;
  onClick: () => void;
}

export function NodeTypeButton({ kind, label, shortcut, active, onClick }: NodeTypeButtonProps) {
  const Icon = ICON_REGISTRY[kind];
  return (
    <button
      onClick={onClick}
      title={`${label} (${shortcut})`}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 6,
        padding: '6px 10px',
        background: active ? 'rgba(168, 85, 247, 0.2)' : 'transparent',
        border: active ? '1px solid var(--accent-purple)' : '1px solid transparent',
        borderRadius: 8,
        color: active ? 'var(--accent-purple)' : 'var(--text-secondary)',
        cursor: 'pointer',
        fontSize: 12,
        fontWeight: 500,
        transition: 'all 0.15s ease',
        whiteSpace: 'nowrap',
        animation: active ? 'glow-pulse 2s ease-in-out infinite' : undefined,
        position: 'relative',
      }}
      onMouseEnter={(e) => {
        if (!active) e.currentTarget.style.background = 'var(--bg-elevated)';
      }}
      onMouseLeave={(e) => {
        if (!active) e.currentTarget.style.background = 'transparent';
      }}
    >
      <Icon size={16} />
      <span>{label}</span>
      <span
        style={{
          fontSize: 10,
          color: 'var(--text-muted)',
          background: 'var(--bg-surface)',
          padding: '1px 5px',
          borderRadius: 4,
          lineHeight: '16px',
        }}
      >
        {shortcut}
      </span>
    </button>
  );
}

import type { IconMeta } from '@/types/icon';
import { sanitizeSvg } from '@/lib/sanitize';

interface IconCardProps {
  icon: IconMeta;
  selected: boolean;
  onSelect: () => void;
}

export function IconCard({ icon, selected, onSelect }: IconCardProps) {
  return (
    <div
      onClick={onSelect}
      style={{
        background: selected ? 'rgba(168, 85, 247, 0.12)' : 'var(--bg-elevated)',
        border: `2px solid ${selected ? 'var(--accent-purple)' : 'var(--border-default)'}`,
        borderRadius: 12,
        padding: 12,
        cursor: 'pointer',
        transition: 'all 0.15s ease',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 8,
      }}
      onMouseEnter={(e) => {
        if (!selected) e.currentTarget.style.borderColor = 'var(--border-active)';
      }}
      onMouseLeave={(e) => {
        if (!selected) e.currentTarget.style.borderColor = 'var(--border-default)';
      }}
    >
      <div
        style={{
          width: 64,
          height: 64,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'var(--accent-purple)',
        }}
        dangerouslySetInnerHTML={{ __html: sanitizeSvg(icon.svgContent) }}
      />

      <span
        style={{
          fontSize: 11,
          fontWeight: 500,
          color: 'var(--text-primary)',
          textAlign: 'center',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          whiteSpace: 'nowrap',
          width: '100%',
        }}
      >
        {icon.name}
      </span>

      {icon.description && (
        <span
          style={{
            fontSize: 9,
            color: 'var(--text-muted)',
            textAlign: 'center',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            lineHeight: 1.3,
            width: '100%',
          }}
        >
          {icon.description}
        </span>
      )}

    </div>
  );
}

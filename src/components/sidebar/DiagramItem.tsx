import { useState, useRef, useEffect } from 'react';
import { IconButton } from '@/components/shared/IconButton';

interface DiagramItemProps {
  id: string;
  name: string;
  active: boolean;
  updatedAt: number;
  onSelect: () => void;
  onRename: (name: string) => void;
  onDuplicate: () => void;
  onDelete: () => void;
}

export function DiagramItem({
  name,
  active,
  updatedAt,
  onSelect,
  onRename,
  onDuplicate,
  onDelete,
}: DiagramItemProps) {
  const [editing, setEditing] = useState(false);
  const [editValue, setEditValue] = useState(name);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (editing && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [editing]);

  const commitRename = () => {
    setEditing(false);
    const trimmed = editValue.trim();
    if (trimmed && trimmed !== name) {
      onRename(trimmed);
    } else {
      setEditValue(name);
    }
  };

  const timeAgo = getTimeAgo(updatedAt);

  return (
    <div
      onClick={onSelect}
      style={{
        padding: '8px 12px',
        background: active ? 'var(--bg-elevated)' : 'transparent',
        borderLeft: active ? '2px solid var(--accent-purple)' : '2px solid transparent',
        cursor: 'pointer',
        transition: 'background 0.15s ease',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 8,
      }}
      onMouseEnter={(e) => {
        if (!active) e.currentTarget.style.background = 'var(--bg-surface)';
      }}
      onMouseLeave={(e) => {
        if (!active) e.currentTarget.style.background = 'transparent';
      }}
    >
      <div style={{ flex: 1, minWidth: 0 }}>
        {editing ? (
          <input
            ref={inputRef}
            value={editValue}
            onChange={(e) => setEditValue(e.target.value)}
            onBlur={commitRename}
            onKeyDown={(e) => {
              if (e.key === 'Enter') commitRename();
              if (e.key === 'Escape') {
                setEditing(false);
                setEditValue(name);
              }
            }}
            onClick={(e) => e.stopPropagation()}
            style={{
              background: 'transparent',
              border: '1px solid var(--border-active)',
              borderRadius: 4,
              color: 'var(--text-primary)',
              fontSize: 13,
              padding: '2px 6px',
              outline: 'none',
              width: '100%',
            }}
          />
        ) : (
          <div
            style={{
              fontSize: 13,
              fontWeight: active ? 600 : 400,
              color: 'var(--text-primary)',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
            }}
            onDoubleClick={(e) => {
              e.stopPropagation();
              setEditing(true);
              setEditValue(name);
            }}
          >
            {name}
          </div>
        )}
        <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 2 }}>
          {timeAgo}
        </div>
      </div>

      {active && (
        <div
          style={{ display: 'flex', gap: 2, flexShrink: 0 }}
          onClick={(e) => e.stopPropagation()}
        >
          <IconButton size={24} onClick={() => { setEditing(true); setEditValue(name); }} title="Rename">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M17 3a2.85 2.83 0 114 4L7.5 20.5 2 22l1.5-5.5Z" />
            </svg>
          </IconButton>
          <IconButton size={24} onClick={onDuplicate} title="Duplicate">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
              <path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1" />
            </svg>
          </IconButton>
          <IconButton size={24} danger onClick={onDelete} title="Delete">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M3 6h18M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2" />
            </svg>
          </IconButton>
        </div>
      )}
    </div>
  );
}

function getTimeAgo(timestamp: number): string {
  const seconds = Math.floor((Date.now() - timestamp) / 1000);
  if (seconds < 60) return 'just now';
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}

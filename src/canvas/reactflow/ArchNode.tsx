import { memo, useState, useCallback, useRef, useEffect } from 'react';
import { Handle, Position, type NodeProps } from '@xyflow/react';
import { NodeKind } from '@/types/node-types';
import { ICON_REGISTRY } from '@/icons';

export interface ArchNodeData {
  kind: NodeKind;
  label: string;
  highlighted: boolean;
  onLabelChange: (id: string, label: string) => void;
  [key: string]: unknown;
}

export const ArchNodeComponent = memo(function ArchNodeComponent({
  id,
  data,
  selected,
}: NodeProps & { data: ArchNodeData }) {
  const [editing, setEditing] = useState(false);
  const [editValue, setEditValue] = useState(data.label);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (editing && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [editing]);

  const commitEdit = useCallback(() => {
    setEditing(false);
    const trimmed = editValue.trim();
    if (trimmed && trimmed !== data.label) {
      data.onLabelChange(id, trimmed);
    } else {
      setEditValue(data.label);
    }
  }, [editValue, data.label, data.onLabelChange, id]);

  const Icon = ICON_REGISTRY[data.kind];
  const isHighlighted = data.highlighted;

  let borderColor = 'var(--node-border)';
  let shadow = 'var(--node-shadow)';
  if (selected) {
    borderColor = 'var(--node-border-selected)';
    shadow = 'var(--node-shadow-selected)';
  } else if (isHighlighted) {
    borderColor = 'var(--node-border-highlighted)';
    shadow = 'var(--node-shadow-highlighted)';
  }

  return (
    <div
      style={{
        background: 'var(--node-bg)',
        border: `2px solid ${borderColor}`,
        borderRadius: 12,
        padding: '12px 16px',
        display: 'flex',
        alignItems: 'center',
        gap: 10,
        minWidth: 140,
        boxShadow: shadow,
        animation: 'node-appear 0.2s ease',
        cursor: 'grab',
        transition: 'border-color 0.15s ease, box-shadow 0.15s ease',
      }}
      onDoubleClick={(e) => {
        e.stopPropagation();
        setEditing(true);
        setEditValue(data.label);
      }}
    >
      <Handle type="source" position={Position.Top} id="top" />
      <Handle type="source" position={Position.Right} id="right" />
      <Handle type="source" position={Position.Bottom} id="bottom" />
      <Handle type="source" position={Position.Left} id="left" />

      <div style={{ color: 'var(--accent-purple)', flexShrink: 0 }}>
        <Icon size={20} />
      </div>

      {editing ? (
        <input
          ref={inputRef}
          value={editValue}
          onChange={(e) => setEditValue(e.target.value)}
          onBlur={commitEdit}
          onKeyDown={(e) => {
            if (e.key === 'Enter') commitEdit();
            if (e.key === 'Escape') {
              setEditing(false);
              setEditValue(data.label);
            }
          }}
          style={{
            background: 'transparent',
            border: '1px solid var(--border-active)',
            borderRadius: 4,
            color: 'var(--text-primary)',
            fontSize: 13,
            fontWeight: 500,
            padding: '2px 6px',
            outline: 'none',
            width: '100%',
            minWidth: 60,
          }}
        />
      ) : (
        <span
          style={{
            fontSize: 13,
            fontWeight: 500,
            color: 'var(--text-primary)',
            userSelect: 'none',
            whiteSpace: 'nowrap',
          }}
        >
          {data.label}
        </span>
      )}
    </div>
  );
});

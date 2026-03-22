import { useState, useRef, useEffect } from 'react';
import { type NodeProps, NodeResizer } from '@xyflow/react';

export interface GroupNodeData {
  label: string;
  onLabelChange: (id: string, label: string) => void;
  onResize: (id: string, width: number, height: number) => void;
  [key: string]: unknown;
}

export function GroupNode({ id, data, selected }: NodeProps & { data: GroupNodeData }) {
  const [editing, setEditing] = useState(false);
  const [editValue, setEditValue] = useState(data.label);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (editing && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [editing]);

  const commitEdit = () => {
    setEditing(false);
    const trimmed = editValue.trim();
    if (trimmed && trimmed !== data.label) {
      data.onLabelChange(id, trimmed);
    } else {
      setEditValue(data.label);
    }
  };

  return (
    <>
      <NodeResizer
        minWidth={150}
        minHeight={100}
        isVisible={selected}
        lineStyle={{ border: '1px solid var(--accent-purple)' }}
        handleStyle={{
          width: 8,
          height: 8,
          background: 'var(--accent-purple)',
          border: 'none',
          borderRadius: 2,
        }}
        onResizeEnd={(_event, { width, height }) => {
          data.onResize(id, width, height);
        }}
      />
      <div
        style={{
          width: '100%',
          height: '100%',
          background: 'rgba(168, 85, 247, 0.04)',
          border: `2px dashed ${selected ? 'var(--accent-purple)' : 'var(--border-default)'}`,
          borderRadius: 12,
          padding: 0,
          position: 'relative',
        }}
      >
        <div
          style={{
            position: 'absolute',
            top: -12,
            left: 12,
            background: 'var(--bg-primary)',
            padding: '0 8px',
          }}
          onDoubleClick={(e) => {
            e.stopPropagation();
            setEditing(true);
            setEditValue(data.label);
          }}
        >
          {editing ? (
            <input
              ref={inputRef}
              value={editValue}
              onChange={(e) => setEditValue(e.target.value)}
              onBlur={commitEdit}
              onKeyDown={(e) => {
                if (e.key === 'Enter') commitEdit();
                if (e.key === 'Escape') { setEditing(false); setEditValue(data.label); }
              }}
              style={{
                background: 'transparent',
                border: '1px solid var(--border-active)',
                borderRadius: 4,
                color: 'var(--text-muted)',
                fontSize: 11,
                fontWeight: 600,
                letterSpacing: '0.05em',
                textTransform: 'uppercase',
                padding: '1px 6px',
                outline: 'none',
              }}
            />
          ) : (
            <span
              style={{
                fontSize: 11,
                fontWeight: 600,
                color: 'var(--text-muted)',
                letterSpacing: '0.05em',
                textTransform: 'uppercase',
                userSelect: 'none',
              }}
            >
              {data.label}
            </span>
          )}
        </div>
      </div>
    </>
  );
}

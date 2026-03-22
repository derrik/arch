import { useState, useRef, useEffect } from 'react';
import { Handle, Position, type NodeProps } from '@xyflow/react';

export interface NoteNodeData {
  text: string;
  attachedTo: string | null;
  onTextChange: (id: string, text: string) => void;
  [key: string]: unknown;
}

export function NoteNode({ id, data, selected }: NodeProps & { data: NoteNodeData }) {
  const [editing, setEditing] = useState(false);
  const [editValue, setEditValue] = useState(data.text);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (editing && textareaRef.current) {
      textareaRef.current.focus();
      textareaRef.current.select();
    }
  }, [editing]);

  const commitEdit = () => {
    setEditing(false);
    const trimmed = editValue.trim();
    if (trimmed !== data.text) {
      data.onTextChange(id, trimmed);
    } else {
      setEditValue(data.text);
    }
  };

  return (
    <div
      style={{
        background: 'rgba(234, 179, 8, 0.08)',
        border: `1px solid ${selected ? 'var(--accent-purple)' : 'rgba(234, 179, 8, 0.3)'}`,
        borderRadius: 4,
        padding: '8px 12px',
        minWidth: 100,
        maxWidth: 200,
        boxShadow: selected ? 'var(--node-shadow-selected)' : '0 2px 8px rgba(0,0,0,0.15)',
        animation: 'node-appear 0.2s ease',
        cursor: 'grab',
        position: 'relative',
      }}
      onDoubleClick={(e) => {
        e.stopPropagation();
        setEditing(true);
        setEditValue(data.text);
      }}
    >
      <Handle type="source" position={Position.Left} id="left" style={{ opacity: 0 }} />
      <Handle type="source" position={Position.Right} id="right" style={{ opacity: 0 }} />

      {editing ? (
        <textarea
          ref={textareaRef}
          value={editValue}
          onChange={(e) => setEditValue(e.target.value)}
          onBlur={commitEdit}
          onKeyDown={(e) => {
            if (e.key === 'Escape') { setEditing(false); setEditValue(data.text); }
          }}
          style={{
            background: 'transparent',
            border: 'none',
            color: 'var(--text-secondary)',
            fontSize: 12,
            fontStyle: 'italic',
            outline: 'none',
            resize: 'vertical',
            width: '100%',
            minHeight: 40,
          }}
        />
      ) : (
        <div
          style={{
            fontSize: 12,
            fontStyle: 'italic',
            color: 'var(--text-secondary)',
            whiteSpace: 'pre-wrap',
            wordBreak: 'break-word',
            userSelect: 'none',
          }}
        >
          {data.text || 'Double-click to edit...'}
        </div>
      )}
    </div>
  );
}

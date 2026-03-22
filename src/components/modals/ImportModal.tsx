import { useState, useCallback } from 'react';
import { useStore } from '@/store';
import { Modal } from './Modal';

export function ImportModal() {
  const activeModal = useStore((s) => s.activeModal);
  const closeModal = useStore((s) => s.closeModal);
  const importJSON = useStore((s) => s.importJSON);
  const [value, setValue] = useState('');
  const [error, setError] = useState('');

  const open = activeModal === 'import';

  const handleImport = useCallback(() => {
    setError('');
    if (!value.trim()) {
      setError('Paste JSON to import');
      return;
    }
    const success = importJSON(value);
    if (success) {
      setValue('');
      closeModal();
    } else {
      setError('Invalid JSON format. Expected { nodes: [...], edges: [...] }');
    }
  }, [value, importJSON, closeModal]);

  return (
    <Modal
      open={open}
      onClose={() => {
        setValue('');
        setError('');
        closeModal();
      }}
      title="Import JSON"
    >
      <p style={{ color: 'var(--text-secondary)', fontSize: 13, marginBottom: 12 }}>
        Paste a JSON diagram or LLM-generated output. Supports <code style={{
          background: 'var(--bg-elevated)',
          padding: '1px 4px',
          borderRadius: 3,
          fontSize: 12,
        }}>nodes</code>, <code style={{
          background: 'var(--bg-elevated)',
          padding: '1px 4px',
          borderRadius: 3,
          fontSize: 12,
        }}>edges</code>, <code style={{
          background: 'var(--bg-elevated)',
          padding: '1px 4px',
          borderRadius: 3,
          fontSize: 12,
        }}>groups</code>, and <code style={{
          background: 'var(--bg-elevated)',
          padding: '1px 4px',
          borderRadius: 3,
          fontSize: 12,
        }}>notes</code>.
      </p>
      <textarea
        value={value}
        onChange={(e) => { setValue(e.target.value); setError(''); }}
        placeholder={`{
  "nodes": [
    { "id": "api", "name": "API Service", "type": "service" },
    { "id": "db", "name": "PostgreSQL", "type": "database" }
  ],
  "edges": [
    { "from": "api", "to": "db", "label": "SQL" }
  ]
}`}
        style={{
          width: '100%',
          height: 220,
          background: 'var(--bg-elevated)',
          border: `1px solid ${error ? 'var(--danger)' : 'var(--border-default)'}`,
          borderRadius: 6,
          padding: 10,
          color: 'var(--text-primary)',
          fontSize: 12,
          fontFamily: 'monospace',
          resize: 'vertical',
          outline: 'none',
        }}
      />
      {error && (
        <div style={{ color: 'var(--danger)', fontSize: 12, marginTop: 6 }}>{error}</div>
      )}
      <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end', marginTop: 16 }}>
        <button
          onClick={() => { setValue(''); setError(''); closeModal(); }}
          style={{
            padding: '8px 16px',
            background: 'var(--bg-elevated)',
            border: '1px solid var(--border-default)',
            borderRadius: 8,
            color: 'var(--text-secondary)',
            cursor: 'pointer',
            fontSize: 13,
          }}
        >
          Cancel
        </button>
        <button
          onClick={handleImport}
          style={{
            padding: '8px 16px',
            background: 'var(--accent-purple)',
            border: 'none',
            borderRadius: 8,
            color: '#fff',
            cursor: 'pointer',
            fontSize: 13,
            fontWeight: 600,
          }}
        >
          Import
        </button>
      </div>
    </Modal>
  );
}

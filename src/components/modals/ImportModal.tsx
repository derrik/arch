import { useState, useCallback } from 'react';
import { useStore } from '@/store';
import { Modal } from './Modal';

export function ImportModal() {
  const activeModal = useStore((s) => s.activeModal);
  const closeModal = useStore((s) => s.closeModal);
  const importJSON = useStore((s) => s.importJSON);
  const createDiagram = useStore((s) => s.createDiagram);
  const switchDiagram = useStore((s) => s.switchDiagram);
  const saveCurrentDiagram = useStore((s) => s.saveCurrentDiagram);
  const [value, setValue] = useState('');
  const [error, setError] = useState('');

  const open = activeModal === 'import';

  const handleImport = useCallback(async () => {
    setError('');
    if (!value.trim()) {
      setError('Paste JSON to import');
      return;
    }

    // Validate JSON first without applying it
    let parsed: any;
    try {
      parsed = JSON.parse(value);
      if (!parsed.nodes && !parsed.components) {
        setError('Invalid JSON format. Expected { nodes: [...], edges: [...] }');
        return;
      }
    } catch {
      setError('Invalid JSON format. Expected { nodes: [...], edges: [...] }');
      return;
    }

    // Save current work, create new diagram, switch to it
    await saveCurrentDiagram();
    const name = (typeof parsed.name === 'string' && parsed.name.trim()) ? parsed.name.trim() : 'Imported Diagram';
    const diagram = await createDiagram(name);
    switchDiagram(diagram.id);

    // Now import the JSON into the new (empty) diagram
    const result = importJSON(value);
    if (result !== null) {
      // Save the imported content into the new diagram
      await saveCurrentDiagram();
      setValue('');
      closeModal();
    } else {
      setError('Failed to parse diagram data');
    }
  }, [value, importJSON, createDiagram, switchDiagram, saveCurrentDiagram, closeModal]);

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
        Paste a JSON diagram or LLM-generated output. A new diagram will be created automatically.
        Include a <code style={{
          background: 'var(--bg-elevated)',
          padding: '1px 4px',
          borderRadius: 3,
          fontSize: 12,
        }}>"name"</code> field to set the diagram title.
      </p>
      <textarea
        value={value}
        onChange={(e) => { setValue(e.target.value); setError(''); }}
        placeholder={`{
  "name": "My Architecture",
  "nodes": [
    { "id": "api", "type": "service", "label": "API Service", "x": 100, "y": 200 },
    { "id": "db", "type": "database", "label": "PostgreSQL", "x": 350, "y": 200 }
  ],
  "edges": [
    { "source": "api", "target": "db", "label": "SQL" }
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

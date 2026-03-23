import { useState, useEffect } from 'react';
import { Modal } from './Modal';
import { useStore } from '@/store';

const STORAGE_KEY = 'arch-welcome-seen';

function WelcomeBody({ onClose }: { onClose: () => void }) {
  const openModal = useStore((s) => s.openModal);

  const handleTryAI = () => {
    onClose();
    openModal('ai-prompt');
  };

  return (
    <div style={{ maxWidth: 520 }}>
      {/* Header */}
      <div style={{ textAlign: 'center', marginBottom: 24 }}>
        <div
          style={{
            fontSize: 28,
            fontWeight: 800,
            color: 'var(--accent-purple)',
            letterSpacing: '0.08em',
            marginBottom: 4,
          }}
        >
          ARCH
        </div>
        <div style={{ fontSize: 14, color: 'var(--text-secondary)' }}>
          Local-first architecture diagrams &amp; icon design
        </div>
      </div>

      {/* What */}
      <Section title="What is this?">
        Arch is a tool for building system architecture diagrams — the kind you
        sketch on whiteboards but wish lived in a shareable, editable format.
        Everything runs in your browser. No accounts, no servers, no data
        leaves your machine.
      </Section>

      {/* AI Generation — front and center */}
      <div
        style={{
          background: 'linear-gradient(135deg, rgba(168, 85, 247, 0.12), rgba(6, 182, 212, 0.08))',
          border: '1px solid var(--accent-purple)',
          borderRadius: 10,
          padding: '14px 16px',
          marginBottom: 16,
        }}
      >
        <h3
          style={{
            fontSize: 13,
            fontWeight: 700,
            color: 'var(--accent-purple)',
            margin: '0 0 6px',
            textTransform: 'uppercase',
            letterSpacing: '0.05em',
            display: 'flex',
            alignItems: 'center',
            gap: 6,
          }}
        >
          <span style={{ fontSize: 16 }}>&#10024;</span> AI-Powered Diagrams
        </h3>
        <p style={{ margin: '0 0 8px', fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.6 }}>
          Describe your system in plain English and let an LLM generate the
          entire diagram for you — nodes, edges, groups, and layout. Click the{' '}
          <strong style={{ color: 'var(--accent-purple)' }}>sparkles button</strong> in
          the right panel to get a prompt you can paste into ChatGPT, Claude, or
          any LLM. Copy the JSON output, then <strong style={{ color: 'var(--text-primary)' }}>Import</strong> it
          into Arch.
        </p>
        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
          <button
            onClick={handleTryAI}
            style={{
              padding: '6px 16px',
              background: 'var(--accent-purple)',
              border: 'none',
              borderRadius: 6,
              color: '#fff',
              fontSize: 12,
              fontWeight: 600,
              cursor: 'pointer',
              transition: 'opacity 0.15s ease',
            }}
          >
            Try it now
          </button>
          <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>
            Works with any LLM — no API key needed
          </span>
        </div>
      </div>

      {/* Design Canvas */}
      <Section title="Design Canvas">
        <List items={[
          <><Key>1</Key>–<Key>8</Key> to select a node type (service, database, cache, etc.)</>,
          'Click the canvas to place nodes, drag between nodes to connect',
          'Click an edge to toggle sync/async, double-click labels to rename',
          <>Right panel: groups, notes, share, import, and the <strong style={{ color: 'var(--accent-purple)' }}>AI button</strong></>,
          <>Press <Key>Esc</Key> to return to pointer mode</>,
        ]} />
      </Section>

      {/* Icon Studio */}
      <Section title="Icon Studio">
        <p style={{ margin: 0, color: 'var(--text-secondary)', fontSize: 13, lineHeight: 1.6 }}>
          The <strong style={{ color: 'var(--text-primary)' }}>Icons</strong> tab
          is a workspace for iterating on custom SVG icons with an LLM coding agent.
          Generate, review, refine, and publish icons as new node types on the canvas.
        </p>
      </Section>

      {/* Sharing */}
      <Section title="Sharing & Persistence">
        <List items={[
          'Share diagrams as compressed URLs — the entire diagram is encoded, no server needed',
          'Export/import as JSON for version control or collaboration',
          'Diagrams persist in IndexedDB across refreshes — nothing leaves your browser',
        ]} />
      </Section>

      {/* CTA */}
      <div style={{ textAlign: 'center', marginTop: 20 }}>
        <button
          onClick={onClose}
          style={{
            padding: '10px 32px',
            background: 'var(--accent-purple)',
            border: 'none',
            borderRadius: 8,
            color: '#fff',
            fontSize: 14,
            fontWeight: 600,
            cursor: 'pointer',
            transition: 'opacity 0.15s ease',
          }}
        >
          Get Started
        </button>
        <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 8 }}>
          Press <Key>?</Key> or click the help button to see this again
        </div>
      </div>
    </div>
  );
}

export function WelcomeModal() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!localStorage.getItem(STORAGE_KEY)) {
      setOpen(true);
    }
  }, []);

  const handleClose = () => {
    localStorage.setItem(STORAGE_KEY, '1');
    setOpen(false);
  };

  return (
    <Modal open={open} onClose={handleClose} title="">
      <WelcomeBody onClose={handleClose} />
    </Modal>
  );
}

/** Reopen from outside */
export function openWelcomeModal() {
  localStorage.removeItem(STORAGE_KEY);
  window.dispatchEvent(new CustomEvent('arch:openWelcome'));
}

export function WelcomeModalListener() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const handler = () => setOpen(true);
    window.addEventListener('arch:openWelcome', handler);
    return () => window.removeEventListener('arch:openWelcome', handler);
  }, []);

  if (!open) return null;

  return (
    <Modal open={open} onClose={() => setOpen(false)} title="">
      <WelcomeBody onClose={() => setOpen(false)} />
    </Modal>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div style={{ marginBottom: 16 }}>
      <h3 style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-primary)', margin: '0 0 6px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
        {title}
      </h3>
      <div style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.6 }}>
        {children}
      </div>
    </div>
  );
}

function List({ items }: { items: React.ReactNode[] }) {
  return (
    <ul style={{ margin: 0, paddingLeft: 18, fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.8 }}>
      {items.map((item, i) => (
        <li key={i}>{item}</li>
      ))}
    </ul>
  );
}

function Key({ children }: { children: React.ReactNode }) {
  return (
    <kbd
      style={{
        background: 'var(--bg-elevated)',
        padding: '1px 6px',
        borderRadius: 4,
        border: '1px solid var(--border-default)',
        fontSize: 11,
        fontFamily: 'inherit',
      }}
    >
      {children}
    </kbd>
  );
}

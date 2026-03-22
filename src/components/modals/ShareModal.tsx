import { useState, useCallback } from 'react';
import { useStore } from '@/store';
import { Modal } from './Modal';
import { createShareURL } from '@/sharing/serialize';
import { exportJSON } from '@/sharing/json-export';

export function ShareModal() {
  const activeModal = useStore((s) => s.activeModal);
  const closeModal = useStore((s) => s.closeModal);
  const nodes = useStore((s) => s.nodes);
  const edges = useStore((s) => s.edges);
  const groups = useStore((s) => s.groups);
  const notes = useStore((s) => s.notes);
  const viewport = useStore((s) => s.viewport);
  const [urlCopied, setUrlCopied] = useState(false);
  const [jsonCopied, setJsonCopied] = useState(false);

  const open = activeModal === 'share';

  const shareUrl = open ? createShareURL(nodes, edges, groups, notes, viewport) : '';
  const jsonStr = open ? exportJSON(nodes, edges, groups, notes, viewport) : '';

  const copyUrl = useCallback(async () => {
    await navigator.clipboard.writeText(shareUrl);
    setUrlCopied(true);
    setTimeout(() => setUrlCopied(false), 2000);
  }, [shareUrl]);

  const copyJson = useCallback(async () => {
    await navigator.clipboard.writeText(jsonStr);
    setJsonCopied(true);
    setTimeout(() => setJsonCopied(false), 2000);
  }, [jsonStr]);

  const buttonStyle = {
    padding: '6px 14px',
    background: 'var(--accent-purple)',
    border: 'none',
    borderRadius: 6,
    color: '#fff',
    cursor: 'pointer',
    fontSize: 12,
    fontWeight: 600 as const,
  };

  return (
    <Modal open={open} onClose={closeModal} title="Share Diagram">
      {/* URL Section */}
      <div style={{ marginBottom: 16 }}>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: 6,
          }}
        >
          <label style={{ fontSize: 12, color: 'var(--text-muted)', fontWeight: 600 }}>
            Share URL
          </label>
          <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>
            {shareUrl.length} chars
          </span>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <input
            readOnly
            value={shareUrl}
            style={{
              flex: 1,
              background: 'var(--bg-elevated)',
              border: '1px solid var(--border-default)',
              borderRadius: 6,
              padding: '8px 10px',
              color: 'var(--text-primary)',
              fontSize: 12,
              outline: 'none',
            }}
            onClick={(e) => (e.target as HTMLInputElement).select()}
          />
          <button onClick={copyUrl} style={buttonStyle}>
            {urlCopied ? 'Copied!' : 'Copy'}
          </button>
        </div>
      </div>

      {/* JSON Section */}
      <div>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: 6,
          }}
        >
          <label style={{ fontSize: 12, color: 'var(--text-muted)', fontWeight: 600 }}>
            JSON Export
          </label>
          <button onClick={copyJson} style={buttonStyle}>
            {jsonCopied ? 'Copied!' : 'Copy JSON'}
          </button>
        </div>
        <textarea
          readOnly
          value={jsonStr}
          style={{
            width: '100%',
            height: 200,
            background: 'var(--bg-elevated)',
            border: '1px solid var(--border-default)',
            borderRadius: 6,
            padding: 10,
            color: 'var(--text-primary)',
            fontSize: 12,
            fontFamily: 'monospace',
            resize: 'vertical',
            outline: 'none',
          }}
        />
      </div>
    </Modal>
  );
}

import { useStore } from '@/store';
import { NODE_TYPE_REGISTRY } from '@/types/node-types';
import { NodeTypeButton } from '@/components/toolbar/NodeTypeButton';
import { LibraryPopover } from '@/components/toolbar/LibraryPopover';
import { useRef, useState, useEffect } from 'react';

export function Toolbar() {
  const stampMode = useStore((s) => s.stampMode);
  const setStampMode = useStore((s) => s.setStampMode);
  const nodes = useStore((s) => s.nodes);
  const [saved, setSaved] = useState(false);
  const saveTimer = useRef<ReturnType<typeof setTimeout>>();

  useEffect(() => {
    if (nodes.length > 0) {
      setSaved(true);
      clearTimeout(saveTimer.current);
      saveTimer.current = setTimeout(() => setSaved(false), 2000);
    }
  }, [nodes]);

  return (
    <div
      style={{
        height: 48,
        background: 'var(--toolbar-bg)',
        backdropFilter: 'blur(12px)',
        borderBottom: '1px solid var(--border-default)',
        display: 'flex',
        alignItems: 'center',
        padding: '0 12px',
        gap: 4,
        zIndex: 10,
      }}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 4,
          flex: 1,
        }}
      >
        {NODE_TYPE_REGISTRY.map((nt) => (
          <NodeTypeButton
            key={nt.kind}
            kind={nt.kind}
            label={nt.label}
            shortcut={nt.shortcut}
            active={stampMode === nt.kind}
            onClick={() =>
              setStampMode(stampMode === nt.kind ? null : nt.kind)
            }
          />
        ))}
        <div style={{ width: 1, height: 24, background: 'var(--border-default)', margin: '0 4px' }} />
        <LibraryPopover />
      </div>

      {/* Save indicator */}
      <div
        style={{
          fontSize: 11,
          color: 'var(--text-muted)',
          opacity: saved ? 1 : 0,
          transition: 'opacity 0.3s ease',
          whiteSpace: 'nowrap',
        }}
      >
        Saved
      </div>
    </div>
  );
}

import { useState, useRef, useEffect } from 'react';
import { useStore } from '@/store';
import { sanitizeSvg } from '@/lib/sanitize';

export function LibraryPopover() {
  const [open, setOpen] = useState(false);
  const libraryIcons = useStore((s) => s.libraryIcons);
  const customStampId = useStore((s) => s.customStampId);
  const setCustomStampId = useStore((s) => s.setCustomStampId);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [open]);

  if (libraryIcons.length === 0) return null;

  return (
    <div ref={ref} style={{ position: 'relative' }}>
      <button
        onClick={() => setOpen(!open)}
        title="Library icons"
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 6,
          padding: '6px 10px',
          background: customStampId ? 'rgba(168, 85, 247, 0.2)' : open ? 'var(--bg-elevated)' : 'transparent',
          border: customStampId ? '1px solid var(--accent-purple)' : '1px solid transparent',
          borderRadius: 8,
          color: customStampId ? 'var(--accent-purple)' : 'var(--text-secondary)',
          cursor: 'pointer',
          fontSize: 12,
          fontWeight: 500,
          transition: 'all 0.15s ease',
          whiteSpace: 'nowrap',
          animation: customStampId ? 'glow-pulse 2s ease-in-out infinite' : undefined,
        }}
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M4 20h16a2 2 0 002-2V8a2 2 0 00-2-2h-7.93a2 2 0 01-1.66-.9l-.82-1.2A2 2 0 007.93 3H4a2 2 0 00-2 2v13c0 1.1.9 2 2 2z" />
        </svg>
        <span>Library</span>
        <span
          style={{
            fontSize: 10,
            color: 'var(--text-muted)',
            background: 'var(--bg-surface)',
            padding: '1px 5px',
            borderRadius: 4,
          }}
        >
          {libraryIcons.length}
        </span>
      </button>

      {open && (
        <div
          style={{
            position: 'absolute',
            top: '100%',
            left: 0,
            marginTop: 4,
            background: 'var(--bg-secondary)',
            border: '1px solid var(--border-default)',
            borderRadius: 12,
            padding: 12,
            boxShadow: '0 8px 32px rgba(0,0,0,0.3)',
            zIndex: 100,
            minWidth: 240,
            maxWidth: 360,
            maxHeight: 300,
            overflow: 'auto',
          }}
        >
          <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-muted)', marginBottom: 8 }}>
            Click to stamp on canvas
          </div>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(64px, 1fr))',
              gap: 8,
            }}
          >
            {libraryIcons.map((icon) => {
              const iconId = icon.id.replace('library:', '');
              const isActive = customStampId === iconId;
              return (
                <button
                  key={icon.id}
                  onClick={() => {
                    setCustomStampId(isActive ? null : iconId);
                    setOpen(false);
                  }}
                  title={icon.name}
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: 4,
                    padding: 8,
                    background: isActive ? 'rgba(168, 85, 247, 0.2)' : 'var(--bg-elevated)',
                    border: isActive ? '1px solid var(--accent-purple)' : '1px solid var(--border-default)',
                    borderRadius: 8,
                    cursor: 'pointer',
                    transition: 'all 0.15s ease',
                  }}
                >
                  <div
                    style={{
                      width: 32,
                      height: 32,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: 'var(--accent-purple)',
                    }}
                    dangerouslySetInnerHTML={{ __html: sanitizeSvg(icon.svgContent) }}
                  />
                  <span
                    style={{
                      fontSize: 9,
                      color: 'var(--text-muted)',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap',
                      width: '100%',
                      textAlign: 'center',
                    }}
                  >
                    {icon.name}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

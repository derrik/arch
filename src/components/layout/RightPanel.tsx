import { useCallback, type ReactNode } from 'react';
import { useStore } from '@/store';
import { useTheme } from '@/hooks/useTheme';
import { IconButton } from '@/components/shared/IconButton';
import { openWelcomeModal } from '@/components/modals/WelcomeModal';

export function RightPanel() {
  const toolMode = useStore((s) => s.toolMode);
  const stampMode = useStore((s) => s.stampMode);
  const setToolMode = useStore((s) => s.setToolMode);
  const setStampMode = useStore((s) => s.setStampMode);
  const openModal = useStore((s) => s.openModal);
  const { theme, toggleTheme } = useTheme();

  const handleCenterGraph = useCallback(() => {
    window.dispatchEvent(new CustomEvent('arch:fitView'));
  }, []);

  const handleFullscreen = useCallback(() => {
    if (document.fullscreenElement) {
      document.exitFullscreen();
    } else {
      document.documentElement.requestFullscreen();
    }
  }, []);

  const isPointerMode = !stampMode && !toolMode;

  return (
    <div
      style={{
        width: 64,
        background: 'var(--bg-secondary)',
        borderLeft: '1px solid var(--border-default)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        padding: '12px 0',
        gap: 2,
        zIndex: 10,
        overflowY: 'auto',
      }}
    >
      <SectionLabel>Tools</SectionLabel>

      <LabeledButton
        label="Pointer"
        active={isPointerMode}
        onClick={() => { setStampMode(null); setToolMode(null); }}
        title="Pointer mode (Esc)"
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M3 3l7.07 16.97 2.51-7.39 7.39-2.51L3 3z" />
        </svg>
      </LabeledButton>

      <LabeledButton
        label="Group"
        active={toolMode?.type === 'group'}
        onClick={() => setToolMode(toolMode?.type === 'group' ? null : { type: 'group' })}
        title="Group / Boundary"
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeDasharray="4 2">
          <rect x="3" y="3" width="18" height="18" rx="3" />
        </svg>
      </LabeledButton>

      <LabeledButton
        label="Note"
        active={toolMode?.type === 'note'}
        onClick={() => setToolMode(toolMode?.type === 'note' ? null : { type: 'note' })}
        title="Note / Annotation"
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
          <polyline points="14,2 14,8 20,8" />
          <line x1="16" y1="13" x2="8" y2="13" />
          <line x1="16" y1="17" x2="8" y2="17" />
        </svg>
      </LabeledButton>

      <Separator />

      <SectionLabel>Actions</SectionLabel>

      <LabeledButton label="Center" onClick={handleCenterGraph} title="Center graph">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7" />
        </svg>
      </LabeledButton>

      <LabeledButton label="Share" onClick={() => openModal('share')} title="Share">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M4 12v8a2 2 0 002 2h12a2 2 0 002-2v-8" />
          <polyline points="16,6 12,2 8,6" />
          <line x1="12" y1="2" x2="12" y2="15" />
        </svg>
      </LabeledButton>

      <LabeledButton label="Import" onClick={() => openModal('import')} title="Import JSON">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" />
          <polyline points="7,10 12,15 17,10" />
          <line x1="12" y1="15" x2="12" y2="3" />
        </svg>
      </LabeledButton>

      <LabeledButton label="AI" onClick={() => openModal('ai-prompt')} title="AI diagram prompt">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M12 2l1.09 3.26L16 6l-2.91.74L12 10l-1.09-3.26L8 6l2.91-.74L12 2z" />
          <path d="M18 10l.6 1.8L20.4 12.4l-1.8.6L18 14.8l-.6-1.8-1.8-.6 1.8-.6L18 10z" />
          <path d="M7 14l.8 2.4L10.2 17.2l-2.4.8L7 20.4l-.8-2.4-2.4-.8 2.4-.8L7 14z" />
        </svg>
      </LabeledButton>

      <LabeledButton label="Fullscreen" onClick={handleFullscreen} title="Toggle fullscreen">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M8 3H5a2 2 0 00-2 2v3m18 0V5a2 2 0 00-2-2h-3m0 18h3a2 2 0 002-2v-3M3 16v3a2 2 0 002 2h3" />
        </svg>
      </LabeledButton>

      <div style={{ flex: 1 }} />

      <LabeledButton
        label={theme === 'dark' ? 'Light' : 'Dark'}
        onClick={toggleTheme}
        title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
      >
        {theme === 'dark' ? (
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="5" />
            <line x1="12" y1="1" x2="12" y2="3" />
            <line x1="12" y1="21" x2="12" y2="23" />
            <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
            <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
            <line x1="1" y1="12" x2="3" y2="12" />
            <line x1="21" y1="12" x2="23" y2="12" />
            <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
            <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
          </svg>
        ) : (
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z" />
          </svg>
        )}
      </LabeledButton>

      <LabeledButton label="Help" onClick={openWelcomeModal} title="About Arch (?)">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="12" cy="12" r="10" />
          <path d="M9.09 9a3 3 0 015.83 1c0 2-3 3-3 3" />
          <line x1="12" y1="17" x2="12.01" y2="17" />
        </svg>
      </LabeledButton>
    </div>
  );
}

function LabeledButton({
  label,
  active,
  onClick,
  title,
  children,
}: {
  label: string;
  active?: boolean;
  onClick: () => void;
  title: string;
  children: ReactNode;
}) {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 2,
        marginBottom: 4,
      }}
    >
      <IconButton active={active} onClick={onClick} title={title}>
        {children}
      </IconButton>
      <span
        style={{
          fontSize: 9,
          fontWeight: 500,
          color: active ? 'var(--accent-purple)' : 'var(--text-muted)',
          lineHeight: 1,
          userSelect: 'none',
        }}
      >
        {label}
      </span>
    </div>
  );
}

function SectionLabel({ children }: { children: string }) {
  return (
    <div
      style={{
        fontSize: 9,
        fontWeight: 700,
        textTransform: 'uppercase',
        letterSpacing: '0.08em',
        color: 'var(--text-muted)',
        marginBottom: 4,
        marginTop: 4,
      }}
    >
      {children}
    </div>
  );
}

function Separator() {
  return (
    <div
      style={{
        width: 24,
        height: 1,
        background: 'var(--border-default)',
        margin: '6px 0',
      }}
    />
  );
}

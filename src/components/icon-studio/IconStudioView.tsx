import { useStore } from '@/store';
import { WorkspaceGrid } from './WorkspaceGrid';
import { LibraryGrid } from './LibraryGrid';

export function IconStudioView() {
  const subView = useStore((s) => s.iconStudioSubView);
  const setSubView = useStore((s) => s.setIconStudioSubView);
  const workspaceCount = useStore((s) => s.workspaceIcons.length);
  const libraryCount = useStore((s) => s.libraryIcons.length);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', overflow: 'hidden' }}>
      {/* Tab bar */}
      <div
        style={{
          height: 48,
          background: 'var(--toolbar-bg)',
          backdropFilter: 'blur(12px)',
          borderBottom: '1px solid var(--border-default)',
          display: 'flex',
          alignItems: 'center',
          padding: '0 16px',
          gap: 4,
        }}
      >
        <TabButton
          label="Workspace"
          count={workspaceCount}
          active={subView === 'workspace'}
          onClick={() => setSubView('workspace')}
        />
        <TabButton
          label="Library"
          count={libraryCount}
          active={subView === 'library'}
          onClick={() => setSubView('library')}
        />
      </div>

      {/* Content */}
      {subView === 'workspace' ? <WorkspaceGrid /> : <LibraryGrid />}
    </div>
  );
}

function TabButton({
  label,
  count,
  active,
  onClick,
}: {
  label: string;
  count: number;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      style={{
        padding: '6px 14px',
        background: active ? 'rgba(168, 85, 247, 0.15)' : 'transparent',
        border: active ? '1px solid var(--accent-purple)' : '1px solid transparent',
        borderRadius: 8,
        color: active ? 'var(--accent-purple)' : 'var(--text-secondary)',
        fontSize: 13,
        fontWeight: 500,
        cursor: 'pointer',
        transition: 'all 0.15s ease',
        display: 'flex',
        alignItems: 'center',
        gap: 6,
      }}
    >
      {label}
      <span
        style={{
          fontSize: 10,
          background: active ? 'rgba(168, 85, 247, 0.2)' : 'var(--bg-surface)',
          padding: '1px 6px',
          borderRadius: 10,
          color: active ? 'var(--accent-purple)' : 'var(--text-muted)',
        }}
      >
        {count}
      </span>
    </button>
  );
}

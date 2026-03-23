import { useStore } from '@/store';
import { DiagramList } from '@/components/sidebar/DiagramList';
import type { ActiveView } from '@/store/ui-slice';
import type { IconStudioSubView } from '@/store/icon-studio-slice';

export function Sidebar() {
  const activeView = useStore((s) => s.activeView);
  const setActiveView = useStore((s) => s.setActiveView);

  return (
    <div
      style={{
        width: 220,
        background: 'var(--sidebar-bg)',
        borderRight: '1px solid var(--border-default)',
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
      }}
    >
      {/* Brand + view tabs */}
      <div style={{ borderBottom: '1px solid var(--border-default)' }}>
        <div
          style={{
            padding: '12px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <span
            style={{
              fontSize: 14,
              fontWeight: 700,
              color: 'var(--accent-purple)',
              letterSpacing: '0.05em',
            }}
          >
            ARCH
          </span>
        </div>

        <div style={{ display: 'flex', padding: '0 8px 8px', gap: 4 }}>
          <ViewTab
            label="Design"
            active={activeView === 'design'}
            onClick={() => setActiveView('design')}
          />
          <ViewTab
            label="Icons"
            active={activeView === 'icon-studio'}
            onClick={() => setActiveView('icon-studio')}
          />
        </div>
      </div>

      {/* Contextual sidebar content */}
      {activeView === 'design' ? <DesignSidebar /> : <IconStudioSidebar />}
    </div>
  );
}

function DesignSidebar() {
  const createDiagram = useStore((s) => s.createDiagram);
  const switchDiagram = useStore((s) => s.switchDiagram);

  const handleNew = async () => {
    const diagram = await createDiagram();
    switchDiagram(diagram.id);
  };

  return (
    <>
      <div
        style={{
          padding: '8px 12px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <span style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--text-muted)' }}>
          Diagrams
        </span>
        <button
          onClick={handleNew}
          title="New diagram"
          style={{
            background: 'var(--bg-elevated)',
            border: '1px solid var(--border-default)',
            color: 'var(--text-secondary)',
            borderRadius: 6,
            padding: '3px 8px',
            fontSize: 11,
            cursor: 'pointer',
            transition: 'all 0.15s ease',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.borderColor = 'var(--accent-purple)';
            e.currentTarget.style.color = 'var(--accent-purple)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.borderColor = 'var(--border-default)';
            e.currentTarget.style.color = 'var(--text-secondary)';
          }}
        >
          + New
        </button>
      </div>
      <DiagramList />
    </>
  );
}

function IconStudioSidebar() {
  const subView = useStore((s) => s.iconStudioSubView);
  const setSubView = useStore((s) => s.setIconStudioSubView);
  const workspaceIcons = useStore((s) => s.workspaceIcons);
  const libraryIcons = useStore((s) => s.libraryIcons);
  const refreshIcons = useStore((s) => s.refreshIcons);

  // Workspace folders
  const folders = new Set<string>();
  for (const icon of workspaceIcons) {
    folders.add(icon.folder ?? 'ungrouped');
  }

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
      <div style={{ padding: '8px 12px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <span style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--text-muted)' }}>
          Icon Studio
        </span>
        <button
          onClick={refreshIcons}
          title="Refresh icons"
          style={{
            background: 'var(--bg-elevated)',
            border: '1px solid var(--border-default)',
            color: 'var(--text-secondary)',
            borderRadius: 6,
            padding: '3px 8px',
            fontSize: 11,
            cursor: 'pointer',
          }}
        >
          Refresh
        </button>
      </div>

      <div style={{ flex: 1, overflow: 'auto' }}>
        <SidebarNavItem
          label="Workspace"
          count={workspaceIcons.length}
          active={subView === 'workspace'}
          onClick={() => setSubView('workspace')}
        />
        {[...folders].map((folder) => (
          <SidebarNavItem
            key={folder}
            label={folder === 'ungrouped' ? 'Root' : folder}
            indent
            count={workspaceIcons.filter((i) => (i.folder ?? 'ungrouped') === folder).length}
            active={false}
            onClick={() => setSubView('workspace')}
          />
        ))}
        <SidebarNavItem
          label="Library"
          count={libraryIcons.length}
          active={subView === 'library'}
          onClick={() => setSubView('library')}
        />
      </div>
    </div>
  );
}

function SidebarNavItem({
  label,
  count,
  active,
  indent,
  onClick,
}: {
  label: string;
  count: number;
  active: boolean;
  indent?: boolean;
  onClick: () => void;
}) {
  return (
    <div
      onClick={onClick}
      style={{
        padding: `6px 12px 6px ${indent ? 28 : 12}px`,
        background: active ? 'var(--bg-elevated)' : 'transparent',
        borderLeft: active ? '2px solid var(--accent-purple)' : '2px solid transparent',
        cursor: 'pointer',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        transition: 'background 0.15s ease',
        fontSize: 13,
        color: active ? 'var(--text-primary)' : 'var(--text-secondary)',
        fontWeight: active ? 600 : 400,
      }}
    >
      <span>{label}</span>
      <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>{count}</span>
    </div>
  );
}

function ViewTab({ label, active, onClick }: { label: string; active: boolean; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      style={{
        flex: 1,
        padding: '5px 0',
        background: active ? 'var(--bg-elevated)' : 'transparent',
        border: active ? '1px solid var(--border-active)' : '1px solid transparent',
        borderRadius: 6,
        color: active ? 'var(--text-primary)' : 'var(--text-muted)',
        fontSize: 12,
        fontWeight: active ? 600 : 400,
        cursor: 'pointer',
        transition: 'all 0.15s ease',
      }}
    >
      {label}
    </button>
  );
}

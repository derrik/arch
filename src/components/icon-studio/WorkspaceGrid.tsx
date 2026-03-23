import { useStore } from '@/store';
import { IconCard } from './IconCard';
import { IconDetail } from './IconDetail';

export function WorkspaceGrid() {
  const icons = useStore((s) => s.workspaceIcons);
  const selectedIconId = useStore((s) => s.selectedIconId);
  const setSelectedIconId = useStore((s) => s.setSelectedIconId);

  const selectedIcon = icons.find((i) => i.id === selectedIconId);

  // Group by folder
  const grouped = new Map<string, typeof icons>();
  for (const icon of icons) {
    const key = icon.folder ?? 'ungrouped';
    if (!grouped.has(key)) grouped.set(key, []);
    grouped.get(key)!.push(icon);
  }

  if (icons.length === 0) {
    return (
      <div
        style={{
          flex: 1,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'var(--text-muted)',
          padding: 40,
        }}
      >
        <div style={{ textAlign: 'center', maxWidth: 400 }}>
          <div style={{ fontSize: 16, marginBottom: 12 }}>No workspace icons yet</div>
          <div style={{ fontSize: 13, lineHeight: 1.6 }}>
            Use Claude Code to generate SVG icons into
            <code
              style={{
                background: 'var(--bg-elevated)',
                padding: '2px 6px',
                borderRadius: 4,
                fontSize: 12,
                margin: '0 4px',
              }}
            >
              assets/icons/workspace/
            </code>
            and they will appear here automatically via HMR.
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
      {/* Grid */}
      <div style={{ flex: 1, overflow: 'auto', padding: 20 }}>
        {[...grouped.entries()].map(([folder, folderIcons]) => (
          <div key={folder} style={{ marginBottom: 24 }}>
            <div
              style={{
                fontSize: 11,
                fontWeight: 700,
                textTransform: 'uppercase',
                letterSpacing: '0.08em',
                color: 'var(--text-muted)',
                marginBottom: 12,
              }}
            >
              {folder === 'ungrouped' ? 'Workspace' : folder}
            </div>
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(120px, 1fr))',
                gap: 12,
              }}
            >
              {folderIcons.map((icon) => (
                <IconCard
                  key={icon.id}
                  icon={icon}
                  selected={selectedIconId === icon.id}
                  onSelect={() => setSelectedIconId(selectedIconId === icon.id ? null : icon.id)}
                />
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Detail panel */}
      {selectedIcon && (
        <div style={{ width: 280, flexShrink: 0 }}>
          <IconDetail icon={selectedIcon} />
        </div>
      )}
    </div>
  );
}

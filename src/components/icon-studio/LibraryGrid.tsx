import { useStore } from '@/store';
import { IconCard } from './IconCard';
import { IconDetail } from './IconDetail';

export function LibraryGrid() {
  const icons = useStore((s) => s.libraryIcons);
  const selectedIconId = useStore((s) => s.selectedIconId);
  const setSelectedIconId = useStore((s) => s.setSelectedIconId);

  const selectedIcon = icons.find((i) => i.id === selectedIconId);

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
          <div style={{ fontSize: 16, marginBottom: 12 }}>Library is empty</div>
          <div style={{ fontSize: 13, lineHeight: 1.6 }}>
            Publish icons from the workspace to build your library.
            Published icons become available as node types on the design canvas.
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
      {/* Grid */}
      <div style={{ flex: 1, overflow: 'auto', padding: 20 }}>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(120px, 1fr))',
            gap: 12,
          }}
        >
          {icons.map((icon) => (
            <IconCard
              key={icon.id}
              icon={icon}
              selected={selectedIconId === icon.id}
              onSelect={() => setSelectedIconId(selectedIconId === icon.id ? null : icon.id)}
            />
          ))}
        </div>
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

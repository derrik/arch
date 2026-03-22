import { useStore } from '@/store';
import { DiagramList } from '@/components/sidebar/DiagramList';

export function Sidebar() {
  const createDiagram = useStore((s) => s.createDiagram);
  const switchDiagram = useStore((s) => s.switchDiagram);

  const handleNew = async () => {
    const diagram = await createDiagram();
    switchDiagram(diagram.id);
  };

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
      <div
        style={{
          padding: '12px',
          borderBottom: '1px solid var(--border-default)',
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
        <button
          onClick={handleNew}
          title="New diagram"
          style={{
            background: 'var(--bg-elevated)',
            border: '1px solid var(--border-default)',
            color: 'var(--text-secondary)',
            borderRadius: 6,
            padding: '4px 10px',
            fontSize: 12,
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
    </div>
  );
}

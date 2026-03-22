import { useStore } from '@/store';
import { DiagramItem } from './DiagramItem';

export function DiagramList() {
  const diagrams = useStore((s) => s.diagrams);
  const activeDiagramId = useStore((s) => s.activeDiagramId);
  const switchDiagram = useStore((s) => s.switchDiagram);
  const renameDiagram = useStore((s) => s.renameDiagram);
  const duplicateDiagram = useStore((s) => s.duplicateDiagram);
  const openModal = useStore((s) => s.openModal);

  return (
    <div style={{ flex: 1, overflowY: 'auto' }}>
      {diagrams.map((d) => (
        <DiagramItem
          key={d.id}
          id={d.id}
          name={d.name}
          active={d.id === activeDiagramId}
          updatedAt={d.updatedAt}
          onSelect={() => switchDiagram(d.id)}
          onRename={(name) => renameDiagram(d.id, name)}
          onDuplicate={() => duplicateDiagram(d.id)}
          onDelete={() => openModal('delete-confirm', d.id)}
        />
      ))}
    </div>
  );
}

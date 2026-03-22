import { useStore } from '@/store';
import { Modal } from './Modal';

export function DeleteConfirm() {
  const activeModal = useStore((s) => s.activeModal);
  const deleteTargetId = useStore((s) => s.deleteTargetId);
  const closeModal = useStore((s) => s.closeModal);
  const deleteDiagram = useStore((s) => s.deleteDiagram);
  const diagrams = useStore((s) => s.diagrams);

  const target = diagrams.find((d) => d.id === deleteTargetId);
  const open = activeModal === 'delete-confirm' && !!target;

  const handleDelete = async () => {
    if (deleteTargetId) {
      await deleteDiagram(deleteTargetId);
      closeModal();
    }
  };

  return (
    <Modal open={open} onClose={closeModal} title="Delete Diagram">
      <p style={{ color: 'var(--text-secondary)', fontSize: 14, marginBottom: 20 }}>
        Are you sure you want to delete <strong style={{ color: 'var(--text-primary)' }}>{target?.name}</strong>?
        This action cannot be undone.
      </p>
      <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
        <button
          onClick={closeModal}
          style={{
            padding: '8px 16px',
            background: 'var(--bg-elevated)',
            border: '1px solid var(--border-default)',
            borderRadius: 8,
            color: 'var(--text-secondary)',
            cursor: 'pointer',
            fontSize: 13,
          }}
        >
          Cancel
        </button>
        <button
          onClick={handleDelete}
          style={{
            padding: '8px 16px',
            background: 'var(--danger)',
            border: 'none',
            borderRadius: 8,
            color: '#fff',
            cursor: 'pointer',
            fontSize: 13,
            fontWeight: 600,
          }}
        >
          Delete
        </button>
      </div>
    </Modal>
  );
}

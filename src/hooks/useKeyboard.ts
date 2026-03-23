import { useEffect } from 'react';
import { useStore } from '@/store';
import { NODE_TYPE_REGISTRY } from '@/types/node-types';
import { openWelcomeModal } from '@/components/modals/WelcomeModal';

export function useKeyboard() {
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      // Don't handle if typing in an input
      const tag = (e.target as HTMLElement)?.tagName;
      if (tag === 'INPUT' || tag === 'TEXTAREA') return;

      const state = useStore.getState();

      // Number keys 1-8 for stamp mode
      const num = parseInt(e.key);
      if (num >= 1 && num <= 8) {
        const nodeType = NODE_TYPE_REGISTRY[num - 1];
        if (nodeType) {
          const current = state.stampMode;
          state.setStampMode(current === nodeType.kind ? null : nodeType.kind);
        }
        return;
      }

      // Escape: exit tool mode or clear selection
      if (e.key === 'Escape') {
        if (state.customStampId) {
          state.setCustomStampId(null);
        } else if (state.toolMode) {
          state.setToolMode(null);
        } else if (state.stampMode) {
          state.setStampMode(null);
        } else {
          state.clearSelection();
        }
        return;
      }

      // ? key: open help/welcome modal
      if (e.key === '?') {
        openWelcomeModal();
        return;
      }

      // Delete/Backspace: remove selected nodes and edges
      if (e.key === 'Delete' || e.key === 'Backspace') {
        if (state.selectedNodeIds.length > 0) {
          state.removeNodes(state.selectedNodeIds);
        }
        if (state.selectedEdgeIds.length > 0) {
          state.removeEdges(state.selectedEdgeIds);
        }
        state.clearSelection();
        return;
      }
    }

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);
}

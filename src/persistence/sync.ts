import { useStore } from '@/store';
import { PERSISTENCE_DEBOUNCE_MS } from '@/lib/constants';

let timer: ReturnType<typeof setTimeout> | null = null;

export function startPersistenceSync() {
  return useStore.subscribe((state, prev) => {
    if (
      state.nodes !== prev.nodes ||
      state.edges !== prev.edges ||
      state.groups !== prev.groups ||
      state.notes !== prev.notes ||
      state.viewport !== prev.viewport
    ) {
      if (timer) clearTimeout(timer);
      timer = setTimeout(() => {
        state.saveCurrentDiagram();
      }, PERSISTENCE_DEBOUNCE_MS);
    }
  });
}

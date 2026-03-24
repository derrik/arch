import { StateCreator } from 'zustand';
import { ArchNode, ArchEdge, ArchGroup, ArchNote, ArchViewport } from '@/types/graph';

interface GraphSnapshot {
  nodes: ArchNode[];
  edges: ArchEdge[];
  groups: ArchGroup[];
  notes: ArchNote[];
  viewport: ArchViewport;
}

const MAX_HISTORY = 100;

export interface HistorySlice {
  /** @internal */ _undoStack: GraphSnapshot[];
  /** @internal */ _redoStack: GraphSnapshot[];
  /** @internal */ _isDragging: boolean;
  /** @internal */ _dragSnapshot: GraphSnapshot | null;

  /** Push current graph state onto undo stack (called before mutations). */
  pushHistory: () => void;
  undo: () => void;
  redo: () => void;
  canUndo: () => boolean;
  canRedo: () => boolean;

  /** Call on drag start to capture a single snapshot for the whole drag. */
  startDrag: () => void;
  /** Call on drag end to commit the drag snapshot to history. */
  endDrag: () => void;
}

export const createHistorySlice: StateCreator<
  HistorySlice & { nodes: ArchNode[]; edges: ArchEdge[]; groups: ArchGroup[]; notes: ArchNote[]; viewport: ArchViewport },
  [],
  [],
  HistorySlice
> = (set, get) => ({
  _undoStack: [],
  _redoStack: [],
  _isDragging: false,
  _dragSnapshot: null,

  pushHistory: () => {
    // If we're mid-drag, don't push — the drag snapshot handles it
    if (get()._isDragging) return;

    const { nodes, edges, groups, notes, viewport } = get();
    const snapshot: GraphSnapshot = { nodes, edges, groups, notes, viewport };
    set(state => ({
      _undoStack: [...state._undoStack.slice(-(MAX_HISTORY - 1)), snapshot],
      _redoStack: [], // Clear redo on new action
    }));
  },

  undo: () => {
    const { _undoStack } = get();
    if (_undoStack.length === 0) return;

    const { nodes, edges, groups, notes, viewport } = get();
    const current: GraphSnapshot = { nodes, edges, groups, notes, viewport };
    const prev = _undoStack[_undoStack.length - 1];

    set({
      _undoStack: _undoStack.slice(0, -1),
      _redoStack: [...get()._redoStack, current],
      nodes: prev.nodes,
      edges: prev.edges,
      groups: prev.groups,
      notes: prev.notes,
      viewport: prev.viewport,
    });
  },

  redo: () => {
    const { _redoStack } = get();
    if (_redoStack.length === 0) return;

    const { nodes, edges, groups, notes, viewport } = get();
    const current: GraphSnapshot = { nodes, edges, groups, notes, viewport };
    const next = _redoStack[_redoStack.length - 1];

    set({
      _redoStack: _redoStack.slice(0, -1),
      _undoStack: [...get()._undoStack, current],
      nodes: next.nodes,
      edges: next.edges,
      groups: next.groups,
      notes: next.notes,
      viewport: next.viewport,
    });
  },

  canUndo: () => get()._undoStack.length > 0,
  canRedo: () => get()._redoStack.length > 0,

  startDrag: () => {
    const { nodes, edges, groups, notes, viewport } = get();
    set({
      _isDragging: true,
      _dragSnapshot: { nodes, edges, groups, notes, viewport },
    });
  },

  endDrag: () => {
    const { _dragSnapshot } = get();
    if (_dragSnapshot) {
      set(state => ({
        _undoStack: [...state._undoStack.slice(-(MAX_HISTORY - 1)), _dragSnapshot],
        _redoStack: [],
        _isDragging: false,
        _dragSnapshot: null,
      }));
    } else {
      set({ _isDragging: false, _dragSnapshot: null });
    }
  },
});

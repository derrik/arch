import { StateCreator } from 'zustand';
import { NodeKind } from '@/types/node-types';

export type ToolMode = { type: 'stamp'; kind: NodeKind } | { type: 'group' } | { type: 'note' } | null;
export type ModalType = 'share' | 'delete-confirm' | 'import' | null;

export interface UISlice {
  toolMode: ToolMode;
  stampMode: NodeKind | null; // kept for backward compat
  selectedNodeIds: string[];
  selectedEdgeIds: string[];
  highlightedNodeIds: string[];
  isConnecting: boolean;
  activeModal: ModalType;
  deleteTargetId: string | null;
  setToolMode: (mode: ToolMode) => void;
  setStampMode: (mode: NodeKind | null) => void;
  setSelection: (nodeIds: string[], edgeIds: string[]) => void;
  clearSelection: () => void;
  setHighlightedNodeIds: (ids: string[]) => void;
  setIsConnecting: (connecting: boolean) => void;
  openModal: (modal: NonNullable<ModalType>, targetId?: string) => void;
  closeModal: () => void;
}

function arraysEqual(a: string[], b: string[]): boolean {
  if (a.length !== b.length) return false;
  for (let i = 0; i < a.length; i++) {
    if (a[i] !== b[i]) return false;
  }
  return true;
}

export const createUISlice: StateCreator<UISlice, [], [], UISlice> = (set, get) => ({
  toolMode: null,
  stampMode: null,
  selectedNodeIds: [],
  selectedEdgeIds: [],
  highlightedNodeIds: [],
  isConnecting: false,
  activeModal: null,
  deleteTargetId: null,

  setToolMode: (mode) => set({
    toolMode: mode,
    stampMode: mode?.type === 'stamp' ? mode.kind : null,
  }),

  setStampMode: (mode) => set({
    stampMode: mode,
    toolMode: mode ? { type: 'stamp', kind: mode } : null,
  }),

  setSelection: (nodeIds, edgeIds) => {
    const state = get();
    if (arraysEqual(state.selectedNodeIds, nodeIds) && arraysEqual(state.selectedEdgeIds, edgeIds)) return;
    set({ selectedNodeIds: nodeIds, selectedEdgeIds: edgeIds });
  },

  clearSelection: () => set({
    selectedNodeIds: [],
    selectedEdgeIds: [],
    highlightedNodeIds: [],
  }),

  setHighlightedNodeIds: (ids) => {
    const state = get();
    if (arraysEqual(state.highlightedNodeIds, ids)) return;
    set({ highlightedNodeIds: ids });
  },

  setIsConnecting: (connecting) => set({ isConnecting: connecting }),

  openModal: (modal, targetId) => set({
    activeModal: modal,
    deleteTargetId: targetId ?? null,
  }),

  closeModal: () => set({ activeModal: null, deleteTargetId: null }),
});

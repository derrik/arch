import { StateCreator } from 'zustand';
import { Diagram } from '@/types/graph';
import { createId } from '@/lib/id';
import { DEFAULT_DIAGRAM_NAME } from '@/lib/constants';
import { getAllDiagrams, saveDiagram, deleteDiagram as dbDeleteDiagram } from '@/persistence/db';
import type { GraphSlice } from './graph-slice';

export interface DiagramsSlice {
  diagrams: Diagram[];
  activeDiagramId: string | null;
  diagramsLoaded: boolean;
  loadDiagrams: () => Promise<void>;
  createDiagram: (name?: string) => Promise<Diagram>;
  switchDiagram: (id: string) => void;
  renameDiagram: (id: string, name: string) => Promise<void>;
  deleteDiagram: (id: string) => Promise<void>;
  duplicateDiagram: (id: string) => Promise<Diagram>;
  saveCurrentDiagram: () => Promise<void>;
}

function getCurrentGraph(state: GraphSlice) {
  return {
    nodes: state.nodes,
    edges: state.edges,
    groups: state.groups,
    notes: state.notes,
    viewport: state.viewport,
  };
}

export const createDiagramsSlice: StateCreator<
  DiagramsSlice & GraphSlice,
  [],
  [],
  DiagramsSlice
> = (set, get) => ({
  diagrams: [],
  activeDiagramId: null,
  diagramsLoaded: false,

  loadDiagrams: async () => {
    const diagrams = await getAllDiagrams();
    if (diagrams.length === 0) {
      const diagram = await get().createDiagram();
      set({ diagramsLoaded: true });
      get().switchDiagram(diagram.id);
      return;
    }
    diagrams.sort((a, b) => b.updatedAt - a.updatedAt);
    set({ diagrams, diagramsLoaded: true });
    get().switchDiagram(diagrams[0].id);
  },

  createDiagram: async (name?: string) => {
    const now = Date.now();
    const diagram: Diagram = {
      id: createId(),
      name: name ?? DEFAULT_DIAGRAM_NAME,
      graph: { nodes: [], edges: [], groups: [], notes: [], viewport: { x: 0, y: 0, zoom: 1 } },
      createdAt: now,
      updatedAt: now,
    };
    await saveDiagram(diagram);
    set(state => ({ diagrams: [diagram, ...state.diagrams] }));
    return diagram;
  },

  switchDiagram: (id) => {
    const state = get();
    if (state.activeDiagramId) {
      const current = state.diagrams.find(d => d.id === state.activeDiagramId);
      if (current) {
        const updated = {
          ...current,
          graph: getCurrentGraph(state),
          updatedAt: Date.now(),
        };
        saveDiagram(updated);
        set(s => ({
          diagrams: s.diagrams.map(d => d.id === updated.id ? updated : d),
        }));
      }
    }

    const target = state.diagrams.find(d => d.id === id);
    if (target) {
      state.loadGraph(target.graph);
      set({ activeDiagramId: id });
    }
  },

  renameDiagram: async (id, name) => {
    set(state => ({
      diagrams: state.diagrams.map(d =>
        d.id === id ? { ...d, name, updatedAt: Date.now() } : d
      ),
    }));
    const diagram = get().diagrams.find(d => d.id === id);
    if (diagram) await saveDiagram(diagram);
  },

  deleteDiagram: async (id) => {
    await dbDeleteDiagram(id);
    const remaining = get().diagrams.filter(d => d.id !== id);
    set({ diagrams: remaining });

    if (get().activeDiagramId === id) {
      // Clear the canvas immediately so the user sees the deletion
      get().clearGraph();
      if (remaining.length > 0) {
        get().switchDiagram(remaining[0].id);
      } else {
        set({ activeDiagramId: null });
        const newDiagram = await get().createDiagram();
        get().switchDiagram(newDiagram.id);
      }
    }
  },

  duplicateDiagram: async (id) => {
    const source = get().diagrams.find(d => d.id === id);
    if (!source) throw new Error('Diagram not found');

    const state = get();
    const graph = id === state.activeDiagramId ? getCurrentGraph(state) : source.graph;

    const now = Date.now();
    const diagram: Diagram = {
      id: createId(),
      name: `${source.name} (copy)`,
      graph: JSON.parse(JSON.stringify(graph)),
      createdAt: now,
      updatedAt: now,
    };
    await saveDiagram(diagram);
    set(s => ({ diagrams: [diagram, ...s.diagrams] }));
    return diagram;
  },

  saveCurrentDiagram: async () => {
    const state = get();
    if (!state.activeDiagramId) return;
    const diagram = state.diagrams.find(d => d.id === state.activeDiagramId);
    if (!diagram) return;
    const updated = {
      ...diagram,
      graph: getCurrentGraph(state),
      updatedAt: Date.now(),
    };
    await saveDiagram(updated);
    set(s => ({
      diagrams: s.diagrams.map(d => d.id === updated.id ? updated : d),
    }));
  },
});

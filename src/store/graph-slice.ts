import { StateCreator } from 'zustand';
import { ArchNode, ArchEdge, ArchGroup, ArchNote, ArchViewport, ArchGraph } from '@/types/graph';
import { NodeKind } from '@/types/node-types';
import { createId } from '@/lib/id';
import { DEFAULT_LABELS } from '@/lib/constants';
import { computeHandles } from '@/lib/auto-handle';

export interface GraphSlice {
  nodes: ArchNode[];
  edges: ArchEdge[];
  groups: ArchGroup[];
  notes: ArchNote[];
  viewport: ArchViewport;
  addNode: (kind: NodeKind, x: number, y: number, customIconId?: string | null) => ArchNode;
  updateNode: (id: string, updates: Partial<Pick<ArchNode, 'label' | 'x' | 'y'>>) => void;
  removeNodes: (ids: string[]) => void;
  addEdge: (source: string, target: string, sourceHandle?: string | null, targetHandle?: string | null) => ArchEdge | null;
  updateEdge: (id: string, newSource: string, newTarget: string, newSourceHandle?: string | null, newTargetHandle?: string | null) => void;
  updateEdgeLabel: (id: string, label: string) => void;
  toggleEdgeAsync: (id: string) => void;
  removeEdges: (ids: string[]) => void;
  addGroup: (label: string, x: number, y: number, width?: number, height?: number) => ArchGroup;
  updateGroup: (id: string, updates: Partial<Pick<ArchGroup, 'label' | 'x' | 'y' | 'width' | 'height'>>) => void;
  removeGroups: (ids: string[]) => void;
  addNote: (text: string, x: number, y: number, attachedTo?: string | null) => ArchNote;
  updateNote: (id: string, updates: Partial<Pick<ArchNote, 'text' | 'x' | 'y' | 'attachedTo'>>) => void;
  removeNotes: (ids: string[]) => void;
  recomputeHandlesForNode: (nodeId: string) => void;
  setViewport: (viewport: ArchViewport) => void;
  loadGraph: (graph: ArchGraph) => void;
  clearGraph: () => void;
  importJSON: (json: string) => string | null;
}

export const createGraphSlice: StateCreator<GraphSlice, [], [], GraphSlice> = (set, get) => {
  // Helper to push history before mutations. Accesses pushHistory from the
  // combined store via get() — safe because slices share the same store.
  const snap = () => {
    const store = get() as unknown as { pushHistory?: () => void };
    store.pushHistory?.();
  };

  return {
  nodes: [],
  edges: [],
  groups: [],
  notes: [],
  viewport: { x: 0, y: 0, zoom: 1 },

  addNode: (kind, x, y, customIconId = null) => {
    snap();
    const node: ArchNode = {
      id: createId(),
      kind,
      label: customIconId
        ? customIconId.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')
        : DEFAULT_LABELS[kind],
      x,
      y,
      customIconId,
    };
    set(state => ({ nodes: [...state.nodes, node] }));
    return node;
  },

  updateNode: (id, updates) => {
    snap();
    set(state => ({
      nodes: state.nodes.map(n => (n.id === id ? { ...n, ...updates } : n)),
    }));
  },

  removeNodes: (ids) => {
    snap();
    const idSet = new Set(ids);
    set(state => ({
      nodes: state.nodes.filter(n => !idSet.has(n.id)),
      edges: state.edges.filter(e => !idSet.has(e.source) && !idSet.has(e.target)),
      notes: state.notes.map(n =>
        n.attachedTo && idSet.has(n.attachedTo) ? { ...n, attachedTo: null } : n
      ),
    }));
  },

  addEdge: (source, target, sourceHandle = null, targetHandle = null) => {
    if (source === target) return null;
    const existing = get().edges.find(e => e.source === source && e.target === target);
    if (existing) return null;
    snap();

    if (!sourceHandle || !targetHandle) {
      const nodes = get().nodes;
      const sourceNode = nodes.find(n => n.id === source);
      const targetNode = nodes.find(n => n.id === target);
      if (sourceNode && targetNode) {
        const auto = computeHandles(sourceNode, targetNode);
        sourceHandle = sourceHandle || auto.sourceHandle;
        targetHandle = targetHandle || auto.targetHandle;
      }
    }

    const edge: ArchEdge = {
      id: createId(),
      source,
      target,
      sourceHandle,
      targetHandle,
      label: '',
      async: false,
    };
    set(state => ({ edges: [...state.edges, edge] }));
    return edge;
  },

  updateEdge: (id, newSource, newTarget, newSourceHandle = null, newTargetHandle = null) => {
    if (newSource === newTarget) return;
    snap();
    set(state => ({
      edges: state.edges.map(e =>
        e.id === id ? { ...e, source: newSource, target: newTarget, sourceHandle: newSourceHandle, targetHandle: newTargetHandle } : e
      ),
    }));
  },

  updateEdgeLabel: (id, label) => {
    snap();
    set(state => ({
      edges: state.edges.map(e => (e.id === id ? { ...e, label } : e)),
    }));
  },

  toggleEdgeAsync: (id) => {
    snap();
    set(state => ({
      edges: state.edges.map(e => (e.id === id ? { ...e, async: !e.async } : e)),
    }));
  },

  removeEdges: (ids) => {
    snap();
    const idSet = new Set(ids);
    set(state => ({
      edges: state.edges.filter(e => !idSet.has(e.id)),
    }));
  },

  // Groups
  addGroup: (label, x, y, width = 300, height = 200) => {
    snap();
    const group: ArchGroup = { id: createId(), label, x, y, width, height };
    set(state => ({ groups: [...state.groups, group] }));
    return group;
  },

  updateGroup: (id, updates) => {
    snap();
    set(state => ({
      groups: state.groups.map(g => (g.id === id ? { ...g, ...updates } : g)),
    }));
  },

  removeGroups: (ids) => {
    snap();
    const idSet = new Set(ids);
    set(state => ({
      groups: state.groups.filter(g => !idSet.has(g.id)),
      nodes: state.nodes.map(n =>
        n.parentId && idSet.has(n.parentId) ? { ...n, parentId: null } : n
      ),
    }));
  },

  // Notes
  addNote: (text, x, y, attachedTo = null) => {
    snap();
    const note: ArchNote = { id: createId(), text, x, y, attachedTo };
    set(state => ({ notes: [...state.notes, note] }));
    return note;
  },

  updateNote: (id, updates) => {
    snap();
    set(state => ({
      notes: state.notes.map(n => (n.id === id ? { ...n, ...updates } : n)),
    }));
  },

  removeNotes: (ids) => {
    snap();
    const idSet = new Set(ids);
    set(state => ({
      notes: state.notes.filter(n => !idSet.has(n.id)),
    }));
  },

  recomputeHandlesForNode: (nodeId) => {
    const { nodes, edges } = get();
    const nodeMap = new Map(nodes.map(n => [n.id, n]));
    const updated = edges.map(e => {
      if (e.source !== nodeId && e.target !== nodeId) return e;
      const sourceNode = nodeMap.get(e.source);
      const targetNode = nodeMap.get(e.target);
      if (!sourceNode || !targetNode) return e;
      const auto = computeHandles(sourceNode, targetNode);
      return { ...e, sourceHandle: auto.sourceHandle, targetHandle: auto.targetHandle };
    });
    set({ edges: updated });
  },

  setViewport: (viewport) => set({ viewport }),

  loadGraph: (graph) => set({
    nodes: graph.nodes ?? [],
    edges: graph.edges ?? [],
    groups: graph.groups ?? [],
    notes: graph.notes ?? [],
    viewport: graph.viewport ?? { x: 0, y: 0, zoom: 1 },
  }),

  clearGraph: () => { snap(); set({
    nodes: [], edges: [], groups: [], notes: [],
    viewport: { x: 0, y: 0, zoom: 1 },
  }); },

  importJSON: (json) => {
    try {
      snap();
      const data = JSON.parse(json);
      const diagramName: string | null = typeof data.name === 'string' && data.name.trim() ? data.name.trim() : null;
      const nodeKinds = new Set(Object.values(NodeKind));

      // Map LLM-friendly types to NodeKind
      const typeMap: Record<string, NodeKind> = {
        service: NodeKind.Service,
        database: NodeKind.Database,
        db: NodeKind.Database,
        cache: NodeKind.Cache,
        queue: NodeKind.Queue,
        gateway: NodeKind.Gateway,
        user: NodeKind.User,
        client: NodeKind.User,
        frontend: NodeKind.User,
        'external-api': NodeKind.ExternalApi,
        external: NodeKind.ExternalApi,
        api: NodeKind.Service,
        generic: NodeKind.Generic,
      };

      // Parse nodes
      const rawNodes = data.nodes || data.components || [];
      const nodeIdSet = new Set<string>();
      const nodes: ArchNode[] = rawNodes.map((n: Record<string, unknown>, i: number) => {
        const id = String(n.id || createId());
        nodeIdSet.add(id);
        const rawType = String(n.type || n.kind || 'generic').toLowerCase();
        const kind = typeMap[rawType] || (nodeKinds.has(rawType as NodeKind) ? rawType as NodeKind : NodeKind.Generic);
        return {
          id,
          kind,
          label: String(n.name || n.label || 'Component'),
          x: Number(n.x) || (150 + (i % 4) * 220),
          y: Number(n.y) || (100 + Math.floor(i / 4) * 150),
        };
      });

      // Parse edges
      const rawEdges = data.edges || data.connections || [];
      const edges: ArchEdge[] = rawEdges
        .filter((e: Record<string, unknown>) => {
          const src = String(e.from || e.source || '');
          const tgt = String(e.to || e.target || '');
          return nodeIdSet.has(src) && nodeIdSet.has(tgt) && src !== tgt;
        })
        .map((e: Record<string, unknown>) => {
          const source = String(e.from || e.source);
          const target = String(e.to || e.target);
          const srcNode = nodes.find(n => n.id === source);
          const tgtNode = nodes.find(n => n.id === target);
          let sourceHandle: string | null = null;
          let targetHandle: string | null = null;
          if (srcNode && tgtNode) {
            const auto = computeHandles(srcNode, tgtNode);
            sourceHandle = auto.sourceHandle;
            targetHandle = auto.targetHandle;
          }
          return {
            id: String(e.id || createId()),
            source,
            target,
            sourceHandle,
            targetHandle,
            label: String(e.label || ''),
            async: e.async === true || e.type === 'async',
          };
        });

      // Parse groups
      const rawGroups = data.groups || [];
      const groups: ArchGroup[] = rawGroups.map((g: Record<string, unknown>, i: number) => ({
        id: String(g.id || createId()),
        label: String(g.name || g.label || 'Group'),
        x: Number(g.x) || (50 + i * 50),
        y: Number(g.y) || (50 + i * 50),
        width: Number(g.width) || 300,
        height: Number(g.height) || 200,
      }));

      // Parse notes
      const rawNotes = data.notes || [];
      const notes: ArchNote[] = rawNotes.map((n: Record<string, unknown>, i: number) => ({
        id: String(n.id || createId()),
        text: String(n.text || ''),
        x: Number(n.x) || (600 + i * 30),
        y: Number(n.y) || (50 + i * 80),
        attachedTo: n.attachedTo && nodeIdSet.has(String(n.attachedTo)) ? String(n.attachedTo) : null,
      }));

      set({
        nodes,
        edges,
        groups,
        notes,
        viewport: { x: 0, y: 0, zoom: 1 },
      });
      return diagramName ?? '';
    } catch {
      return null;
    }
  },
}; // end return
}; // end createGraphSlice

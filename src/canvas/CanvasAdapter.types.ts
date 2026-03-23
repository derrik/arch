import { ArchNode, ArchEdge, ArchGroup, ArchNote, ArchViewport } from '@/types/graph';
import { NodeKind } from '@/types/node-types';
import type { ToolMode } from '@/store/ui-slice';

export interface CanvasAdapterProps {
  nodes: ArchNode[];
  edges: ArchEdge[];
  groups: ArchGroup[];
  notes: ArchNote[];
  viewport: ArchViewport;
  selectedNodeIds: string[];
  selectedEdgeIds: string[];
  highlightedNodeIds: string[];
  toolMode: ToolMode;
  stampMode: NodeKind | null;
  isConnecting: boolean;
  customStampId: string | null;
  onNodeMove: (id: string, x: number, y: number) => void;
  onNodeLabelChange: (id: string, label: string) => void;
  onAddNode: (kind: NodeKind, x: number, y: number) => void;
  onConnect: (source: string, target: string, sourceHandle: string | null, targetHandle: string | null) => void;
  onReconnect: (edgeId: string, newSource: string, newTarget: string, newSourceHandle: string | null, newTargetHandle: string | null) => void;
  onEdgeClick: (id: string) => void;
  onEdgeDoubleClick: (id: string) => void;
  onEdgeLabelChange: (id: string, label: string) => void;
  onSelectionChange: (nodeIds: string[], edgeIds: string[]) => void;
  onViewportChange: (viewport: ArchViewport) => void;
  onConnectStart: () => void;
  onConnectEnd: () => void;
  onDeleteSelected: (params: { nodes: { id: string }[]; edges: { id: string }[] }) => void;
  onGroupMove: (id: string, x: number, y: number) => void;
  onGroupLabelChange: (id: string, label: string) => void;
  onGroupResize: (id: string, width: number, height: number) => void;
  onNoteMoveOrUpdate: (id: string, updates: Partial<Pick<ArchNote, 'text' | 'x' | 'y'>>) => void;
  onPaneClickWithTool: (tool: NonNullable<ToolMode>, x: number, y: number) => void;
}

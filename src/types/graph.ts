import { NodeKind } from './node-types';

export interface ArchNode {
  id: string;
  kind: NodeKind;
  label: string;
  x: number;
  y: number;
  parentId?: string | null;
  customIconId?: string | null;
}

export interface ArchEdge {
  id: string;
  source: string;
  target: string;
  sourceHandle: string | null;
  targetHandle: string | null;
  label: string;
  async: boolean;
}

export interface ArchGroup {
  id: string;
  label: string;
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface ArchNote {
  id: string;
  text: string;
  x: number;
  y: number;
  attachedTo: string | null;
}

export interface ArchViewport {
  x: number;
  y: number;
  zoom: number;
}

export interface ArchGraph {
  nodes: ArchNode[];
  edges: ArchEdge[];
  groups: ArchGroup[];
  notes: ArchNote[];
  viewport: ArchViewport;
}

export interface Diagram {
  id: string;
  name: string;
  graph: ArchGraph;
  createdAt: number;
  updatedAt: number;
}

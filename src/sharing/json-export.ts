import { ArchNode, ArchEdge, ArchGroup, ArchNote, ArchViewport } from '@/types/graph';

export function exportJSON(
  nodes: ArchNode[],
  edges: ArchEdge[],
  groups: ArchGroup[],
  notes: ArchNote[],
  viewport: ArchViewport
): string {
  return JSON.stringify({ nodes, edges, groups, notes, viewport }, null, 2);
}

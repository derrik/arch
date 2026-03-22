import { compressToEncodedURIComponent } from 'lz-string';
import { ArchNode, ArchEdge, ArchGroup, ArchNote, ArchViewport } from '@/types/graph';

export function serializeGraph(
  nodes: ArchNode[],
  edges: ArchEdge[],
  groups: ArchGroup[],
  notes: ArchNote[],
  viewport: ArchViewport
): string {
  const data: Record<string, unknown> = {
    n: nodes.map((n) => [n.id, n.kind, n.label, Math.round(n.x), Math.round(n.y)]),
    e: edges.map((e) => [e.id, e.source, e.target, e.async ? 1 : 0, e.sourceHandle, e.targetHandle, e.label || undefined]),
    v: [Math.round(viewport.x), Math.round(viewport.y), +viewport.zoom.toFixed(2)],
  };
  if (groups.length > 0) {
    data.g = groups.map((g) => [g.id, g.label, Math.round(g.x), Math.round(g.y), Math.round(g.width), Math.round(g.height)]);
  }
  if (notes.length > 0) {
    data.t = notes.map((n) => [n.id, n.text, Math.round(n.x), Math.round(n.y), n.attachedTo]);
  }
  return compressToEncodedURIComponent(JSON.stringify(data));
}

export function createShareURL(
  nodes: ArchNode[],
  edges: ArchEdge[],
  groups: ArchGroup[],
  notes: ArchNote[],
  viewport: ArchViewport
): string {
  const compressed = serializeGraph(nodes, edges, groups, notes, viewport);
  return `${window.location.origin}${window.location.pathname}?g=${compressed}`;
}

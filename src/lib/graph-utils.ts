import { ArchEdge } from '@/types/graph';

/** BFS traversal to find all connected node IDs upstream of a given node */
export function getUpstream(nodeId: string, edges: ArchEdge[]): Set<string> {
  const visited = new Set<string>();
  const queue = [nodeId];
  while (queue.length > 0) {
    const current = queue.shift()!;
    for (const edge of edges) {
      if (edge.target === current && !visited.has(edge.source)) {
        visited.add(edge.source);
        queue.push(edge.source);
      }
    }
  }
  return visited;
}

/** BFS traversal to find all connected node IDs downstream of a given node */
export function getDownstream(nodeId: string, edges: ArchEdge[]): Set<string> {
  const visited = new Set<string>();
  const queue = [nodeId];
  while (queue.length > 0) {
    const current = queue.shift()!;
    for (const edge of edges) {
      if (edge.source === current && !visited.has(edge.target)) {
        visited.add(edge.target);
        queue.push(edge.target);
      }
    }
  }
  return visited;
}

/** Get all connected nodes (both upstream and downstream) */
export function getConnected(nodeId: string, edges: ArchEdge[]): Set<string> {
  const upstream = getUpstream(nodeId, edges);
  const downstream = getDownstream(nodeId, edges);
  return new Set([...upstream, ...downstream]);
}

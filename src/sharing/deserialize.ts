import { decompressFromEncodedURIComponent } from 'lz-string';
import { ArchNode, ArchEdge, ArchGroup, ArchNote, ArchViewport, ArchGraph } from '@/types/graph';
import { NodeKind } from '@/types/node-types';

export function deserializeGraph(compressed: string): ArchGraph | null {
  try {
    const json = decompressFromEncodedURIComponent(compressed);
    if (!json) return null;
    const data = JSON.parse(json);

    const nodes: ArchNode[] = (data.n || []).map(
      (t: [string, string, string, number, number]) => ({
        id: t[0],
        kind: t[1] as NodeKind,
        label: t[2],
        x: t[3],
        y: t[4],
      })
    );

    const edges: ArchEdge[] = (data.e || []).map(
      (t: (string | number | null | undefined)[]) => ({
        id: t[0] as string,
        source: t[1] as string,
        target: t[2] as string,
        async: t[3] === 1,
        sourceHandle: (t[4] as string) ?? null,
        targetHandle: (t[5] as string) ?? null,
        label: (t[6] as string) ?? '',
      })
    );

    const groups: ArchGroup[] = (data.g || []).map(
      (t: [string, string, number, number, number, number]) => ({
        id: t[0],
        label: t[1],
        x: t[2],
        y: t[3],
        width: t[4],
        height: t[5],
      })
    );

    const notes: ArchNote[] = (data.t || []).map(
      (t: [string, string, number, number, string | null]) => ({
        id: t[0],
        text: t[1],
        x: t[2],
        y: t[3],
        attachedTo: t[4] ?? null,
      })
    );

    const v = data.v || [0, 0, 1];
    const viewport: ArchViewport = { x: v[0], y: v[1], zoom: v[2] };

    return { nodes, edges, groups, notes, viewport };
  } catch {
    return null;
  }
}

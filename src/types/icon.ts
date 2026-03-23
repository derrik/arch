export interface IconMeta {
  id: string;
  name: string;
  svgContent: string;
  description: string | null;
  source: 'workspace' | 'library';
  folder?: string;
}

/** Extract description from <!-- description: ... --> comment in SVG */
export function parseIconDescription(svg: string): string | null {
  const match = svg.match(/<!--\s*description:\s*([\s\S]*?)-->/i);
  if (!match) return null;
  return match[1].trim().replace(/\s+/g, ' ');
}

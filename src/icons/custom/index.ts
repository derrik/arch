import type { IconMeta } from '@/types/icon';
import { parseIconDescription } from '@/types/icon';

const workspaceGlob = import.meta.glob<string>('/assets/icons/workspace/**/*.svg', {
  query: '?raw',
  import: 'default',
  eager: true,
});

const libraryGlob = import.meta.glob<string>('/assets/icons/library/*.svg', {
  query: '?raw',
  import: 'default',
  eager: true,
});

function pathToMeta(path: string, source: 'workspace' | 'library'): IconMeta {
  const parts = path.split('/');
  const filename = parts[parts.length - 1].replace('.svg', '');
  const id = `${source}:${filename}`;
  const name = filename
    .split('-')
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ');

  let folder: string | undefined;
  if (source === 'workspace') {
    // Extract session folder: /assets/icons/workspace/session-name/file.svg
    const wsIndex = parts.indexOf('workspace');
    if (wsIndex >= 0 && parts.length - wsIndex > 2) {
      folder = parts[wsIndex + 1];
    }
  }

  const svgContent = workspaceGlob[path] ?? libraryGlob[path] ?? '';
  return { id, name, svgContent, description: parseIconDescription(svgContent), source, folder };
}

export function loadWorkspaceIcons(): IconMeta[] {
  return Object.keys(workspaceGlob).map((path) => pathToMeta(path, 'workspace'));
}

export function loadLibraryIcons(): IconMeta[] {
  return Object.keys(libraryGlob).map((path) => pathToMeta(path, 'library'));
}

/** Map of library icon id → SVG content for use in the canvas */
export function getLibraryIconMap(): Map<string, string> {
  const map = new Map<string, string>();
  for (const [path, svg] of Object.entries(libraryGlob)) {
    const filename = path.split('/').pop()!.replace('.svg', '');
    map.set(filename, svg);
  }
  return map;
}

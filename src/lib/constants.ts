import { NodeKind } from '@/types/node-types';

export const DEFAULT_LABELS: Record<NodeKind, string> = {
  [NodeKind.Service]: 'Service',
  [NodeKind.Database]: 'Database',
  [NodeKind.Cache]: 'Cache',
  [NodeKind.Queue]: 'Queue',
  [NodeKind.Gateway]: 'Gateway',
  [NodeKind.User]: 'User',
  [NodeKind.ExternalApi]: 'External API',
  [NodeKind.Generic]: 'Component',
};

export const DEFAULT_DIAGRAM_NAME = 'Untitled';
export const PERSISTENCE_DEBOUNCE_MS = 500;
export const DB_NAME = 'arch-db';
export const DB_STORE = 'diagrams';

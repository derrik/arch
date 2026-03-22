export enum NodeKind {
  Service = 'service',
  Database = 'database',
  Cache = 'cache',
  Queue = 'queue',
  Gateway = 'gateway',
  User = 'user',
  ExternalApi = 'external-api',
  Generic = 'generic',
}

export interface NodeTypeInfo {
  kind: NodeKind;
  label: string;
  shortcut: string;
}

export const NODE_TYPE_REGISTRY: NodeTypeInfo[] = [
  { kind: NodeKind.Service, label: 'Service', shortcut: '1' },
  { kind: NodeKind.Database, label: 'Database', shortcut: '2' },
  { kind: NodeKind.Cache, label: 'Cache', shortcut: '3' },
  { kind: NodeKind.Queue, label: 'Queue', shortcut: '4' },
  { kind: NodeKind.Gateway, label: 'Gateway', shortcut: '5' },
  { kind: NodeKind.User, label: 'User', shortcut: '6' },
  { kind: NodeKind.ExternalApi, label: 'External API', shortcut: '7' },
  { kind: NodeKind.Generic, label: 'Generic', shortcut: '8' },
];

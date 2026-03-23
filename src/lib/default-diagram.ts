import type { ArchGraph } from '@/types/graph';

export const DEFAULT_DIAGRAM: ArchGraph = {
  nodes: [
    // Client tier
    { id: 'web-app', kind: 'user' as any, label: 'Web App', x: 80, y: 280 },
    { id: 'mobile', kind: 'user' as any, label: 'Mobile App', x: 80, y: 430 },

    // Edge
    { id: 'cdn', kind: 'gateway' as any, label: 'CDN', x: 285.42, y: 185.44 },
    { id: 'api-gw', kind: 'gateway' as any, label: 'API Gateway', x: 297, y: 362.07 },

    // Core services
    { id: 'auth', kind: 'service' as any, label: 'Auth Service', x: 578.62, y: 201.38 },
    { id: 'user-svc', kind: 'service' as any, label: 'User Service', x: 579.88, y: 303.59 },
    { id: 'content-svc', kind: 'service' as any, label: 'Content Service', x: 600, y: 434.72 },
    { id: 'search-svc', kind: 'service' as any, label: 'Search Service', x: 588.68, y: 568.37 },

    // Async layer
    { id: 'event-bus', kind: 'queue' as any, label: 'Event Bus', x: 854.84, y: 510.19 },
    { id: 'notifications', kind: 'service' as any, label: 'Notifications', x: 1135.03, y: 509.56 },
    { id: 'analytics', kind: 'service' as any, label: 'Analytics', x: 1132.52, y: 392.27 },

    // Data tier
    { id: 'users-db', kind: 'database' as any, label: 'Users DB', x: 902.64, y: 161.13 },
    { id: 'content-db', kind: 'database' as any, label: 'Content DB', x: 917.73, y: 235.67 },
    { id: 'search-idx', kind: 'database' as any, label: 'Search Index', x: 880, y: 630 },
    { id: 'session-cache', kind: 'cache' as any, label: 'Session Cache', x: 878.74, y: 53.71 },

    // External
    { id: 'email-provider', kind: 'external-api' as any, label: 'Email Provider', x: 1122.45, y: 662.20 },
    { id: 'storage', kind: 'external-api' as any, label: 'Object Storage', x: 1130, y: 280 },
  ],
  edges: [
    // Client → Edge
    { id: 'e1', source: 'web-app', target: 'cdn', sourceHandle: 'right', targetHandle: 'left', label: '', async: false },
    { id: 'e2', source: 'web-app', target: 'api-gw', sourceHandle: 'right', targetHandle: 'left', label: '', async: false },
    { id: 'e3', source: 'mobile', target: 'api-gw', sourceHandle: 'right', targetHandle: 'left', label: '', async: false },

    // Edge → Services
    { id: 'e4', source: 'api-gw', target: 'auth', sourceHandle: 'right', targetHandle: 'left', label: 'JWT', async: false },
    { id: 'e5', source: 'api-gw', target: 'user-svc', sourceHandle: 'right', targetHandle: 'left', label: 'REST', async: false },
    { id: 'e6', source: 'api-gw', target: 'content-svc', sourceHandle: 'right', targetHandle: 'left', label: 'REST', async: false },
    { id: 'e7', source: 'api-gw', target: 'search-svc', sourceHandle: 'right', targetHandle: 'left', label: 'REST', async: false },

    // Services → Data
    { id: 'e8', source: 'auth', target: 'users-db', sourceHandle: 'right', targetHandle: 'left', label: '', async: false },
    { id: 'e9', source: 'auth', target: 'session-cache', sourceHandle: 'right', targetHandle: 'left', label: '', async: false },
    { id: 'e10', source: 'user-svc', target: 'users-db', sourceHandle: 'right', targetHandle: 'left', label: '', async: false },
    { id: 'e11', source: 'content-svc', target: 'content-db', sourceHandle: 'right', targetHandle: 'left', label: '', async: false },
    { id: 'e12', source: 'search-svc', target: 'search-idx', sourceHandle: 'right', targetHandle: 'left', label: '', async: false },

    // Async flows
    { id: 'e13', source: 'content-svc', target: 'event-bus', sourceHandle: 'right', targetHandle: 'left', label: 'events', async: true },
    { id: 'e14', source: 'user-svc', target: 'event-bus', sourceHandle: 'right', targetHandle: 'left', label: 'events', async: true },
    { id: 'e15', source: 'event-bus', target: 'notifications', sourceHandle: 'right', targetHandle: 'left', label: '', async: true },
    { id: 'e16', source: 'event-bus', target: 'analytics', sourceHandle: 'right', targetHandle: 'left', label: '', async: true },
    { id: 'e17', source: 'event-bus', target: 'search-svc', sourceHandle: 'left', targetHandle: 'right', label: 'reindex', async: true },

    // External
    { id: 'e18', source: 'notifications', target: 'email-provider', sourceHandle: 'bottom', targetHandle: 'top', label: 'SMTP', async: true },
    { id: 'e19', source: 'content-svc', target: 'storage', sourceHandle: 'right', targetHandle: 'left', label: 'S3', async: false },
  ],
  groups: [
    { id: 'g-clients', label: 'Clients', x: 50, y: 240, width: 230, height: 260 },
    { id: 'g-services', label: 'Platform Services', x: 560, y: 140, width: 240, height: 560 },
    { id: 'g-data', label: 'Data Layer', x: 840, y: 20, width: 240, height: 680 },
    { id: 'g-async', label: 'Async Workers', x: 1090, y: 240, width: 240, height: 530 },
  ],
  notes: [
    { id: 'n1', text: 'Rate limited\n1000 req/min', x: 330, y: 500, attachedTo: null },
    { id: 'n2', text: 'Event-driven architecture\nfor decoupled scaling', x: 884.66, y: 713.40, attachedTo: null },
  ],
  viewport: { x: 13.93, y: 97.49, zoom: 0.795 },
};

import { useState } from 'react';
import { useStore } from '@/store';
import { Modal } from './Modal';

const SYSTEM_PROMPT = `You are an expert system architect. You generate architecture diagrams as JSON for the Arch diagramming tool.

## Output Format

Respond with a single JSON code block. The JSON has this structure:

\`\`\`json
{
  "name": "Short Diagram Title",
  "nodes": [
    { "id": "unique-id", "type": "service|database|cache|queue|gateway|user|external-api|generic", "label": "Display Name", "x": 0, "y": 0 }
  ],
  "edges": [
    { "source": "node-id-1", "target": "node-id-2", "label": "optional label", "async": false }
  ],
  "groups": [
    { "id": "group-id", "label": "Group Name", "x": 0, "y": 0, "width": 300, "height": 200 }
  ],
  "notes": [
    { "id": "note-id", "text": "Annotation text", "x": 0, "y": 0 }
  ]
}
\`\`\`

## Node Types

| Type | Use for |
|------|---------|
| \`service\` | Backend services, APIs, microservices |
| \`database\` | Databases, data stores (also accepts \`db\`) |
| \`cache\` | Redis, Memcached, any caching layer |
| \`queue\` | Message queues, event streams (Kafka, SQS, RabbitMQ) |
| \`gateway\` | API gateways, load balancers, reverse proxies |
| \`user\` | Users, clients, frontends (also accepts \`client\`, \`frontend\`) |
| \`external-api\` | Third-party APIs, external services (also accepts \`external\`) |
| \`generic\` | Anything that doesn't fit the above |

## Layout Rules

- Canvas origin is top-left (0, 0)
- Each node is roughly 160px wide × 60px tall
- Use **220px horizontal spacing** and **150px vertical spacing** between nodes
- Arrange left-to-right for request flows, top-to-bottom for data flows
- Place users/clients on the left, databases/storage on the right
- Place groups behind the nodes they contain (lower x/y, larger width/height)
- Place notes near the components they annotate

## Edges

- \`source\` and \`target\` must reference valid node \`id\` values
- Set \`async: true\` for event-driven / fire-and-forget connections (queues, webhooks, pub/sub)
- Set \`async: false\` (or omit) for synchronous request/response
- \`label\` is optional — use for protocol, method, or data description (e.g., "REST", "gRPC", "events")

## Groups (Boundaries)

Use groups to represent deployment boundaries, network zones, or logical groupings:
- VPC, subnet, region
- "Backend Services", "Data Layer"
- Position groups so they visually contain their nodes (group x/y should be ~30px above/left of contained nodes, width/height should encompass them with padding)

## Example

User: "Simple web app with auth"

\`\`\`json
{
  "name": "Web App with Auth",
  "nodes": [
    { "id": "browser", "type": "user", "label": "Browser", "x": 100, "y": 200 },
    { "id": "gateway", "type": "gateway", "label": "API Gateway", "x": 350, "y": 200 },
    { "id": "auth", "type": "service", "label": "Auth Service", "x": 600, "y": 100 },
    { "id": "app", "type": "service", "label": "App Service", "x": 600, "y": 300 },
    { "id": "users-db", "type": "database", "label": "Users DB", "x": 850, "y": 100 },
    { "id": "app-db", "type": "database", "label": "App DB", "x": 850, "y": 300 },
    { "id": "session-cache", "type": "cache", "label": "Session Cache", "x": 600, "y": 500 }
  ],
  "edges": [
    { "source": "browser", "target": "gateway", "label": "HTTPS" },
    { "source": "gateway", "target": "auth", "label": "JWT verify" },
    { "source": "gateway", "target": "app", "label": "REST" },
    { "source": "auth", "target": "users-db" },
    { "source": "app", "target": "app-db" },
    { "source": "auth", "target": "session-cache" }
  ],
  "groups": [
    { "id": "backend", "label": "Backend VPC", "x": 320, "y": 60, "width": 600, "height": 500 }
  ]
}
\`\`\`

## Guidelines

1. Use descriptive, kebab-case IDs (e.g., \`order-service\`, \`user-db\`)
2. Keep labels concise (1-3 words)
3. Model the real architecture — include caches, queues, and gateways where they'd exist in production
4. Show async connections for event-driven patterns
5. Group related services into boundaries
6. Add notes for important constraints or decisions
7. Aim for 5-15 nodes — enough detail to be useful, not so many it's overwhelming`;

export function AIPromptModal() {
  const activeModal = useStore((s) => s.activeModal);
  const closeModal = useStore((s) => s.closeModal);
  const [copied, setCopied] = useState(false);

  const open = activeModal === 'ai-prompt';

  const handleCopy = () => {
    navigator.clipboard.writeText(SYSTEM_PROMPT);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <Modal open={open} onClose={closeModal} title="AI Diagram Generation">
      <div>
        <p style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.6, marginTop: 0, marginBottom: 16 }}>
          Copy this prompt and paste it into any LLM chat (Claude, ChatGPT, etc.).
          Then describe the system you want to diagram. The LLM will output JSON
          that you can import directly.
        </p>

        {/* Copy button */}
        <div style={{ display: 'flex', gap: 8, marginBottom: 12 }}>
          <button
            onClick={handleCopy}
            style={{
              flex: 1,
              padding: '10px 16px',
              background: copied ? 'rgba(34, 197, 94, 0.15)' : 'var(--accent-purple)',
              border: copied ? '1px solid rgba(34, 197, 94, 0.4)' : 'none',
              borderRadius: 8,
              color: copied ? 'rgb(34, 197, 94)' : '#fff',
              fontSize: 13,
              fontWeight: 600,
              cursor: 'pointer',
              transition: 'all 0.2s ease',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 8,
            }}
          >
            {copied ? (
              <>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
                Copied to clipboard!
              </>
            ) : (
              <>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
                  <path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1" />
                </svg>
                Copy prompt to clipboard
              </>
            )}
          </button>
        </div>

        {/* Workflow hint */}
        <div
          style={{
            background: 'var(--bg-elevated)',
            borderRadius: 8,
            padding: 12,
            marginBottom: 12,
            border: '1px solid var(--border-default)',
          }}
        >
          <div style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--text-muted)', marginBottom: 6 }}>
            Workflow
          </div>
          <ol style={{ margin: 0, paddingLeft: 18, fontSize: 12, color: 'var(--text-secondary)', lineHeight: 1.8 }}>
            <li>Copy the prompt above</li>
            <li>Paste into your LLM chat</li>
            <li>Add your request: <em>"Create a diagram for a video upload pipeline"</em></li>
            <li>Copy the JSON from the response</li>
            <li>Click <strong>Import</strong> in Arch and paste it</li>
          </ol>
        </div>

        {/* Prompt preview */}
        <details>
          <summary
            style={{
              fontSize: 12,
              color: 'var(--text-muted)',
              cursor: 'pointer',
              marginBottom: 8,
              userSelect: 'none',
            }}
          >
            View prompt contents
          </summary>
          <div
            style={{
              maxHeight: 300,
              overflow: 'auto',
              padding: 12,
              background: 'var(--bg-primary)',
              borderRadius: 8,
              border: '1px solid var(--border-default)',
            }}
          >
            <pre
              style={{
                fontSize: 11,
                color: 'var(--text-secondary)',
                whiteSpace: 'pre-wrap',
                wordBreak: 'break-word',
                margin: 0,
                fontFamily: 'monospace',
                lineHeight: 1.5,
              }}
            >
              {SYSTEM_PROMPT}
            </pre>
          </div>
        </details>
      </div>
    </Modal>
  );
}

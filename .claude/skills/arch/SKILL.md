---
name: arch
description: Analyze the current codebase and generate an architecture diagram as JSON, importable into the Arch diagramming tool
argument-hint: "[focus area or description]"
allowed-tools: Glob, Grep, Read, Bash, Agent
---

# Generate Architecture Diagram

Analyze this codebase and produce a single JSON block that can be pasted into the [Arch](https://randomlevel.com/arch) import modal.

## Analysis Steps

Do these in parallel where possible:

1. **Project type & entry points**: Read `package.json`, `pyproject.toml`, `go.mod`, `Cargo.toml`, `docker-compose.yml`, `Makefile`, or equivalent. Identify the language, framework, and main entry points.

2. **Service boundaries**: Look for:
   - Separate service directories (monorepo packages, microservices)
   - Docker/container definitions
   - Serverless function directories (lambdas, cloud functions)
   - API route files, controllers, handlers

3. **Data stores**: Grep for database connections, ORM configs, migration directories, cache clients (Redis, Memcached), search engines (Elasticsearch).

4. **Message queues & async**: Grep for queue/broker usage — Kafka, SQS, RabbitMQ, Redis pub/sub, event emitters, background job frameworks (Celery, Sidekiq, BullMQ).

5. **External integrations**: Grep for HTTP clients, SDK imports, webhook handlers, third-party API keys/configs (Stripe, Twilio, S3, email providers, etc.).

6. **API layer**: Identify gateways, reverse proxies (nginx configs), GraphQL schemas, REST routers, gRPC proto files.

7. **Frontend/client apps**: Look for React/Vue/Angular/mobile directories, static site generators, or CLI tools that consume the backend.

8. **Infrastructure**: Check for Terraform, CloudFormation, Pulumi, k8s manifests, CI/CD configs that reveal deployment topology.

If `$ARGUMENTS` is provided, focus the analysis on that area (e.g., "auth flow", "data pipeline", "payment system").

## Output Format

Output a single fenced JSON code block. Nothing else — no explanation before or after the JSON. The user will copy-paste this directly.

```json
{
  "name": "Descriptive Diagram Title",
  "nodes": [
    { "id": "kebab-case-id", "type": "<type>", "label": "Short Name", "x": 0, "y": 0 }
  ],
  "edges": [
    { "source": "node-id", "target": "node-id", "label": "protocol/description", "async": false }
  ],
  "groups": [
    { "id": "group-id", "label": "Boundary Name", "x": 0, "y": 0, "width": 300, "height": 200 }
  ],
  "notes": [
    { "id": "note-id", "text": "Key constraint or decision", "x": 0, "y": 0 }
  ]
}
```

### Node Types

| Type | Use for |
|------|---------|
| `service` | Backend services, APIs, microservices, serverless functions |
| `database` | Databases, data stores (Postgres, MongoDB, DynamoDB) |
| `cache` | Redis, Memcached, any caching layer |
| `queue` | Message queues, event streams (Kafka, SQS, RabbitMQ) |
| `gateway` | API gateways, load balancers, reverse proxies, CDNs |
| `user` | Users, clients, frontends, mobile apps, CLI tools |
| `external-api` | Third-party services (Stripe, Twilio, S3, email providers) |
| `generic` | Anything else |

### Layout Rules

- Canvas origin is top-left (0, 0). Each node is ~160px wide x 60px tall.
- Use **220px horizontal spacing** and **150px vertical spacing**.
- Arrange **left-to-right**: clients → gateways → services → data stores → external services.
- Use **top-to-bottom** within a tier to separate concerns.
- Groups should encompass their nodes with ~30px padding on all sides.
- Place notes near the components they describe.

### Edge Rules

- `source` and `target` must reference valid node `id` values.
- `async: true` for queues, events, webhooks, pub/sub, background jobs.
- `async: false` (default) for synchronous request/response.
- `label` is optional — use for protocol (REST, gRPC, SQL), data flow description, or key detail.

## Quality Guidelines

1. **Be accurate** — only include components you actually found evidence for in the code. Don't guess.
2. **Be complete** — include data stores, caches, queues, and external services, not just app servers.
3. **Use real names** — label nodes after the actual service/database names used in the codebase.
4. **Show data flow** — edges should reflect how data actually moves through the system.
5. **Group meaningfully** — use groups for deployment boundaries (VPC, k8s namespace), logical domains, or monorepo packages.
6. **Add notes** — annotate important constraints, scaling characteristics, or architectural decisions you discovered.
7. **Aim for 8-20 nodes** — enough to be informative without being overwhelming. For large systems, focus on the most important components or the area specified in the arguments.
8. **Name the diagram** — the `"name"` field should describe what this diagram shows (e.g., "Acme E-Commerce Platform", "Auth & Session Flow").

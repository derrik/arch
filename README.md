# Arch

**Local-first architecture diagram builder.**

[Live Demo](https://randomlevel.com/arch) | No accounts, no servers, no data leaves your browser.

![Node Types: Service, Database, Cache, Queue, Gateway, User, External API, Generic](https://img.shields.io/badge/node_types-8-a855f7)

---

## What is this?

Arch is a tool for building system architecture diagrams — the kind you sketch on whiteboards but wish lived in a shareable, editable format. It's designed around a few core beliefs:

- **Local-first**: Diagrams live in your browser's IndexedDB. Nothing is sent to any server.
- **LLM-native**: Describe your system in plain English, paste the AI-generated JSON, and get a full diagram in seconds.
- **Keyboard-driven**: Number keys `1`–`8` select node types, click to place, drag to connect. No menus to dig through.
- **Themeable**: Dark and light themes that follow your OS preference, with a vaporwave/cyberpunk color palette (purple, cyan, pink accents).

## Features

### Design Canvas

The main workspace for building diagrams. Place nodes, connect them with edges, organize with groups, and annotate with sticky notes.

**8 built-in node types**, each with a distinctive icon and keyboard shortcut:

| Key | Type | Use for |
|-----|------|---------|
| `1` | Service | Backend services, APIs, microservices |
| `2` | Database | Databases, data stores |
| `3` | Cache | Redis, Memcached, caching layers |
| `4` | Queue | Message queues, event streams |
| `5` | Gateway | API gateways, load balancers, CDNs |
| `6` | User | Users, clients, frontends |
| `7` | External API | Third-party services |
| `8` | Generic | Anything else |

**Edges** can be synchronous (solid) or asynchronous (dashed green) — click to toggle, double-click to edit labels. Edges auto-route to the nearest handle (top/right/bottom/left) based on node positions.

**Groups** (boundaries) represent deployment zones, VPCs, logical domains. They're resizable and sit behind nodes visually.

**Notes** are freeform text annotations you can place anywhere on the canvas.

### AI Diagram Generation

Click the sparkles button in the right panel to get a system prompt you can paste into any LLM (Claude, ChatGPT, etc.). Describe your system, and the LLM outputs JSON in Arch's format. Click Import, paste the JSON, and a new diagram is created automatically — named from the JSON's `"name"` field.

The JSON format is intentionally simple and LLM-friendly:

```json
{
  "name": "My System",
  "nodes": [
    { "id": "api", "type": "service", "label": "API Server", "x": 100, "y": 200 }
  ],
  "edges": [
    { "source": "api", "target": "db", "label": "SQL", "async": false }
  ],
  "groups": [
    { "id": "vpc", "label": "VPC", "x": 70, "y": 160, "width": 400, "height": 300 }
  ],
  "notes": [
    { "id": "n1", "text": "Rate limited", "x": 300, "y": 500 }
  ]
}
```

### Claude Code Skill

If you use [Claude Code](https://claude.com/claude-code), install the `/arch` skill to generate diagrams directly from any codebase:

The skill is included in this repo at `.claude/skills/arch/SKILL.md`. To make it available globally (in any project):

```bash
mkdir -p ~/.claude/skills/arch
cp .claude/skills/arch/SKILL.md ~/.claude/skills/arch/
```

Then in any project: `/arch` analyzes the repo and outputs importable JSON. Use `/arch auth flow` to focus on a specific area.

### Icon Studio

A workspace for iterating on custom SVG icons using an LLM coding agent. The workflow:

1. Prompt your agent to generate icon variations (see `ICON_GENERATION.md`)
2. Review them in the Icon Studio grid view
3. Give feedback — the agent refines and generates new rounds
4. Publish finalized icons to the library
5. Published icons appear as new node types on the canvas toolbar

Icons are stroke-based SVGs (`stroke="currentColor"`) so they inherit the active theme. Each includes an embedded `<!-- description: ... -->` comment that serves as an LLM validation mechanism.

### Sharing

Diagrams can be shared as compressed URLs — the entire diagram is LZ-compressed and encoded into the URL query string. No server involved. You can also export/import as JSON for version control or collaboration.

### Multi-Diagram Management

The sidebar lists all saved diagrams. Create, rename, delete, and switch between them. Diagrams persist in IndexedDB across browser refreshes.

## Quick Start

```bash
git clone <repo-url>
cd arch
npm install
npm run dev
```

Open `http://localhost:5173/arch/` and start building.

### Deploy

```bash
npm run build    # TypeScript check + Vite build → dist/
./deploy.sh      # Builds and rsyncs to production
```

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | React 18 |
| Canvas | React Flow v12 (controlled mode) |
| State | Zustand v5 (slices pattern) |
| Persistence | IndexedDB via `idb` |
| Sharing | LZ-String compression |
| Animations | Framer Motion |
| IDs | nanoid |
| Build | Vite 5, TypeScript 5 |
| Deployment | Static files, rsync to any host |

Zero runtime backend dependencies. The entire app is a static site.

## Architecture

```
src/
  App.tsx                    # Init: load diagrams, handle shared URLs
  main.tsx                   # Entry point, theme init

  canvas/
    CanvasAdapter.tsx        # Bridge between store and React Flow
    CanvasAdapter.types.ts   # Props interface
    reactflow/
      ReactFlowCanvas.tsx    # Core canvas: nodes, edges, selection, resize
      ArchNode.tsx           # Node renderer (built-in + custom icons)
      ArchEdge.tsx           # Edge renderer (sync/async styles)
      GroupNode.tsx           # Resizable group boundary
      NoteNode.tsx           # Sticky note node
      GridBackground.tsx     # Themed dot grid

  components/
    layout/
      Shell.tsx              # Top-level layout grid
      Sidebar.tsx            # Design/Icons tabs, diagram list, icon folders
      Toolbar.tsx            # Node type buttons + library popover
      RightPanel.tsx         # Groups, notes, share, import, AI, help
    modals/
      Modal.tsx              # Base modal component
      AIPromptModal.tsx      # Copyable LLM system prompt
      ImportModal.tsx        # JSON import → auto-creates diagram
      ShareModal.tsx         # Compressed URL sharing
      WelcomeModal.tsx       # First-visit onboarding
      DeleteConfirm.tsx      # Diagram deletion confirmation
    icon-studio/
      IconStudioView.tsx     # Main Icon Studio container
      WorkspaceGrid.tsx      # Session folder grid
      LibraryGrid.tsx        # Published icons grid
      IconCard.tsx           # Icon preview card
      IconDetail.tsx         # Large preview + description + SVG source
    toolbar/
      LibraryPopover.tsx     # Custom icon picker dropdown

  store/
    index.ts                 # Composed Zustand store
    graph-slice.ts           # Nodes, edges, groups, notes, viewport, import
    diagrams-slice.ts        # Multi-diagram CRUD, persistence, default diagram
    ui-slice.ts              # Selection, tool modes, modals, active view
    icon-studio-slice.ts     # Workspace/library icon state

  hooks/
    useKeyboard.ts           # Global keyboard shortcuts
    useTheme.ts              # OS theme detection + manual override

  persistence/
    db.ts                    # IndexedDB wrapper (idb)
    sync.ts                  # Auto-save on store changes

  sharing/
    serialize.ts             # Graph → LZ-compressed string
    deserialize.ts           # LZ string → graph
    json-export.ts           # Clean JSON export

  icons/                     # Built-in SVG icon components
    custom/index.ts          # Vite glob loader for workspace/library SVGs

  lib/
    auto-handle.ts           # Smart edge routing (nearest handle selection)
    constants.ts             # DB name, default labels
    default-diagram.ts       # Showcase diagram for first-time visitors
    graph-utils.ts           # Graph traversal helpers
    id.ts                    # nanoid wrapper

  types/
    graph.ts                 # ArchNode, ArchEdge, ArchGroup, ArchNote, Diagram
    node-types.ts            # NodeKind enum, type registry
    icon.ts                  # IconMeta, description parser

assets/icons/
  workspace/                 # Active icon experiments (by session folder)
  library/                   # Published icons (appear in canvas toolbar)
```

## How It Evolved

### v1 — Core Diagramming

The initial version established the fundamentals: a React Flow canvas with 8 node types, edge connections with sync/async distinction, Zustand state management, IndexedDB persistence, and URL-based sharing via LZ-String compression. Dark/light theming with OS preference detection.

Key technical decisions:
- **React Flow controlled mode** — explicit `selected` prop management for precise selection control
- **Zustand slices** — graph, UI, and diagrams as independent slices composed into a single store
- **Auto-handle routing** — edges automatically connect to the nearest handle based on relative node positions

### v2 — Icon Studio & AI Integration

The second version added two major features:

**Icon Studio** — a full workflow for creating custom node types using LLM coding agents. Workspace folders for iteration, a library for published icons, and automatic integration with the canvas toolbar. Icons are loaded at build time via Vite's `import.meta.glob` with `?raw` queries.

**AI Diagram Generation** — a system prompt that teaches any LLM to output Arch-compatible JSON. Import auto-creates a new diagram with the name from the JSON. Combined with the Claude Code `/arch` skill, this enables generating diagrams directly from codebases.

Other v2 additions: welcome modal for deployed site onboarding, overlap cycling (click to cycle through stacked nodes), live group resize, HMR-resilient view state via sessionStorage, default showcase diagram.

## Keyboard Shortcuts

| Key | Action |
|-----|--------|
| `1`–`8` | Select node type (toggle) |
| `Esc` | Exit tool mode / clear selection |
| `?` | Open help modal |
| `Delete` / `Backspace` | Remove selected elements |
| `Shift+Click` | Multi-select nodes |

## Roadmap Ideas

Some directions this could go:

- **Export to PNG/SVG** — render the canvas to an image for docs and presentations
- **Collaborative editing** — CRDTs (Yjs) over WebRTC for real-time multi-user diagramming, still local-first
- **Diagram diffing** — visual diff between two versions of a diagram, useful for architecture reviews
- **More edge types** — bidirectional, conditional, data flow annotations
- **Snap-to-grid and auto-layout** — automatic arrangement algorithms (dagre, ELK)
- **Template library** — pre-built diagram templates (microservices, event-driven, serverless, etc.)
- **CLI export** — `npx arch export diagram.json --format png` for CI/CD integration
- **Plugin system** — custom node types, edge renderers, and layout algorithms as plugins

## License

MIT

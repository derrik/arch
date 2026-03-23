import { useCallback, useEffect, useMemo, useRef } from 'react';
import {
  ReactFlow,
  type Node,
  type Edge,
  type OnNodesChange,
  type OnConnect,
  type OnSelectionChangeFunc,
  type OnReconnect,
  type NodeMouseHandler,
  ConnectionMode,
  type ReactFlowInstance,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';

import { NodeKind } from '@/types/node-types';
import type { CanvasAdapterProps } from '../CanvasAdapter.types';
import { ArchNodeComponent, type ArchNodeData } from './ArchNode';
import { ArchEdgeComponent, type ArchEdgeData } from './ArchEdge';
import { GroupNode, type GroupNodeData } from './GroupNode';
import { NoteNode, type NoteNodeData } from './NoteNode';
import { GridBackground } from './GridBackground';

const nodeTypes = { arch: ArchNodeComponent, boundary: GroupNode, note: NoteNode };
const edgeTypes = { arch: ArchEdgeComponent };

export function ReactFlowCanvas({
  nodes: archNodes,
  edges: archEdges,
  groups,
  notes,
  selectedNodeIds,
  selectedEdgeIds,
  highlightedNodeIds,
  toolMode,
  stampMode,
  onNodeMove,
  onNodeLabelChange,
  onAddNode,
  onConnect,
  onReconnect,
  onEdgeClick,
  onEdgeDoubleClick,
  onEdgeLabelChange,
  onSelectionChange,
  onViewportChange,
  onConnectStart,
  onConnectEnd,
  onDeleteSelected,
  onGroupMove,
  onGroupLabelChange,
  onGroupResize,
  onNoteMoveOrUpdate,
  onPaneClickWithTool,
  customStampId,
}: CanvasAdapterProps) {
  const rfRef = useRef<ReactFlowInstance | null>(null);
  const skipNextSelectionRef = useRef(false);
  const highlightSet = useMemo(() => new Set(highlightedNodeIds), [highlightedNodeIds]);
  const selectedSet = useMemo(() => new Set(selectedNodeIds), [selectedNodeIds]);

  useEffect(() => {
    const handler = () => {
      rfRef.current?.fitView({ padding: 0.15, duration: 300 });
    };
    window.addEventListener('arch:fitView', handler);
    return () => window.removeEventListener('arch:fitView', handler);
  }, []);

  const rfNodes: Node[] = useMemo(() => {
    const groupNodes: Node[] = (groups ?? []).map((g) => ({
      id: g.id,
      type: 'boundary',
      position: { x: g.x, y: g.y },
      style: { width: g.width, height: g.height },
      selected: selectedSet.has(g.id),
      zIndex: -1,
      data: {
        label: g.label,
        onLabelChange: onGroupLabelChange,
        onResize: onGroupResize,
      } satisfies GroupNodeData,
    }));

    const archRfNodes: Node[] = (archNodes ?? []).map((n) => ({
      id: n.id,
      type: 'arch',
      position: { x: n.x, y: n.y },
      selected: selectedSet.has(n.id),
      parentId: n.parentId ?? undefined,
      data: {
        kind: n.kind,
        label: n.label,
        highlighted: highlightSet.has(n.id),
        customIconId: n.customIconId,
        onLabelChange: onNodeLabelChange,
      } satisfies ArchNodeData,
    }));

    const noteNodes: Node[] = (notes ?? []).map((n) => ({
      id: n.id,
      type: 'note',
      position: { x: n.x, y: n.y },
      data: {
        text: n.text,
        attachedTo: n.attachedTo,
        onTextChange: (id: string, text: string) => onNoteMoveOrUpdate(id, { text }),
      } satisfies NoteNodeData,
    }));

    // Groups first so they render behind everything
    return [...groupNodes, ...archRfNodes, ...noteNodes];
  }, [archNodes, groups, notes, selectedSet, highlightSet, onNodeLabelChange, onGroupLabelChange, onNoteMoveOrUpdate]);

  const rfEdges: Edge[] = useMemo(
    () =>
      (archEdges ?? []).map((e) => ({
        id: e.id,
        source: e.source,
        target: e.target,
        sourceHandle: e.sourceHandle ?? undefined,
        targetHandle: e.targetHandle ?? undefined,
        type: 'arch',
        data: {
          async: e.async,
          selected: selectedEdgeIds.includes(e.id),
          label: e.label,
          onEdgeClick,
          onEdgeDoubleClick,
          onLabelChange: onEdgeLabelChange,
        } satisfies ArchEdgeData,
      })),
    [archEdges, selectedEdgeIds, onEdgeClick, onEdgeDoubleClick, onEdgeLabelChange]
  );

  const onNodesChange: OnNodesChange = useCallback(
    (changes) => {
      for (const change of changes) {
        if (change.type === 'position' && change.position) {
          const group = groups.find(g => g.id === change.id);
          const note = notes.find(n => n.id === change.id);
          if (group) {
            onGroupMove(change.id, change.position.x, change.position.y);
          } else if (note) {
            onNoteMoveOrUpdate(change.id, { x: change.position.x, y: change.position.y });
          } else {
            onNodeMove(change.id, change.position.x, change.position.y);
          }
        }
        // Handle live resize from NodeResizer (resizing flag distinguishes from auto-measurement)
        if (change.type === 'dimensions' && change.resizing && change.dimensions) {
          const group = groups.find(g => g.id === change.id);
          if (group) {
            onGroupResize(change.id, change.dimensions.width, change.dimensions.height);
          }
        }
      }
    },
    [groups, notes, onNodeMove, onGroupMove, onGroupResize, onNoteMoveOrUpdate]
  );

  const handleConnect: OnConnect = useCallback(
    (params) => {
      if (params.source && params.target) {
        onConnect(params.source, params.target, params.sourceHandle ?? null, params.targetHandle ?? null);
      }
    },
    [onConnect]
  );

  const onSelectionChangeHandler: OnSelectionChangeFunc = useCallback(
    ({ nodes, edges }) => {
      if (skipNextSelectionRef.current) {
        skipNextSelectionRef.current = false;
        return;
      }
      onSelectionChange(
        nodes.map((n) => n.id),
        edges.map((e) => e.id)
      );
    },
    [onSelectionChange]
  );

  const handleNodeClick: NodeMouseHandler = useCallback(
    (event, clickedNode) => {
      if (event.shiftKey) return; // Let RF handle multi-select
      if (!rfRef.current) return;

      // If node not already selected, just select it (fixes single-click group selection)
      if (!selectedSet.has(clickedNode.id)) {
        onSelectionChange([clickedNode.id], []);
        skipNextSelectionRef.current = true;
        return;
      }

      // Already selected — find overlapping nodes at click point to cycle through
      const flowPos = rfRef.current.screenToFlowPosition({
        x: event.clientX,
        y: event.clientY,
      });

      const allNodes = rfRef.current.getNodes();
      const overlapping: string[] = [];

      for (const node of allNodes) {
        let absX = node.position.x;
        let absY = node.position.y;
        if (node.parentId) {
          const parent = allNodes.find(p => p.id === node.parentId);
          if (parent) {
            absX += parent.position.x;
            absY += parent.position.y;
          }
        }
        const w = node.measured?.width ?? (typeof node.style?.width === 'number' ? node.style.width : 120);
        const h = node.measured?.height ?? (typeof node.style?.height === 'number' ? node.style.height : 80);
        if (flowPos.x >= absX && flowPos.x <= absX + w && flowPos.y >= absY && flowPos.y <= absY + h) {
          overlapping.push(node.id);
        }
      }

      if (overlapping.length <= 1) {
        skipNextSelectionRef.current = true;
        return;
      }

      // Cycle to the next overlapping node
      const currentIndex = overlapping.indexOf(clickedNode.id);
      const nextIndex = (currentIndex + 1) % overlapping.length;
      onSelectionChange([overlapping[nextIndex]], []);
      skipNextSelectionRef.current = true;
    },
    [selectedSet, onSelectionChange]
  );

  const handleReconnect: OnReconnect = useCallback(
    (oldEdge, newConnection) => {
      if (newConnection.source && newConnection.target) {
        onReconnect(oldEdge.id, newConnection.source, newConnection.target, newConnection.sourceHandle ?? null, newConnection.targetHandle ?? null);
      }
    },
    [onReconnect]
  );

  const isPlacementMode = !!toolMode || !!stampMode || !!customStampId;

  const handlePaneClick = useCallback(
    (event: React.MouseEvent) => {
      if (!rfRef.current) return;
      const position = rfRef.current.screenToFlowPosition({
        x: event.clientX,
        y: event.clientY,
      });

      if (stampMode || customStampId) {
        onAddNode(stampMode ?? NodeKind.Generic, position.x, position.y);
      } else if (toolMode) {
        onPaneClickWithTool(toolMode, position.x, position.y);
      }
    },
    [stampMode, customStampId, toolMode, onAddNode, onPaneClickWithTool]
  );

  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        cursor: isPlacementMode ? 'crosshair' : undefined,
      }}
    >
      <ReactFlow
        nodes={rfNodes}
        edges={rfEdges}
        nodeTypes={nodeTypes}
        edgeTypes={edgeTypes}
        onNodesChange={onNodesChange}
        onConnect={handleConnect}
        onReconnect={handleReconnect}
        edgesReconnectable
        onSelectionChange={onSelectionChangeHandler}
        onMoveEnd={(_, viewport) =>
          onViewportChange({ x: viewport.x, y: viewport.y, zoom: viewport.zoom })
        }
        onInit={(instance) => {
          rfRef.current = instance;
        }}
        onNodeClick={handleNodeClick}
        onEdgeClick={(_event, edge) => {
          onEdgeClick(edge.id);
        }}
        onEdgeDoubleClick={(_event, edge) => {
          onEdgeDoubleClick(edge.id);
        }}
        onPaneClick={handlePaneClick}
        onConnectStart={() => onConnectStart()}
        onConnectEnd={() => onConnectEnd()}
        connectionMode={ConnectionMode.Loose}
        fitView={false}
        defaultViewport={{ x: 0, y: 0, zoom: 1 }}
        minZoom={0.1}
        maxZoom={4}
        onDelete={onDeleteSelected}
        deleteKeyCode={['Backspace', 'Delete']}
        multiSelectionKeyCode="Shift"
        selectionOnDrag={false}
        panOnDrag={isPlacementMode ? false : [0]}
        zoomOnScroll
        proOptions={{ hideAttribution: true }}
      >
        <GridBackground />
        <svg style={{ position: 'absolute', width: 0, height: 0 }}>
          <defs>
            <marker id="arrow-sync" viewBox="0 0 10 10" refX="10" refY="5" markerWidth="8" markerHeight="8" orient="auto-start-reverse">
              <path d="M 0 0 L 10 5 L 0 10 z" fill="var(--edge-sync)" />
            </marker>
            <marker id="arrow-async" viewBox="0 0 10 10" refX="10" refY="5" markerWidth="8" markerHeight="8" orient="auto-start-reverse">
              <path d="M 0 0 L 10 5 L 0 10 z" fill="var(--edge-async)" />
            </marker>
          </defs>
        </svg>
      </ReactFlow>

      {archNodes.length === 0 && groups.length === 0 && notes.length === 0 && (
        <div
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            textAlign: 'center',
            color: 'var(--text-muted)',
            pointerEvents: 'none',
            animation: 'fade-in 0.5s ease',
          }}
        >
          <div style={{ fontSize: 16, marginBottom: 8 }}>
            Press <kbd style={{ background: 'var(--bg-elevated)', padding: '2px 8px', borderRadius: 4, border: '1px solid var(--border-default)', fontSize: 14 }}>1</kbd>-<kbd style={{ background: 'var(--bg-elevated)', padding: '2px 8px', borderRadius: 4, border: '1px solid var(--border-default)', fontSize: 14 }}>8</kbd> to select a node type, then click to place
          </div>
          <div style={{ fontSize: 13 }}>
            Or use the toolbar above
          </div>
        </div>
      )}
    </div>
  );
}

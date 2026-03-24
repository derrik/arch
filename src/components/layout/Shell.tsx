import { useCallback } from 'react';
import { ReactFlowProvider } from '@xyflow/react';
import { useStore } from '@/store';
import type { ToolMode } from '@/store/ui-slice';
import { Sidebar } from './Sidebar';
import { Toolbar } from './Toolbar';
import { RightPanel } from './RightPanel';
import { CanvasAdapter } from '@/canvas/CanvasAdapter';
import { ShareModal } from '@/components/modals/ShareModal';
import { DeleteConfirm } from '@/components/modals/DeleteConfirm';
import { ImportModal } from '@/components/modals/ImportModal';
import { WelcomeModal, WelcomeModalListener } from '@/components/modals/WelcomeModal';
import { AIPromptModal } from '@/components/modals/AIPromptModal';
import { IconStudioView } from '@/components/icon-studio/IconStudioView';
import { useKeyboard } from '@/hooks/useKeyboard';
import { getConnected } from '@/lib/graph-utils';

export function Shell() {
  useKeyboard();

  const activeView = useStore((s) => s.activeView);

  const nodes = useStore((s) => s.nodes);
  const edges = useStore((s) => s.edges);
  const groups = useStore((s) => s.groups);
  const notes = useStore((s) => s.notes);
  const viewport = useStore((s) => s.viewport);
  const toolMode = useStore((s) => s.toolMode);
  const stampMode = useStore((s) => s.stampMode);
  const selectedNodeIds = useStore((s) => s.selectedNodeIds);
  const selectedEdgeIds = useStore((s) => s.selectedEdgeIds);
  const highlightedNodeIds = useStore((s) => s.highlightedNodeIds);
  const isConnecting = useStore((s) => s.isConnecting);

  const addNode = useStore((s) => s.addNode);
  const updateNode = useStore((s) => s.updateNode);
  const removeNodes = useStore((s) => s.removeNodes);
  const removeEdges = useStore((s) => s.removeEdges);
  const addEdge = useStore((s) => s.addEdge);
  const updateEdge = useStore((s) => s.updateEdge);
  const updateEdgeLabel = useStore((s) => s.updateEdgeLabel);
  const toggleEdgeAsync = useStore((s) => s.toggleEdgeAsync);
  const recomputeHandlesForNode = useStore((s) => s.recomputeHandlesForNode);
  const setViewport = useStore((s) => s.setViewport);
  const setSelection = useStore((s) => s.setSelection);
  const setHighlightedNodeIds = useStore((s) => s.setHighlightedNodeIds);
  const setIsConnecting = useStore((s) => s.setIsConnecting);

  const customStampId = useStore((s) => s.customStampId);
  const startDrag = useStore((s) => s.startDrag);
  const endDrag = useStore((s) => s.endDrag);
  const addGroup = useStore((s) => s.addGroup);
  const updateGroup = useStore((s) => s.updateGroup);
  const addNote = useStore((s) => s.addNote);
  const updateNote = useStore((s) => s.updateNote);

  const handleNodeMove = useCallback(
    (id: string, x: number, y: number) => {
      updateNode(id, { x, y });
      recomputeHandlesForNode(id);
    },
    [updateNode, recomputeHandlesForNode]
  );

  const handleNodeLabelChange = useCallback(
    (id: string, label: string) => updateNode(id, { label }),
    [updateNode]
  );

  const handleAddNode = useCallback(
    (kind: Parameters<typeof addNode>[0], x: number, y: number) => {
      addNode(kind, x, y, customStampId);
    },
    [addNode, customStampId]
  );

  const handleConnect = useCallback(
    (source: string, target: string, sourceHandle: string | null, targetHandle: string | null) => {
      addEdge(source, target, sourceHandle, targetHandle);
    },
    [addEdge]
  );

  const handleReconnect = useCallback(
    (edgeId: string, newSource: string, newTarget: string, newSourceHandle: string | null, newTargetHandle: string | null) => {
      updateEdge(edgeId, newSource, newTarget, newSourceHandle, newTargetHandle);
    },
    [updateEdge]
  );

  const handleSelectionChange = useCallback(
    (nodeIds: string[], edgeIds: string[]) => {
      setSelection(nodeIds, edgeIds);
      if (nodeIds.length === 1) {
        const connected = getConnected(nodeIds[0], edges);
        setHighlightedNodeIds([...connected]);
      } else {
        setHighlightedNodeIds([]);
      }
    },
    [setSelection, setHighlightedNodeIds, edges]
  );

  const handleDeleteSelected = useCallback(
    ({ nodes, edges }: { nodes: { id: string }[]; edges: { id: string }[] }) => {
      const nodeIds = nodes.map((n) => n.id);
      const edgeIds = edges.map((e) => e.id);
      if (nodeIds.length > 0) removeNodes(nodeIds);
      if (edgeIds.length > 0) removeEdges(edgeIds);
      setSelection([], []);
      setHighlightedNodeIds([]);
    },
    [removeNodes, removeEdges, setSelection, setHighlightedNodeIds]
  );

  const handleGroupMove = useCallback(
    (id: string, x: number, y: number) => updateGroup(id, { x, y }),
    [updateGroup]
  );

  const handleGroupLabelChange = useCallback(
    (id: string, label: string) => updateGroup(id, { label }),
    [updateGroup]
  );

  const handleGroupResize = useCallback(
    (id: string, width: number, height: number) => updateGroup(id, { width, height }),
    [updateGroup]
  );

  const handleNoteMoveOrUpdate = useCallback(
    (id: string, updates: Partial<{ text: string; x: number; y: number }>) => updateNote(id, updates),
    [updateNote]
  );

  const handlePaneClickWithTool = useCallback(
    (tool: NonNullable<ToolMode>, x: number, y: number) => {
      if (tool.type === 'group') {
        addGroup('Group', x, y);
      } else if (tool.type === 'note') {
        addNote('', x, y);
      }
    },
    [addGroup, addNote]
  );

  const isDesign = activeView === 'design';

  return (
    <ReactFlowProvider>
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: isDesign ? '220px 1fr 64px' : '220px 1fr',
          gridTemplateRows: '1fr',
          height: '100%',
          width: '100%',
        }}
      >
        <Sidebar />

        {isDesign ? (
          <>
            <div style={{ display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
              <Toolbar />
              <div style={{ flex: 1, position: 'relative' }}>
                <CanvasAdapter
                  nodes={nodes}
                  edges={edges}
                  groups={groups}
                  notes={notes}
                  viewport={viewport}
                  selectedNodeIds={selectedNodeIds}
                  selectedEdgeIds={selectedEdgeIds}
                  highlightedNodeIds={highlightedNodeIds}
                  toolMode={toolMode}
                  stampMode={stampMode}
                  isConnecting={isConnecting}
                  customStampId={customStampId}
                  onNodeMove={handleNodeMove}
                  onNodeLabelChange={handleNodeLabelChange}
                  onAddNode={handleAddNode}
                  onConnect={handleConnect}
                  onReconnect={handleReconnect}
                  onEdgeClick={(id) => {
                    if (selectedEdgeIds.includes(id)) {
                      toggleEdgeAsync(id);
                    } else {
                      setSelection([], [id]);
                    }
                  }}
                  onEdgeDoubleClick={toggleEdgeAsync}
                  onEdgeLabelChange={updateEdgeLabel}
                  onSelectionChange={handleSelectionChange}
                  onViewportChange={setViewport}
                  onConnectStart={() => setIsConnecting(true)}
                  onConnectEnd={() => setIsConnecting(false)}
                  onDeleteSelected={handleDeleteSelected}
                  onGroupMove={handleGroupMove}
                  onGroupLabelChange={handleGroupLabelChange}
                  onGroupResize={handleGroupResize}
                  onNoteMoveOrUpdate={handleNoteMoveOrUpdate}
                  onPaneClickWithTool={handlePaneClickWithTool}
                  onDragStart={startDrag}
                  onDragEnd={endDrag}
                />
              </div>
            </div>
            <RightPanel />
          </>
        ) : (
          <IconStudioView />
        )}
      </div>
      <ShareModal />
      <DeleteConfirm />
      <ImportModal />
      <AIPromptModal />
      <WelcomeModal />
      <WelcomeModalListener />
    </ReactFlowProvider>
  );
}

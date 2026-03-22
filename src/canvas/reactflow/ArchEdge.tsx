import { BaseEdge, EdgeLabelRenderer, getSmoothStepPath, type EdgeProps } from '@xyflow/react';

export interface ArchEdgeData {
  async: boolean;
  selected: boolean;
  label: string;
  onEdgeClick: (id: string) => void;
  onEdgeDoubleClick: (id: string) => void;
  onLabelChange: (id: string, label: string) => void;
  [key: string]: unknown;
}

export function ArchEdgeComponent({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  data,
}: EdgeProps & { data: ArchEdgeData }) {
  const [edgePath, labelX, labelY] = getSmoothStepPath({
    sourceX,
    sourceY,
    targetX,
    targetY,
    sourcePosition,
    targetPosition,
    borderRadius: 16,
  });

  const isAsync = data?.async ?? false;
  const isSelected = data?.selected ?? false;
  const label = data?.label ?? '';

  const edgeColor = isAsync ? 'var(--edge-async)' : 'var(--edge-sync)';
  const markerEnd = `url(#arrow-${isAsync ? 'async' : 'sync'})`;

  return (
    <>
      {/* Wide invisible hit area for easier clicking */}
      <path
        d={edgePath}
        fill="none"
        stroke="transparent"
        strokeWidth={20}
        style={{ cursor: 'pointer' }}
      />
      {/* Selection glow behind the edge */}
      {isSelected && (
        <path
          d={edgePath}
          fill="none"
          stroke="var(--accent-purple)"
          strokeWidth={6}
          strokeOpacity={0.4}
          strokeLinecap="round"
        />
      )}
      <BaseEdge
        id={id}
        path={edgePath}
        markerEnd={markerEnd}
        style={{
          stroke: edgeColor,
          strokeWidth: isSelected ? 3 : 2,
          strokeDasharray: isAsync ? '8 4' : undefined,
          animation: isAsync ? 'dash-flow 0.6s linear infinite' : undefined,
        }}
      />
      {/* Edge label */}
      <EdgeLabelRenderer>
        <div
          style={{
            position: 'absolute',
            transform: `translate(-50%, -50%) translate(${labelX}px, ${labelY}px)`,
            pointerEvents: 'all',
            cursor: 'pointer',
          }}
          className="nodrag nopan"
        >
          {isSelected ? (
            <input
              defaultValue={label}
              placeholder="label..."
              autoFocus={!label}
              onBlur={(e) => data?.onLabelChange(id, e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') (e.target as HTMLInputElement).blur();
              }}
              onClick={(e) => e.stopPropagation()}
              style={{
                background: 'var(--bg-surface)',
                border: '1px solid var(--accent-purple)',
                borderRadius: 4,
                color: 'var(--text-primary)',
                fontSize: 11,
                fontWeight: 500,
                padding: '2px 8px',
                outline: 'none',
                textAlign: 'center',
                minWidth: 50,
                width: Math.max(50, (label.length || 5) * 7),
              }}
            />
          ) : label ? (
            <div
              style={{
                background: 'var(--bg-surface)',
                border: '1px solid var(--border-default)',
                borderRadius: 4,
                color: 'var(--text-secondary)',
                fontSize: 11,
                fontWeight: 500,
                padding: '2px 8px',
                whiteSpace: 'nowrap',
              }}
            >
              {label}
            </div>
          ) : null}
        </div>
      </EdgeLabelRenderer>
    </>
  );
}

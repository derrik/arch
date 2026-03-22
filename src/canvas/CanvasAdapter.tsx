import type { CanvasAdapterProps } from './CanvasAdapter.types';
import { ReactFlowCanvas } from './reactflow/ReactFlowCanvas';

export function CanvasAdapter(props: CanvasAdapterProps) {
  return <ReactFlowCanvas {...props} />;
}

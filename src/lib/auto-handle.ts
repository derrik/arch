import { ArchNode } from '@/types/graph';

/** Approximate node dimensions for center calculation */
const NODE_WIDTH = 160;
const NODE_HEIGHT = 48;

type HandleSide = 'top' | 'right' | 'bottom' | 'left';

interface HandlePair {
  sourceHandle: string;
  targetHandle: string;
}

/**
 * Pick the best source/target handle pair based on relative position.
 *
 * Strategy: compute the angle from source center to target center,
 * then map to the closest cardinal direction. Source gets the handle
 * facing the target, target gets the handle facing the source.
 */
export function computeHandles(source: ArchNode, target: ArchNode): HandlePair {
  const sx = source.x + NODE_WIDTH / 2;
  const sy = source.y + NODE_HEIGHT / 2;
  const tx = target.x + NODE_WIDTH / 2;
  const ty = target.y + NODE_HEIGHT / 2;

  const dx = tx - sx;
  const dy = ty - sy;

  const sourceSide = dominantDirection(dx, dy);
  const targetSide = opposite(sourceSide);

  return {
    sourceHandle: sourceSide,
    targetHandle: targetSide,
  };
}

function dominantDirection(dx: number, dy: number): HandleSide {
  const absDx = Math.abs(dx);
  const absDy = Math.abs(dy);

  if (absDx > absDy) {
    return dx > 0 ? 'right' : 'left';
  } else {
    return dy > 0 ? 'bottom' : 'top';
  }
}

function opposite(side: HandleSide): HandleSide {
  switch (side) {
    case 'top': return 'bottom';
    case 'bottom': return 'top';
    case 'left': return 'right';
    case 'right': return 'left';
  }
}

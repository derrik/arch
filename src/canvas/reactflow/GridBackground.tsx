import { Background, BackgroundVariant } from '@xyflow/react';

export function GridBackground() {
  return (
    <>
      <Background
        variant={BackgroundVariant.Lines}
        gap={20}
        size={1}
        color="var(--grid-line)"
      />
      <Background
        id="major"
        variant={BackgroundVariant.Lines}
        gap={100}
        size={1}
        color="var(--grid-line-major)"
      />
    </>
  );
}

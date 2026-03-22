import { useEffect, useState } from 'react';
import { useStore } from '@/store';
import { startPersistenceSync } from '@/persistence/sync';
import { deserializeGraph } from '@/sharing/deserialize';
import { Shell } from '@/components/layout/Shell';

export default function App() {
  const [ready, setReady] = useState(false);
  const loadDiagrams = useStore((s) => s.loadDiagrams);
  const loadGraph = useStore((s) => s.loadGraph);

  useEffect(() => {
    async function init() {
      // Check for shared URL
      const params = new URLSearchParams(window.location.search);
      const graphParam = params.get('g');

      if (graphParam) {
        const graph = deserializeGraph(graphParam);
        if (graph) {
          await loadDiagrams();
          loadGraph(graph);
          // Clean URL
          window.history.replaceState({}, '', window.location.pathname);
          setReady(true);
          return;
        }
      }

      await loadDiagrams();
      setReady(true);
    }

    init();
    const unsub = startPersistenceSync();
    return unsub;
  }, []);

  if (!ready) {
    return (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'var(--bg-primary)',
          color: 'var(--accent-purple)',
          fontSize: 18,
          fontWeight: 600,
        }}
      >
        Loading...
      </div>
    );
  }

  return <Shell />;
}

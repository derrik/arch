import { openDB, IDBPDatabase } from 'idb';
import { Diagram } from '@/types/graph';
import { DB_NAME, DB_STORE } from '@/lib/constants';

let dbPromise: Promise<IDBPDatabase> | null = null;

function getDB() {
  if (!dbPromise) {
    dbPromise = openDB(DB_NAME, 1, {
      upgrade(db) {
        if (!db.objectStoreNames.contains(DB_STORE)) {
          db.createObjectStore(DB_STORE, { keyPath: 'id' });
        }
      },
    });
  }
  return dbPromise;
}

export async function getAllDiagrams(): Promise<Diagram[]> {
  const db = await getDB();
  return db.getAll(DB_STORE);
}

export async function getDiagram(id: string): Promise<Diagram | undefined> {
  const db = await getDB();
  return db.get(DB_STORE, id);
}

export async function saveDiagram(diagram: Diagram): Promise<void> {
  const db = await getDB();
  await db.put(DB_STORE, diagram);
}

export async function deleteDiagram(id: string): Promise<void> {
  const db = await getDB();
  await db.delete(DB_STORE, id);
}

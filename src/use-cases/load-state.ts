import { access } from 'node:fs/promises';
import { InventoryStore } from '../persistence/inventory-store.js';
import { emptyInventoryState, type InventoryState } from '../domain/inventory-state.js';

export async function loadState(filePath: string): Promise<InventoryState> {
  const store = new InventoryStore(filePath);
  try {
    await access(filePath);
  } catch {
    const state = emptyInventoryState();
    await store.save(state);
    return state;
  }
  return store.load();
}
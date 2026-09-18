import { applyStockMovement } from '../domain/inventory-state.js';
import type { InventoryState } from '../domain/inventory-state.js';

interface StateStore {
  load(): Promise<InventoryState>;
  save(state: InventoryState): Promise<unknown>;
}

export async function addStockEntry(store: StateStore, productCode: string, quantity: number, timestamp?: string): Promise<InventoryState> {
  const previous = await store.load();
  const next = applyStockMovement(previous, productCode, 'entry', quantity, timestamp);
  await store.save(next);
  return next;
}
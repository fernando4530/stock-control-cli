import { addProduct, type InventoryState } from '../domain/inventory-state.js';
import type { Product } from '../domain/product.js';
interface StateStore {
  load(): Promise<InventoryState>;
  save(state: InventoryState): Promise<unknown>;
}

export async function registerProduct(store: StateStore, input: Omit<Product, 'code'> & { code: string }): Promise<InventoryState> {
  const previous = await store.load();
  const next = addProduct(previous, input);
  try {
    await store.save(next);
  } catch (error) {
    throw error;
  }
  return next;
}
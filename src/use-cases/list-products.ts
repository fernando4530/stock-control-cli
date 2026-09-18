import type { InventoryState } from '../domain/inventory-state.js';

export function listProducts(state: InventoryState): { products: InventoryState['products']; message?: string } {
  return state.products.length === 0
    ? { products: [], message: 'No hay productos disponibles.' }
    : { products: [...state.products] };
}
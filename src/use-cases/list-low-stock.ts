import type { InventoryState } from '../domain/inventory-state.js';

export function listLowStock(state: InventoryState): { products: InventoryState['products']; message?: string } {
  const products = state.products.filter((product) => product.availableQuantity <= product.minStock);
  return products.length === 0 ? { products, message: 'No hay productos con stock bajo.' } : { products };
}
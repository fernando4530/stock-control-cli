import type { Product } from '../../domain/product.js';
import type { StockMovement } from '../../domain/stock-movement.js';

export function formatProducts(products: Product[], emptyMessage = 'No hay productos disponibles.'): string {
  if (products.length === 0) return emptyMessage;
  return products.map((product) => `${product.code} | ${product.name} | disponible: ${product.availableQuantity} | mínimo: ${product.minStock}`).join('\n');
}

export function formatMovements(movements: StockMovement[], emptyMessage = 'No hay movimientos.'): string {
  if (movements.length === 0) return emptyMessage;
  return movements.map((movement) => `${movement.productCode} | ${movement.type === 'entry' ? 'entrada' : 'salida'} | cantidad: ${movement.quantity} | fecha: ${movement.timestamp} | resultante: ${movement.resultingQuantity}`).join('\n');
}

export function formatError(error: unknown): string {
  return `Error: ${error instanceof Error ? error.message : String(error)}`;
}
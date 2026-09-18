import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { addProduct, emptyInventoryState } from '../../src/domain/inventory-state.js';
import { listLowStock } from '../../src/use-cases/list-low-stock.js';

describe('flujo integrado de stock bajo', () => {
  it('consulta productos bajo el mínimo y devuelve ausencia cuando corresponde', () => {
    const state = addProduct(emptyInventoryState(), { code: 'p', name: 'Producto', description: 'd', availableQuantity: 2, minStock: 2 });
    assert.equal(listLowStock(state).products.length, 1);
    const normal = addProduct(emptyInventoryState(), { code: 'p', name: 'Producto', description: 'd', availableQuantity: 3, minStock: 2 });
    assert.equal(listLowStock(normal).message, 'No hay productos con stock bajo.');
  });
});
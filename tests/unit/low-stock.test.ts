import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { addProduct, emptyInventoryState } from '../../src/domain/inventory-state.js';
import { listLowStock } from '../../src/use-cases/list-low-stock.js';

describe('stock bajo', () => {
  it('incluye igualdad y valores inferiores, y omite superiores', () => {
    let state = emptyInventoryState();
    state = addProduct(state, { code: 'low', name: 'Bajo', description: 'd', availableQuantity: 4, minStock: 5 });
    state = addProduct(state, { code: 'equal', name: 'Igual', description: 'd', availableQuantity: 5, minStock: 5 });
    state = addProduct(state, { code: 'ok', name: 'Normal', description: 'd', availableQuantity: 6, minStock: 5 });
    assert.deepEqual(listLowStock(state).products.map((product) => product.code), ['low', 'equal']);
  });
});
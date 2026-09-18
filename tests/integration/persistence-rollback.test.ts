import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { addProduct, emptyInventoryState } from '../../src/domain/inventory-state.js';
import { addStockEntry } from '../../src/use-cases/add-stock-entry.js';

describe('rollback de persistencia', () => {
  it('no confirma el estado en memoria si falla el guardado', async () => {
    const previous = addProduct(emptyInventoryState(), { code: 'p', name: 'Producto', description: 'd', availableQuantity: 1, minStock: 0 });
    let savedState = previous;
    const store = { load: async () => savedState, save: async () => { throw new Error('fallo de disco'); } };
    await assert.rejects(addStockEntry(store, 'p', 1));
    assert.equal(savedState.products[0].availableQuantity, 1);
    assert.equal(savedState.movements.length, 0);
  });
});
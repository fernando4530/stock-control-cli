import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { addProduct, emptyInventoryState } from '../../src/domain/inventory-state.js';
import { addStockEntry } from '../../src/use-cases/add-stock-entry.js';

describe('caso de uso de entrada', () => {
  it('persiste la entrada y devuelve el saldo resultante', async () => {
    const initial = addProduct(emptyInventoryState(), { code: 'p', name: 'Producto', description: 'Descripción', availableQuantity: 2, minStock: 0 });
    const store = { load: async () => initial, save: async (state: typeof initial) => state };
    const result = await addStockEntry(store, 'P', 3, '2026-01-01T00:00:00.000Z');
    assert.equal(result.products[0].availableQuantity, 5);
    assert.equal(result.movements[0].type, 'entry');
  });
});
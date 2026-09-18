import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { addProduct, emptyInventoryState } from '../../src/domain/inventory-state.js';
import { addStockEntry } from '../../src/use-cases/add-stock-entry.js';
import { addStockExit } from '../../src/use-cases/add-stock-exit.js';

describe('flujo integrado de movimientos', () => {
  it('persiste entradas y salidas, y rechaza salidas excedidas sin movimiento', async () => {
    let state = addProduct(emptyInventoryState(), { code: 'p', name: 'Producto', description: 'd', availableQuantity: 10, minStock: 2 });
    const store = { load: async () => state, save: async (next: typeof state) => { state = next; } };
    await addStockEntry(store, 'p', 5);
    await addStockExit(store, 'p', 3);
    await assert.rejects(addStockExit(store, 'p', 100));
    assert.equal(state.products[0].availableQuantity, 12);
    assert.equal(state.movements.length, 2);
  });
});
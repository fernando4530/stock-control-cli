import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { addProduct, emptyInventoryState } from '../../src/domain/inventory-state.js';
import { addStockExit } from '../../src/use-cases/add-stock-exit.js';
import { ValidationError } from '../../src/domain/errors.js';

describe('caso de uso de salida', () => {
  it('rechaza salidas mayores al stock sin guardar cambios', async () => {
    const initial = addProduct(emptyInventoryState(), { code: 'p', name: 'Producto', description: 'Descripción', availableQuantity: 2, minStock: 0 });
    let saved = false;
    const store = { load: async () => initial, save: async () => { saved = true; } };
    await assert.rejects(addStockExit(store, 'p', 3), ValidationError);
    assert.equal(saved, false);
    assert.equal(initial.products[0].availableQuantity, 2);
  });
});
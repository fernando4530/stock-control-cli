import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { addProduct, emptyInventoryState } from '../../src/domain/inventory-state.js';
import { ValidationError } from '../../src/domain/errors.js';

describe('registro de productos', () => {
  it('normaliza el código y conserva la disponibilidad inicial sin movimiento', () => {
    const state = addProduct(emptyInventoryState(), {
      code: ' ABC-12 ', name: 'Lámpara LED', description: 'Luz doméstica', availableQuantity: 15, minStock: 5,
    });
    assert.deepEqual(state.products[0], { code: 'abc-12', name: 'Lámpara LED', description: 'Luz doméstica', availableQuantity: 15, minStock: 5 });
    assert.deepEqual(state.movements, []);
  });

  it('rechaza duplicados, textos vacíos y cantidades inválidas', () => {
    const state = addProduct(emptyInventoryState(), { code: 'abc-12', name: 'Producto', description: 'Descripción', availableQuantity: 0, minStock: 0 });
    assert.throws(() => addProduct(state, { code: ' ABC-12 ', name: 'Otro', description: 'Descripción', availableQuantity: 1, minStock: 0 }), ValidationError);
    assert.throws(() => addProduct(emptyInventoryState(), { code: 'x', name: ' ', description: 'Descripción', availableQuantity: 0, minStock: 0 }), ValidationError);
    assert.throws(() => addProduct(emptyInventoryState(), { code: 'x', name: 'Producto', description: 'Descripción', availableQuantity: -1, minStock: 0 }), ValidationError);
  });
});
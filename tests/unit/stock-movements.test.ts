import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { addProduct, applyStockMovement, emptyInventoryState } from '../../src/domain/inventory-state.js';
import { NotFoundError, ValidationError } from '../../src/domain/errors.js';

function stateWithProduct() {
  return addProduct(emptyInventoryState(), { code: 'P-001', name: 'Producto', description: 'Descripción', availableQuantity: 10, minStock: 2 });
}

describe('movimientos de stock', () => {
  it('incrementa y decrementa creando movimientos', () => {
    const entered = applyStockMovement(stateWithProduct(), 'p-001', 'entry', 5, '2026-01-01T00:00:00.000Z');
    const exited = applyStockMovement(entered, 'P-001', 'exit', 3, '2026-01-02T00:00:00.000Z');
    assert.equal(exited.products[0].availableQuantity, 12);
    assert.equal(exited.movements.length, 2);
    assert.equal(exited.movements[1].resultingQuantity, 12);
  });

  it('rechaza producto inexistente, cantidad inválida y salida excedida sin mutar', () => {
    const state = stateWithProduct();
    assert.throws(() => applyStockMovement(state, 'P-999', 'entry', 1), NotFoundError);
    assert.throws(() => applyStockMovement(state, 'P-001', 'entry', 0), ValidationError);
    assert.throws(() => applyStockMovement(state, 'P-001', 'exit', 11), ValidationError);
    assert.equal(state.products[0].availableQuantity, 10);
    assert.equal(state.movements.length, 0);
  });
});
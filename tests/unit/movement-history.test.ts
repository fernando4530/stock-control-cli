import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { listMovements } from '../../src/domain/inventory-state.js';
import type { InventoryState } from '../../src/domain/inventory-state.js';
import { listMovementHistory } from '../../src/use-cases/list-movements.js';

describe('historial de movimientos', () => {
  it('ordena por timestamp descendente y luego por id descendente', () => {
    const state: InventoryState = { products: [], movements: [
      { id: 1, productCode: 'p', type: 'entry', quantity: 1, timestamp: '2026-01-01T00:00:00.000Z', resultingQuantity: 1 },
      { id: 3, productCode: 'p', type: 'exit', quantity: 1, timestamp: '2026-01-02T00:00:00.000Z', resultingQuantity: 0 },
      { id: 2, productCode: 'p', type: 'entry', quantity: 2, timestamp: '2026-01-02T00:00:00.000Z', resultingQuantity: 2 },
    ] };
    assert.deepEqual(listMovements(state).map((movement) => movement.id), [3, 2, 1]);
    assert.equal(listMovementHistory({ products: [], movements: [] }).message, 'No hay movimientos.');
  });
});
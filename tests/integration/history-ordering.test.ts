import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { listMovementHistory } from '../../src/use-cases/list-movements.js';

describe('orden del historial', () => {
  it('muestra únicamente movimientos aceptados en orden descendente', () => {
    const result = listMovementHistory({ products: [], movements: [
      { id: 1, productCode: 'p', type: 'entry', quantity: 1, timestamp: '2026-01-01T00:00:00.000Z', resultingQuantity: 1 },
      { id: 2, productCode: 'p', type: 'exit', quantity: 1, timestamp: '2026-01-01T00:00:00.000Z', resultingQuantity: 0 },
    ] });
    assert.deepEqual(result.movements.map((movement) => movement.id), [2, 1]);
  });
});
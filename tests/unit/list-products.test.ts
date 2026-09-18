import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { emptyInventoryState } from '../../src/domain/inventory-state.js';
import { listProducts } from '../../src/use-cases/list-products.js';

describe('consulta de productos', () => {
  it('devuelve un catálogo vacío con mensaje explícito', () => {
    assert.deepEqual(listProducts(emptyInventoryState()), { products: [], message: 'No hay productos disponibles.' });
  });
});
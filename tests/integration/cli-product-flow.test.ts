import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { addProduct, emptyInventoryState } from '../../src/domain/inventory-state.js';
import { registerProduct } from '../../src/use-cases/register-product.js';
import { listProducts } from '../../src/use-cases/list-products.js';

describe('flujo integrado de productos', () => {
  it('registra una vez y consulta la disponibilidad persistida', async () => {
    let state = emptyInventoryState();
    const store = { load: async () => state, save: async (next: typeof state) => { state = next; } };
    await registerProduct(store, { code: ' ABC-12 ', name: 'Lámpara', description: 'Luz', availableQuantity: 15, minStock: 5 });
    assert.equal(listProducts(await store.load()).products[0].availableQuantity, 15);
    await assert.rejects(registerProduct(store, { code: 'abc-12', name: 'Otra', description: 'Luz', availableQuantity: 1, minStock: 0 }));
  });
});
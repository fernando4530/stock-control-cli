import assert from 'node:assert/strict';
import { mkdtemp, readFile, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { afterEach, describe, it } from 'node:test';
import { InventoryStore } from '../../src/persistence/inventory-store.js';
import type { InventoryState } from '../../src/domain/inventory-state.js';

const temporaryDirectories: string[] = [];

afterEach(async () => {
  await Promise.all(temporaryDirectories.splice(0).map((directory) => rm(directory, { recursive: true, force: true })));
});

describe('persistencia JSON', () => {
  it('lee, escribe y reemplaza el estado de forma atómica', async () => {
    const directory = await mkdtemp(join(tmpdir(), 'stock-control-'));
    temporaryDirectories.push(directory);
    const filePath = join(directory, 'inventory.json');
    const store = new InventoryStore(filePath);
    const state: InventoryState = { products: [], movements: [] };

    await store.save(state);

    assert.deepEqual(await store.load(), state);
    assert.equal(await readFile(filePath, 'utf8'), `${JSON.stringify(state, null, 2)}\n`);
  });
});
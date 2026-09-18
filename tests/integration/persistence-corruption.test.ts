import assert from 'node:assert/strict';
import { access, mkdtemp, readFile, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { afterEach, describe, it } from 'node:test';
import { loadState } from '../../src/use-cases/load-state.js';

const directories: string[] = [];
afterEach(async () => Promise.all(directories.splice(0).map((directory) => rm(directory, { recursive: true, force: true }))));

describe('persistencia y corrupción', () => {
  it('crea un estado vacío si no existe el archivo y preserva uno corrupto', async () => {
    const directory = await mkdtemp(join(tmpdir(), 'stock-control-menu-'));
    directories.push(directory);
    const filePath = join(directory, 'inventory.json');
    assert.deepEqual(await loadState(filePath), { products: [], movements: [] });
    await access(filePath);
    const content = '{corrupto';
    await writeFile(filePath, content, 'utf8');
    await assert.rejects(loadState(filePath));
    assert.equal(await readFile(filePath, 'utf8'), content);
  });
});
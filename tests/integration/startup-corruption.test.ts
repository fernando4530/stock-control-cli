import assert from 'node:assert/strict';
import { mkdtemp, readFile, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { afterEach, describe, it } from 'node:test';
import { CorruptInventoryError } from '../../src/domain/errors.js';
import { loadState } from '../../src/use-cases/load-state.js';

const temporaryDirectories: string[] = [];

afterEach(async () => {
  await Promise.all(temporaryDirectories.splice(0).map((directory) => rm(directory, { recursive: true, force: true })));
});

describe('inicio con datos corruptos', () => {
  it('conserva el archivo y aborta la carga', async () => {
    const directory = await mkdtemp(join(tmpdir(), 'stock-control-corrupt-'));
    temporaryDirectories.push(directory);
    const filePath = join(directory, 'inventory.json');
    const original = '{ datos inválidos';
    await writeFile(filePath, original, 'utf8');

    await assert.rejects(loadState(filePath), CorruptInventoryError);
    assert.equal(await readFile(filePath, 'utf8'), original);
  });
});
import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { runMenu, type MenuIO } from '../../src/app/cli/menu.js';
import { emptyInventoryState } from '../../src/domain/inventory-state.js';

describe('menú de la CLI', () => {
  it('mantiene el flujo, rechaza opción inválida y permite salir', async () => {
    const output: string[] = [];
    const answers = ['99', '7'];
    const io: MenuIO = { ask: async () => answers.shift() ?? '7', write: (message) => output.push(message) };
    const store = { load: async () => emptyInventoryState(), save: async () => undefined };
    await runMenu(store, io);
    assert.match(output.join('\n'), /Opción inválida/);
    assert.match(output.join('\n'), /Hasta luego/);
  });
});
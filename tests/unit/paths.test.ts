import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { resolveInventoryPath } from '../../src/persistence/paths.js';

describe('resolución de rutas', () => {
  it('usa data/inventory.json bajo la raíz de desarrollo', () => {
    const result = resolveInventoryPath({
      developmentRoot: '/proyecto',
      executablePath: '/proyecto/dist/main.js',
      isPackaged: false,
    });

    assert.equal(result, '/proyecto/data/inventory.json');
  });

  it('usa el directorio del ejecutable cuando está empaquetada', () => {
    const result = resolveInventoryPath({
      developmentRoot: '/proyecto',
      executablePath: '/opt/stock-control/stock-control-linux',
      isPackaged: true,
    });

    assert.equal(result, '/opt/stock-control/data/inventory.json');
  });
});
import { access, mkdir, readFile } from 'node:fs/promises';
import { dirname } from 'node:path';
import { CorruptInventoryError, PersistenceError } from '../domain/errors.js';
import { validateInventoryState, type InventoryState } from '../domain/inventory-state.js';
import { writeFileAtomically } from './atomic-writer.js';

export async function readInventoryFile(filePath: string): Promise<InventoryState> {
  let content: string;
  try {
    content = await readFile(filePath, 'utf8');
  } catch (error) {
    throw new PersistenceError(`No se pudo leer el archivo de inventario: ${error instanceof Error ? error.message : String(error)}`);
  }
  try {
    return validateInventoryState(JSON.parse(content) as unknown);
  } catch (error) {
    if (error instanceof SyntaxError || error instanceof Error) {
      throw new CorruptInventoryError(`El archivo de inventario está corrupto o no cumple el modelo: ${error.message}`);
    }
    throw new CorruptInventoryError('El archivo de inventario está corrupto o no cumple el modelo.');
  }
}

export async function writeInventoryFile(filePath: string, state: InventoryState): Promise<void> {
  try {
    const validated = validateInventoryState(state);
    await mkdir(dirname(filePath), { recursive: true });
    await access(dirname(filePath));
    await writeFileAtomically(filePath, `${JSON.stringify(validated, null, 2)}\n`);
  } catch (error) {
    if (error instanceof PersistenceError) throw error;
    throw new PersistenceError(`No se pudo guardar el inventario: ${error instanceof Error ? error.message : String(error)}`);
  }
}
import { createInterface } from 'node:readline/promises';
import { stdin as input, stdout as output } from 'node:process';
import { CorruptInventoryError } from '../domain/errors.js';
import { InventoryStore } from '../persistence/inventory-store.js';
import { resolveRuntimeInventoryPath } from '../persistence/paths.js';
import { loadState } from '../use-cases/load-state.js';
import { runMenu } from './cli/menu.js';

export async function startApplication(): Promise<void> {
  const filePath = resolveRuntimeInventoryPath();
  try {
    await loadState(filePath);
  } catch (error) {
    if (error instanceof CorruptInventoryError) {
      console.error(`Error de inicio: ${error.message}`);
      return;
    }
    throw error;
  }
  const readline = createInterface({ input, output });
  try {
    await runMenu(new InventoryStore(filePath), {
      ask: (question) => readline.question(question),
      write: (message) => console.log(message),
    });
  } finally {
    readline.close();
  }
}
import { access } from 'node:fs/promises';
import { emptyInventoryState, type InventoryState } from '../domain/inventory-state.js';
import { readInventoryFile, writeInventoryFile } from './json-file.js';

export class InventoryStore {
  constructor(private readonly filePath: string) {}

  async load(): Promise<InventoryState> {
    try {
      await access(this.filePath);
    } catch {
      return emptyInventoryState();
    }
    return readInventoryFile(this.filePath);
  }

  async save(state: InventoryState): Promise<void> {
    await writeInventoryFile(this.filePath, state);
  }
}
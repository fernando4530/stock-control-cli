import { dirname, join } from 'node:path';

declare global {
  namespace NodeJS {
    interface Process {
      pkg?: unknown;
    }
  }
}

export interface PathResolutionOptions {
  developmentRoot: string;
  executablePath: string;
  isPackaged: boolean;
}

export function resolveInventoryPath(options: PathResolutionOptions): string {
  const root = options.isPackaged ? dirname(options.executablePath) : options.developmentRoot;
  return join(root, 'data', 'inventory.json');
}

export function resolveRuntimeInventoryPath(): string {
  const isPackaged = process.pkg !== undefined;
  return resolveInventoryPath({
    developmentRoot: process.cwd(),
    executablePath: process.execPath,
    isPackaged,
  });
}
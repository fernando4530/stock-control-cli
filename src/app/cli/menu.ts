import { addStockEntry } from '../../use-cases/add-stock-entry.js';
import { addStockExit } from '../../use-cases/add-stock-exit.js';
import { listLowStock } from '../../use-cases/list-low-stock.js';
import { listMovementHistory } from '../../use-cases/list-movements.js';
import { listProducts } from '../../use-cases/list-products.js';
import { registerProduct } from '../../use-cases/register-product.js';
import type { InventoryStore } from '../../persistence/inventory-store.js';
import { formatError, formatMovements, formatProducts } from './formatter.js';
import { askInteger, askRequired, type PromptIO } from './prompts.js';

export interface MenuIO extends PromptIO {
  write(message: string): void;
}

export async function runMenu(store: Pick<InventoryStore, 'load' | 'save'>, io: MenuIO): Promise<void> {
  let active = true;
  while (active) {
    io.write('\n1. Registrar producto\n2. Registrar entrada\n3. Registrar salida\n4. Consultar productos\n5. Consultar stock bajo\n6. Consultar historial\n7. Salir');
    try {
      const option = await io.ask('Opción: ');
      switch (option.trim()) {
        case '1': await registerProductFromMenu(store, io); break;
        case '2': await movementFromMenu(store, io, 'entry'); break;
        case '3': await movementFromMenu(store, io, 'exit'); break;
        case '4': { const result = listProducts(await store.load()); io.write(formatProducts(result.products, result.message)); break; }
        case '5': { const result = listLowStock(await store.load()); io.write(formatProducts(result.products, result.message)); break; }
        case '6': { const result = listMovementHistory(await store.load()); io.write(formatMovements(result.movements, result.message)); break; }
        case '7': active = false; io.write('Hasta luego.'); break;
        default: io.write('Opción inválida.');
      }
    } catch (error) {
      io.write(formatError(error));
    }
  }
}

async function registerProductFromMenu(store: Pick<InventoryStore, 'load' | 'save'>, io: MenuIO): Promise<void> {
  const state = await registerProduct(store, {
    code: await askRequired(io, 'Código: '),
    name: await askRequired(io, 'Nombre: '),
    description: await askRequired(io, 'Descripción: '),
    availableQuantity: await askInteger(io, 'Cantidad inicial: '),
    minStock: await askInteger(io, 'Stock mínimo: '),
  });
  io.write(`Producto registrado. Disponibilidad: ${state.products.at(-1)?.availableQuantity ?? 0}.`);
}

async function movementFromMenu(store: Pick<InventoryStore, 'load' | 'save'>, io: MenuIO, type: 'entry' | 'exit'): Promise<void> {
  const code = await askRequired(io, 'Código: ');
  const quantity = await askInteger(io, 'Cantidad: ');
  const state = type === 'entry' ? await addStockEntry(store, code, quantity) : await addStockExit(store, code, quantity);
  io.write(`Movimiento registrado. Disponibilidad: ${state.products.find((product) => product.code === code.trim().toLowerCase())?.availableQuantity ?? 0}.`);
}
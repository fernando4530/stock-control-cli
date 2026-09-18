import { normalizeCode } from '../shared/normalize.js';
import { requirePositiveInteger } from './validations.js';

export type StockMovementType = 'entry' | 'exit';

export interface StockMovement {
  id: number;
  productCode: string;
  type: StockMovementType;
  quantity: number;
  timestamp: string;
  resultingQuantity: number;
}

export function createStockMovement(input: StockMovement): StockMovement {
  if (!Number.isInteger(input.id) || input.id <= 0) {
    throw new Error('El identificador del movimiento debe ser un entero positivo.');
  }
  if (input.type !== 'entry' && input.type !== 'exit') {
    throw new Error('El tipo de movimiento no es válido.');
  }
  if (input.resultingQuantity < 0 || !Number.isInteger(input.resultingQuantity)) {
    throw new Error('El stock resultante debe ser un entero no negativo.');
  }
  return {
    ...input,
    productCode: normalizeCode(input.productCode),
    quantity: requirePositiveInteger(input.quantity, 'cantidad'),
  };
}

export function compareMovementsDescending(left: StockMovement, right: StockMovement): number {
  const timestampOrder = right.timestamp.localeCompare(left.timestamp);
  return timestampOrder !== 0 ? timestampOrder : right.id - left.id;
}
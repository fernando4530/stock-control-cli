import { listMovements, type InventoryState } from '../domain/inventory-state.js';

export function listMovementHistory(state: InventoryState) {
  const movements = listMovements(state);
  return movements.length === 0 ? { movements, message: 'No hay movimientos.' } : { movements };
}
import { NotFoundError, ValidationError } from './errors.js';
import { createProduct, type Product } from './product.js';
import { compareMovementsDescending, createStockMovement, type StockMovement, type StockMovementType } from './stock-movement.js';
import { normalizeCode } from '../shared/normalize.js';
import { requirePositiveInteger } from './validations.js';

export interface InventoryState {
  products: Product[];
  movements: StockMovement[];
}

export const emptyInventoryState = (): InventoryState => ({ products: [], movements: [] });

export function validateInventoryState(value: unknown): InventoryState {
  if (!value || typeof value !== 'object') {
    throw new ValidationError('El estado de inventario debe ser un objeto.');
  }
  const candidate = value as { products?: unknown; movements?: unknown };
  if (!Array.isArray(candidate.products) || !Array.isArray(candidate.movements)) {
    throw new ValidationError('El estado debe contener las colecciones products y movements.');
  }
  const products = candidate.products.map((product) => createProduct(product as Product));
  const codes = new Set<string>();
  for (const product of products) {
    if (codes.has(product.code)) {
      throw new ValidationError(`El código ${product.code} está duplicado.`);
    }
    codes.add(product.code);
  }
  const movements = candidate.movements.map((movement) => createStockMovement(movement as StockMovement));
  for (const movement of movements) {
    if (!codes.has(movement.productCode)) {
      throw new ValidationError(`El movimiento ${movement.id} referencia un producto inexistente.`);
    }
  }
  return { products, movements };
}

export function addProduct(state: InventoryState, input: Omit<Product, 'code'> & { code: string }): InventoryState {
  const product = createProduct(input);
  if (state.products.some((existing) => existing.code === product.code)) {
    throw new ValidationError(`El código ${product.code} ya existe.`);
  }
  return { products: [...state.products, product], movements: [...state.movements] };
}

export function applyStockMovement(
  state: InventoryState,
  productCode: string,
  type: StockMovementType,
  quantity: number,
  timestamp = new Date().toISOString(),
): InventoryState {
  const code = normalizeCode(productCode);
  const productIndex = state.products.findIndex((product) => product.code === code);
  if (productIndex === -1) {
    throw new NotFoundError(`No existe el producto ${code}.`);
  }
  const validQuantity = requirePositiveInteger(quantity, 'cantidad');
  const product = state.products[productIndex];
  const resultingQuantity = type === 'entry' ? product.availableQuantity + validQuantity : product.availableQuantity - validQuantity;
  if (resultingQuantity < 0) {
    throw new ValidationError('La salida supera el stock disponible.');
  }
  const movement = createStockMovement({
    id: nextMovementId(state),
    productCode: code,
    type,
    quantity: validQuantity,
    timestamp,
    resultingQuantity,
  });
  const products = state.products.map((current, index) => index === productIndex ? { ...current, availableQuantity: resultingQuantity } : current);
  return { products, movements: [...state.movements, movement] };
}

export function nextMovementId(state: InventoryState): number {
  return state.movements.reduce((maximum, movement) => Math.max(maximum, movement.id), 0) + 1;
}

export function listMovements(state: InventoryState): StockMovement[] {
  return [...state.movements].sort(compareMovementsDescending);
}
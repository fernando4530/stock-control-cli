import { normalizeCode } from '../shared/normalize.js';
import { requireNonEmptyText, requireNonNegativeInteger } from './validations.js';

export interface Product {
  code: string;
  name: string;
  description: string;
  availableQuantity: number;
  minStock: number;
}

export function createProduct(input: Omit<Product, 'code'> & { code: string }): Product {
  return {
    code: normalizeCode(input.code),
    name: requireNonEmptyText(input.name, 'nombre'),
    description: requireNonEmptyText(input.description, 'descripción'),
    availableQuantity: requireNonNegativeInteger(input.availableQuantity, 'cantidad disponible'),
    minStock: requireNonNegativeInteger(input.minStock, 'stock mínimo'),
  };
}
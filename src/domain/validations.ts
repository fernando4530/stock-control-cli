import { ValidationError } from './errors.js';

export function requireNonEmptyText(value: string, field: string): string {
  const normalized = value.trim();
  if (normalized.length === 0) {
    throw new ValidationError(`El campo ${field} no puede estar vacío.`);
  }
  return normalized;
}

export function requireNonNegativeInteger(value: number, field: string): number {
  if (!Number.isInteger(value) || value < 0) {
    throw new ValidationError(`El campo ${field} debe ser un entero no negativo.`);
  }
  return value;
}

export function requirePositiveInteger(value: number, field: string): number {
  if (!Number.isInteger(value) || value <= 0) {
    throw new ValidationError(`El campo ${field} debe ser un entero positivo.`);
  }
  return value;
}
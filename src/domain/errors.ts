export class DomainError extends Error {
  constructor(message: string) {
    super(message);
    this.name = new.target.name;
  }
}

export class ValidationError extends DomainError {}
export class NotFoundError extends DomainError {}
export class PersistenceError extends DomainError {}
export class CorruptInventoryError extends PersistenceError {}
export class UnsupportedOperationError extends DomainError {}
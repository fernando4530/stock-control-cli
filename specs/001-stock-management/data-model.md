# Modelo de datos del sistema de gestión de stock

## Visión general

El sistema gestiona dos tipos principales de datos: productos y movimientos de stock. Ambos se mantienen en un estado global persistido en archivos JSON externos y se cargan al inicio de la aplicación. El estado es local, no concurrente y puede ser recuperado en reinicios del programa.

## Entidad: Producto

```ts
interface Product {
  code: string;
  name: string;
  description: string;
  availableQuantity: number;
  minStock: number;
}
```

### Atributos

- `code`: código único, normalizado en minúsculas y sin espacios envolventes.
- `name`: nombre legible del producto; debe ser no vacío después de recortar espacios.
- `description`: descripción legible; debe ser no vacía tras recortar espacios.
- `availableQuantity`: cantidad actual disponible; entero no negativo.
- `minStock`: umbral de alerta; entero no negativo.

### Reglas de validación

- El código no puede quedar vacío después de `trim()`.
- El código se normaliza para comparación: `trim().toLowerCase()`.
- No puede existir más de un producto con el mismo código normalizado.
- `name` y `description` no pueden quedar vacíos luego de recortar espacios.
- La cantidad inicial y el stock mínimo deben ser enteros no negativos.
- La cantidad inicial registrada no genera movimiento, solo define disponibilidad inicial.

### Relaciones

- Un producto puede estar relacionado con varios movimientos.
- El producto se identifica por `code`, no por índice.

## Entidad: Movimiento de stock

```ts
interface StockMovement {
  id: number;
  productCode: string;
  type: 'entry' | 'exit';
  quantity: number;
  timestamp: string;
  resultingQuantity: number;
}
```

### Atributos

- `id`: entero positivo, secuencial y creciente; el siguiente identificador será el máximo existente más uno.
- `productCode`: código del producto asociado a la operación.
- `type`: tipo de operación; valores permitidos: `entry` y `exit`.
- `quantity`: cantidad involucrada en la operación; entero positivo.
- `timestamp`: marca temporal de la operación en formato ISO 8601.
- `resultingQuantity`: cantidad disponible del producto luego de ejecutar la operación.

### Reglas de validación

- La cantidad debe ser un entero mayor que cero.
- La operación debe referenciar un producto existente.
- La salida no puede exceder la cantidad disponible actual.
- El cálculo final no puede generar un valor negativo.
- El historial debe presentarse con orden descendente por `timestamp` y desempate por `id` descendente.
- El `id` debe mantenerse secuencial y creciente para asegurar determinismo y trazabilidad.

### Relaciones

- Cada movimiento pertenece a un producto.
- El historial se guarda en una colección ordenada por criterio de auditoría.

## Estado global

```ts
interface InventoryState {
  products: Product[];
  movements: StockMovement[];
}
```

### Semántica del estado

- `products`: catálogo de productos activos.
- `movements`: historial de operaciones aceptadas.
- El estado se reconstruye desde el archivo JSON al iniciar.
- La ruta persistente es `<raíz-del-proyecto>/data/inventory.json` en desarrollo y `<directorio-del-ejecutable>/data/inventory.json` en binarios empaquetados.
- Si el estado es corrupto, ilegible o no cumple el modelo esperado, la carga falla sin destruir el archivo original.

## Estados y transiciones

### Estado de producto

- `registered`: producto existente y operativo.
- `low-stock`: producto cuyo `availableQuantity <= minStock`.

### Transiciones de movimiento

- `register-product`: valida, crea producto y lo agrega al estado; no genera movimiento.
- `stock-entry`: valida producto, cantidad positiva y persiste movimiento.
- `stock-exit`: valida producto, cantidad positiva, existencia de stock y persiste movimiento.
- `rejected`: si falla validación, el estado no cambia.

## Reglas de integridad

1. Todo producto tiene un código único tras normalizar espacios y mayúsculas.
2. La cantidad disponible nunca puede ser negativa.
3. Las salidas rechazadas no crean movimiento ni alteran stock.
4. El registro de un producto no crea movimiento.
5. Los cambios de estado solo se persisten cuando la escritura completa es exitosa.
6. El historial siempre representa operaciones aceptadas y aprobadas por validación.

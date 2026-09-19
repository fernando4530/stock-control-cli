# Documentación técnica

Documento generado a partir de las entradas autorizadas del proyecto. Las afirmaciones se clasifican como hechos verificados, decisiones SDD o limitaciones.

## Propósito

### Hechos verificados

Stock Control CLI es una aplicación de línea de comandos que mantiene un catálogo de productos y movimientos de stock en un estado formado por las colecciones `products` y `movements`. Permite registrar productos, entradas y salidas, consultar productos, detectar stock bajo y consultar el historial. El punto de entrada es `src/main.ts` y la interacción usa la entrada y salida estándar mediante `node:readline/promises` (`src/main.ts`, `src/app/bootstrap.ts`, `src/app/cli/menu.ts`, `src/domain/inventory-state.ts`).

### Decisiones SDD

La constitución y la especificación definen una aplicación CLI local, sin interfaz gráfica, servidor web, base de datos, autenticación ni servicios de red. El inventario debe persistir en archivos JSON externos y las entradas y salidas aceptadas deben crear movimientos (`.specify/memory/constitution.md`, `specs/001-stock-management/spec.md`).

### Limitaciones

La especificación figura con estado `Borrador`. Los objetivos de tiempo de respuesta del plan no tienen una medición documentada en las evidencias autorizadas (`specs/001-stock-management/spec.md`, `specs/001-stock-management/plan.md`).

## Alcance

### Hechos verificados

- Registro de productos con código, nombre, descripción, cantidad inicial y stock mínimo.
- Normalización del código mediante recorte de espacios y conversión a minúsculas.
- Registro de entradas y salidas para productos existentes.
- Consultas de productos y de productos con `availableQuantity <= minStock`.
- Consulta del historial ordenado por marca temporal descendente y, en empate, por identificador descendente.
- Menú persistente hasta seleccionar la opción `7`.
- Persistencia local del estado en JSON y carga de un estado vacío cuando el archivo no existe (`src/domain/`, `src/use-cases/`, `src/app/cli/`, `src/persistence/`).

### Decisiones SDD

La especificación deja fuera de alcance la edición y eliminación de productos o movimientos, múltiples almacenes, precios, ventas, compras, proveedores, autenticación, base de datos, red, nube y concurrencia multiusuario (`specs/001-stock-management/spec.md`).

### Limitaciones

No se observa en el código una funcionalidad de edición o eliminación, consistente con el fuera de alcance SDD. No hay evidencia autorizada de uso concurrente ni de funcionalidades fuera de las enumeradas.

## Arquitectura

### Hechos verificados

La implementación está organizada en módulos:

- `src/domain/`: entidades `Product` y `StockMovement`, estado global, validaciones y errores.
- `src/use-cases/`: carga de estado, registro de productos, movimientos y consultas.
- `src/persistence/`: resolución de rutas, lectura/escritura JSON, escritura atómica y `InventoryStore`.
- `src/app/cli/`: menú, prompts y formateo de respuestas.
- `src/app/bootstrap.ts`: resolución de la ruta, carga inicial y composición de la CLI.
- `src/shared/normalize.ts`: normalización de códigos y textos.

Los casos de uso cargan el estado, construyen un nuevo estado y lo entregan al almacenamiento. El menú captura errores y los convierte en mensajes mediante `formatError` (`src/domain/inventory-state.ts`, `src/use-cases/*.ts`, `src/app/cli/menu.ts`).

### Decisiones SDD

El plan define una arquitectura modular separada en dominio, casos de uso, persistencia y CLI, con TypeScript estricto y Node.js 24 (`specs/001-stock-management/plan.md`).

### Limitaciones

El plan propone `src/shared/time.ts` y `src/shared/logger.ts`, pero esos archivos no están presentes en la estructura autorizada inspeccionada. El flujo implementado no los necesita para las capacidades observadas. La estructura prevista también menciona módulos de pruebas que no coinciden exactamente con los archivos presentes (`specs/001-stock-management/plan.md`, `src/`, `tests/`).

## Estructura

La estructura relevante verificada es:

```text
src/
├── main.ts
├── app/
│   ├── bootstrap.ts
│   └── cli/
│       ├── formatter.ts
│       ├── menu.ts
│       └── prompts.ts
├── domain/
│   ├── errors.ts
│   ├── inventory-state.ts
│   ├── product.ts
│   ├── stock-movement.ts
│   └── validations.ts
├── persistence/
│   ├── atomic-writer.ts
│   ├── inventory-store.ts
│   ├── json-file.ts
│   └── paths.ts
├── shared/
│   └── normalize.ts
└── use-cases/
    ├── add-stock-entry.ts
    ├── add-stock-exit.ts
    ├── list-low-stock.ts
    ├── list-movements.ts
    ├── list-products.ts
    ├── load-state.ts
    └── register-product.ts

tests/
├── fixtures/
├── integration/
└── unit/
```

Las pruebas unitarias e integración presentes se enumeran en `tests/`; las evidencias autorizadas están en `docs/evidencias/`.

## Modelo de datos

### Hechos verificados

`Product` contiene `code`, `name`, `description`, `availableQuantity` y `minStock`. La creación normaliza el código, recorta textos y exige cantidades enteras no negativas.

`StockMovement` contiene `id`, `productCode`, `type`, `quantity`, `timestamp` y `resultingQuantity`. `type` solo acepta `entry` o `exit`; el identificador debe ser entero positivo, la cantidad debe ser positiva y el stock resultante no puede ser negativo.

`InventoryState` contiene `products: Product[]` y `movements: StockMovement[]`. Un movimiento referencia un código de producto normalizado. Los identificadores nuevos se calculan como el máximo existente más uno (`src/domain/product.ts`, `src/domain/stock-movement.ts`, `src/domain/inventory-state.ts`).

### Decisiones SDD

El modelo SDD define las mismas tres estructuras, la disponibilidad inicial sin movimiento, el vínculo de los movimientos por código y el orden descendente por `timestamp` e `id` (`specs/001-stock-management/data-model.md`).

### Limitaciones

La validación estructural comprueba colecciones, productos, movimientos y referencias a productos, pero no se documenta en las fuentes una validación adicional de consistencia histórica entre cada `resultingQuantity` y la secuencia completa de movimientos.

## Funcionalidades

### Registro y consulta de productos

`addProduct` crea un producto normalizado y rechaza códigos duplicados. La cantidad inicial modifica la disponibilidad del producto y no agrega un movimiento. `listProducts` devuelve una copia del catálogo o el mensaje `No hay productos disponibles.` (`src/domain/inventory-state.ts`, `src/use-cases/register-product.ts`, `src/use-cases/list-products.ts`).

### Entradas y salidas

`applyStockMovement` normaliza el código, exige un producto existente y una cantidad positiva, calcula el nuevo saldo y agrega un movimiento solo después de validar el resultado. Una salida que excede la disponibilidad produce un error sin alterar el estado que recibe. Las entradas y salidas se exponen mediante `addStockEntry` y `addStockExit` (`src/domain/inventory-state.ts`, `src/use-cases/add-stock-entry.ts`, `src/use-cases/add-stock-exit.ts`).

### Stock bajo

`listLowStock` filtra productos cuya disponibilidad es menor o igual al stock mínimo y devuelve `No hay productos con stock bajo.` cuando no encuentra resultados (`src/use-cases/list-low-stock.ts`).

### Historial

`listMovementHistory` ordena una copia de los movimientos con el comparador descendente y devuelve `No hay movimientos.` si la colección está vacía. El formateador muestra código, tipo traducido, cantidad, fecha y cantidad resultante (`src/domain/inventory-state.ts`, `src/use-cases/list-movements.ts`, `src/app/cli/formatter.ts`).

### CLI

El menú ofrece registrar producto, registrar entrada, registrar salida, consultar productos, consultar stock bajo, consultar historial y salir. Las respuestas de texto están en español. Los prompts recortan respuestas obligatorias y convierten cantidades a enteros; cualquier error capturado se informa y el bucle continúa (`src/app/cli/menu.ts`, `src/app/cli/prompts.ts`, `src/app/cli/formatter.ts`).

## Persistencia

### Hechos verificados

La ruta de desarrollo se calcula como `<process.cwd()>/data/inventory.json`. Cuando `process.pkg` está definido, se usa `<directorio del ejecutable>/data/inventory.json` (`src/persistence/paths.ts`).

`InventoryStore.load` devuelve un estado vacío si el archivo no existe; `loadState` lo guarda en ese primer uso, creando el directorio necesario. Si existe un archivo ilegible o cuyo JSON no cumple el modelo, la carga lanza `CorruptInventoryError`. `startApplication` informa el error de inicio y retorna antes de crear el menú (`src/persistence/inventory-store.ts`, `src/use-cases/load-state.ts`, `src/persistence/json-file.ts`, `src/app/bootstrap.ts`).

Las escrituras crean un archivo temporal con `randomUUID`, escriben el contenido, ejecutan `sync`, cierran el archivo y lo reemplazan mediante `rename`. Ante un error, el temporal se elimina. El JSON se valida antes de la escritura (`src/persistence/atomic-writer.ts`, `src/persistence/json-file.ts`).

Los casos de uso guardan el nuevo estado antes de devolverlo. El estado anterior no se muta cuando falla el cálculo o el guardado, según la construcción inmutable de `inventory-state.ts` y las pruebas de rollback.

### Decisiones SDD

El SDD establece un archivo JSON externo, rutas distintas para desarrollo y ejecutables empaquetados, creación inicial, escritura atómica, preservación de archivos corruptos y confirmación integral de cada operación (`specs/001-stock-management/plan.md`, `specs/001-stock-management/data-model.md`).

### Limitaciones

La evidencia autorizada de Windows no incluye una prueba específica con datos corruptos. Por ello, el manejo de corrupción de Windows queda respaldado por código y pruebas generales, pero no por una validación manual Windows documentada (`docs/evidencias/empaquetado-windows.md`).

## Validaciones y errores

Las validaciones de dominio exigen textos no vacíos después de `trim`, enteros no negativos para disponibilidad y stock mínimo, y enteros positivos para movimientos. Los errores de dominio distinguen `ValidationError`, `NotFoundError`, `PersistenceError`, `CorruptInventoryError` y `UnsupportedOperationError` (`src/domain/validations.ts`, `src/domain/errors.ts`).

La CLI rechaza opciones desconocidas, entradas obligatorias vacías y cantidades no enteras. Los errores de casos de uso o persistencia se formatean como mensajes `Error: ...` y el menú vuelve a iterar (`src/app/cli/menu.ts`, `src/app/cli/prompts.ts`, `src/app/cli/formatter.ts`).

## Pruebas

### Hechos verificados

Las pruebas presentes cubren:

- productos, duplicados, textos vacíos y cantidades iniciales;
- entradas, salidas, productos inexistentes, cantidades inválidas y salidas excedidas;
- criterio de stock bajo e igualdad con `minStock`;
- orden del historial por fecha e identificador;
- resolución de rutas;
- lectura, escritura, corrupción, arranque defensivo y rollback de persistencia;
- flujos integrados de productos, movimientos, stock bajo y menú.

La evidencia de fundamentos documenta la validación inicial de la base del proyecto. La evidencia final en `docs/evidencias/resultados-pruebas.md` registra la ejecución completa de `npm run typecheck`, `npm test` y `npm run build`, con 20 pruebas aprobadas y 0 fallidas. Esta evidencia cubre dominio, casos de uso, persistencia, corrupción, rollback, rutas y flujos integrados de la CLI.

### Decisiones SDD

La estrategia SDD requiere pruebas de dominio, casos de uso, persistencia, menú y arranque con archivos corruptos, con trazabilidad a FR-001..FR-028 y BR-001..BR-014 (`specs/001-stock-management/plan.md`, `specs/001-stock-management/tasks.md`).

### Limitaciones

La ejecución completa posterior a la generación de esta documentación está registrada en `docs/evidencias/resultados-pruebas.md`. Permanece sin medición específica el criterio SC-001 y no se realizó una prueba manual de corrupción de datos en Windows.

## Compilación y empaquetado

### Hechos verificados

`package.json` declara TypeScript estricto mediante `typecheck` y `build`, pruebas con `node --test`, y scripts `package:linux`, `package:windows` y `package:all`. Declara `typescript`, `@types/node` y `@yao-pkg/pkg` como dependencias de desarrollo, sin dependencias de producción (`package.json`, `tsconfig.json`).

La evidencia de empaquetado documenta la generación de ejecutables Linux x64 y Windows x64. Linux fue validado funcionalmente con datos externos al ejecutable. Windows fue validado manualmente en Windows x64 sin Node.js instalado, incluyendo persistencia tras reinicio; esa validación está separada de la mera generación del artefacto (`docs/evidencias/empaquetado-linux.md`, `docs/evidencias/empaquetado-windows.md`).

### Decisiones SDD

La constitución y el plan exigen Node.js 24, TypeScript, empaquetado Linux/Windows x64, un ejecutable Windows autónomo y datos JSON externos (`.specify/memory/constitution.md`, `specs/001-stock-management/plan.md`).

### Limitaciones

El plan describe una configuración de empaquetado recomendada, mientras que la fuente verificable de scripts es `package.json`. No se afirma una configuración adicional no presente allí. La evidencia Windows confirma ejecución manual, pero no una prueba de corrupción en ese entorno.

## Ejecución

Los comandos declarados en `package.json` son:

```text
npm run typecheck
npm run build
npm test
npm run package:linux
npm run package:windows
npm run package:all
```

La entrada compilada declarada por `package.json` es `dist/src/main.js`. El agente detectó que la ruta originalmente indicada en el plan no coincidía con el campo `bin` ni con la configuración `rootDir`/`outDir`. Durante la revisión final, el plan y la guía rápida se corrigieron para utilizar la ruta verificable `node dist/src/main.js` (`package.json`, `tsconfig.json`, `specs/001-stock-management/plan.md`).


## Trazabilidad

| Área SDD | Implementación | Pruebas o evidencia autorizada |
|---|---|---|
| FR-001..FR-007, BR-001..BR-003 | `product.ts`, `inventory-state.ts`, `register-product.ts`, `list-products.ts` | `tests/unit/product-registration.test.ts`, `tests/unit/list-products.test.ts`, `tests/integration/cli-product-flow.test.ts` |
| FR-008..FR-015, BR-003..BR-007 | `inventory-state.ts`, `add-stock-entry.ts`, `add-stock-exit.ts` | `tests/unit/stock-movements.test.ts`, `tests/unit/add-stock-entry.test.ts`, `tests/unit/add-stock-exit.test.ts`, `tests/integration/cli-stock-operations.test.ts` |
| FR-016..FR-018, BR-008 | `list-low-stock.ts` | `tests/unit/low-stock.test.ts`, `tests/integration/cli-low-stock.test.ts` |
| FR-019..FR-022, BR-013 | `list-movements.ts`, `stock-movement.ts`, `formatter.ts` | `tests/unit/movement-history.test.ts`, `tests/integration/history-ordering.test.ts` |
| FR-023..FR-028, BR-009..BR-014 | `menu.ts`, `bootstrap.ts`, `load-state.ts`, `inventory-store.ts`, `json-file.ts`, `atomic-writer.ts` | `tests/integration/cli-menu.test.ts`, pruebas de persistencia/corrupción/rollback y evidencias autorizadas |
| Constitución VI y empaquetado SDD | scripts de `package.json`, `paths.ts` | `docs/evidencias/empaquetado-linux.md`, `docs/evidencias/empaquetado-windows.md` |

La trazabilidad individual de FR-001 a FR-028 y BR-001 a BR-014 está consolidada en `docs/evidencias/trazabilidad-requisitos.md`, donde cada requisito se relaciona con tareas, implementación, pruebas o evidencias y estado final.

## Limitaciones

- T062 y T063 están respaldadas por `docs/evidencias/ejecucion-agente-documentador.md`.
- La especificación está en estado `Borrador`.
- La diferencia detectada entre la ruta planificada y la salida real fue corregida durante la revisión final; el plan, la guía rápida y la implementación utilizan `node dist/src/main.js`.
- El plan menciona `src/shared/time.ts`, `src/shared/logger.ts` y algunos archivos de pruebas que no aparecen en la estructura inspeccionada.
- No hay evidencia manual Windows del escenario de datos corruptos.
- No se documentan mediciones del tiempo de registro previsto por SC-001.
- La revisión humana y la aceptación de la salida del agente están registradas en `docs/evidencias/ejecucion-agente-documentador.md`.

## Clasificación de afirmaciones

- **Hecho verificado**: comportamiento observado directamente en código, pruebas o evidencias autorizadas.
- **Decisión SDD**: intención declarada en la constitución, especificación, plan, modelo de datos o contrato CLI.
- **No verificada**: afirmación sin respaldo suficiente o con una diferencia no resuelta; se identifica explícitamente como limitación.

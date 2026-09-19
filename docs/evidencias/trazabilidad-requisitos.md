# Trazabilidad de requisitos

**Fecha:** 2026-09-19
**Fuentes:** `specs/001-stock-management/spec.md`, `plan.md`, `tasks.md`, código, pruebas y evidencias del directorio `docs/evidencias/`.

Estados usados: **Verificado** significa que existe implementación, prueba y evidencia de ejecución; **Verificado con limitación** significa que el requisito está cubierto, pero existe una limitación declarada en la evidencia.

## Requisitos funcionales

| Requisito | Tareas | Implementación y prueba | Evidencia | Estado |
|---|---|---|---|---|
| FR-001 | T011, T024, T026, T028 | `register-product.ts`; `product-registration.test.ts`; `cli-product-flow.test.ts` | `npm test`, 20 aprobadas | Verificado |
| FR-002 | T011, T014, T024, T026 | `normalize.ts`, `validations.ts`; pruebas de registro | `npm test` | Verificado |
| FR-003 | T010, T015, T024, T026 | `inventory-state.ts`; pruebas de duplicados | `npm test` | Verificado |
| FR-004 | T011, T014, T024, T026 | `validations.ts`; `product-registration.test.ts` | `npm test` | Verificado |
| FR-005 | T011, T014, T024, T026 | `product.ts`, `register-product.ts`; registro sin movimiento | `npm test`; `product-registration.test.ts` | Verificado |
| FR-006 | T023, T025, T028 | `list-products.ts`, `formatter.ts`; pruebas de listado | `npm test` | Verificado |
| FR-007 | T023, T025, T028 | Mensaje de catálogo vacío en `list-products.ts` y `formatter.ts` | `npm test` | Verificado |
| FR-008 | T029, T030, T031, T036 | `add-stock-entry.ts`; pruebas unitarias e integración | `npm test` | Verificado |
| FR-009 | T029, T030, T032, T036 | `add-stock-exit.ts`; pruebas unitarias e integración | `npm test` | Verificado |
| FR-010 | T014, T029, T030, T031, T032 | Validaciones de enteros positivos; pruebas de movimientos | `npm test` | Verificado |
| FR-011 | T029, T031, T032, T036 | `inventory-state.ts`; escenarios de producto inexistente | `npm test` | Verificado |
| FR-012 | T029, T032, T036 | Rechazo de salida excedida en `inventory-state.ts` | `npm test`; rollback verificado | Verificado |
| FR-013 | T014, T032, T036 | Validación de stock resultante no negativo | `npm test` | Verificado |
| FR-014 | T012, T031, T032, T033, T036 | `stock-movement.ts`; creación de movimientos aceptados | `npm test`; historial | Verificado |
| FR-015 | T013, T032, T034, T036 | Construcción inmutable y guardado posterior | `persistence-rollback.test.ts`, `cli-stock-operations.test.ts` | Verificado |
| FR-016 | T014, T039, T041 | Filtro `availableQuantity <= minStock` en `list-low-stock.ts` | `npm test` | Verificado |
| FR-017 | T038, T039, T040, T041 | Caso de uso y formato de stock bajo | `cli-low-stock.test.ts`, `low-stock.test.ts` | Verificado |
| FR-018 | T039, T040, T041 | Mensaje `No hay productos con stock bajo.` | `npm test` | Verificado |
| FR-019 | T042, T043, T045 | `list-movements.ts`; consulta de historial | `history-ordering.test.ts`, `movement-history.test.ts` | Verificado |
| FR-020 | T042, T043, T044 | `formatter.ts` muestra código, tipo, cantidad, fecha y resultante | `npm test` | Verificado |
| FR-021 | T042, T043, T045 | Orden por `timestamp` e `id` descendentes | `npm test`; prueba de empate | Verificado |
| FR-022 | T043, T044, T045 | Mensaje `No hay movimientos.` | `npm test` | Verificado |
| FR-023 | T046, T049, T052 | Bucle de menú en `menu.ts` hasta opción 7 | `cli-menu.test.ts` | Verificado |
| FR-024 | T046, T049, T050, T052 | `prompts.ts`, `formatter.ts`; entradas vacías/no numéricas | `cli-menu.test.ts`, `npm test` | Verificado |
| FR-025 | T007, T008, T016, T017, T019, T020, T027, T035, T047, T048, T051, T052 | `InventoryStore`, JSON y carga inicial | `persistence.test.ts`, flujos de CLI | Verificado |
| FR-026 | T007, T016, T019, T048 | Estado vacío y creación inicial de `data/inventory.json` | `persistence-corruption.test.ts` | Verificado |
| FR-027 | T009, T019, T047, T048, T052 | `CorruptInventoryError`, preservación y retorno temprano | `startup-corruption.test.ts`, `persistence-corruption.test.ts` | Verificado |
| FR-028 | T008, T018, T020, T034, T047, T051, T052 | Escritura atómica y rollback | `persistence.test.ts`, `persistence-rollback.test.ts` | Verificado |

## Reglas del negocio

| Requisito | Tareas | Implementación y prueba | Evidencia | Estado |
|---|---|---|---|---|
| BR-001 | T011, T014, T024, T026 | Normalización y unicidad en `inventory-state.ts` | `product-registration.test.ts`; `npm test` | Verificado |
| BR-002 | T011, T014, T024 | Validación de enteros no negativos | `product-registration.test.ts`; `npm test` | Verificado |
| BR-003 | T014, T029, T030, T031, T032 | Validación de cantidades positivas | `stock-movements.test.ts`; `npm test` | Verificado |
| BR-004 | T032, T036 | Rechazo cuando la salida supera el saldo | `add-stock-exit.test.ts`; `cli-stock-operations.test.ts` | Verificado |
| BR-005 | T014, T032, T033, T036 | Cálculo de saldo y validación no negativa | `stock-movements.test.ts`; `npm test` | Verificado |
| BR-006 | T012, T031, T032, T033 | Movimiento por entrada o salida aceptada | `movement-history.test.ts`; `npm test` | Verificado |
| BR-007 | T013, T034, T036, T051 | Operaciones rechazadas sin mutación ni movimiento | `persistence-rollback.test.ts`; `cli-stock-operations.test.ts` | Verificado |
| BR-008 | T014, T039, T041 | Criterio menor o igual al mínimo | `low-stock.test.ts`; `npm test` | Verificado |
| BR-009 | T016, T017, T019, T020, T051 | Archivo JSON externo y rutas de ejecución | `paths.test.ts`, `persistence.test.ts` | Verificado |
| BR-010 | T016, T051 | Diseño para usuario local sin coordinación concurrente | `spec.md`, `plan.md`, `paths.ts` | Verificado con limitación: no se prueba concurrencia |
| BR-011 | T011, T024, T026 | Cantidad inicial sin movimiento | `product-registration.test.ts`; `npm test` | Verificado |
| BR-012 | T009, T019, T047, T048, T052 | Inicio seguro ante JSON ilegible o inválido | `startup-corruption.test.ts`; `npm test` | Verificado |
| BR-013 | T012, T033, T042, T043, T045 | Orden descendente y desempate por identificador | `history-ordering.test.ts`; `npm test` | Verificado |
| BR-014 | T008, T018, T020, T034, T051 | Confirmación solo después del guardado atómico | `persistence-rollback.test.ts`, `persistence.test.ts` | Verificado |

## Conclusión

Los 28 requisitos funcionales y las 14 reglas del negocio tienen tareas, implementación o contrato, pruebas y evidencia asociada. BR-010 se marca con limitación porque el diseño declara un único usuario local y no pretende probar concurrencia. No se afirma una medición de rendimiento para `SC-001`; esa métrica queda fuera de esta matriz de requisitos funcionales y de negocio.

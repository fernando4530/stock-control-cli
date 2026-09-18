# Tareas: gestión de stock

**Entrada**: [spec.md](spec.md), [plan.md](plan.md), [data-model.md](data-model.md), [research.md](research.md), [contracts/cli-contract.md](contracts/cli-contract.md) y [.specify/memory/constitution.md](../../.specify/memory/constitution.md)

**Prerequisitos**:
- [plan.md](plan.md) (obligatorio)
- [spec.md](spec.md) (obligatorio para historias de usuario)
- [data-model.md](data-model.md)
- [research.md](research.md)
- [contracts/cli-contract.md](contracts/cli-contract.md)
- [.specify/memory/constitution.md](../../.specify/memory/constitution.md)

**Pruebas**: todas las pruebas automatizadas que aparecen en la especificación son obligatorias y deben ejecutarse antes de aceptar cada historia y antes del cierre del proyecto.

**Organización**: las tareas están agrupadas por fases y por historias de usuario para permitir implementación, validación y entrega independientes por incremento.

## Formato: [ID] [P?] [Story] Descripción con ruta exacta

- [P]: la tarea puede ejecutarse en paralelo con otras tareas de archivos distintos y sin dependencias directas.
- [Story]: se usa solo para tareas de historia de usuario, según US1 a US5.
- Cada tarea incluye una ruta exacta, una dependencia directa o una evidencia esperada.

---

## Fase 1: Preparación del proyecto

**Objetivo**: dejar la base técnica y la estructura inicial lista antes de implementar reglas de negocio.

- [x] T001 [P] Crear la estructura base del proyecto y los directorios src/app/cli, src/domain, src/use-cases, src/persistence, src/shared, tests/unit, tests/integration, tests/fixtures, data, dist, release y docs/evidencias en la raíz del repositorio.
- [x] T002 [P] Definir package.json con nombre, versión, scripts de build, test, package:linux, package:windows y package:all, dependencias de desarrollo y metadatos del CLI para el proyecto en package.json.
- [x] T003 [P] Configurar tsconfig.json con TypeScript estricto, target Node.js 24, include de src y tests, outDir dist y parámetros de compilación compatibles con el empaquetado para Linux y Windows en tsconfig.json.
- [x] T004 [P] Preparar .gitignore con exclusiones para node_modules, dist, release, data/inventory.json y artefactos generados, manteniendo solo la estructura de fuentes, especificaciones y evidencias en .gitignore.
- [x] T005 [P] Crear la estructura inicial de la CLI en src/main.ts, src/app/bootstrap.ts y src/app/cli/menu.ts para dejar el punto de entrada y la composición de la aplicación preparada para pruebas e integración.
- [x] T006 [P] Definir el contrato de scripts de validación y empaquetado para verificar build, test y packaging en package.json con trazabilidad a FR-023, FR-025, FR-026, FR-027 y BR-009.

---

## Fase 2: Fundamentos y pruebas de base

**Objetivo**: establecer los componentes fundamentales del dominio y de la persistencia, y dejar pruebas automáticas de los fundamentos antes de comenzar las historias.

- [x] T007 [P] Crear la prueba de resolución de rutas en tests/unit/paths.test.ts para validar la construcción de rutas multiplataforma y la resolución de data/inventory.json en desarrollo y en ejecutables empaquetados, con trazabilidad a FR-025, FR-026, FR-027 y BR-009.
- [x] T008 [P] Crear la prueba de persistencia y escritura atómica en tests/integration/persistence.test.ts para validar lectura, escritura, uso de archivo temporal, validación previa y reemplazo seguro del estado persistido, con trazabilidad a FR-025, FR-028 y BR-014.
- [x] T009 [P] Crear la prueba de inicio con datos corruptos en tests/integration/startup-corruption.test.ts para verificar que la aplicación detecte archivos ilegibles o corruptos, conserve el archivo original y finalice sin habilitar operaciones de inventario, con trazabilidad a FR-027 y BR-012.
- [x] T010 Definir la estructura base de InventoryState en src/domain/inventory-state.ts como entidad central del estado global del inventario, con los campos products y movements y la semántica de persistencia de FR-025, FR-026 y BR-009.
- [x] T011 Definir la entidad Product en src/domain/product.ts con code, name, description, availableQuantity y minStock, y dejar explícitas las reglas de validación de FR-001 a FR-005 y BR-001 a BR-003.
- [x] T012 Definir la entidad StockMovement en src/domain/stock-movement.ts con id, productCode, type, quantity, timestamp y resultingQuantity, y documentar la regla de orden descendente y el desempate por id según FR-019 a FR-021 y BR-013.
- [x] T013 Crear el módulo de errores y resultados de dominio en src/domain/errors.ts para distinguir errores de validación, no encontrado, persistencia, archivo corrupto y operación no admitida, con trazabilidad a FR-011, FR-015, FR-027, FR-028 y BR-007, BR-012, BR-014.
- [x] T014 Crear la capa de validación y normalización en src/domain/validations.ts y src/shared/normalize.ts para normalizar códigos, validar textos, cantidades enteras no negativas, cantidades positivas y condiciones de stock bajo, según FR-002, FR-004, FR-005, FR-010, FR-016 y BR-001 a BR-008.
- [x] T015 Definir las funciones de evolución y validación del estado global del inventario en src/domain/inventory-state.ts para controlar duplicados, transformaciones de stock, movimientos y estado de stock bajo, manteniendo una separación clara de la definición de InventoryState y la lógica de evolución del estado, sin marcar estas tareas como paralelas.
- [x] T016 Definir la resolución de rutas multiplataforma en src/persistence/paths.ts para data/inventory.json en desarrollo y en ejecutables empaquetados, con soporte para Linux y Windows y sin depender de rutas fijas del sistema operativo, según FR-025, FR-026, FR-027 y BR-009.
- [x] T017 Crear la capa-base de persistencia JSON en src/persistence/json-file.ts para lectura, escritura y validación estructural del archivo principal de inventario, con manejo defensivo de archivos vacíos, corruptos o inválidos, según FR-025 a FR-028 y BR-009, BR-012, BR-014.
- [x] T018 [P] Implementar la escritura atómica y la sustitución segura del archivo persistido en src/persistence/atomic-writer.ts usando archivo temporal, validación previa y renombrado final para evitar corrupción durante la persistencia, con trazabilidad a FR-025, FR-028 y BR-014.
- [x] T019 [P] Implementar la carga inicial y validación estructural del estado en src/use-cases/load-state.ts para crear data/ e inventory.json si no existen, conservar archivos corruptos y abortar con error claro cuando la estructura no sea válida, según FR-026, FR-027 y BR-012.
- [x] T020 [P] Crear el módulo de almacenamiento global y acceso persistente en src/persistence/inventory-store.ts para encapsular lectura, escritura y validación del estado y dejar un contrato de operaciones atómicas para casos de uso según BR-007 y BR-014.
- [x] T021 Ejecutar la verificación de fundamentos y registrar la evidencia en docs/evidencias/verificacion-fundamentos.md con los resultados de las pruebas de rutas, persistencia y arranque con archivos corruptos, junto con el estado de cumplimiento de la base del proyecto antes de iniciar US1.

---

## Fase 3: Historia de usuario 1 - Registro y consulta de productos (Prioridad: P1)

**Objetivo**: gestionar el catálogo de productos y la consulta del inventario actual.

**Prueba independiente**: se puede verificar creando varios productos, intentando duplicar un código con espacios y mayúsculas, y consultando el listado completo con cantidades válidas.

- [x] T022 [P] [US1] Escribir las pruebas de dominio y validación para registro de productos en tests/unit/product-registration.test.ts cubriendo códigos duplicados, nombres vacíos, cantidades iniciales no negativas y stock mínimo válido, con trazabilidad a FR-001 a FR-007 y BR-001 a BR-003.
- [x] T023 [P] [US1] Escribir la prueba de caso de uso para listar productos en tests/unit/list-products.test.ts con escenarios de catálogo vacío, catálogo con varios productos y consulta normalizada, según FR-006 y FR-007.
- [x] T024 [US1] Implementar el caso de uso de registro de producto en src/use-cases/register-product.ts para validar código normalizado, nombre, descripción, availableQuantity y minStock, crear el producto y persistir el estado sin movimiento, según FR-001 a FR-005, FR-015 y BR-001, BR-011, BR-014.
- [x] T025 [US1] Implementar la consulta de productos en src/use-cases/list-products.ts para devolver el catálogo completo con cantidades actuales y mostrar mensajes de ausencia cuando no existan productos, con base en FR-006 y FR-007.
- [x] T026 [US1] Añadir la validación y consolidación del catálogo en src/domain/inventory-state.ts para garantizar que no haya duplicados y que el inventario actual permanezca consistente, permitiendo la comprobación de stock bajo posterior según FR-003 y BR-001.
- [x] T027 [US1] Crear la prueba de integración del flujo del menú para registrar y consultar productos en tests/integration/cli-product-flow.test.ts validando la ejecución real del flujo de consola y la persistencia entre ejecuciones, con trazabilidad a FR-023 a FR-026.
- [x] T028 [US1] Validar el flujo independiente de US1 con pruebas unitarias e integración y comprobar que el producto se registre una sola vez, que el duplicado falle y que la consulta muestre la disponibilidad actual antes de avanzar a US2.

---

## Fase 4: Historia de usuario 2 - Entradas y salidas de stock (Prioridad: P1)

**Objetivo**: permitir registrar movimientos de entrada y salida sin romper la integridad del inventario.

**Prueba independiente**: se puede verificar con una secuencia de cantidad válida, cantidad inválida, producto inexistente, salida mayor que stock disponible y comprobación de que no se generan movimientos tras una operación rechazada.

**Dependencia**: US2 debe ejecutarse después de US1 porque las entradas y salidas requieren que exista la funcionalidad base de registro y consulta de productos.

- [x] T029 [P] [US2] Escribir pruebas de dominio para entradas y salidas en tests/unit/stock-movements.test.ts cubriendo valor positivo, producto inexistente, salida excedida, stock negativo y ausencia de movimiento en operaciones rechazadas, con trazabilidad a FR-008 a FR-015 y BR-003 a BR-007.
- [x] T030 [P] [US2] Escribir pruebas de casos de uso de entrada y salida en tests/unit/add-stock-entry.test.ts y tests/unit/add-stock-exit.test.ts para validar el incremento, decremento y reversión de errores según FR-008 a FR-015 y BR-003 a BR-007.
- [x] T031 [US2] Implementar el caso de uso de entrada de stock en src/use-cases/add-stock-entry.ts para validar producto existente, cantidad entera positiva y persistir movimiento con resultingQuantity actualizado, según FR-008, FR-010, FR-014, FR-020 y BR-003, BR-006, BR-014.
- [x] T032 [US2] Implementar el caso de uso de salida de stock en src/use-cases/add-stock-exit.ts para validar producto existente, cantidad entera positiva, saldo suficiente y rechazo sin cambiar el estado si la operación no puede completarse, según FR-009, FR-010, FR-011, FR-012, FR-013, FR-015 y BR-004 a BR-007.
- [x] T033 [US2] Añadir el cálculo de resultingQuantity y la generación de ids secuenciales para stock movements en src/domain/stock-movement.ts y src/domain/inventory-state.ts, usando timestamp y el mayor id existente según FR-014, FR-020 y BR-013.
- [x] T034 [US2] Añadir la persistencia atómica y la reversión de cambios en src/persistence/inventory-store.ts para que, si falla el guardado, la operación rechazada no deje el inventario en estado parcialmente actualizado, según FR-028 y BR-014.
- [x] T035 [US2] Crear la prueba de integración del menú para entrada y salida en tests/integration/cli-stock-operations.test.ts validando la entrada del usuario, los mensajes de error y la persistencia entre ejecuciones, según FR-023, FR-024, FR-028 y BR-014.
- [x] T036 [US2] Validar el flujo independiente de US2 con pruebas unitarias e integración y comprobar que el historial y las cantidades resultantes queden coherentes antes de continuar con US3.

---

## Fase 5: Historia de usuario 3 - Stock bajo (Prioridad: P2)

**Objetivo**: detectar productos en riesgo de agotarse o por debajo del nivel mínimo definido.

**Prueba independiente**: se puede verificar consultando productos con stock menor o igual al mínimo, incluyendo casos con varios resultados y sin resultados.

**Dependencia**: US3 depende de US1 y US2 porque necesita el catálogo y la lógica de movimientos para evaluar disponibilidad real relativa al mínimo.

- [x] T037 [P] [US3] Escribir pruebas unitarias para el reporte de stock bajo en tests/unit/low-stock.test.ts cubriendo igualdad con minStock, producto por debajo del mínimo y ausencia de resultados, con trazabilidad a FR-016 a FR-018 y BR-008.
- [x] T038 [P] [US3] Escribir la prueba de integración específica de stock bajo en tests/integration/cli-low-stock.test.ts para verificar el flujo del menú y la salida de productos en condición de stock bajo, según FR-016 a FR-018 y BR-008.
- [x] T039 [US3] Implementar el caso de uso de consulta de stock bajo en src/use-cases/list-low-stock.ts para filtrar productos con availableQuantity <= minStock y devolver un mensaje explícito cuando no existan, según FR-016 a FR-018.
- [x] T040 [US3] Añadir la lógica de consulta y presentación en src/app/cli/formatter.ts para mostrar los productos con stock bajo en un formato legible y consistente, con mensajes claros para ausencia de resultados y trazabilidad con el contrato de la CLI en contracts/cli-contract.md.
- [x] T041 [US3] Validar la historia US3 con pruebas unitarias e integración del menú y confirmar que el criterio de stock bajo siga siendo aplicable después de entradas y salidas en el mismo inventario antes de avanzar a US4.

---

## Fase 6: Historia de usuario 4 - Historial ordenado (Prioridad: P2)

**Objetivo**: permitir auditar las operaciones registradas y revisarlas en orden cronológico y estable.

**Prueba independiente**: se puede verificar generando varios movimientos, comprobando orden descendente por timestamp y desempate por id, y revisando el caso sin movimientos.

**Dependencia**: US4 depende de US2 porque el historial se genera a partir de operaciones aceptadas de movimiento.

- [x] T042 [P] [US4] Escribir las pruebas de dominio y persistencia para historial ordenado en tests/unit/movement-history.test.ts y tests/integration/history-ordering.test.ts cubriendo timestamps iguales, id como desempate, historial vacío y lista ordenada descendente, con trazabilidad a FR-019 a FR-022 y BR-013.
- [x] T043 [US4] Implementar el caso de uso de consulta de historial en src/use-cases/list-movements.ts para ordenar movimientos por timestamp descendente e id descendente, mostrando cada producto, tipo, cantidad, marca temporal y resultingQuantity, según FR-019 a FR-022.
- [x] T044 [US4] Añadir la presentación del historial en src/app/cli/formatter.ts para que las salidas sean legibles y excluyan artefactos vacíos, con mensajes explícitos cuando no existan movimientos y compatibilidad con el contrato de la CLI.
- [x] T045 [US4] Validar la historia US4 con pruebas unitarias e integración y confirmar que el historial refleje solamente movimientos aceptados, sin registros para operaciones rechazadas ni para la cantidad inicial del producto.

---

## Fase 7: Historia de usuario 5 - Menú, persistencia y manejo de errores (Prioridad: P1)

**Objetivo**: dejar la CLI operable, persistente y tolerante a errores, con entrada validada, datos guardados y control del flujo.

**Prueba independiente**: se puede verificar lanzando la aplicación, intentando opciones no válidas, saliendo del menú y reiniciando la aplicación con datos persistidos; además, se debe validar el manejo de archivos corruptos al inicio.

**Dependencia**: US5 integra todas las historias y debe ejecutarse después de US1, US2, US3 y US4.

- [x] T046 [P] [US5] Escribir pruebas de integración del menú en tests/integration/cli-menu.test.ts para validar opciones del menú, validación de entrada, persistencia entre ejecuciones y manejo del flujo de salida, según FR-023 a FR-028.
- [x] T047 [P] [US5] Escribir pruebas de persistencia y corrupción en tests/integration/persistence-corruption.test.ts para cubrir archivo inexistente, archivo corrupto, datos ilegibles y operación de guardado con fallo, según FR-025 a FR-028 y BR-009 a BR-014.
- [x] T048 [US5] Implementar la carga inicial del estado y validación del menú en src/app/bootstrap.ts para crear la estructura si hace falta, cargar el estado persistido y abortar con errores claros si el archivo está corrupto, según FR-025 a FR-028 y BR-012.
- [x] T049 [US5] Implementar la interfaz de menú y prompts en src/app/cli/prompts.ts y src/app/cli/menu.ts para mantener la aplicación activa hasta que el usuario salga, validar entradas vacías y no numéricas y devolver el control al menú sin estado inconsistente, según FR-023, FR-024 y BR-014.
- [x] T050 [US5] Implementar los mensajes de error y la gestión de fallas operativas en src/app/cli/formatter.ts para comunicar claramente el motivo del rechazo y la intervención del usuario, siguiendo el contrato de la CLI en contracts/cli-contract.md y la lógica de errores del dominio.
- [x] T051 [US5] Añadir la persistencia de la sesión y actualización de estado desde la CLI en src/app/bootstrap.ts y src/persistence/inventory-store.ts para garantizar que solo el estado persistido actualizado se considere válido, con rollback completo si la persistencia falla, según FR-028 y BR-014.
- [x] T052 [US5] Validar la historia US5 con pruebas de integración, confirmando que la aplicación permanezca operable, que los errores queden controlados y que los archivos corruptos se preserven sin sobrescritura ni actividad de inventario.

---

## Fase 8: Empaquetado y validación de binarios

**Objetivo**: preparar, generar y verificar artefactos de entrega para Linux y Windows según la especificación.

- [x] T053 [P] Preparar el script de empaquetado para Linux x64 en package.json y revisar la configuración de @yao-pkg/pkg para que genere release/stock-control-linux con salida nativa y sin depender de Node.js en el entorno de ejecución, según BR-009, FR-025 y la política de portabilidad de la constitución.
- [x] T054 [P] Preparar el script de empaquetado para Windows x64 en package.json y revisar la configuración de @yao-pkg/pkg para que genere release/stock-control-windows.exe sin Node.js en el equipo de destino, según la constitución y FR-025.
- [x] T055 Ejecutar la compilación y la validación del ejecutable Linux usando npm run package:linux y registrar el resultado en docs/evidencias/empaquetado-linux.md, comprobando que el binario arranca correctamente con rutas persistentes externas y sin errores de inicio en el entorno de desarrollo.
- [ ] T056 Ejecutar la validación manual del ejecutable Windows en un entorno sin Node.js instalado y registrar el resultado en docs/evidencias/empaquetado-windows.md, comprobando que el archivo .exe mantiene la lógica de inventario, las rutas externas y el manejo de datos corruptos.
- [ ] T057 [P] Crear y guardar la evidencia de empaquetado en docs/evidencias/empaquetado-linux.md y docs/evidencias/empaquetado-windows.md con comandos ejecutados, resultados observados y referencias a la validación de Linux y Windows, manteniendo trazabilidad con la constitución y los requisitos funcionales.

---

## Fase 9: Agente declarativo y documentación técnica

**Objetivo**: generar la documentación técnica verificada por el agente declarativo después de que el código y las pruebas estén terminados.

- [ ] T058 [P] Crear el agente declarativo .github/agents/documentador-codigo.agent.md con propósito, entradas, salidas, restricciones y procedimiento de revisión humana, conforme al acuerdo del plan técnico y a la constitución del proyecto.
- [ ] T059 [P] Crear la skill .github/skills/documentar-codigo/SKILL.md con la secuencia para inspeccionar el código, corroborar artefactos SDD y redactar la documentación técnica en español sin inventar comportamientos no implementados.
- [ ] T060 [P] Crear el recurso .github/resources/documentador-codigo/plantilla-documentacion.md con la estructura mínima de la documentación técnica y los apartados obligatorios: propósito, arquitectura, entidades, casos de uso, persistencia, CLI, pruebas, empaquetado y trazabilidad.
- [ ] T061 Ejecutar el agente declarativo después de la implementación y validación del código para generar docs/documentacion-tecnica.md a partir de la constitución, la especificación, el plan, el código fuente, las pruebas y la configuración del proyecto.
- [ ] T062 Revisar la salida del agente contra el código actual, los artefactos SDD y la evidencia de pruebas para detectar afirmaciones no verificadas, inconsistencias o inventos, y registrar las correcciones en docs/evidencias/ejecucion-agente-documentador.md.
- [ ] T063 Consolidar la evidencia del agente declarativo en docs/evidencias/ejecucion-agente-documentador.md con objetivo, entradas analizadas, instrucción utilizada, salida generada, observaciones de revisión, correcciones y resultado final, de acuerdo con la gobernanza de IA de la constitución.
- [ ] T064 Validar que la documentación técnica final refleje solo lo que existe en código y artefactos SDD, y que no incluya placeholders, TODO, decisiones abiertas ni texto en inglés salvo nombres técnicos y comandos permitidos por la constitución.

---

## Fase 10: Cierre, validación final y entregables

**Objetivo**: cerrar la entrega con documentación, trazabilidad y verificación final de cumplimiento.

- [ ] T065 Crear el README completo en español en README.md con objetivo del proyecto, requisitos, guía de instalación, ejecución, validación de pruebas y referencias a la persistencia externa según quickstart.md y la constitución.
- [ ] T066 Crear la guía de uso en español en docs/guia-uso.md con instrucciones de registro de productos, entradas, salidas, stock bajo, historial, persistencia y manejo de errores del menú.
- [ ] T067 Revisar el cumplimiento constitucional mediante una auditoría final en docs/evidencias/cumplimiento-constitucion.md, confirmando que no se añadieron funcionalidades fuera del alcance y que cada requisito de la especificación tiene una prueba y una tarea asociada.
- [ ] T068 Ejecutar la batería completa de pruebas con npm test o el comando equivalente y registrar el resultado en docs/evidencias/resultados-pruebas.md para confirmar que dominio, casos de uso, persistencia, menú y validación de corrupción pasan íntegramente antes de cerrar la entrega.
- [ ] T069 Ejecutar la verificación de trazabilidad y registrar el resultado en docs/evidencias/trazabilidad-requisitos.md para comprobar que cada requisito FR-001 a FR-028 y BR-001 a BR-014 cuenta con tareas concretas, pruebas asociadas y evidencia de validación en el proyecto.
- [ ] T070 Preparar el inventario final de entrega en docs/evidencias/inventario-entrega.md con el listado de artefactos, binarios, documentación técnica, README, guía de uso y evidencias finales para la entrega del proyecto.

---

## Dependencias y orden recomendado

### Fase de dependencias

- Preparación del proyecto (Fase 1): no tiene dependencias y puede comenzar de inmediato.
- Fundamentos y pruebas de base (Fase 2): depende de la Fase 1; bloquea todas las historias de usuario.
- US1 (Fase 3): depende de la Fase 2 y es la base de la funcionalidad del inventario.
- US2 (Fase 4): depende de US1 porque las entradas y salidas requieren que exista la funcionalidad base de productos.
- US3 (Fase 5): depende de US1 y US2 para consultar el stock disponible y el mínimo del producto.
- US4 (Fase 6): depende de US2 porque el historial se genera a partir de operaciones aceptadas.
- US5 (Fase 7): integra todas las historias y depende de US1, US2, US3 y US4.
- Empaquetado (Fase 8): depende de que la funcionalidad esté validada y de que las pruebas hayan pasado.
- Agente declarativo (Fase 9): debe ejecutarse solo después de que el código y las pruebas estén terminados.
- Cierre (Fase 10): depende de la Fase 8 y la Fase 9, y se ejecuta antes de la entrega final.

### Orden recomendado por historia

- Historia 1: registro y consulta de productos.
- Historia 2: entradas y salidas de stock.
- Historia 3: stock bajo.
- Historia 4: historial ordenado.
- Historia 5: menú, persistencia y manejo de errores.

### Criterios de terminación por historia

- US1 está completa cuando se puede registrar un producto, validar duplicados y consultar el catálogo. Criterio de validación: pruebas unitarias e integración y trazabilidad a FR-001 a FR-007.
- US2 está completa cuando se pueden realizar entradas y salidas válidas, rechazar cantidades inválidas y mantener stock no negativo. Criterio de validación: pruebas unitarias e integración y trazabilidad a FR-008 a FR-015.
- US3 está completa cuando se detectan los productos con disponibilidad menor o igual a minStock. Criterio de validación: pruebas unitarias e integración y trazabilidad a FR-016 a FR-018.
- US4 está completa cuando el historial se ordena por fecha descendente y desempate por id. Criterio de validación: pruebas unitarias e integración y trazabilidad a FR-019 a FR-022.
- US5 está completa cuando el menú, la validación y la persistencia se mantienen operativas en ejecución y se gestionan errores de guardado y archivos corruptos. Criterio de validación: pruebas de integración y trazabilidad a FR-023 a FR-028.

---

## Oportunidades de paralelismo

- Las tareas T001 a T006 de preparación pueden ejecutarse en paralelo y no dependen de la lógica del dominio.
- Las tareas T007 a T020 de fundamentos y pruebas base pueden ejecutarse en paralelo por módulos: rutas, persistencia, validación y estado, siempre que se coordinen para no romper la integración.
- Las tareas T010 y T015 no deben marcarse como paralelas porque ambas modifican el mismo archivo src/domain/inventory-state.ts: una define el tipo y la otra añade las funciones de evolución y validación del estado.
- Las pruebas de cada historia pueden escribirse antes de la implementación en paralelo con el diseño del caso de uso relacionado.
- US1 y US2 pueden desarrollarse de manera secuencial por dependencia de productos, y US3 y US4 pueden ejecutarse en paralelo una vez que ambos flujos básicos estén validados.
- US5 debe cerrarse al final porque integra todas las historias en la CLI y exige revisar los efectos de persistencia y errores de guardado.

---

## Ejemplo de paralelismo por historia

```bash
# Ejemplo de trabajo simultáneo para la historia US1
# Tarea 1: pruebas de dominio y validación
# Tarea 2: pruebas de caso de uso de listado
# Tarea 3: implementación del registro del producto
# Tarea 4: implementación de la consulta del catálogo
```

```bash
# Ejemplo de trabajo simultáneo para la historia US2
# Tarea 1: pruebas de movimientos de stock
# Tarea 2: prueba de caso de uso de entrada
# Tarea 3: prueba de caso de uso de salida
# Tarea 4: implementación de la lógica de entrada y salida
```

---

## Estrategia de implementación

### MVP primero

1. Completar la Fase 1 y la Fase 2 para dejar la estructura y los fundamentos sosteniendo todas las historias.
2. Implementar US1 para registrar productos y consultar el stock actual.
3. Validar US1 de forma independiente antes de incorporar US2.
4. Continuar con US2 y US3 para cubrir reposición y control del stock mínimo.
5. Añadir US4 para auditar el historial y cerrar la capa funcional del inventario.
6. Finalizar con US5 para dejar el menú, la persistencia y el manejo de errores en estado operativo.

### Entrega incremental

1. Validar Fase 1 + Fase 2 con pruebas de infraestructura.
2. Entregar US1 como mínimo viable funcional.
3. Añadir US2 para completar la operación del inventario.
4. Añadir US3 y US4 para fortalecer la trazabilidad y la alerta de stock bajo.
5. Completar US5 para cerrar la experiencia de uso.
6. Ejecutar empaquetado, agente documentador y cierre final con evidencias.

### Revisión de calidad antes del cierre

- Confirmar que cada tarea sigue el formato de checklist requerido por GitHub Spec Kit.
- Confirmar que existe al menos una prueba automatizada en cada historia y que todas las pruebas de validación están incluidas como tareas de implementación.
- Confirmar que no se incluyen funcionalidades fuera del alcance ni requisitos nuevos no previstos por la especificación.
- Confirmar que la persistencia JSON, la atomicidad y la validación de corrupción están cubiertas por tareas explícitas.
- Confirmar que la documentación técnica final se genera solo después de terminar el código y las pruebas.

---

## Observaciones finales

- Las tareas están redactadas en español, de acuerdo con la constitución y la política del proyecto.
- Los nombres técnicos, rutas, comandos y símbolos de código permanecen en inglés solo donde corresponde.
- Los identificadores de tareas son estables y correlativos: T001 a T070.
- Las rutas de archivos son específicas y se presentan como referencias directas a la estructura del proyecto.
- La trazabilidad con los requisitos funcionales y las reglas del negocio queda explícita en cada bloque funcional y en las tareas de validación y cierre.

---

## Matriz de trazabilidad determinista

| Requisito | Tareas de implementación | Tareas o archivos de prueba | Evidencia o criterio de validación |
|-----------|--------------------------|----------------------------|----------------------------------|
| FR-001 | T011, T024, T026, T028 | `tests/unit/product-registration.test.ts`; `tests/integration/cli-product-flow.test.ts` | Registro válido de producto con código normalizado, nombre, descripción, cantidad inicial y stock mínimo sin errores ni movimientos no autorizados. |
| FR-002 | T011, T014, T024, T026 | `tests/unit/product-registration.test.ts`; `tests/integration/cli-product-flow.test.ts` | El código se normaliza con trim y lowercase; se rechaza vacío o inválido antes de persistir. |
| FR-003 | T010, T015, T024, T026 | `tests/unit/product-registration.test.ts`; `tests/integration/cli-product-flow.test.ts` | Duplicado de código con mayúsculas y espacios se rechaza y conserva el inventario sin duplicados. |
| FR-004 | T011, T014, T024, T026 | `tests/unit/product-registration.test.ts` | `name` y `description` con espacios vacíos se rechazan con error claro. |
| FR-005 | T011, T014, T024, T026 | `tests/unit/product-registration.test.ts`; `tests/unit/stock-movements.test.ts` | Cantidades iniciales y stock mínimo no negativos; la cantidad inicial no genera movimiento. |
| FR-006 | T025, T028, T041 | `tests/unit/list-products.test.ts`; `tests/integration/cli-product-flow.test.ts` | Consulta del catálogo completo con los productos y cantidades actuales visibles. |
| FR-007 | T025, T028, T041 | `tests/unit/list-products.test.ts`; `tests/integration/cli-product-flow.test.ts` | Si no hay productos, la aplicación muestra mensaje explícito de ausencia. |
| FR-008 | T031, T036, T051 | `tests/unit/add-stock-entry.test.ts`; `tests/integration/cli-stock-operations.test.ts` | Entrada de stock válida incrementa la cantidad disponible y crea un movimiento aceptado. |
| FR-009 | T032, T036, T051 | `tests/unit/add-stock-exit.test.ts`; `tests/integration/cli-stock-operations.test.ts` | Salida válida decrementa cantidad disponible y crea movimiento aceptado. |
| FR-010 | T014, T031, T032, T036 | `tests/unit/stock-movements.test.ts`; `tests/unit/add-stock-entry.test.ts`; `tests/unit/add-stock-exit.test.ts` | Cantidades de entrada y salida positivas enteras y mayores que cero. |
| FR-011 | T013, T031, T032, T036 | `tests/unit/stock-movements.test.ts`; `tests/integration/cli-stock-operations.test.ts` | Producto inexistente se rechaza con error y no se altera ningún dato. |
| FR-012 | T013, T032, T036 | `tests/unit/add-stock-exit.test.ts`; `tests/integration/cli-stock-operations.test.ts` | Salida mayor que la disponibilidad actual se rechaza sin modificar stock ni historial. |
| FR-013 | T014, T032, T036 | `tests/unit/stock-movements.test.ts`; `tests/unit/add-stock-exit.test.ts` | La cantidad disponible no puede quedar negativa en ninguna operación. |
| FR-014 | T012, T031, T032, T033, T036 | `tests/unit/stock-movements.test.ts`; `tests/integration/history-ordering.test.ts` | Cada entrada o salida exitosa deja un movimiento con id, tipo, cantidad, timestamp y resultingQuantity. |
| FR-015 | T013, T031, T032, T034, T036 | `tests/unit/stock-movements.test.ts`; `tests/integration/cli-stock-operations.test.ts` | Las operaciones rechazadas no alteran productos ni generan movimientos. |
| FR-016 | T014, T039, T041 | `tests/unit/low-stock.test.ts`; `tests/integration/cli-low-stock.test.ts` | Producto con availableQuantity <= minStock se considera bajo. |
| FR-017 | T039, T041 | `tests/unit/low-stock.test.ts`; `tests/integration/cli-low-stock.test.ts` | Consulta de stock bajo devuelve los productos en condición de alerta. |
| FR-018 | T039, T041 | `tests/unit/low-stock.test.ts`; `tests/integration/cli-low-stock.test.ts` | Si no hay stock bajo, la aplicación muestra mensaje explícito. |
| FR-019 | T012, T043, T045 | `tests/unit/movement-history.test.ts`; `tests/integration/history-ordering.test.ts` | Historial completo disponible para consulta por el usuario. |
| FR-020 | T012, T043, T044 | `tests/unit/movement-history.test.ts`; `tests/integration/history-ordering.test.ts` | Cada movimiento muestra código, tipo, cantidad, marca temporal y stock resultante. |
| FR-021 | T012, T043, T045 | `tests/unit/movement-history.test.ts`; `tests/integration/history-ordering.test.ts` | El historial se presenta por timestamp descendente y desempate por id descendente. |
| FR-022 | T043, T045 | `tests/unit/movement-history.test.ts`; `tests/integration/history-ordering.test.ts` | Si no hay movimientos, la aplicación muestra mensaje explícito. |
| FR-023 | T048, T049, T052 | `tests/integration/cli-menu.test.ts`; `tests/integration/cli-product-flow.test.ts` | El menú permanece activo hasta que el usuario elige salir. |
| FR-024 | T014, T049, T050, T052 | `tests/integration/cli-menu.test.ts`; `tests/integration/cli-stock-operations.test.ts` | Datos vacíos, no numéricos o incompletos se validan y se devuelve el control al menú con mensajes claros. |
| FR-025 | T010, T017, T048, T051, T052 | `tests/integration/persistence.test.ts`; `tests/integration/cli-menu.test.ts` | La información persiste entre cierres y reinicios del programa. |
| FR-026 | T019, T048, T052 | `tests/integration/persistence.test.ts`; `tests/integration/cli-menu.test.ts` | En la primera ejecución, el sistema inicia con colecciones vacías y operables si no existe persistencia. |
| FR-027 | T007, T009, T019, T048, T052 | `tests/unit/paths.test.ts`; `tests/integration/startup-corruption.test.ts` | Si el archivo de datos es ilegible o corrupto, la aplicación informa y finaliza sin sobrescribirlo. |
| FR-028 | T018, T034, T047, T051, T052 | `tests/integration/persistence.test.ts`; `tests/integration/persistence-corruption.test.ts`; `tests/integration/cli-stock-operations.test.ts` | Si falla la persistencia, la operación se rechaza y el inventario previo permanece intacto. |
| BR-001 | T011, T014, T024, T026 | `tests/unit/product-registration.test.ts`; `tests/integration/cli-product-flow.test.ts` | Códigos normalizados con espacios y mayúsculas son equivalentes y únicos. |
| BR-002 | T011, T014, T024 | `tests/unit/product-registration.test.ts`; `tests/unit/stock-movements.test.ts` | Cantidades de producto y mínimo deben ser enteros no negativos. |
| BR-003 | T011, T014, T031, T032 | `tests/unit/stock-movements.test.ts`; `tests/unit/add-stock-entry.test.ts`; `tests/unit/add-stock-exit.test.ts` | Las cantidades de entrada y salida deben ser enteras positivas mayores que cero. |
| BR-004 | T032, T036 | `tests/unit/add-stock-exit.test.ts`; `tests/integration/cli-stock-operations.test.ts` | Salida superior a la disponibilidad actual se rechaza. |
| BR-005 | T014, T032, T036 | `tests/unit/stock-movements.test.ts`; `tests/unit/add-stock-exit.test.ts` | La cantidad disponible nunca es negativa. |
| BR-006 | T031, T032, T033, T036 | `tests/unit/stock-movements.test.ts`; `tests/integration/history-ordering.test.ts` | Cada operación aceptada produce un movimiento asociado al producto afectado. |
| BR-007 | T013, T031, T032, T034 | `tests/unit/stock-movements.test.ts`; `tests/integration/cli-stock-operations.test.ts` | Operaciones rechazadas son atómicas: no alteran stock ni crean movimiento. |
| BR-008 | T014, T039, T041 | `tests/unit/low-stock.test.ts`; `tests/integration/cli-low-stock.test.ts` | Un producto se considera en stock bajo cuando availableQuantity <= minStock. |
| BR-009 | T006, T010, T016, T017, T047 | `tests/unit/paths.test.ts`; `tests/integration/persistence.test.ts` | La persistencia JSON se conserva entre ejecuciones y fuera del ejecutable. |
| BR-010 | T010, T048, T051 | `tests/integration/cli-menu.test.ts` | La aplicación opera en un único usuario local sin concurrencia multiusuario. |
| BR-011 | T011, T024, T026 | `tests/unit/product-registration.test.ts`; `tests/integration/cli-product-flow.test.ts` | La cantidad inicial del producto se registra como disponibilidad inicial y no genera movimiento. |
| BR-012 | T009, T013, T019, T048 | `tests/integration/startup-corruption.test.ts`; `tests/integration/persistence-corruption.test.ts` | Archivo corrupto al inicio se conserva sin sobrescritura y la aplicación finaliza de forma segura. |
| BR-013 | T012, T033, T042, T043 | `tests/unit/movement-history.test.ts`; `tests/integration/history-ordering.test.ts` | Historial ordenado por timestamp descendente y desempate por id descendente. |
| BR-014 | T018, T034, T047, T051, T068 | `tests/integration/persistence.test.ts`; `tests/integration/persistence-corruption.test.ts`; `tests/integration/cli-stock-operations.test.ts` | Si falla la persistencia, la operación completa se revierte y el estado previo queda intacto. |

---

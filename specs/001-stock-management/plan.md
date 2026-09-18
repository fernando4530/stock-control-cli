# Plan técnico: gestión de stock

**Rama**: `001-stock-management` | **Fecha**: 2026-09-18 | **Especificación**: [spec.md](spec.md)

**Entrada**: [spec.md](spec.md)

## Resumen

Se implementará una aplicación de línea de comandos para gestionar productos, entradas y salidas de stock con persistencia local en archivos JSON. La solución usará Node.js 24 y TypeScript estricto, con una arquitectura modular que separa dominio, casos de uso, persistencia y CLI. El sistema validará un único código normalizado por producto, evitará cantidades negativas, registrará solo las entradas y salidas de stock exitosas como movimientos y usará escrituras atómicas para asegurar que la información persista sin corrupción ni pérdida de datos. Registrar un producto no crea movimiento.

## Contexto técnico

**Lenguaje / versión**: TypeScript en modo estricto con Node.js 24.

**Dependencias principales**:
- `@yao-pkg/pkg` como dependencia de desarrollo para crear ejecutables Linux x64 y Windows x64.
- `node:readline/promises` para la interacción por consola.
- `node:test` y `node:assert` para pruebas automatizadas.
- Dependencias de producción mínimas; se usa la librería estándar de Node.js para manejo de archivos, rutas, temporales y procesos.

**Persistencia**: archivo JSON local externo al ejecutable en la ruta `<raíz-del-proyecto>/data/inventory.json` durante el desarrollo y `<directorio-del-ejecutable>/data/inventory.json` en ejecutables empaquetados. El directorio `data` y el archivo se crean en la primera ejecución si no existen.

**Pruebas**: pruebas automatizadas de dominio, casos de uso y persistencia; prueba de integración del menú; validación del ejecutable Linux; validación manual del `.exe` en Windows sin Node.js instalado. Todo ello con `node:test` y `node:assert` y, cuando corresponda, validación funcional del binario generado.

**Plataforma objetivo**: Ubuntu Linux para desarrollo y ejecución, con empaquetado para Linux x64 y Windows x64.

**Tipo de proyecto**: aplicación CLI monolítica modular, sin servidor, sin base de datos ni interfaz gráfica.

**Objetivos de rendimiento**: manipular inventarios locales pequeños y medianos con tiempos de respuesta instantáneos; priorizar integridad sobre complejidad.

**Restricciones**: un único usuario local, sin concurrencia multiusuario, sin llamadas a red, sin dependencias de infraestructura y sin persistencia dentro del ejecutable.

**Escala / alcance**: gestión de inventario a partir de productos, movimientos de stock, consultas de stock bajo y historial cronológico por consola.

## Verificación explícita de cumplimiento de la constitución

La constitución vigente en [../../.specify/memory/constitution.md](../../.specify/memory/constitution.md) incluye siete principios que se cumplen en este diseño.

### Cumplimiento de los principios

- Principio I: la funcionalidad se basa en [spec.md](spec.md); el plan no agrega requisitos ajenos.
- Principio II: la entrega se divide por historias de usuario y pruebas trazables.
- Principio III: los productos tienen código único, las cantidades son enteras no negativas y cada entrada o salida de stock aceptada genera un movimiento; el registro de un producto no genera movimientos.
- Principio IV: la propuesta exige pruebas automatizadas para validaciones, fallos y casos límite.
- Principio V: la aplicación es CLI, usa Node.js 24 y TypeScript strict, sin interfaz web ni servicios externos.
- Principio VI: el proyecto contempla desarrollo en Ubuntu y empaquetado para Linux y Windows, con JSON externo y rutas multiplataforma.
- Principio VII: se implementará y ejecutará el Agente Documentador de Código con una skill, un recurso y evidencia revisable, siguiendo el patrón AS-Transformation y verificando que la documentación generada refleje solo lo que existe en el código y en los artefactos SDD.

### Puertas de calidad

- La especificación y la constitución existen y son consistentes.
- La persistencia JSON será externa al ejecutable.
- La estructura modular cubre dominio, casos de uso, persistencia y CLI.
- Las reglas de negocio están definidas y no permiten stock negativo.
- El diseño contempla archivos corruptos e inicio defensivo.
- Se implementará y ejecutará el Agente Documentador de Código con una skill, un recurso y evidencia revisable.
- No se requieren excepciones ni desviaciones de la constitución.

## Estructura propuesta del proyecto

```text
stock-control-cli/
├── package.json
├── tsconfig.json
├── .gitignore
├── README.md
├── data/
│   └── inventory.json               # Datos locales reales; no versionar
├── src/
│   ├── app/
│   │   ├── cli/
│   │   │   ├── menu.ts
│   │   │   ├── prompts.ts
│   │   │   └── formatter.ts
│   │   └── bootstrap.ts
│   ├── domain/
│   │   ├── product.ts
│   │   ├── stock-movement.ts
│   │   ├── inventory-state.ts
│   │   ├── validations.ts
│   │   └── errors.ts
│   ├── use-cases/
│   │   ├── register-product.ts
│   │   ├── add-stock-entry.ts
│   │   ├── add-stock-exit.ts
│   │   ├── list-products.ts
│   │   ├── list-low-stock.ts
│   │   ├── list-movements.ts
│   │   └── load-state.ts
│   ├── persistence/
│   │   ├── inventory-store.ts
│   │   ├── json-file.ts
│   │   ├── atomic-writer.ts
│   │   └── paths.ts
│   ├── shared/
│   │   ├── normalize.ts
│   │   ├── time.ts
│   │   └── logger.ts
│   └── main.ts                     # Punto de entrada único del código fuente
├── tests/
│   ├── unit/
│   │   ├── validations.test.ts
│   │   ├── inventory-domain.test.ts
│   │   └── normalize.test.ts
│   ├── integration/
│   │   ├── cli-menu.test.ts
│   │   ├── persistence.test.ts
│   │   └── startup-corruption.test.ts
│   └── fixtures/
│       ├── inventory-samples.json
│       └── empty-inventory.json    # Ejemplos para pruebas o entrega; no son datos locales reales
├── specs/
│   └── 001-stock-management/
│       ├── spec.md
│       ├── plan.md
│       ├── research.md
│       ├── data-model.md
│       ├── quickstart.md
│       ├── contracts/
│       │   └── cli-contract.md
│       └── tasks.md
├── dist/                           # Salida compilada; no versionar
│   └── main.js                     # Punto de entrada compilado
├── release/                        # Binarios empaquetados; no versionar
│   ├── stock-control-linux
│   └── stock-control-windows.exe
├── docs/
│   └── evidencias/
│       └── ejecucion-agente-documentador.md
├── .github/
│   ├── agents/
│   │   └── documentador-codigo.agent.md
│   ├── skills/
│   │   └── documentar-codigo/
│   │       └── SKILL.md
│   └── resources/
│       └── documentador-codigo/
│           └── plantilla-documentacion.md
└── .gitignore
```

### Decisión de estructura

La estructura elegida mantiene una separación nítida entre capa de dominio, casos de uso, persistencia y CLI. Esto permite que las validaciones y las reglas de negocio sean verificables por pruebas sin depender de la consola, y que la persistencia quede encapsulada para controlar escrituras JSON, rutas y atomicidad. La composición modular reduce el riesgo de errores de integridad y facilita el empaquetado con `@yao-pkg/pkg`. Los directorios `data/`, `dist/` y `release/` se reservan para datos locales, artefactos de compilación y binarios generados, y no deben versionarse.

## Agente declarativo acordado

### Nombre

Agente Documentador de Código.

### Propósito

Analizar el código fuente, las pruebas y los artefactos SDD del proyecto para generar o actualizar documentación técnica verificable en español.

### Entradas

- `.specify/memory/constitution.md`
- `specs/001-stock-management/spec.md`
- `specs/001-stock-management/plan.md`
- `src/`
- `tests/`
- `package.json`
- `tsconfig.json`

### Salida

- `docs/documentacion-tecnica.md`

### Contenido requerido de la documentación

- propósito y alcance;
- arquitectura y organización de módulos;
- entidades y reglas del dominio;
- casos de uso;
- persistencia JSON y atomicidad;
- funcionamiento de la CLI;
- estrategia de pruebas;
- compilación y empaquetado;
- trazabilidad con los requisitos funcionales;
- limitaciones conocidas.

### Restricciones

- No modificar código fuente, pruebas ni artefactos SDD.
- No inventar comportamientos ausentes del código o de las especificaciones.
- Señalar explícitamente cualquier inconsistencia o información no verificable.
- Generar toda la documentación en español.
- Permitir revisión humana antes de aceptar el resultado.

### Responsabilidad de los componentes declarativos

- El agente coordina la inspección de los archivos, utiliza la skill y produce la documentación.
- La skill define el procedimiento reutilizable para analizar y documentar el proyecto.
- El recurso proporciona la estructura y los criterios obligatorios del documento resultante.
- La evidencia registra objetivo, entradas analizadas, prompt o instrucción utilizada, salida generada, resultado de la revisión humana y correcciones realizadas.

### Componentes declarativos planificados

- Agente: `.github/agents/documentador-codigo.agent.md`
- Skill: `.github/skills/documentar-codigo/SKILL.md`
- Recurso: `.github/resources/documentador-codigo/plantilla-documentacion.md`
- Evidencia de ejecución y revisión: `docs/evidencias/ejecucion-agente-documentador.md`

## Modelo de datos

### Entidad: Producto

- `code`: código único normalizado; se compara con trim y lowercase.
- `name`: nombre visible validado no vacío.
- `description`: descripción validada no vacía.
- `availableQuantity`: entero no negativo con disponibilidad actual.
- `minStock`: entero no negativo usado para evaluar stock bajo.

**Reglas**:
- El código se almacena normalizado en minúsculas y sin espacios envolventes.
- La creación debe rechazar nombres o descripciones compuestos solo por espacios.
- Dos productos no pueden compartir el mismo código normalizado.
- Se acepta cantidad inicial >= 0 y stock mínimo >= 0.

### Entidad: Movimiento de stock

- `id`: entero positivo, secuencial y creciente; el siguiente valor será el máximo identificador existente más uno.
- `productCode`: código del producto afectado.
- `type`: `entry` o `exit`.
- `quantity`: entero positivo mayor que cero.
- `timestamp`: marca temporal ISO 8601 UTC o equivalente segura.
- `resultingQuantity`: cantidad disponible del producto después del movimiento.

**Reglas**:
- Solo una entrada o salida de stock aceptada genera un movimiento.
- El historial debe ordenarse por fecha descendente y por `id` descendente si hay empate.
- No se genera movimiento para la cantidad inicial de un producto ni para una operación rechazada.
- Si la operación falla, el producto y el historial permanecen sin cambios.

### Estado global de inventario

```ts
interface InventoryState {
  products: Product[];
  movements: StockMovement[];
}
```

**Relaciones**:
- Un producto puede tener cero o muchos movimientos.
- Cada movimiento referencia un producto por `productCode`.
- Las operaciones se aplican siempre sobre la copia en memoria y se persisten solo si la escritura completa tiene éxito.

## Persistencia y atomicidad

### Decisión de diseño

La persistencia se realizará con un único archivo JSON principal de estado: en desarrollo en `<raíz-del-proyecto>/data/inventory.json` y en ejecutables empaquetados en `<directorio-del-ejecutable>/data/inventory.json`. El directorio `data` y el archivo se crean en la primera ejecución si no existen. Si el archivo existe pero es ilegible, corrupto o no cumple el modelo esperado, se preserva sin cambios y la aplicación finaliza de forma segura.

### Escritura atómica

- Se escribe en un archivo temporal con nombre generado por el proceso.
- La nueva versión se valida como JSON antes de reemplazar el archivo objetivo.
- Se usa una operación de reemplazo atómico: crear temporal, fsync si es posible, renombrar al destino final.
- Si la escritura falla, el archivo original no se modifica.
- La operación de inventario completa se aplica solo después de la confirmación segura del archivo.

### Manejo de corrupción

- Si el archivo JSON existe pero no se puede parsear, se detecta como error de inicio.
- Se muestra un mensaje claro al usuario.
- Se preservan los archivos originales sin sobrescribirlos.
- La aplicación sale de forma segura sin habilitar operaciones del inventario.

### Reversión de cambios

- La aplicación no modifica el estado persistido antes de confirmar la operación.
- En caso de error durante la escritura, se descarta la operación y se recupera el último estado válido.
- El flujo de guardado aplica “todo o nada” para una operación de entrada, salida o registro de producto.

## Estrategia de pruebas trazable a los requisitos

### Niveles de prueba

1. Pruebas unitarias de validación y normalización.
2. Pruebas unitarias del dominio de inventario.
3. Pruebas de integración del menú y flujo de persistencia.
4. Pruebas de inicio con archivos corruptos.

### Cobertura trazable

- FR-001 a FR-007: pruebas de registro, código único, validación de nombre/descripción y listados vacíos.
- FR-008 a FR-015: pruebas de entradas, salidas, validación de cantidades, rechazo por producto inexistente y confirmación atómica.
- FR-016 a FR-022: pruebas de stock bajo y orden del historial descendente.
- FR-023 a FR-028: pruebas del menú persistente, manejo de errores y archivos corruptos.

### Casos de prueba clave

- Registro con código `" ABC-12 "` y validación de duplicado por normalización.
- Entrada con cantidad 5 y salida con cantidad 3 sobre stock 10.
- Salida rechazada por stock insuficiente.
- Inicio con archivo JSON corrupto y finalización segura.
- Escritura fallida de persistencia y reversión integral.
- Orden cronológico descendente del historial y desempate por id.

## Estrategia de empaquetado para Linux y Windows

### Herramienta

Se utilizará `@yao-pkg/pkg` como dependencia de desarrollo, con configuración de empaquetado por plataforma. Se generarán dos artefactos: un ejecutable nativo para Linux x64 y un `.exe` para Windows x64.

### Scripts npm definidos

- `npm run package:linux` → genera `release/stock-control-linux`.
- `npm run package:windows` → genera `release/stock-control-windows.exe`.
- `npm run package:all` → genera ambos artefactos.

### Requisitos del empaquetado

- El ejecutable de Windows debe funcionar sin instalar Node.js en el equipo destino.
- Los archivos JSON modificables deben permanecer fuera del binario y ubicarse en `<directorio-del-ejecutable>/data/inventory.json`.
- La lógica debe hacer uso de rutas de archivos confiables y absolutas calculadas desde el entorno del usuario o desde el directorio del ejecutable.
- La build debe generar binarios que llamen a la misma lógica de aplicación, con diferenciación solo de la plataforma objetivo.

### Configuración recomendada

- `devDependencies`: incluir `@yao-pkg/pkg`.
- `scripts`: `package:linux`, `package:windows` y `package:all`.
- `targets`: Linux x64 y win-x64.
- `outputPath`: `release/`.
- `assets`: incluir archivos mínimos de configuración si se requieren.

## Guía de ejecución y validación

### Requisitos previos

- Node.js 24 instalado.
- npm o pnpm disponible.
- Entorno Linux para desarrollo.

### Comandos de validación

```bash
npm install
npm run build
npm test
```
### Empaquetado

```bash
npm run package:linux
npm run package:windows
npm run package:all
```
### Ejecución local

```bash
node dist/main.js
```

### Validación funcional sugerida

1. Registrar productos con códigos normalizados.
2. Verificar que el código duplicado sea rechazado.
3. Realizar entradas y salidas válidas.
4. Comprobar productos con stock bajo.
5. Consultar el historial ordenado cronológicamente.
6. Cerrar y volver a abrir la aplicación para comprobar persistencia.
7. Forzar un archivo corrupto y verificar cierre seguro.

## Riesgos y decisiones relevantes

### Riesgos principales

- Corruptión del archivo JSON: mitigado con validación de parseo y bloqueo de inicio.
- Pérdida de datos por escritura parcial: mitigado con escritura atómica y archivos temporales.
- Inconsistencias en las cantidades: mitigado con validaciones estrictas y no permitir valores negativos.
- Orden inconsistente en el historial: mitigado con criterio `timestamp desc, id desc`.
- Dependencias de entorno de ejecución: mitigado con API estándar de Node.js y empaquetado controlado.

### Decisiones técnicas relevantes

- Persistencia en JSON, no en base de datos, dado el alcance CLI y la restricción de no red ni servicios.
- Se evita la edición de registros por simplicidad y por estar fuera del alcance.
- Se prioriza la integridad por sobre “volúmenes” de código; cada operación se valida antes de persistir.
- Se usan rutas basadas en el sistema operativo sin depender de parámetros de entorno no documentados.

## Artefactos auxiliares de planificación

Los artefactos requeridos por Spec Kit se han preparado para esta funcionalidad:

- [spec.md](spec.md)
- [research.md](research.md)
- [data-model.md](data-model.md)
- [quickstart.md](quickstart.md)
- [contracts/cli-contract.md](contracts/cli-contract.md)

La implementación posterior debe continuar con la generación de tareas en [tasks.md](tasks.md), que se añadirá en la fase de planificación de tareas del flujo de GitHub Spec Kit.

## Compleción del plan

Se concluye la fase de diseño y se deja el proyecto listo para el siguiente paso de especificación de tareas. El plan cumple los requisitos de la constitución, la especificación funcional y las restricciones técnicas exigidas por el proyecto.

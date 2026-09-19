# Stock Control CLI

## Objetivo

Aplicación de línea de comandos para registrar productos, entradas y salidas de stock, consultar el inventario, detectar stock bajo y revisar el historial de movimientos. El estado se conserva en un archivo JSON externo.

## Alcance

Incluye catálogo de productos, códigos normalizados, cantidades iniciales, stock mínimo, movimientos aceptados, consultas, menú persistente, validación de entradas, escritura atómica y manejo defensivo de datos corruptos. No incluye interfaz gráfica, servidor, base de datos, red, autenticación, múltiples almacenes, precios, proveedores, edición ni eliminación.

## Tecnologías

- Node.js 24.
- TypeScript 5.9 en modo estricto.
- APIs estándar `node:readline/promises`, `node:fs/promises`, `node:path` y `node:test`.
- `@yao-pkg/pkg` para generar ejecutables Linux x64 y Windows x64.

## Requisitos

- Node.js 24 y npm.
- Permisos de lectura y escritura en el directorio del proyecto.
- Linux para el desarrollo local. El ejecutable Windows se valida en Windows x64 sin Node.js instalado.

## Instalación

```bash
npm install
```

## Compilación y ejecución en desarrollo

Los comandos disponibles están declarados en `package.json`:

```bash
npm run build
node dist/src/main.js
```

La primera ejecución crea `data/` y `data/inventory.json` si no existen.

## Pruebas y typecheck

```bash
npm run typecheck
npm test
```

`npm test` compila y ejecuta los archivos JavaScript emitidos en `dist/tests/` con `node --test`.

## Empaquetado

```bash
npm run package:linux
npm run package:windows
npm run package:all
```

Los resultados se generan localmente en `release/stock-control-linux` y `release/stock-control-windows.exe`. Los datos modificables permanecen fuera del ejecutable, en el directorio `data/` correspondiente.

## Persistencia JSON externa

En desarrollo, la ruta es `<raíz-del-proyecto>/data/inventory.json`. En un ejecutable empaquetado, es `<directorio-del-ejecutable>/data/inventory.json`. El sistema valida el estado antes de escribir, usa un archivo temporal y reemplazo atómico, conserva un archivo corrupto sin sobrescribirlo y revierte lógicamente una operación si falla el guardado.

## Estructura principal

- `src/domain/`: entidades, estado, validaciones y errores.
- `src/use-cases/`: registro, movimientos, consultas y carga inicial.
- `src/persistence/`: rutas, JSON, escritura atómica y almacenamiento.
- `src/app/cli/`: menú, prompts y formateo.
- `tests/unit/` y `tests/integration/`: pruebas de dominio, casos de uso, persistencia y CLI.
- `specs/001-stock-management/`: especificación, plan, modelo, contrato, investigación y tareas.
- `docs/`: documentación técnica, guía y evidencias.

## Agente declarativo

El Agente Documentador de Código (`.github/agents/documentador-codigo.agent.md`) analiza código, pruebas y artefactos SDD para producir documentación técnica verificable en español. Usa `.github/skills/documentar-codigo/SKILL.md` y la plantilla de `.github/resources/documentador-codigo/`; su ejecución y revisión están registradas en `docs/evidencias/ejecucion-agente-documentador.md`.

## Documentación y evidencias

- [Documentación técnica](docs/documentacion-tecnica.md)
- [Guía de uso](docs/guia-uso.md)
- [Ejecución del agente](docs/evidencias/ejecucion-agente-documentador.md)
- [Resultados de pruebas](docs/evidencias/resultados-pruebas.md)
- [Trazabilidad de requisitos](docs/evidencias/trazabilidad-requisitos.md)
- [Cumplimiento de la constitución](docs/evidencias/cumplimiento-constitucion.md)
- [Inventario de entrega](docs/evidencias/inventario-entrega.md)

## Limitaciones conocidas

La especificación conserva el estado `Borrador`. No existe una medición de `SC-001` ni una validación manual Windows específica para datos corruptos. Durante la revisión final, la ruta de ejecución se alineó con la salida compilada verificable: `node dist/src/main.js`. La aplicación está pensada para un único usuario local y no coordina procesos concurrentes.

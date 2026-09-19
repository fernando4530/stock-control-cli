# Inventario de entrega

**Fecha:** 2026-09-19

## Artefactos Spec Kit

| Elemento | Estado de versionado |
|---|---|
| `.specify/memory/constitution.md` | Versionado por Git |
| `specs/001-stock-management/spec.md` | Versionado por Git |
| `specs/001-stock-management/plan.md` | Versionado por Git |
| `specs/001-stock-management/research.md` | Versionado por Git |
| `specs/001-stock-management/data-model.md` | Versionado por Git |
| `specs/001-stock-management/quickstart.md` | Versionado por Git |
| `specs/001-stock-management/contracts/cli-contract.md` | Versionado por Git |
| `specs/001-stock-management/tasks.md` | Versionado por Git; T001-T070 marcadas |

## Código y pruebas

`src/`, `tests/`, `package.json`, `package-lock.json` y `tsconfig.json` están versionados por Git. Las pruebas incluyen unitarias, integración y fixtures JSON.

## Agente, skill y recurso

Los siguientes elementos están versionados por Git:

- `.github/agents/documentador-codigo.agent.md`.
- `.github/skills/documentar-codigo/SKILL.md`.
- `.github/resources/documentador-codigo/plantilla-documentacion.md`.

## Documentación

Están versionados o quedan incluidos en la entrega de fuentes:

- `README.md`.
- `docs/documentacion-tecnica.md`.
- `docs/guia-uso.md`.
- `docs/evidencias/ejecucion-agente-documentador.md`.
- `docs/evidencias/verificacion-fundamentos.md`.
- `docs/evidencias/empaquetado-linux.md`.
- `docs/evidencias/empaquetado-windows.md`.
- `docs/evidencias/resultados-pruebas.md`.
- `docs/evidencias/cumplimiento-constitucion.md`.
- `docs/evidencias/trazabilidad-requisitos.md`.
- `docs/evidencias/inventario-entrega.md`.
- `docs/evidencias/capturas/`.

## Ejecutables y paquete Windows

Se generaron localmente `release/stock-control-linux` y `release/stock-control-windows.exe`. También existen `release/data/inventory.json`, `entrega-windows/` y `stock-control-windows.zip` como materiales locales de entrega. Deben incluirse manualmente cuando la entrega requiera binarios, datos o paquete; no se incorporan binarios al repositorio.

## Estado de versionado de artefactos locales

`release/`, `data/inventory.json`, `dist/`, `node_modules/`, `entrega-windows/` y `stock-control-windows.zip` están ignorados por Git según `.gitignore` y no forman parte del conjunto versionado. Los archivos ZIP deben permanecer fuera del repositorio. `data/` puede conservar fixtures o estructura local, pero el inventario operativo `data/inventory.json` no se versiona.

## Elementos que deben incluirse manualmente

Para una entrega ejecutable, copiar manualmente los ejecutables de `release/`, el contenido requerido de `entrega-windows/`, el ZIP Windows y el archivo JSON de datos que corresponda. La entrega desde Git contiene el código, las pruebas, los artefactos SDD, el agente, la documentación y las evidencias, pero no esos binarios ni datos locales ignorados.

# Evidencia de empaquetado Linux

**Fecha:** 2026-09-18
**Alcance:** T053, T054 y T055

## Prerrequisitos

Se ejecutaron antes del empaquetado:

```text
npm run typecheck
> tsc -p tsconfig.json --noEmit

npm test
> npm run build && node --test "dist/tests/**/*.test.js"
ℹ tests 20
ℹ pass 20
ℹ fail 0

npm run build
> tsc -p tsconfig.json
```

Los tres comandos finalizaron con código 0.

## Empaquetado

Los scripts existentes en `package.json` se ejecutaron correctamente:

```text
npm run package:linux
> pkg . --targets node24-linux-x64 --output release/stock-control-linux
> pkg@6.22.0

npm run package:windows
> pkg . --targets node24-win-x64 --output release/stock-control-windows.exe
> pkg@6.22.0

npm run package:all
> npm run package:linux && npm run package:windows
> pkg@6.22.0
> pkg@6.22.0
```

Resultados observados después de `npm run package:all`:

```text
release/stock-control-linux|73760480 bytes|-rwxrwxr-x
release/stock-control-windows.exe|92068083 bytes|-rw-rw-r--
```

Tipos observados con `file`:

```text
release/stock-control-linux: ELF 64-bit LSB executable, x86-64, dynamically linked, stripped
release/stock-control-windows.exe: PE32+ executable for MS Windows, x86-64
```

El ejecutable Windows fue generado, pero no se validó funcionalmente en Windows.

## Validación funcional Linux

Se inició `./release/stock-control-linux` en una sesión interactiva. Con `release/data/inventory.json` conteniendo un producto `REL-1` y el archivo de desarrollo `data/inventory.json` conteniendo otro producto `DEV-1`, se enviaron las opciones `4` y `7` una por una.

Salida observada:

```text
1. Registrar producto
2. Registrar entrada
3. Registrar salida
4. Consultar productos
5. Consultar stock bajo
6. Consultar historial
7. Salir
Opción: 4
rel-1 | Producto release | disponible: 3 | mínimo: 1

Opción: 7
Hasta luego.
```

El proceso finalizó correctamente después de seleccionar la salida. El producto mostrado fue el de `release/data/inventory.json`, no el producto `DEV-1` del archivo de desarrollo.

Se eliminó el `data/inventory.json` temporal usado para la comprobación. El archivo externo del release permaneció en `release/data/inventory.json` con 40 bytes y la huella SHA-256 observada fue:

```text
82043b4c5886d977d19b92f2b872b7bf8b15160c0a53fd161aa6c19f1dcc02df
```

## Exclusión de Git

`git status --short --ignored release data` mostró:

```text
!! release/
```

El `.gitignore` excluye `release/`, `dist/` y `data/inventory.json`, por lo que los ejecutables y los datos locales no se incorporan al control de versiones.

## Alcance de validación

La validación funcional realizada corresponde únicamente a Linux. La validación manual del ejecutable Windows queda pendiente para T056. T057 permanece pendiente y no se marca con esta evidencia.

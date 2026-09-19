# Evidencia de empaquetado Windows

**Fecha de validación:** 2026-09-19
**Entorno validado:** Windows x64 sin Node.js instalado
**Alcance:** T056 y T057

## Procedimiento realizado

Se abrió el ejecutable `release/stock-control-windows.exe` en un equipo Windows x64 sin Node.js instalado y se realizó el flujo manual de inventario. La aplicación se inició, mostró el menú y creó automáticamente la carpeta externa `data` junto al ejecutable.

Luego se ejecutaron las siguientes operaciones desde el menú:

1. Registro de `PROD-001` con cantidad inicial `10` y stock mínimo `3`.
2. Registro de una entrada de `5` unidades.
3. Registro de una salida de `2` unidades.
4. Consulta de productos.
5. Consulta del historial.
6. Cierre mediante la opción `7`.
7. Nueva apertura del ejecutable para comprobar la persistencia.

## Resultados observados

- El ejecutable inició correctamente y mostró el menú.
- La carpeta externa `data` se creó junto al ejecutable.
- `PROD-001` quedó registrado con disponibilidad inicial `10` y stock mínimo `3`.
- La entrada de `5` dejó una disponibilidad de `15`.
- La salida de `2` dejó una disponibilidad de `13`.
- La consulta de productos mostró `PROD-001` con disponibilidad `13`.
- El historial mostró primero la salida y luego la entrada.
- La opción `7` cerró correctamente la aplicación.
- El ejecutable funcionó de forma autónoma en Windows, sin Node.js instalado.

Capturas de la ejecución:

- [Inicio y almacenamiento externo](capturas/windows-inicio-y-almacenamiento.png)
- [Operaciones e historial](capturas/windows-operaciones-e-historial.png)

## Validación de persistencia

Después de cerrar la aplicación, se abrió nuevamente el ejecutable. `PROD-001` continuó disponible con cantidad `13`, por lo que el estado persistido se conservó entre ejecuciones.

Captura de la reapertura:

- [Persistencia tras reinicio](capturas/windows-persistencia-tras-reinicio.png)

Durante esta validación manual no se realizó una prueba específica con un archivo de datos corrupto; por lo tanto, esta evidencia no atribuye a Windows un resultado adicional sobre ese escenario.

## Conclusión

La validación manual informada confirma que el ejecutable Windows x64 inicia y funciona sin Node.js instalado, mantiene la lógica de registro, entradas, salidas y consultas, utiliza almacenamiento externo junto al ejecutable y conserva los datos después de reiniciar la aplicación.

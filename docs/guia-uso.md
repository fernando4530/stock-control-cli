# Guía de uso

## Iniciar la aplicación

Desde la raíz del proyecto:

```bash
npm run build
node dist/src/main.js
```

El menú permanece activo hasta elegir `7. Salir`.

## Registrar un producto

1. Elegir `1`.
2. Ingresar código, nombre, descripción, cantidad inicial y stock mínimo.
3. La cantidad inicial queda disponible y no crea un movimiento.

El código se recorta y se convierte a minúsculas. Un código normalizado duplicado se rechaza.

## Registrar una entrada

1. Elegir `2`.
2. Ingresar el código de un producto existente.
3. Ingresar una cantidad entera positiva.

La cantidad se suma y se registra un movimiento de entrada.

## Registrar una salida

1. Elegir `3`.
2. Ingresar el código de un producto existente.
3. Ingresar una cantidad entera positiva que no supere la disponibilidad.

La cantidad se resta y se registra un movimiento de salida. Una salida mayor al stock se rechaza sin modificar el inventario.

## Consultar productos

Elegir `4`. La aplicación muestra código, nombre, disponibilidad y stock mínimo. Si no hay productos, muestra `No hay productos disponibles.`.

## Consultar stock bajo

Elegir `5`. Se muestran los productos cuya disponibilidad es menor o igual a su stock mínimo. Si no hay coincidencias, muestra `No hay productos con stock bajo.`.

## Consultar historial

Elegir `6`. Cada movimiento muestra código, tipo, cantidad, fecha y stock resultante. El orden es descendente por fecha y, en caso de empate, por identificador descendente. Si no hay movimientos, muestra `No hay movimientos.`.

## Salir

Elegir `7`. La aplicación muestra `Hasta luego.` y cierra la sesión sin cambiar el inventario.

## Ubicación de los datos

En desarrollo, el archivo persistente es `data/inventory.json` relativo a la raíz de ejecución. En un ejecutable empaquetado, es `data/inventory.json` junto al ejecutable. El archivo se crea en la primera ejecución cuando no existe.

## Entradas inválidas

Los campos obligatorios no pueden estar vacíos. Las cantidades se convierten a números enteros; una entrada vacía o no entera produce un error y devuelve el control al menú. Una opción desconocida muestra `Opción inválida.`.

## Stock insuficiente y productos inexistentes

Las entradas y salidas requieren un producto existente y una cantidad positiva. Una salida mayor que la disponibilidad se rechaza. Los errores se muestran con el prefijo `Error:`, no generan movimientos y no dejan cantidades negativas.

## Datos corruptos

Si `data/inventory.json` no puede leerse, no contiene JSON válido o no cumple la estructura esperada, la aplicación muestra un error de inicio, conserva el archivo sin sobrescribirlo y finaliza sin habilitar el menú.

## Fallos de guardado

La escritura se realiza mediante un archivo temporal y reemplazo atómico. Si falla, la operación completa se rechaza, el estado previo se conserva y el menú continúa disponible cuando el fallo ocurre durante una sesión.

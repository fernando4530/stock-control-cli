# Guía de ejecución y validación

## Requisitos previos

- Node.js 24 instalado.
- npm disponible.
- Sistema operativo Linux para desarrollo.
- Permisos de escritura en el directorio de datos de la aplicación.

## Preparación del entorno

1. Instalar dependencias:

```bash
npm install
```

2. Compilar el proyecto:

```bash
npm run build
```

3. Ejecutar la aplicación:

```bash
node dist/main.js
```

La aplicación crea automáticamente el directorio `data` y el archivo `data/inventory.json` si no existen. En desarrollo, la ruta persistente es `<raíz-del-proyecto>/data/inventory.json`; en ejecutables empaquetados, `<directorio-del-ejecutable>/data/inventory.json`.

## Validación funcional

### 1. Registro de producto

1. Iniciar la aplicación.
2. Elegir la opción de registro de producto.
3. Registrar un producto con código `ABC-12`, nombre `Lámpara LED` y cantidad inicial 15.
4. Confirmar que la aplicación lo muestra en el listado de productos.

### 2. Duplicado de código

1. Intentar registrar otro producto con código `abc-12`.
2. Verificar que la operación sea rechazada con mensaje claro.

### 3. Entrada y salida válidas

1. Registrar una entrada de 5 unidades para `abc-12`.
2. Confirmar que la cantidad disponible pasa a 20.
3. Registrar una salida de 3 unidades.
4. Confirmar que la cantidad disponible pasa a 17 y que el movimiento queda registrado.

### 4. Validación de stock insuficiente

1. Intentar una salida mayor que la cantidad disponible.
2. Confirmar que la operación es rechazada, sin cambios en los datos y sin movimiento creado.

### 5. Consulta de stock bajo

1. Definir stock mínimo igual a 5.
2. Verificar que el producto aparece cuando la disponibilidad es menor o igual al mínimo.

### 6. Historial ordenado

1. Generar varios movimientos.
2. Consultar el historial completo.
3. Confirmar orden descendente por marca temporal y desempate por `id`.

### 7. Persistencia y reinicio

1. Registrar productos y movimientos.
2. Cerrar la aplicación.
3. Ejecutarla nuevamente.
4. Verificar que los datos siguen disponibles.

### 8. Archivo corrupto

1. Corromper manualmente el archivo JSON de persistencia.
2. Iniciar la aplicación.
3. Confirmar que muestra el error, preserva el archivo original y finaliza sin habilitar operaciones.

## Ejecución y validación del agente declarativo

Debe ejecutarse después de completar y validar la implementación del proyecto. El agente declarativo debe generar el archivo `docs/documentacion-tecnica.md` a partir de la constitución, la especificación, el plan, el código fuente, las pruebas y el archivo de configuración del proyecto. El resultado debe compararse contra el código y los artefactos SDD para verificar que no contiene afirmaciones no respaldadas. La revisión humana debe registrarse en `docs/evidencias/ejecucion-agente-documentador.md` con objetivo, entradas analizadas, instrucción utilizada, salida generada, observaciones de revisión y correcciones realizadas.

## Validación de empaquetado

### Linux x64

```bash
npm run package:linux
```

### Windows x64

```bash
npm run package:windows
```

### Generación completa

```bash
npm run package:all
```

### Resultado esperado

- El binario Linux se genera en `release/stock-control-linux`.
- El ejecutable Windows se genera en `release/stock-control-windows.exe`.
- Los datos JSON permanecen fuera del ejecutable y se accede a ellos por ruta externa.
- La aplicación conserva la misma lógica de validación en ambos sistemas.
- El `.exe` de Windows debe validarse manualmente en una máquina sin Node.js instalado.

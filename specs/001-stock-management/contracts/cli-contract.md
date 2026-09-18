# Contrato de la interfaz de línea de comandos

## Visión general

La aplicación se ejecuta en modo consola y expone un menú persistente con acciones para registrar productos, consultar productos, registrar entradas, registrar salidas, revisar stock bajo y consultar historial. La interacción se realiza mediante entrada estándar y salida estándar.

## Operaciones del menú

### 1. Registrar producto

**Entrada**:
- `code`: código del producto.
- `name`: nombre del producto.
- `description`: descripción del producto.
- `availableQuantity`: cantidad inicial.
- `minStock`: stock mínimo.

**Salida esperada**:
- Éxito: mensaje de registro confirmado.
- Error: mensaje indicando código duplicado, campo vacío o cantidad inválida.

**Regla**:
- La cantidad inicial se registra como disponibilidad actual y no genera movimiento.

### 2. Registrar entrada

**Entrada**:
- `productCode`: código del producto.
- `quantity`: cantidad positiva mayor que 0.

**Salida esperada**:
- Éxito: nuevo saldo y registro de movimiento.
- Error: producto inexistente, cantidad inválida o fallo de guardado.

### 3. Registrar salida

**Entrada**:
- `productCode`: código del producto.
- `quantity`: cantidad positiva mayor que 0.

**Salida esperada**:
- Éxito: saldo actualizado y movimiento registrado.
- Error: producto inexistente, cantidad inválida, stock insuficiente o fallo de guardado.

### 4. Consultar productos

**Entrada**: ninguna.

**Salida esperada**:
- Lista de productos con su cantidad disponible.
- Si no hay productos, mensaje explícito de ausencia.

### 5. Consultar stock bajo

**Entrada**: ninguna.

**Salida esperada**:
- Lista de productos con `availableQuantity <= minStock`.
- Si no existe ninguno, mensaje explícito.

### 6. Consultar historial

**Entrada**: ninguna.

**Salida esperada**:
- Lista ordenada por timestamp descendente y `id` descendente en caso de empate.
- Si no hay movimientos, mensaje explícito.

### 7. Salir

**Entrada**: ninguna.

**Salida esperada**:
- Finaliza la aplicación de forma controlada.
- No modifica productos, movimientos ni archivos de persistencia.
- Cierra la sesión de la CLI sin dejar el estado en un estado inconsistente.

## Manejo de errores

- Se validan entradas vacías, inválidas o incompletas antes de continuar.
- Cada error debe devolver el control al menú sin dejar el sistema en estado inconsistente.
- Si ocurre un fallo de persistencia, se informa claramente y se aborta la operación sin cambiar el inventario existente.
- Si el archivo de datos está corrupto al iniciar, la aplicación cierra de forma segura sin modificarlo.

## Formato de respuestas

La salida de la CLI debe ser legible y consistente, con mensajes de error y confirmación en español. Los códigos y movimientos deben mostrarse con los datos mínimos requeridos por la especificación.

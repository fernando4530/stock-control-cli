# Investigación técnica y decisiones de diseño

## Decisión 1: persistencia mediante archivos JSON locales

**Decisión**: La aplicación almacenará el estado del inventario en un único archivo JSON externo al ejecutable. En desarrollo se usará `<raíz-del-proyecto>/data/inventory.json`; en ejecutables empaquetados, `<directorio-del-ejecutable>/data/inventory.json`.

**Racional**: La especificación exige persistencia local sin base de datos ni servicios externos, y además exige que los archivos modificables permanezcan fuera del ejecutable. Los archivos JSON ofrecen la simplicidad y la trazabilidad requeridas para un proyecto CLI pequeño.

**Alternativas consideradas**:
- SQLite: cumple el objetivo de persistencia, pero introduce complejidad, dependencia extra y un enfoque de base de datos más allá del alcance del proyecto.
- Archivos de texto plano ad hoc: más frágiles y más difíciles de validar y mantener, por lo que no se recomienda.

## Decisión 2: normalización y validación de códigos

**Decisión**: Los códigos de producto se normalizarán con `trim()` y `toLowerCase()`, y la comparación se hará con esa forma normalizada.

**Racional**: La especificación exige que el sistema considere equivalentes los códigos como `" ABC-12 "`, `"ABC-12"` y `"AbC-12"`. La normalización centraliza esa regla y evita duplicados inadvertidos.

**Alternativas consideradas**:
- Usar el valor original sin normalizar: incompatible con la especificación.
- Normalizar solo al guardar y no al comparar: más propenso a errores y duplicidades.

## Decisión 3: escritura atómica y rollback lógico

**Decisión**: Cada operación de entrada o salida de stock exitosa se persistirá con un patrón de escritura atómica: archivo temporal + validación + reemplazo final del destino. La creación de un producto no genera movimiento ni requiere persistencia adicional fuera del estado global del inventario.

**Racional**: La especificación exige que si falla el guardado, la operación completa se revierta y que los archivos existentes no se sobrescriban si están corruptos. La atomicidad reduce el riesgo de pérdida de datos y evita estados parciales.

**Alternativas consideradas**:
- Escritura directa sobre el archivo principal: vulnerable a corrupción parcial.
- Guardado incremental por operación sin validación: más fácil de romper y menos seguro.

## Decisión 4: manejo defensivo de archivos corruptos al iniciar

**Decisión**: Si el archivo JSON no puede leerse, parsearse, o no cumple el modelo esperado al inicio, la aplicación mostrará un error claro, conservará el archivo original y finalizará sin habilitar la lógica de inventario. El directorio `data` y el archivo se crearán automáticamente si no existen en la primera ejecución.

**Racional**: La especificación define explícitamente este comportamiento y exige no sobrescribir ni modificar los archivos corruptos.

**Alternativas consideradas**:
- Intentar recuperar el archivo automáticamente: contradice el requisito de conservarlo y no alterar los datos existentes.
- Ignorar el error e iniciar con estado vacío: no cumple la especificación.

## Decisión 5: orden del historial cronológico descendente

**Decisión**: El historial se ordenará por marca temporal descendente, con desempate por identificador más reciente. El identificador de movimiento es un entero positivo, secuencial y creciente; el siguiente valor será el máximo existente más uno.

**Racional**: La especificación establece claramente la prioridad del orden, fundamental para auditoría y trazabilidad diaria del inventario.

**Alternativas consideradas**:
- Orden ascendente: no cumple la expectativa operativa.
- Orden por orden de inserción: no considera la temporalidad ni el desempate requerido.

## Decisión 6: arquitectura modular sin frameworks

**Decisión**: La aplicación se dividirá en capas de dominio, casos de uso, persistencia y CLI. No se utilizarán frameworks ni bibliotecas de terceros para el núcleo funcional.

**Racional**: La especificación prioriza APIs estándar de Node.js, minimiza dependencias de producción y exige una separación clara entre reglas de negocio y la interfaz por consola.

**Alternativas consideradas**:
- Diseño monolítico: más simple al principio, pero menos testeable y más frágil.
- Framework completo para CLI: innecesario para un proyecto de este tamaño.

## Decisión 7: empaquetado con `@yao-pkg/pkg`

**Decisión**: La distribución final se realizará con `@yao-pkg/pkg`, produciendo ejecutables nativos para Linux x64 y Windows x64.

**Racional**: La especificación exige esta herramienta y la necesidad de un ejecutable Windows que funcione sin Node.js instalado.

**Alternativas consideradas**:
- Generar un script de Node.js sin empaquetar: no cumple la entrega de binarios nativos.
- Usar otras herramientas sin requerimiento explícito: no validan la obligación del proyecto.

## Decisión 8: agente declarativo para documentación técnica

**Decisión**: Se incorporará un agente declarativo llamado Agente Documentador de Código para producir una documentación técnica verificable en español y mantener evidencia revisable del proceso.

**Justificación**: El proyecto requiere documentación técnica precisa, trazable con la constitución, la especificación y el código. La documentación debe resumir arquitectura, dominio, persistencia, CLI, pruebas y empaquetado sin inventar comportamientos no verificados.

**Alternativas consideradas**:
- Documentación manual sin agente: posible, pero menos consistente, más propensa a errores y menos reutilizable.
- Generación automática sin revisión humana: no satisface la restricción de permitir revisión y validación antes de aceptar el resultado.

**Razón para documentar el código**: La documentación no es un documento de marketing ni una referencia genérica; debe servir como evidencia técnica verificable y como punto de control para asegurar que el sistema implementado coincida con los requisitos, la arquitectura y los artefactos SDD.

## Conclusión

Estas decisiones resuelven el conjunto de necesidades técnicas de la funcionalidad y mantienen un diseño compatible con la constitución, la especificación y las restricciones de empaquetado, persistencia y trazabilidad del proyecto.

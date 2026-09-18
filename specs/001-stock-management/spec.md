# Especificación de la funcionalidad: Gestión de stock

**Rama de la funcionalidad**: `001-stock-management`

**Creado**: 2026-09-18

**Estado**: Borrador

**Entrada**: Objetivo funcional: gestionar el inventario de productos y movimientos de stock con persistencia entre ejecuciones.

## Clarificaciones

### Sesión 2026-09-18

- Q: ¿La cantidad inicial registrada al crear un producto debe generar o no un movimiento de stock? → A: La cantidad inicial queda registrada como disponibilidad inicial del producto y no genera un movimiento de stock. Solo las entradas y salidas realizadas posteriormente crean movimientos.
- Q: ¿Qué debe hacer la aplicación si encuentra datos persistidos ilegibles o corruptos al iniciar? → A: Debe mostrar un error claro, conservar los archivos existentes sin modificarlos ni sobrescribirlos y finalizar de forma segura sin habilitar operaciones de inventario.
- Q: ¿En qué orden debe mostrarse el historial de movimientos para que resulte más útil en la operación diaria del inventario? → A: El historial debe mostrarse en orden cronológico descendente, con el movimiento más reciente primero. Si dos movimientos tienen la misma marca temporal, se utiliza su identificador como criterio de desempate, mostrando primero el más recientemente registrado.

## Escenarios de usuario y pruebas *(obligatorio)*

### Historia de usuario 1 - Registro y consulta de productos (Prioridad: P1)

El usuario necesita registrar productos con datos básicos y verificar su disponibilidad actual para mantener el inventario bajo control desde la línea de comandos. La aplicación debe permitir registrar cada producto una sola vez según su código normalizado y consultar la lista completa con la cantidad disponible en cada caso.

**Por qué esta prioridad**: Sin este flujo, la aplicación no puede representar el inventario ni permitir operaciones posteriores de entrada y salida. Es el punto de entrada fundamental para toda la gestión del stock.

**Prueba independiente**: Se puede comprobar con una sesión donde se registran varios productos, se intenta repetir un código con distintos espacios y mayúsculas, y luego se consulta el listado completo.

**Escenarios de aceptación**:

1. **Dado** la aplicación se inicia con un catálogo vacío, **Cuando** el usuario registra un producto con código " ABC-12 ", nombre "Lámpara LED", descripción "Luz de uso doméstico", cantidad disponible 15 y stock mínimo 5, **Entonces** el producto queda registrado y queda visible en la consulta de productos con la cantidad disponible 15.
2. **Dado** un producto ya registrado con código "abc-12", **Cuando** el usuario intenta registrar otro producto con código " ABC-12 " o "AbC-12", **Entonces** la operación es rechazada y la aplicación informa que el código ya existe.
3. **Dado** existen varios productos registrados, **Cuando** el usuario consulta todos los productos, **Entonces** se muestran todos los productos y sus cantidades disponibles actuales.
4. **Dado** no existen productos registrados, **Cuando** el usuario consulta el listado de productos, **Entonces** la aplicación muestra un mensaje explícito indicando que no hay productos disponibles.

---

### Historia de usuario 2 - Registro de entradas y salidas de stock (Prioridad: P1)

El usuario necesita actualizar el stock de los productos para reflejar movimientos reales de inventario. La aplicación debe aceptar entradas y salidas solo cuando la información es válida, evitar cantidades negativas o inconsistentes y registrar cada operación exitosa para mantener historial auditable.

**Por qué esta prioridad**: El valor principal del sistema es proteger la integridad del inventario y permitir un control consistente de la disponibilidad real de cada producto. Sin este flujo, no se puede operar con el stock ni garantizar que no se produzcan errores de inventario.

**Prueba independiente**: Se puede comprobar con una secuencia de alta y baja de stock, incluyendo rechazo por producto inexistente, cantidad inválida, stock insuficiente y confirmación de que no se crean movimientos ni cambios cuando la operación es rechazada.

**Escenarios de aceptación**:

1. **Dado** un producto con código "P-001" y cantidad disponible 10, **Cuando** el usuario registra una entrada de 5 unidades, **Entonces** la cantidad disponible del producto pasa a 15 y se crea un movimiento de tipo entrada con esa cantidad y el stock resultante 15.
2. **Dado** un producto con código "P-001" y cantidad disponible 10, **Cuando** el usuario registra una salida de 3 unidades, **Entonces** la cantidad disponible del producto pasa a 7 y se crea un movimiento de tipo salida con esa cantidad y el stock resultante 7.
3. **Dado** un producto con código "P-001" y cantidad disponible 10, **Cuando** el usuario intenta registrar una entrada con cantidad 0 o negativa, **Entonces** la operación es rechazada, el stock no cambia y no se crea un movimiento.
4. **Dado** un producto con código "P-001" y cantidad disponible 10, **Cuando** el usuario intenta registrar una salida de 15 unidades, **Entonces** la operación es rechazada, el stock no cambia y no se crea un movimiento.
5. **Dado** no existe un producto con código "P-999", **Cuando** el usuario intenta registrar una entrada o salida para ese código, **Entonces** la operación es rechazada con un mensaje claro y no se modifica ningún producto ni movimiento.
6. **Dado** un producto con cantidad disponible 10 y un movimiento de salida válido, **Cuando** el resultado del cálculo sería negativo, **Entonces** la aplicación evita la operación y mantiene el stock en 10 o en el valor previo sin permitir valores negativos.

---

### Historia de usuario 3 - Identificación de productos con stock bajo (Prioridad: P2)

El usuario necesita detectar rápidamente qué productos están en riesgo de agotarse o por debajo del nivel mínimo definido, de modo que pueda tomar decisiones de reposición o revisión de inventario.

**Por qué esta prioridad**: Es un requisito importante para la operación del inventario, pero depende de que primero exista un catálogo y un sistema de movimientos confiable.

**Prueba independiente**: Se puede comprobar consultando productos con stock igual o menor al mínimo, incluyendo el caso sin productos bajo ese criterio y el caso con varios resultados.

**Escenarios de aceptación**:

1. **Dado** un producto con cantidad disponible 4 y stock mínimo 5, **Cuando** el usuario consulta los productos con stock bajo, **Entonces** ese producto aparece en la lista.
2. **Dado** un producto con cantidad disponible 5 y stock mínimo 5, **Cuando** el usuario consulta los productos con stock bajo, **Entonces** ese producto también aparece porque el criterio incluye igualdad.
3. **Dado** un producto con cantidad disponible 6 y stock mínimo 5, **Cuando** el usuario consulta los productos con stock bajo, **Entonces** ese producto no aparece en la lista.
4. **Dado** ningún producto tiene cantidad disponible menor o igual a su stock mínimo, **Cuando** el usuario consulta productos con stock bajo, **Entonces** la aplicación muestra un mensaje explícito indicando que no hay productos en esa condición.

---

### Historia de usuario 4 - Consulta del historial de movimientos (Prioridad: P2)

El usuario necesita revisar el historial completo de entradas y salidas para verificar cómo cambió el inventario a lo largo del tiempo, identificar tendencias y confirmar que cada operación quedó registrada correctamente.

**Por qué esta prioridad**: El historial es clave para auditoría, trazabilidad y validación del estado del inventario. Tiene prioridad alta, pero alcanza su mayor valor una vez que el sistema ya gestiona entradas y salidas de forma fiable.

**Prueba independiente**: Se puede comprobar con varios movimientos, revisando que cada uno muestre código, tipo, cantidad, marca temporal y stock resultante, y validando el caso sin movimientos registrados.

**Escenarios de aceptación**:

1. **Dado** existen varios movimientos de entrada y salida registrados, **Cuando** el usuario consulta el historial completo, **Entonces** la aplicación muestra cada movimiento con su código de producto, tipo de movimiento, cantidad, marca temporal y stock resultante en orden cronológico descendente.
2. **Dado** dos movimientos tienen la misma marca temporal, **Cuando** el usuario consulta el historial completo, **Entonces** la aplicación ordena primero el movimiento con identificador más reciente como criterio de desempate.
3. **Dado** no existen movimientos registrados, **Cuando** el usuario consulta el historial, **Entonces** la aplicación muestra un mensaje explícito indicando que no hay movimientos.
4. **Dado** una operación de entrada o salida se registra con éxito, **Cuando** el usuario consulta el historial, **Entonces** el movimiento aparece en la lista con el producto afectado, la operación realizada y el stock actualizado resultante.

---

### Historia de usuario 5 - Menú persistente y manejo de errores (Prioridad: P1)

El usuario necesita interactuar con la aplicación en un menú que permanezca activo mientras desee operar, con entradas inválidas manejadas de forma controlada y con la información guardada de forma persistente para que sobreviva a cierres y reinicios.

**Por qué esta prioridad**: La experiencia funcional y la seguridad del dato son esenciales. Un menú sin control de errores frustraría el uso y una persistencia débil pondría en riesgo el inventario.

**Prueba independiente**: Se puede comprobar al abrir la aplicación, intentar operaciones con entradas no válidas, salir del menú, cerrar y abrir la aplicación para confirmar que los datos siguen disponibles, y confirmar el manejo de errores de persistencia.

**Escenarios de aceptación**:

1. **Dado** la aplicación está en ejecución, **Cuando** el usuario elige una opción del menú, **Entonces** la interfaz permanece disponible y vuelve al menú tras completar o rechazar la operación, hasta que el usuario elige salir.
2. **Dado** el usuario ingresa texto vacío, valores no numéricos o datos incompletos, **Cuando** la aplicación valida la información, **Entonces** muestra un error claro y vuelve al menú sin dejar el sistema en un estado inconsistente.
3. **Dado** la aplicación ya contiene productos y movimientos, **Cuando** el usuario cierra y vuelve a abrirla, **Entonces** la información persiste y está disponible desde el inicio.
4. **Dado** no existen productos ni movimientos almacenados en el primer uso, **Cuando** la aplicación inicia, **Entonces** se carga un estado vacío y operable sin errores.
5. **Dado** ocurre un error al guardar una operación durante la ejecución, **Cuando** la aplicación intenta persistir los cambios, **Entonces** rechaza la operación completa, conserva sin cambios el stock, los movimientos y la información previamente persistida, informa claramente el error y devuelve el control al menú.
6. **Dado** al iniciar la aplicación existen archivos persistidos ilegibles o corruptos, **Cuando** el sistema realiza la carga inicial, **Entonces** muestra un error claro, conserva los archivos sin modificarlos ni sobrescribirlos y finaliza de forma segura sin habilitar operaciones de inventario.

### Casos límite

- Un producto se registra con un código rodeado de espacios o con letras en mayúsculas y minúsculas; el sistema debe tratarlo como el mismo código.
- Un producto se registra con nombre o descripción compuestos únicamente por espacios; la aplicación debe rechazarlo después de limpiar los espacios envolventes.
- Se intenta registrar una entrada o salida con una cantidad no entera, con cero o con un número negativo; la operación debe rechazarse.
- Se intenta registrar una salida para un producto cuya cantidad disponible es exactamente igual a la cantidad solicitada; la operación debe ser permitida si el resultado queda en cero y no es negativo.
- Se intenta consultar una lista cuando no hay registros; la aplicación debe mostrar un mensaje explícito y no una lista vacía sin contexto.
- Se intenta cerrar la aplicación sin que exista información persistida; la aplicación debe iniciar con colecciones vacías sin pérdida de datos ni errores ocultos.
- Al iniciar la aplicación, si los datos persistidos son ilegibles o corruptos, la aplicación debe mostrar un error claro, conservar los archivos sin modificarlos ni sobrescribirlos y no habilitar operaciones de inventario.
- Si ocurre un error al guardar una operación durante la ejecución, la aplicación debe rechazar la operación completa, conservar sin cambios el stock, los movimientos y la información previamente persistida, y devolver el control al menú.

## Requisitos *(obligatorio)*

### Requisitos funcionales

- **FR-001**: El sistema DEBE permitir registrar un producto con código, nombre, descripción, cantidad disponible inicial y stock mínimo.
- **FR-002**: El sistema DEBE validar que el código de producto no esté vacío después de eliminar espacios alrededor y DEBE normalizarlo para comparar sin distinguir mayúsculas y minúsculas.
- **FR-003**: El sistema DEBE impedir que dos productos distintos compartan el mismo código una vez normalizado, ignorando espacios y mayúsculas/minúsculas.
- **FR-004**: El sistema DEBE requerir que el nombre y la descripción del producto no estén vacíos después de eliminar espacios alrededor.
- **FR-005**: El sistema DEBE aceptar cantidades iniciales y stocks mínimos no negativos, como enteros válidos, y la cantidad inicial se registra como disponibilidad inicial del producto sin generar un movimiento de stock.
- **FR-006**: El sistema DEBE permitir consultar todos los productos registrados y mostrar su cantidad disponible actual.
- **FR-007**: Cuando no existan productos registrados, el sistema DEBE mostrar un mensaje explícito indicando que no hay productos disponibles.
- **FR-008**: El sistema DEBE permitir registrar una entrada de stock para un producto existente.
- **FR-009**: El sistema DEBE permitir registrar una salida de stock para un producto existente.
- **FR-010**: El sistema DEBE validar que cada cantidad de entrada o salida sea un entero positivo mayor que cero.
- **FR-011**: El sistema DEBE rechazar cualquier operación de movimiento cuyo código de producto no exista en el registro de productos.
- **FR-012**: El sistema DEBE rechazar cualquier salida cuyo valor exceda la cantidad disponible actual del producto.
- **FR-013**: El sistema DEBE impedir que la cantidad disponible de un producto sea negativa en ninguna operación.
- **FR-014**: Cada entrada o salida de stock aceptada DEBE crear un registro de movimiento con la información requerida.
- **FR-015**: Las operaciones rechazadas DEBEN dejar intactos los productos y DEBEN no crear registros de movimiento.
- **FR-016**: Un producto se considera con stock bajo cuando su cantidad disponible es menor o igual a su stock mínimo.
- **FR-017**: El sistema DEBE permitir consultar todos los productos que se encuentren en condición de stock bajo.
- **FR-018**: Cuando no existan productos con stock bajo, el sistema DEBE mostrar un mensaje explícito indicando que no hay productos con stock bajo.
- **FR-019**: El sistema DEBE permitir consultar el historial completo de movimientos registrados.
- **FR-020**: El sistema DEBE mostrar en cada movimiento, al menos, el código del producto, el tipo de movimiento, la cantidad, la marca temporal y el stock resultante tras la operación.
- **FR-021**: El historial de movimientos DEBE presentarse en orden cronológico descendente, utilizando el identificador como criterio de desempate cuando dos movimientos comparten la misma marca temporal.
- **FR-022**: Cuando no existan movimientos registrados, el sistema DEBE mostrar un mensaje explícito indicando que no hay movimientos.
- **FR-023**: El sistema DEBE presentar un menú activo que permanezca disponible hasta que el usuario elija salir.
- **FR-024**: El sistema DEBE validar los datos introducidos por el usuario después de recortar espacios alrededor y DEBE mostrar un error claro y seguro antes de retornar al menú.
- **FR-025**: La aplicación DEBE conservar productos y movimientos entre cierres y reinicios del programa.
- **FR-026**: En la primera ejecución, si no existe información persistida, el sistema DEBE iniciar con colecciones vacías de productos y movimientos.
- **FR-027**: Si durante el inicio los datos persistidos son ilegibles o corruptos, la aplicación DEBE informar claramente el problema, conservar los archivos existentes sin modificarlos ni sobrescribirlos y finalizar de forma segura sin habilitar operaciones de inventario.
- **FR-028**: Si ocurre un error al guardar una operación durante la ejecución, la aplicación DEBE rechazar la operación completa, conservar sin cambios el stock, los movimientos y la información previamente persistida, informar claramente el error y devolver el control al menú.

### Reglas del negocio

- **BR-001**: Los códigos de producto DEBEN ser únicos tras normalizar espacios y compararlos sin distinguir mayúsculas de minúsculas.
- **BR-002**: Las cantidades de producto y de stock mínimo DEBEN ser enteros no negativos.
- **BR-003**: Las cantidades de entrada y salida DEBEN ser enteros positivos mayores que cero.
- **BR-004**: Una salida DEBE rechazarse si el valor solicitado supera la cantidad disponible actual.
- **BR-005**: La cantidad disponible de cualquier producto NUNCA DEBE ser negativa.
- **BR-006**: Cada operación exitosa DEBE dejar un registro de movimiento asociado al producto afectado.
- **BR-007**: Las operaciones rechazadas DEBEN ser atómicas: no alteran el producto ni generan un movimiento.
- **BR-008**: Un producto con cantidad disponible menor o igual a su stock mínimo se considera en estado de stock bajo.
- **BR-009**: La aplicación DEBE utilizar la persistencia para conservar la información del inventario entre ejecuciones.
- **BR-010**: La aplicación DEBE operar sin asumir múltiples usuarios o procesos concurrentes.
- **BR-011**: La cantidad inicial registrada al crear un producto se considera disponibilidad inicial del producto y no genera un movimiento de stock.
- **BR-012**: Si los datos persistidos al iniciar la aplicación son ilegibles o corruptos, la aplicación DEBE mostrar un error claro, preservar los archivos existentes sin modificarlos ni sobrescribirlos y finalizar de forma segura sin habilitar operaciones de inventario.
- **BR-013**: El historial de movimientos DEBE ordenarse en orden cronológico descendente, con el movimiento más reciente primero; si dos movimientos comparten la misma marca temporal, se utiliza el identificador como criterio de desempate y se muestra primero el más recientemente registrado.
- **BR-014**: Una entrada, salida o registro de producto solo se considera confirmado cuando todos sus cambios se guardan correctamente; si falla la persistencia, la operación DEBE revertirse completamente.

### Entidades clave

- **Producto**: representa un bien gestionado en stock. Tiene un código único, nombre, descripción, cantidad disponible actual y stock mínimo definido por el usuario.
- **Movimiento de stock**: representa una operación de inventario aceptada. Tiene un identificador único, el código del producto afectado, el tipo de movimiento (entrada o salida), la cantidad involucrada, la marca temporal de la operación y el stock resultante tras la operación.

## Criterios de éxito *(obligatorio)*

### Resultados medibles

- **SC-001**: El usuario puede registrar y consultar productos en menos de 2 minutos en un flujo típico de creación de inventario inicial.
- **SC-002**: El 100% de las operaciones válidas de entrada y salida se procesan y registran correctamente en las pruebas funcionales de inventario.
- **SC-003**: El 100% de las salidas rechazadas por stock insuficiente se resuelven sin producir cantidades negativas ni movimientos no autorizados.
- **SC-004**: El usuario puede consultar el estado de stock bajo y el historial de movimientos completos sin errores de navegación dentro del menú.
- **SC-005**: Cuando la aplicación se cierra y vuelve a abrirse, la información persistida está disponible sin pérdida de datos en escenarios normales de uso.
- **SC-006**: Los errores de entrada o guardado durante la ejecución se comunican de forma clara, se devuelve el control al menú y el inventario queda sin cambios; si los datos persistidos son corruptos durante el inicio, la aplicación finaliza de forma segura y no sobrescribe los archivos existentes.

## Suposiciones

- La aplicación está diseñada para un único usuario que opera desde la línea de comandos y no requiere acceso concurrente por múltiples procesos.
- La información persistente se guarda localmente y está disponible para reutilizarse tras reiniciar la aplicación.
- El inventario inicial puede comenzar vacío y construirse a medida que el usuario registra productos y movimientos.
- Los textos de entrada obligatorios se validan después de eliminar espacios adicionales al inicio y al final.
- Las decisiones de stock mínimo y cantidades iniciales se definen por el usuario al momento de registrar el producto.
- La característica de edición o eliminación de productos y movimientos queda fuera del alcance de esta versión del producto.

## Fuera de alcance

- Interfaz gráfica o aplicación web.
- Autenticación y gestión de usuarios.
- Base de datos.
- Servicios de red o nube.
- Edición y eliminación de productos.
- Edición y eliminación de movimientos.
- Múltiples depósitos o almacenes.
- Precios, ventas, compras y proveedores.
- Acceso concurrente de múltiples usuarios o procesos.

---

## Resumen de trazabilidad

- El flujo de registro y consulta de productos se valida con FR-001 a FR-007.
- El flujo de entradas y salidas de stock se valida con FR-008 a FR-015 y BR-003 a BR-007.
- El flujo de stock bajo se valida con FR-016 a FR-018 y BR-008.
- El flujo de historial de movimientos se valida con FR-019 a FR-022 y BR-013.
- El comportamiento del menú, la validación y la persistencia se valida con FR-023 a FR-028 y BR-009 a BR-014.

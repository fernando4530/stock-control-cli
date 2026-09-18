# Constitución de Stock Control CLI

<!--
Informe de impacto de sincronización
- Cambio de versión: 1.0.0 -> 1.0.1
- Principios modificados: los siete principios existentes, únicamente en idioma y
redacción editorial
- Secciones agregadas: ninguna
- Secciones eliminadas: ninguna
- Seguimientos pendientes: ninguno
-->

## Principios Fundamentales

### I. Desarrollo basado en especificaciones
El comportamiento funcional DEBE especificarse antes de la implementación. Las
especificaciones, los planes y las tareas son la fuente de verdad, y el código NO DEBE
introducir comportamientos ausentes de la especificación aprobada. Todo cambio material
descubierto durante el desarrollo DEBE actualizar los artefactos SDD correspondientes
antes de continuar con la implementación.

Todo artefacto del proyecto destinado a lectura humana DEBE estar redactado en español.
Esto incluye, como mínimo, especificaciones, planes, tareas, documentación, mensajes
visibles para el usuario, criterios de aceptación, evidencia y reglas de gobernanza.
Los nombres convencionales de carpetas y archivos técnicos, comandos, APIs, propiedades,
símbolos de código y términos técnicos sin traducción natural PUEDEN permanecer en
inglés.

### II. Implementación incremental y trazable
La implementación DEBE avanzar una historia de usuario comprobable de forma independiente
por vez. Los requisitos, criterios de aceptación, tareas, código fuente y pruebas DEBEN
mantenerse trazables entre sí. Los artefactos SDD DEBEN registrarse en el control de
versiones antes que su implementación correspondiente, para que el comportamiento
previsto pueda revisarse primero.

### III. Integridad de los datos
Los códigos de producto DEBEN ser únicos. Las cantidades de stock y los valores de stock
mínimo DEBEN ser enteros no negativos. Las salidas de stock NUNCA DEBEN producir
disponibilidad negativa. Cada entrada o salida de stock aceptada DEBE crear un registro de
movimiento. Los datos de productos y movimientos DEBEN persistir en archivos JSON externos.

### IV. Pruebas y validación
Las reglas de negocio DEBEN tener pruebas automatizadas que cubran operaciones exitosas,
fallos de validación y casos límite relevantes. Cada incremento DEBE validarse contra sus
criterios de aceptación. Una implementación está completa únicamente cuando las pruebas
pasan y la convergencia no encuentra brechas críticas sin resolver.

### V. Simplicidad y alcance controlado
El proyecto DEBE usar Node.js 24 y TypeScript, y DEBE seguir siendo una aplicación de
línea de comandos. NO DEBE agregar una interfaz gráfica, un servidor web, una base de
datos, autenticación ni una dependencia de nube. Las dependencias de producción DEBEN
minimizarse en favor de las capacidades de la biblioteca estándar de Node.js. La
arquitectura DEBE ser modular, pero proporcional al alcance reducido.

### VI. Portabilidad y empaquetado
La aplicación DEBE funcionar durante el desarrollo en Ubuntu Linux y DEBE poder compilarse
como un ejecutable de Linux y como un `.exe` de Windows x64. El ejecutable de Windows DEBE
funcionar sin Node.js en el equipo de destino. Los archivos JSON modificables DEBEN
permanecer externos al ejecutable empaquetado, y las rutas de archivos DEBEN funcionar de
forma coherente en Linux y Windows.

### VII. Gobernanza de IA agéntica
El proyecto DEBE incluir un agente declarativo reutilizable que siga el modelo canónico
AS-Transformation. El agente DEBE realizar una tarea real del ciclo de vida de desarrollo
e incluir al menos una skill y un recurso de apoyo. Su ejecución DEBE producir evidencia
revisable. Los resultados generados por IA DEBEN verificarse antes de su aceptación.

## Restricciones Técnicas

El propósito del proyecto es construir una pequeña aplicación de gestión de stock de
línea de comandos como ejercicio práctico final del itinerario de aprendizaje de NTT DATA
Agentic AI y Spec-Driven Development. Todos los datos persistentes de productos y
movimientos DEBEN usar archivos JSON externos. El runtime y la implementación del código
fuente DEBEN usar Node.js 24 y TypeScript, con manejo de rutas independiente de la
plataforma y sin requerir un servicio de red, una base de datos ni un recurso de nube.

## Puertas de Calidad

Antes de comenzar la implementación, DEBEN existir la constitución, la especificación, el
plan y las tareas. Los requisitos y criterios de aceptación DEBEN ser explícitos y
comprobables. Las pruebas automatizadas DEBEN pasar, y ninguna operación de stock PUEDE
producir una cantidad negativa. La persistencia JSON DEBE sobrevivir a los reinicios de
la aplicación. DEBE documentarse al menos un refinamiento de especificación o una
replanificación. El agente declarativo DEBE ejecutarse en el proyecto y su resultado DEBE
conservarse. DEBE conservarse evidencia del empaquetado para Linux y Windows. La entrega
final DEBE incluir el ejecutable, los archivos de datos JSON, el código fuente, los
artefactos SDD, la definición del agente, la evidencia, README y la presentación.

## Gobernanza

Esta constitución prevalece sobre las preferencias informales de implementación. Las
enmiendas DEBEN incluir el motivo del cambio y una evaluación de impacto. Las excepciones
DEBEN documentarse explícitamente en lugar de implementarse de forma silenciosa.

La constitución usa versionado semántico. Una versión MAJOR indica cambios incompatibles
hacia atrás en la gobernanza o los principios; una versión MINOR indica gobernanza
agregada o ampliada materialmente; y una versión PATCH indica aclaraciones o
refinamientos no semánticos. El cumplimiento DEBE revisarse en cada incremento y antes de
la entrega final, incluidas las puertas de calidad y los requisitos de evidencia
anteriores.

**Versión**: 1.0.1 | **Ratificada**: 2026-09-18 | **Última modificación**: 2026-09-18

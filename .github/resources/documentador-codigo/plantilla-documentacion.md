# Documentación técnica

> Documento generado a partir de fuentes autorizadas. Cada apartado debe distinguir hechos verificados, decisiones SDD y limitaciones.

## Propósito

### Hechos verificados

Describir qué problema resuelve el sistema y qué comportamiento puede comprobarse en el código o las pruebas.

### Decisiones SDD

Describir el propósito previsto según la constitución, la especificación y el plan.

### Limitaciones

Indicar objetivos o comportamientos no demostrados por las fuentes.

## Alcance

### Hechos verificados

Enumerar las capacidades implementadas que estén respaldadas por código y pruebas.

### Decisiones SDD

Enumerar el alcance previsto y el fuera de alcance definido en los artefactos SDD.

### Limitaciones

Indicar diferencias o aspectos no verificados.

## Arquitectura

### Hechos verificados

Explicar las capas, módulos y relaciones observables en `src/`.

### Decisiones SDD

Describir la arquitectura definida en el plan.

### Limitaciones

Registrar módulos previstos que no estén presentes o cuya integración no pueda confirmarse.

## Estructura

Presentar la estructura relevante de archivos y directorios respaldada por el repositorio.

## Modelo de datos

Describir `Product`, `StockMovement`, `InventoryState`, sus campos, relaciones y reglas verificadas.

## Funcionalidades

Describir por funcionalidad los flujos implementados, sus entradas, salidas y restricciones verificadas.

## Persistencia

Describir el formato, las rutas, la carga, el guardado, la atomicidad, la corrupción y el rollback únicamente cuando estén respaldados.

## Validaciones y errores

Describir validaciones de datos, errores de dominio, manejo de entradas inválidas y comportamiento ante fallos de persistencia.

## Pruebas

Enumerar las pruebas presentes, sus escenarios y resultados documentados. No afirmar que una prueba pasó si no existe evidencia autorizada que lo confirme.

## Compilación y empaquetado

Describir scripts, dependencias y artefactos de compilación o empaquetado declarados o verificados.

## Ejecución

Describir únicamente comandos y requisitos definidos en `package.json`, el código o los artefactos SDD autorizados.

## Trazabilidad

Relacionar requisitos, decisiones SDD, módulos, pruebas y evidencias solo cuando la relación esté respaldada por las fuentes.

## Limitaciones

Enumerar funcionalidades fuera de alcance, diferencias entre SDD y código, resultados no comprobados y cualquier información `No verificada`.

## Clasificación de afirmaciones

- **Hecho verificado**: se observa directamente en código, pruebas o evidencia autorizada.
- **Decisión SDD**: se declara en la constitución, especificación, plan, modelo o contrato, pero no necesariamente está implementada.
- **No verificada**: no existe respaldo suficiente; debe omitirse o marcarse explícitamente.

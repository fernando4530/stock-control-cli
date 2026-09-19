---
name: documentar-codigo
description: Procedimiento verificable para generar documentación técnica en español a partir del código y de artefactos SDD autorizados.
---

# Skill: documentar-codigo

## Objetivo

Producir `docs/documentacion-tecnica.md` usando únicamente las entradas autorizadas por el agente Documentador de Código. La documentación debe reflejar el estado verificable del proyecto y separar hechos, decisiones SDD y limitaciones.

## Entradas autorizadas

- `.specify/memory/constitution.md`
- `specs/001-stock-management/spec.md`
- `specs/001-stock-management/plan.md`
- `specs/001-stock-management/data-model.md`
- `specs/001-stock-management/contracts/cli-contract.md`
- `package.json`
- `src/`
- `tests/`
- `docs/evidencias/`

## Procedimiento verificable

### 1. Inspeccionar entradas

1. Confirmar que cada archivo autorizado que se vaya a citar existe y leerlo completo.
2. Recorrer `src/` y `tests/` para identificar módulos, exportaciones, casos de uso, validaciones, persistencia y pruebas realmente presentes.
3. Revisar `docs/evidencias/` solo para describir ejecuciones o resultados que estén documentados allí.
4. Registrar para cada afirmación la ruta de la fuente que la respalda.

### 2. Extraer hechos

1. Extraer del código comportamientos implementados, estructuras de datos, flujos, errores y comandos definidos.
2. Extraer de las pruebas los escenarios que están cubiertos, sin convertir la existencia de una prueba en un resultado exitoso si ese resultado no está documentado o verificado.
3. Extraer de `package.json` los scripts y dependencias declarados.
4. Clasificar cada dato como `Hecho verificado`, `Decisión SDD` o `Limitación`.

### 3. Contrastar SDD con código

1. Comparar especificación, plan, modelo de datos y contrato CLI con el comportamiento encontrado en `src/` y `tests/`.
2. Identificar coincidencias, diferencias y elementos previstos que no estén implementados.
3. No resolver una diferencia inventando comportamiento: describirla como limitación o inconsistencia no verificada.
4. Mantener la trazabilidad entre requisitos SDD, módulos, pruebas y evidencias cuando la relación pueda demostrarse.

### 4. Completar la plantilla

1. Usar `.github/resources/documentador-codigo/plantilla-documentacion.md` como estructura obligatoria.
2. Completar todos sus apartados: propósito, alcance, arquitectura, estructura, modelo de datos, funcionalidades, persistencia, validaciones y errores, pruebas, compilación y empaquetado, ejecución, trazabilidad y limitaciones.
3. Redactar en español, conservando únicamente nombres técnicos, rutas, comandos y símbolos necesarios.
4. Incluir referencias a fuentes autorizadas cuando una afirmación dependa de ellas.

### 5. Revisión final contra invenciones

Antes de guardar `docs/documentacion-tecnica.md`:

- Comprobar que cada afirmación técnica importante tiene respaldo en código, prueba, evidencia o SDD, y que su categoría está clara.
- Eliminar funcionalidades, comandos, dependencias, resultados y evidencias no encontrados.
- Marcar como `No verificada` o eliminar toda afirmación que no pueda respaldarse.
- Verificar que no se atribuyan resultados de ejecución a pruebas o comandos que no estén documentados.
- Confirmar que no se modificaron código, pruebas, especificaciones ni evidencias.
- Confirmar que no quedan instrucciones de plantilla, marcadores de trabajo ni decisiones abiertas en la salida final.

## Resultado

Guardar únicamente la documentación técnica prevista en `docs/documentacion-tecnica.md`. La skill no genera evidencia de ejecución ni sustituye la revisión humana posterior.

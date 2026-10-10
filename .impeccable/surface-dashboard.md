# Surface brief — Panel de invitados (dashboard)

Scope: `/` (guest dashboard v1, Operate). Audience: wedding planner (day-to-day), couple reviews.
Job: ver de un vistazo totales + quién necesita seguimiento; encontrar y contactar a cualquier invitado en segundos.
Proof/content: lista sintética de ~24 invitados (marcada como demostración), con nombre, lado/grupo, teléfono, email, estado RSVP, acompañantes, notas y aviso de seguimiento.
Constraints: Next.js + Tailwind v4, español, claro a plena luz (tema claro), sin datos reales todavía, mesas/comedor quedan fuera de v1.

## Direction contract

THESIS: Un patio que cuenta: cada invitado es un azulejo que suma a un total verificable y a una próxima acción. Rehúsa el admin genérico gris-con-un-acento y sus tarjetas métricas intercambiables; aquí el estado se sella y el número de mesa/lado es monumental.

OWN-WORLD: Cal de patio (#F6F3EB) con junta de mortero, cobalto vidriado comprometido (#1446B8 / #0F2E7A) para rail y sellos, tinta para texto, y estados con trabajo real (ámbar pendiente, oliva confirmado, terracota contenida solo en declinado). Grotesca de trabajo (Archivo, capitales espaciadas para mesas), cifras tabulares, densidad de mosaico: baldosas de estado como únicas puertas, bordes de azulejo, sin cristal ni degradados.

STORY: La planner entiende en segundos cuántos van, cuántos faltan y a quién llamar hoy; cree que los números cuadran con la lista; filtra, busca, abre el detalle, cambia un RSVP o marca seguimiento sin perder el hilo.

FIRST VIEWPORT: Rail izquierdo cobalto (marca, nav Invitados/Seguimiento, medidor de asistencia, tarjeta planner). Banda superior fija: buscador, filtros por lado y sellos de estado con conteos split-flap, palabras-guía primero…último. Fila de 4 baldosas de conteo con numeral monumental y barra de acompañantes. Tabla ordenable (Invitado, Contacto, Lado/Grupo, Estado, Acompañantes, Acción) con sello-azulejo por fila; clic abre panel lateral (no modal) con contacto, edición RSVP, notas y seguimiento.

FORM: Candidata 7 de mi lista de 7 (patio andaluz de azulejo), seed key b6fafbea, modo operate. Lista completa en historial: 1 papelería letterpress, 2 mesa-plan en caballete, 3 minuta/programa, 4 taller floral, 5 atelier de costura, 6 tarjeta RSVP con sello, 7 patio de azulejo (asignada).

FINISH: unreviewed and undocumented is unfinished; this build ends with the finish review, the verdict, DESIGN.md, and every shipping raster carrying its provenance

## Raises (de la mano batida, una línea cada una)

- Peso de carga heredado de exposure-record: la carga pendiente se lee como densidad del sello + delta numérico; el conflicto (tel duplicado / choque de acompañantes) cruza el patrón, nunca solo color.
- Puertas-baldosa heredado de metro: los sellos de estado son las únicas puertas; sin cromo extra, pulsar hunde, seleccionar inunda.
- Monumental + split-flap heredado de terminal-yellow: números de mesa/conteo monumentales, totales con tick split-flap, banda de filtros fija.
- Barras de comitiva heredado de labanotation: los acompañantes son barras de longitud exacta con cifra tabular.

## Verdicts

- exposure-record: declined (taller oscuro, no planner; hatching daña lectura). Se queda su disciplina de peso.
- jet-age-ticket-wallet: competitive (sello validado/anulado clava RSVP). Alterna completa.
- lexicon-shoulder-and-plate: competitive (palabras-guía + índice A-Z resuelven “encontrar en segundos”). Alterna completa.
- metro-tiles: declined (lenguaje de interfaz, negro nocturno erróneo a plena luz). Se queda su disciplina puerta-baldosa.
- terminal-yellow: declined (amarillo total ahoga la tabla densa). Se queda monumental + banda fija.
- labanotation: declined (partitura vertical oscurece la tabla). Se queda longitud = duración para comitiva.

Nota de herramientas: `impeccable surface-brief read/write` y `serve-question` no existen en este launcher (solo detect); el contrato vive aquí y el bloqueo se hizo con la herramienta de preguntas estructuradas. Sin generación de imagen disponible: build code-led, sin comps, la ambición vive en FIRST VIEWPORT.

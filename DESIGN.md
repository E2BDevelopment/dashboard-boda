---
name: Panel de invitados · Boda
description: Tablero operativo para la wedding planner — contactos, RSVP y seguimiento.
colors:
  brand-bg: "#FDFBF7"
  brand-soft: "#F2EDE4"
  brand-border: "#E5E0D5"
  brand-text: "#4A453E"
  brand-muted: "#5A5349"
  brand-dark: "#4A453E"
  brand-deep: "#3A352F"
  brand-tint: "#EFE7D8"
  brand-accent: "#C4B7A6"
  sand-bg: "#F5EBD3"
  sand-ink: "#7F6436"
  sage-bg: "#EDF0E2"
  sage-ink: "#5F7052"
  clay-bg: "#F7E4E4"
  clay-ink: "#9E4F4F"
typography:
  display:
    fontFamily: "Archivo, Segoe UI, system-ui, sans-serif"
    fontSize: "2.25rem"
    fontWeight: 800
    lineHeight: 1.1
    letterSpacing: "-0.02em"
  headline:
    fontFamily: "Archivo, Segoe UI, system-ui, sans-serif"
    fontSize: "1.25rem"
    fontWeight: 800
    lineHeight: 1.2
    letterSpacing: "-0.02em"
  body:
    fontFamily: "Archivo, Segoe UI, system-ui, sans-serif"
    fontSize: "0.9375rem"
    fontWeight: 400
    lineHeight: 1.5
  label:
    fontFamily: "Archivo, Segoe UI, system-ui, sans-serif"
    fontSize: "0.8125rem"
    fontWeight: 700
    letterSpacing: "0.12em"
rounded:
  sm: "6px"
  md: "8px"
  pill: "999px"
spacing:
  sm: "8px"
  md: "16px"
  lg: "32px"
components:
  button-primary:
    backgroundColor: "{colors.brand-dark}"
    textColor: "#FFFFFF"
    rounded: "{rounded.sm}"
    padding: "10px 16px"
  button-primary-hover:
    backgroundColor: "{colors.brand-deep}"
    textColor: "#FFFFFF"
  button-ghost:
    backgroundColor: "#FFFFFF"
    textColor: "{colors.brand-text}"
    rounded: "{rounded.sm}"
    padding: "10px 12px"
  chip-filter-active:
    backgroundColor: "{colors.brand-dark}"
    textColor: "#FFFFFF"
    rounded: "{rounded.sm}"
    padding: "8px 12px"
  chip-filter-idle:
    backgroundColor: "#FFFFFF"
    textColor: "{colors.brand-text}"
    rounded: "{rounded.sm}"
    padding: "8px 12px"
  input-field:
    backgroundColor: "#FFFFFF"
    textColor: "{colors.brand-text}"
    rounded: "{rounded.sm}"
    padding: "10px 12px"
---

# Design System: Panel de invitados · Boda

## Overview

**Creative North Star: "El papel que cuenta"**

Papel cálido a plena luz, borde arena y topo profundo que compromete
el rail y los sellos — la misma familia Natural Tones de la web de la
boda. La pantalla es ante todo una herramienta de trabajo —rail fijo,
banda de filtros persistente, tabla densa ordenable— y el mundo entra
solo por tipo, paleta, densidad y un gesto firma: el mosaico de sellos
donde cada invitado suma a un total verificable.

La escena de uso impone el tema claro: la planner consulta a plena luz, en
oficina y en el venue. Sin neones nocturnos, sin cristal, sin degradados.
**Key Characteristics:**
- Mosaico de estados: la baldosa-sello es la única puerta.
- Numerales monumentales con tick split-flap en los conteos.
- Columnas densas, aire generoso entre bloques, más aire encima del título que debajo.

## Colors

Papel cálido con topo comprometido, heredado de la web de la boda; los
estados hacen trabajo real y el declinado queda contenido en pequeño.

### Primary
- **Topo profundo** (#4A453E): rail activo, botones primarios, sellos de invitado, enlaces, foco y barras de comitiva.
- **Topo fondo** (#3A352F): rail lateral, baldosa destacada de personas confirmadas, avisos de estado.

### Secondary
- **Texto** (#4A453E): texto principal sobre papel (contraste ~9:1).
- **Texto suave** (#5A5349): texto secundario teñido del propio topo, nunca gris neutro.

### Tertiary
- **Arena pendiente** (fondo #F5EBD3, tinta #7F6436): pendientes y avisos de llamada.
- **Salvia confirmado** (fondo #EDF0E2, tinta #5F7052): confirmados.
- **Arcilla declinado** (fondo #F7E4E4, tinta #9E4F4F): declinados y conflictos, en pequeño. (Tintas oscurecidas respecto a websiteV3 para ≥4.5:1.)

### Neutral
- **Papel** (#FDFBF7): fondo de la pantalla, trama de puntos topo al 6%.
- **Papel suave** (#F2EDE4): filas alternas, pistas de scroll, fondos de apoyo.
- **Borde arena** (#E5E0D5): bordes de baldosas, divisores de tabla, junta del mosaico.
- **Acento** (#C4B7A6): detalles secundarios dentro de la misma familia.

### Named Rules
**The Committed Topo Rule.** El topo ocupa rail, sellos y selección (~30–40% de la pantalla). Una pantalla gris con un acento no es contención, es el defecto de la categoría.
**The State Does Work Rule.** Ningún estado vive solo del color: cada uno lleva sello-letra (S/P/M/C), etiqueta y, en conflicto, patrón cruzado.

## Typography

**Display Font:** Archivo, ExtraBold (con Segoe UI / system-ui de reserva)
**Body Font:** Archivo, Regular/Medium (misma pila)
**Label/Mono Font:** Sin mono disfrazado; cifras siempre tabulares (`font-variant-numeric: tabular-nums`).

**Character:** Grotesca de trabajo, capitales espaciadas para mesas y lados, numerales monumentales para conteos. Nada de serif editorial de portada.

### Hierarchy
- **Display** (800, 2.25rem/1.1, -0.02em): numerales de las baldosas de conteo.
- **Headline** (800, 1.25rem/1.2, -0.02em): títulos de sección ("Situación", "Invitados").
- **Title** (700, 0.9375rem/1.4): nombres de invitado, títulos de ficha.
- **Body** (400–500, 0.9375rem/1.5): contactos, notas, pies. Medida contenida en paneles estrechos.
- **Label** (700, 0.75–0.8125rem, +0.10–0.18em, mayúsculas): lados, cabeceras de tabla, etiquetas de campo.

### Named Rules
**The Tabular Counts Rule.** Todo número que suma (conteos, comitiva, personas) es tabular y, al cambiar, hace tick split-flap de 420ms. Un conteo que salta sin moverse no existe.

## Layout

Rail fijo de 272px en topo fondo (marca, secciones, medidor de asistencia,
tarjeta de planner) que colapsa a cabecera simple en móvil. Columna principal
con banda de filtros fija arriba (buscador, lado, seguimiento, sellos de
estado con conteos, palabras-guía, acciones), fila de 4 baldosas de resumen y
tabla ordenable con desplazamiento horizontal en estrecho. Ritmo: grupos
compactos (8–12px), separación generosa entre bloques (32–40px), siempre más
aire encima del titular que debajo. Contenedor con `px-4 / lg:px-8`.

## Elevation & Depth

Sombras bajas con desplazamiento y desenfoque suave; nada de halos de color
sin desplazamiento ni bloques duros sin blur fuera de un mundo neobrutalista
(este no lo es).

### Shadow Vocabulary
- **Baldosa en reposo** (`box-shadow: 0 1px 0 rgb(26 35 50 / 0.07), 0 16px 34px -22px rgb(15 46 122 / 0.35)`): tarjetas de resumen, banda de filtros, tabla.

### Named Rules
**The Resting Tile Rule.** La profundidad es una sola: la baldosa reposa con su sombra ambiente. Sin elevaciones escalonadas ni brillos hover.

## Shapes

Rectángulos de radio contenido (6px campos y botones, 8px baldosas, píldora
solo en contadores y llamadas), borde de 1px en arena como junta del
mosaico y sello interior con `outline-offset: -5px`. Nada de máscaras
geométricas, nada de recortes orgánicos fingidos.

## Components

### Buttons
- **Shape:** radio contenido (6px).
- **Primary:** fondo topo, texto blanco, padding 10–12px / 12–16px.
- **Hover / Focus:** fondo topo-fondo; foco siempre con anillo de 3px en topo + 2px de desplazamiento.
- **Secondary / Ghost:** fondo blanco, borde 1px arena, texto principal; hover en papel suave. Peligro (eliminar) en arcilla sobre blanco.

### Chips
- **Style:** filtros de estado con conteo en píldora; activo en topo con texto blanco, inactivo en blanco con borde arena.
- **State:** `aria-pressed` manda; el conteo hace tick al cambiar.

### Cards / Containers
- **Corner Style:** 8px.
- **Background:** blanco sobre papel; la destacada va en topo-fondo con texto blanco.
- **Shadow Strategy:** la sombra de baldosa en reposo.
- **Border:** 1px arena.
- **Internal Padding:** 12–16px.

### Inputs / Fields
- **Style:** fondo blanco, borde 1px arena, radio 6px, texto 15px.
- **Focus:** anillo topo del sistema (nunca solo cambio de borde).
- **Error / Disabled:** error nombrado en aviso (`role="status"`); steppers con `disabled:opacity-40`.

### Navigation
- Rail en topo-fondo con botones semibold; activo en blanco con texto topo-fondo, inactivo en blanco con hover blanco/10. "Mesas" figura como quieto y deshabilitado. En móvil, cabecera simple.

### Sello
Letra S/P/M/C en pastilla 36–48px con filete interior, fondo y tinta del estado. Es la firma del sistema y la única puerta de estado: pulsar hunde 1px, seleccionar inunda.

## Do's and Don'ts

### Do:
- **Do** mantener totales reconciliados a la vista (`X confirmados · Y por responder · Z declinados = N registros`).
- **Do** teñir el texto secundario desde el topo (#5A5349), con contraste ≥4.5:1.
- **Do** abrir la ficha en panel lateral no modal con `tel:` / `mailto:` reales.
- **Do** marcar el duplicado de teléfono con patrón cruzado + aviso, nunca solo con color.

### Don't:
- **Don't** kicker o ante-título sobre un titular; el titular habla solo.
- **Don't** modal para una ficha que no interrumpe ni protege foco.
- **Don't** texto en degradado, cristal esmerilado decorativo, ni borde lateral grueso de colores.
- **Don't** mono disfrazado de "técnico", ni emoji o glifos como iconos: SVG de trazo único 1.8px.

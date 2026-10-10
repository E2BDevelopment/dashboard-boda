# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Stack

Next.js (user chose custom answer "Use Next.js" over static / React+Vite options)

## Users

Primary: wedding planner managing day-to-day guest logistics ahead of the wedding. Job: keep contact details correct, track RSVP progress, and see at a glance who needs follow-up.

Secondary / involved: couple (provides guest list, may review progress but does not operate the dashboard daily).

## Product Purpose

A guest dashboard that visualizes wedding-guest information so the planner can manage contact details and tracking without spreadsheets. Success means: full list is scannable, RSVP status is instantly clear, and any guest can be found/contacted in seconds.

## Positioning

A single-wedding operational board, not a generic CRM: built around invited → pending → confirmed / declined plus-ones logic and planner follow-up.

## Operating Context

Pre-wedding planning workflow. Planner works on desktop, may check on mobile at venue/meetings. Source of truth is the guest list; dashboard is where tracking happens.

## Capabilities and Constraints

Confirmed:
- Familias desde Hoja 1: ID_FAMILIA, NOMBRE, NUM_INVITADOS (cupo), IS_FAMILIY, LINK PROD (?id=)
- Integrantes desde INTEGRANTES_FAMILIA: ID (ref familia), NOMBRE, ASISTENCIA (TRUE=asiste), RESPONSABLE (teléfono)
- LOG desde LOG_INVITADOS: ID_EVENTO, FAMILIA, EVENTO, HORA, FECHA, agrupado por responsable
- Alimentación por Google Apps Script (Web App JSON {familias, integrantes, log}); en local muestra transcrita

Explicitly undecided:
- Table assignment / seating, dietary needs, VIP flags (not selected, leave room for later)
- Real guest data import (CSV/Excel format not confirmed) vs. synthetic sample data for v1
- Editing flow: inline edit vs. detail drawer (surface decision, not product truth)

Constraints:
- Next.js codebase, runs as web app
- No real guest data on hand yet — must not present synthetic names as real

## Evidence on Hand

No real guest list, brand assets, or copy provided. No PRODUCT-adjacent docs in empty repo. Future work must author clearly-labeled synthetic sample guests for demonstration.

## Product Principles

1. Tracking first: status and next action outrank decoration.
2. Reachable in seconds: search, filter, contact — no dead ends.
3. Truthful counts: totals and RSVP numbers always reconcile with the list.
4. Planner-grade clarity: dense but calm, no ambiguous states.
5. Growable: RSVP today, tables/needs tomorrow without remodel.

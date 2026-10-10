import type { Familia, Integrante, LogEvento } from "@/data/boda";

type Fila = unknown[];

function celda(fila: Fila, i: number): string {
  const v = fila[i];
  if (v === null || v === undefined) return "";
  return String(v).trim();
}

function esVerdadero(v: string): boolean {
  return /^(true|1|si|sí|x|verdadero)$/i.test(v.trim());
}

function sinCabecera(filas: Fila[]): Fila[] {
  if (filas.length === 0) return [];
  return filas.slice(1);
}

/** Hoja 1: ID_FAMILIA, NOMBRE, NUM_INVITADOS, IS_FAMILIY, LINK PROD */
export function filasAFamilias(filas: Fila[]): Familia[] {
  const out: Familia[] = [];
  for (const fila of sinCabecera(filas)) {
    const id_familia = celda(fila, 0);
    const nombre = celda(fila, 1);
    if (!id_familia) continue;
    out.push({
      id_familia,
      nombre,
      num_invitados: Number(celda(fila, 2).replace(",", ".")) || 0,
      is_family: esVerdadero(celda(fila, 3)),
      link: celda(fila, 4),
    });
  }
  return out;
}

/** INTEGRANTES_FAMILIA: ID, NOMBRE, ASISTENCIA, RESPONSABLE.
 *  Conserva filas con NOMBRE aunque el ID esté vacío (pendientes de asignar). */
export function filasAIntegrantes(filas: Fila[]): Integrante[] {
  const out: Integrante[] = [];
  for (const fila of sinCabecera(filas)) {
    const id = celda(fila, 0);
    const nombre = celda(fila, 1);
    if (!nombre) continue;
    out.push({
      id,
      nombre,
      asistencia: esVerdadero(celda(fila, 2)),
      responsable: celda(fila, 3),
    });
  }
  return out;
}

/** LOG_INVITADOS real: ID_EVENTO, ID_FAMILIA, FAMILIA, EVENTO, HORA, FECHA.
 *  Acepta también el layout antiguo de 5 columnas (sin ID_FAMILIA). */
export function filasALog(filas: Fila[]): LogEvento[] {
  const cabecera = (filas[0] ?? []).map((c) => String(c ?? "").trim().toUpperCase());
  const conId = cabecera.includes("ID_FAMILIA") || (filas[1] ?? []).length >= 6;
  const out: LogEvento[] = [];
  for (const fila of sinCabecera(filas)) {
    const id_evento = celda(fila, 0);
    if (!id_evento) continue;
    if (conId) {
      out.push({
        id_evento,
        id_familia: celda(fila, 1),
        familia: celda(fila, 2),
        evento: celda(fila, 3),
        hora: celda(fila, 4),
        fecha: celda(fila, 5),
      });
    } else {
      out.push({
        id_evento,
        familia: celda(fila, 1),
        evento: celda(fila, 2),
        hora: celda(fila, 3),
        fecha: celda(fila, 4),
      });
    }
  }
  return out;
}

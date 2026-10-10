import type { BdResponse, Familia, Integrante, LogEvento } from "@/data/boda";

/** La auto-carga al abrir solo sustituye el estado si el Sheet trae familias. */
export function debeSustituirConBd(bd: BdResponse): boolean {
  return Array.isArray(bd.familias) && bd.familias.length > 0;
}

export interface BdLocal {
  familias: Familia[];
  integrantes: Integrante[];
  logs: LogEvento[];
}

/** Texto para el banner de error de carga. */
export function mensajeDeCarga(e: unknown): string {
  return e instanceof Error ? e.message : "No se pudo cargar del backend.";
}

/** Lee la caché de localStorage. Solo cliente: en servidor devuelve null. */
export function loadLocalBd(clave: string): BdLocal | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(clave);
    if (!raw) return null;
    const p = JSON.parse(raw) as Partial<BdLocal>;
    if (Array.isArray(p.familias) && Array.isArray(p.integrantes)) {
      return {
        familias: p.familias,
        integrantes: p.integrantes,
        logs: Array.isArray(p.logs) ? p.logs : [],
      };
    }
  } catch {
    /* muestra transcrita */
  }
  return null;
}

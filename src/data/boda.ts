/* Esquema real BD_INVITADOS — Hoja1 (familias) + INTEGRANTES_FAMILIA + LOG_INVITADOS.
 * La app la alimentas tú por Google Apps Script (JSON). Abajo hay una muestra
 * transcrita de tus capturas para trabajar en local; al conectar el script se
 * sustituye por los datos reales.
 */

export interface Familia {
  id_familia: string;
  nombre: string;
  num_invitados: number; // cupo (columna NUM_INVITADOS)
  is_family: boolean; // columna IS_FAMILIY
  link: string; // LINK PROD (?id=...)
}

export interface Integrante {
  id: string; // ID de familia al que pertenece
  nombre: string;
  asistencia: boolean; // TRUE = asistirá
  responsable: string; // teléfono del responsable
}

export interface LogEvento {
  id_evento: string;
  id_familia?: string; // Columna ID_FAMILIA (orden: ID_EVENTO, ID_FAMILIA, FAMILIA, EVENTO, HORA, FECHA)
  familia: string; // nombre de familia
  evento: string;
  hora: string;
  fecha: string;
}

export type EstadoFamilia =
  | "sin_registro"
  | "pendiente"
  | "parcial"
  | "completa";

export const ESTADO_FAMILIA_META: Record<
  EstadoFamilia,
  { etiqueta: string; sello: string; fondo: string; tinta: string; borde: string }
> = {
  sin_registro: {
    etiqueta: "Sin registro",
    sello: "S",
    fondo: "var(--color-brand-tint)",
    tinta: "var(--color-brand-deep)",
    borde: "rgb(74 69 62 / 0.35)",
  },
  pendiente: {
    etiqueta: "Pendiente",
    sello: "P",
    fondo: "var(--color-sand-bg)",
    tinta: "var(--color-sand-ink)",
    borde: "rgb(127 100 54 / 0.35)",
  },
  parcial: {
    etiqueta: "Parcial",
    sello: "M",
    fondo: "var(--color-sand-bg)",
    tinta: "var(--color-sand-ink)",
    borde: "rgb(127 100 54 / 0.35)",
  },
  completa: {
    etiqueta: "Completa",
    sello: "C",
    fondo: "var(--color-sage-bg)",
    tinta: "var(--color-sage-ink)",
    borde: "rgb(95 112 82 / 0.35)",
  },
};

const APP = "https://boda-naty-enrique.vercel.app/?id=";

/* Muestra transcrita de Hoja 1 (IDs y nombres reales de tus capturas,
 * números tal cual se ven; donde la foto corta el cupo se pone 2). */
export const SAMPLE_FAMILIAS: Familia[] = [
  { id_familia: "d9e806837b230addd933a9f41c7b64e5dd9e65b7d51cff3e137d017be2aca596", nombre: "Puente Carreon", num_invitados: 3, is_family: true, link: `${APP}d9e806837b230addd933a9f41c7b64e5dd9e65b7d51cff3e137d017be2aca596` },
  { id_familia: "b8f7ab173521de744d0d49487cdea06df5f2c84cc01f95234c2040a987f65602", nombre: "Carreon Duarte", num_invitados: 3, is_family: true, link: `${APP}b8f7ab173521de744d0d49487cdea06df5f2c84cc01f95234c2040a987f65602` },
  { id_familia: "ecd4088a66d7e5ff0c1d9a85a224766543e9a4d1b9ce45ad4aaf18627fc8e04c", nombre: "carrion contreras", num_invitados: 5, is_family: true, link: `${APP}ecd4088a66d7e5ff0c1d9a85a224766543e9a4d1b9ce45ad4aaf18627fc8e04c` },
  { id_familia: "9be9a14cd0e97f283a5aa2987df3fdcc085de9918f55a8ec6093ae8a97b4379a", nombre: "navarro salazar", num_invitados: 5, is_family: true, link: `${APP}9be9a14cd0e97f283a5aa2987df3fdcc085de9918f55a8ec6093ae8a97b4379a` },
  { id_familia: "3d9485854a17a3ee129b4e6f6562b11756e1be1f351b4ba1a67a0d8929b6fc", nombre: "carreon olivaes", num_invitados: 6, is_family: true, link: `${APP}3d9485854a17a3ee129b4e6f6562b11756e1be1f351b4ba1a67a0d8929b6fc` },
  { id_familia: "d8191407c1eaaadef094cf9a9776170346d2eaf9d1f16405589b2d046e6ac0", nombre: "perez carreon", num_invitados: 4, is_family: true, link: `${APP}d8191407c1eaaadef094cf9a9776170346d2eaf9d1f16405589b2d046e6ac0` },
  { id_familia: "702b01bcd40dcc2dcde5d2c8f8f51d908e69dee06ec94f34f724b6cc6497af00", nombre: "perez ramirez", num_invitados: 2, is_family: true, link: `${APP}702b01bcd40dcc2dcde5d2c8f8f51d908e69dee06ec94f34f724b6cc6497af00` },
  { id_familia: "11b6bbd94db64b6aefa2f6b30e99c950c17084a9bb3716d748a3d9405cd9ae05b", nombre: "salazar velazquez", num_invitados: 4, is_family: true, link: `${APP}11b6bbd94db64b6aefa2f6b30e99c950c17084a9bb3716d748a3d9405cd9ae05b` },
  { id_familia: "bd9dfa7767e4166b32a7c4bf42d9d8c8f981c73abf3f52c8e7456d5f51b036", nombre: "puente huerta", num_invitados: 4, is_family: true, link: `${APP}bd9dfa7767e4166b32a7c4bf42d9d8c8f981c73abf3f52c8e7456d5f51b036` },
  { id_familia: "4e4861c1178b08aa8c2f1dad2dd2d8af1f11b5d5b9a191fc72db9c37f60fce204", nombre: "puente viramontes", num_invitados: 5, is_family: true, link: `${APP}4e4861c1178b08aa8c2f1dad2dd2d8af1f11b5d5b9a191fc72db9c37f60fce204` },
  { id_familia: "f1614c38bba1e52360bb82217ed9045fc6509b47c8f9bd02fe77fd55d875cff7", nombre: "puente lira", num_invitados: 3, is_family: true, link: `${APP}f1614c38bba1e52360bb82217ed9045fc6509b47c8f9bd02fe77fd55d875cff7` },
  { id_familia: "57d57ff3cd7d53fc6477b36a88c66cfa0b0272e61229730a1148d407a0d0dd2b", nombre: "huerta macias", num_invitados: 7, is_family: true, link: `${APP}57d57ff3cd7d53fc6477b36a88c66cfa0b0272e61229730a1148d407a0d0dd2b` },
  { id_familia: "171679f7edbe73e4214759b3529eddcc827863203c3aa2bf0745f7693a06e2a5", nombre: "carreon viramontes", num_invitados: 2, is_family: true, link: `${APP}171679f7edbe73e4214759b3529eddcc827863203c3aa2bf0745f7693a06e2a5` },
  { id_familia: "d4bf9e9c3f4fa34164096dfc14532756cb382d7467999d72135e06f5706f043", nombre: "alexandro carreon", num_invitados: 1, is_family: false, link: `${APP}d4bf9e9c3f4fa34164096dfc14532756cb382d7467999d72135e06f5706f043` },
  { id_familia: "31b67bd1c2fa189f52496d0b9e6355d83d680c66aeb8332feba641c209433e98", nombre: "mirna carreon viramontes", num_invitados: 2, is_family: false, link: `${APP}31b67bd1c2fa189f52496d0b9e6355d83d680c66aeb8332feba641c209433e98` },
  { id_familia: "4ab30694bab434c125a01b475ae8134d5a9b65162575904c13badb819109025a", nombre: "carreon herrera", num_invitados: 2, is_family: true, link: `${APP}4ab30694bab434c125a01b475ae8134d5a9b65162575904c13badb819109025a` },
  { id_familia: "951d49ed780a8feca19003933772fb6829a09883bef12ff6ad2d6926c3a34722", nombre: "coronado herrera", num_invitados: 2, is_family: true, link: `${APP}951d49ed780a8feca19003933772fb6829a09883bef12ff6ad2d6926c3a34722` },
  { id_familia: "76024ee20bd61845b32628a17c4edf0371a82e8484216184cec38a1c669cca41", nombre: "Ramos Cansino", num_invitados: 2, is_family: true, link: `${APP}76024ee20bd61845b32628a17c4edf0371a82e8484216184cec38a1c669cca41` },
];

/* Muestra transcrita de INTEGRANTES_FAMILIA. RESPONSABLE viene vacío en tu
 * hoja; se deja "" y el dashboard lo pide al editar. */
export const SAMPLE_INTEGRANTES: Integrante[] = [
  { id: "323369d3902976c385c9888f55e3bc9faba14738f981cdd9541e71b615f926df", nombre: "Carmen Leyva", asistencia: true, responsable: "" },
  { id: "323369d3902976c385c9888f55e3bc9faba14738f981cdd9541e71b615f926df", nombre: "Enrique López", asistencia: true, responsable: "" },
  { id: "323369d3902976c385c9888f55e3bc9faba14738f981cdd9541e71b615f926df", nombre: "Fernando López", asistencia: false, responsable: "" },
  { id: "6a96b39fdf016da99eb0aa9946e072eb021db9c966caf6e873ef70ba940b5", nombre: "Selina Arriaga", asistencia: false, responsable: "" },
  { id: "834965bcca766c338a4cc9634cbc37bbd179ad6cc74b51996169ed9f29805d", nombre: "Rosa Leyva", asistencia: false, responsable: "" },
  { id: "834965bcca766c338a4cc9634cbc37bbd179ad6cc74b51996169ed9f29805d", nombre: "David Gonzalez", asistencia: false, responsable: "" },
  { id: "73207728fff9684ef11bbf00cf1d059d64fde1c0542aa336bd47d1e5f77b939", nombre: "Hector Gonzalez", asistencia: false, responsable: "" },
  { id: "73207728fff9684ef11bbf00cf1d059d64fde1c0542aa336bd47d1e5f77b939", nombre: "Paola Rodriguez", asistencia: false, responsable: "" },
  { id: "73207728fff9684ef11bbf00cf1d059d64fde1c0542aa336bd47d1e5f77b939", nombre: "Natalie Gonzalez", asistencia: false, responsable: "" },
  { id: "4ad7e9aa6385e3638197db5c315ad042a3e5fdf0929dd6caf45dc12ead248c20", nombre: "Elizabeth Gonzalez Leyva", asistencia: false, responsable: "" },
  { id: "4ad7e9aa6385e3638197db5c315ad042a3e5fdf0929dd6caf45dc12ead248c20", nombre: "Martin Maya", asistencia: false, responsable: "" },
  { id: "4ad7e9aa6385e3638197db5c315ad042a3e5fdf0929dd6caf45dc12ead248c20", nombre: "Hector Maya", asistencia: false, responsable: "" },
  { id: "4ad7e9aa6385e3638197db5c315ad042a3e5fdf0929dd6caf45dc12ead248c20", nombre: "Camila Maya", asistencia: false, responsable: "" },
  { id: "93741dbb5b9951a3ad43c2153c5bb2f8674401736b04e5974d451efb9456bb74", nombre: "Luis Gerardo Leyva", asistencia: false, responsable: "" },
  { id: "0508c4fb78cd79f8d6f9dad81b29b1b7311d09e6d0aa0110ecc6490682f37b1a", nombre: "Estela Lezama", asistencia: false, responsable: "" },
  { id: "946c7640c827b9a975d436863ee1ca79e896a5a63582e74fa33b10f8f19f9e5", nombre: "José Lopez", asistencia: true, responsable: "+34 600 100 101" },
  { id: "946c7640c827b9a975d436863ee1ca79e896a5a63582e74fa33b10f8f19f9e5", nombre: "Efrén López", asistencia: false, responsable: "+34 600 100 101" },
  { id: "946c7640c827b9a975d436863ee1ca79e896a5a63582e74fa33b10f8f19f9e5", nombre: "Ximena López", asistencia: true, responsable: "+34 600 100 101" },
  { id: "946c7640c827b9a975d436863ee1ca79e896a5a63582e74fa33b10f8f19f9e5", nombre: "Mamá", asistencia: true, responsable: "+34 600 100 101" },
  { id: "946c7640c827b9a975d436863ee1ca79e896a5a63582e74fa33b10f8f19f9e5", nombre: "Papá", asistencia: false, responsable: "+34 600 100 101" },
  { id: "d9e806837b230addd933a9f41c7b64e5dd9e65b7d51cff3e137d017be2aca596", nombre: "Naty (responsable Puente Carreon)", asistencia: true, responsable: "+34 612 340 118" },
  { id: "d9e806837b230addd933a9f41c7b64e5dd9e65b7d51cff3e137d017be2aca596", nombre: "Enrique (responsable Puente Carreon)", asistencia: true, responsable: "+34 612 340 118" },
  { id: "b8f7ab173521de744d0d49487cdea06df5f2c84cc01f95234c2040a987f65602", nombre: "Fam. Carreon Duarte 1", asistencia: true, responsable: "+34 655 201 884" },
  { id: "b8f7ab173521de744d0d49487cdea06df5f2c84cc01f95234c2040a987f65602", nombre: "Fam. Carreon Duarte 2", asistencia: false, responsable: "+34 655 201 884" },
];

/* Muestra de LOG_INVITADOS con tu orden: ID_EVENTO, ID_FAMILIA, FAMILIA, EVENTO, HORA, FECHA. */
export const SAMPLE_LOG: LogEvento[] = [
  { id_evento: "log-001", id_familia: "d9e806837b230addd933a9f41c7b64e5dd9e65b7d51cff3e137d017be2aca596", familia: "Puente Carreon", evento: "Confirmó asistencia (2 personas)", hora: "10:24", fecha: "2026-09-18" },
  { id_evento: "log-002", id_familia: "b8f7ab173521de744d0d49487cdea06df5f2c84cc01f95234c2040a987f65602", familia: "Carreon Duarte", evento: "Abrió invitación", hora: "11:02", fecha: "2026-09-19" },
  { id_evento: "log-003", id_familia: "946c7640c827b9a975d436863ee1ca79e896a5a63582e74fa33b10f8f19f9e5", familia: "José Lopez y fam.", evento: "Actualizó responsable +34 600 100 101", hora: "12:40", fecha: "2026-09-20" },
  { id_evento: "log-004", id_familia: "d9e806837b230addd933a9f41c7b64e5dd9e65b7d51cff3e137d017be2aca596", familia: "Puente Carreon", evento: "Actualizó responsable +34 612 340 118", hora: "09:15", fecha: "2026-09-21" },
  { id_evento: "log-005", id_familia: "76024ee20bd61845b32628a17c4edf0371a82e8484216184cec38a1c669cca41", familia: "Ramos Cansino", evento: "Confirmó asistencia (1 persona)", hora: "18:33", fecha: "2026-09-22" },
  { id_evento: "log-006", id_familia: "57d57ff3cd7d53fc6477b36a88c66cfa0b0272e61229730a1148d407a0d0dd2b", familia: "huerta macias", evento: "Abrió invitación", hora: "20:05", fecha: "2026-09-23" },
  { id_evento: "log-007", id_familia: "951d49ed780a8feca19003933772fb6829a09883bef12ff6ad2d6926c3a34722", familia: "coronado herrera", evento: "Confirmó asistencia (2 personas)", hora: "08:52", fecha: "2026-09-24" },
  { id_evento: "log-008", id_familia: "d8191407c1eaaadef094cf9a9776170346d2eaf9d1f16405589b2d046e6ac0", familia: "perez carreon", evento: "Pendiente de respuesta", hora: "14:11", fecha: "2026-09-25" },
];

/* Derivados */

export function integrantesDe(integrantes: Integrante[], idFamilia: string): Integrante[] {
  return integrantes.filter((i) => i.id === idFamilia);
}

export function asistenDe(integrantes: Integrante[], idFamilia: string): number {
  return integrantes.filter((i) => i.id === idFamilia && i.asistencia).length;
}

export function responsablesDe(integrantes: Integrante[], idFamilia: string): string[] {
  const set = new Set<string>();
  for (const i of integrantes) {
    if (i.id === idFamilia && i.responsable.trim()) set.add(i.responsable.trim());
  }
  return [...set];
}

export function estadoFamilia(
  familia: Familia,
  integrantes: Integrante[],
): EstadoFamilia {
  const lista = integrantesDe(integrantes, familia.id_familia);
  if (lista.length === 0) return "sin_registro";
  const ok = lista.filter((i) => i.asistencia).length;
  if (ok === 0) return "pendiente";
  if (ok >= familia.num_invitados || ok >= lista.length) return "completa";
  return "parcial";
}

/** LOG por responsable: usa ID_FAMILIA cuando existe; si no, cruza por nombre. */
export function responsableDeLog(
  log: LogEvento,
  familias: Familia[],
  integrantes: Integrante[],
): string[] {
  if (log.id_familia?.trim()) {
    const directos = responsablesDe(integrantes, log.id_familia.trim());
    if (directos.length > 0) return directos;
    // Aunque haya ID, si no hay responsables se sigue al fallback por nombre.
  }
  const fam = familias.find(
    (f) => f.nombre.toLowerCase() === log.familia.toLowerCase(),
  );
  const porNombre = fam ? responsablesDe(integrantes, fam.id_familia) : [];
  if (porNombre.length > 0) return porNombre;
  // Sin match exacto: busca por coincidencia parcial del nombre
  const todas = familias.filter((f) =>
    log.familia.toLowerCase().includes(f.nombre.toLowerCase().split(" ")[0]),
  );
  const set = new Set<string>();
  for (const t of todas)
    for (const r of responsablesDe(integrantes, t.id_familia)) set.add(r);
  return [...set];
}

export function toCsvFamilias(familias: Familia[]): string {
  const head = "ID_FAMILIA;NOMBRE;NUM_INVITADOS;IS_FAMILIY;LINK PROD";
  return [head, ...familias.map((f) => [f.id_familia, f.nombre, String(f.num_invitados), f.is_family ? "TRUE" : "FALSE", f.link].join(";"))].join("\n");
}

export function toCsvLog(logs: LogEvento[]): string {
  const head = "ID_EVENTO;ID_FAMILIA;FAMILIA;EVENTO;HORA;FECHA";
  return [head, ...logs.map((l) => [l.id_evento, l.id_familia ?? "", l.familia, l.evento, l.hora, l.fecha].join(";"))].join("\n");
}

/** Mensaje de invitación para copiar desde la ficha de familia, con el link personalizado al final. */
export function mensajeInvitacion(link: string): string {
  return [
    "¡Nos casamos! 🥹💍❤️",
    "Estamos muy felices de compartir contigo esta etapa tan bonita de nuestras vidas. Queremos celebrar nuestro amor rodeados de personas especiales, y nos encantaría que tú fueras parte de este día. 🤍✨",
    "Te compartimos nuestra invitación con muchísimo cariño. 💌",
    "Por favor, ayúdanos confirmando tu asistencia antes del 6 de noviembre para poder organizarnos y preparar todo con mucho amor.",
    "¡Esperamos verte y compartir contigo nuestra felicidad! 💒",
    "Natalia & Enrique ♡",
    link.trim(),
  ].join("\n\n");
}

/**
 * Copia texto al portapapeles de forma robusta:
 * 1) intenta navigator.clipboard.writeText (requiere contexto seguro),
 * 2) fallback con textarea + execCommand para http / Safari / permisos denegados.
 * Devuelve true si copió, false si no pudo. Nunca lanza.
 */
export async function copiarTexto(texto: string): Promise<boolean> {
  try {
    const nav = globalThis.navigator as Navigator | undefined;
    if (nav?.clipboard?.writeText) {
      await nav.clipboard.writeText(texto);
      return true;
    }
  } catch {
    /* sigue al fallback */
  }
  try {
    const doc = globalThis.document as Document | undefined;
    if (!doc) return false;
    const ta = doc.createElement("textarea");
    ta.value = texto;
    ta.setAttribute("readonly", "");
    ta.style.position = "fixed";
    ta.style.top = "0";
    ta.style.opacity = "0";
    doc.body.appendChild(ta);
    ta.focus();
    ta.select();
    ta.setSelectionRange(0, ta.value.length);
    const ok = doc.execCommand("copy");
    doc.body.removeChild(ta);
    return ok;
  } catch {
    return false;
  }
}

/** Formato esperado del JSON de tu Google Apps Script (Web App). */
export interface BdResponse {
  familias: Familia[];
  integrantes: Integrante[];
  log: LogEvento[];
}

export async function fetchBd(url: string): Promise<BdResponse> {
  const res = await fetch(url, { cache: "no-store" });
  if (!res.ok) throw new Error(`Apps Script respondió ${res.status}`);
  const data = (await res.json()) as Partial<BdResponse>;
  return {
    familias: Array.isArray(data.familias) ? data.familias : [],
    integrantes: Array.isArray(data.integrantes) ? data.integrantes : [],
    log: Array.isArray(data.log) ? data.log : [],
  };
}

/** Lee del backend interno (/api/bd) con el service account de Google. */
export async function fetchBdInterno(): Promise<BdResponse> {
  const res = await fetch("/api/bd", { cache: "no-store" });
  if (!res.ok) {
    let detalle = "";
    try {
      const j = (await res.json()) as { error?: string };
      if (j.error) detalle = `: ${j.error}`;
    } catch {
      /* cuerpo no JSON */
    }
    throw new Error(`Backend respondió ${res.status}${detalle}`);
  }
  const data = (await res.json()) as Partial<BdResponse>;
  return {
    familias: Array.isArray(data.familias) ? data.familias : [],
    integrantes: Array.isArray(data.integrantes) ? data.integrantes : [],
    log: Array.isArray(data.log) ? data.log : [],
  };
}

async function postBd(payload: unknown): Promise<void> {
  const res = await fetch("/api/bd", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    let detalle = "";
    try {
      const j = (await res.json()) as { error?: string };
      if (j.error) detalle = `: ${j.error}`;
    } catch {
      /* cuerpo no JSON */
    }
    throw new Error(`No se pudo guardar en el Sheet (${res.status}${detalle})`);
  }
}

export function guardarAsistenciaRemota(
  idFamilia: string,
  nombre: string,
  asistencia: boolean,
  familiaNombre: string,
): Promise<void> {
  return postBd({
    action: "asistencia",
    idFamilia,
    nombre,
    asistencia,
    familiaNombre,
    evento: `Cambió asistencia de ${nombre} a ${asistencia ? "TRUE" : "FALSE"}`,
  });
}

export function guardarResponsableRemoto(
  idFamilia: string,
  nombre: string,
  responsable: string,
  familiaNombre: string,
): Promise<void> {
  return postBd({
    action: "responsable",
    idFamilia,
    nombre,
    responsable,
    familiaNombre,
    evento: `Asignó responsable ${responsable.trim()} a ${nombre}`,
  });
}

export function uid(prefix: string): string {
  return `${prefix}-${Date.now().toString(36)}-${Math.floor(Math.random() * 9999)}`;
}

export function hoyPartes(): { hora: string; fecha: string } {
  const d = new Date();
  const hora = `${String(d.getHours()).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")}`;
  const fecha = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
  return { hora, fecha };
}

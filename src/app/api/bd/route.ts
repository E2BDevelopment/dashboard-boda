import { getSheetsClient, getSheetsConfig, rango } from "@/lib/google-sheets";
import { filasAFamilias, filasAIntegrantes, filasALog } from "@/lib/sheets";

function mensajeError(e: unknown): string {
  if (e instanceof Error) return e.message;
  return "Error desconocido del backend.";
}

function partesHoy(): { hora: string; fecha: string } {
  const d = new Date();
  const hora = `${String(d.getHours()).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")}`;
  const fecha = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
  return { hora, fecha };
}

export async function GET() {
  try {
    const cfg = getSheetsConfig();
    const sheets = await getSheetsClient();
    const res = await sheets.spreadsheets.values.batchGet({
      spreadsheetId: cfg.spreadsheetId,
      ranges: [
        rango(cfg.hojaFamilias, "A:E"),
        rango(cfg.hojaIntegrantes, "A:D"),
        rango(cfg.hojaLog, "A:F"),
      ],
    });
    const [fam, integ, log] = res.data.valueRanges ?? [];
    return Response.json({
      familias: filasAFamilias((fam?.values as unknown[][] | undefined) ?? []),
      integrantes: filasAIntegrantes((integ?.values as unknown[][] | undefined) ?? []),
      log: filasALog((log?.values as unknown[][] | undefined) ?? []),
    });
  } catch (e) {
    return Response.json({ error: mensajeError(e) }, { status: 500 });
  }
}

type Accion =
  | { action: "asistencia"; idFamilia: string; nombre: string; asistencia: boolean; familiaNombre?: string; evento?: string }
  | { action: "responsable"; idFamilia: string; nombre: string; responsable: string; familiaNombre?: string; evento?: string }
  | { action: "nuevo-integrante"; idFamilia: string; nombre: string; responsable: string; familiaNombre?: string; evento?: string };

async function filaDeIntegrante(
  sheets: Awaited<ReturnType<typeof getSheetsClient>>,
  cfg: ReturnType<typeof getSheetsConfig>,
  idFamilia: string,
  nombre: string,
): Promise<{ indice: number; valores: unknown[][] }> {
  const res = await sheets.spreadsheets.values.get({
    spreadsheetId: cfg.spreadsheetId,
    range: rango(cfg.hojaIntegrantes, "A:D"),
  });
  const valores = (res.data.values as unknown[][] | undefined) ?? [];
  const indice = valores.findIndex(
    (f, i) => i > 0 && String(f[0] ?? "").trim() === idFamilia && String(f[1] ?? "").trim() === nombre,
  );
  if (indice < 0) throw new Error(`Integrante no encontrado en el Sheet: ${nombre}`);
  return { indice: indice + 1, valores };
}

async function anexarLog(
  sheets: Awaited<ReturnType<typeof getSheetsClient>>,
  cfg: ReturnType<typeof getSheetsConfig>,
  idFamilia: string,
  familia: string,
  evento: string,
) {
  const { hora, fecha } = partesHoy();
  const id_evento = `log-${Date.now().toString(36)}-${Math.floor(Math.random() * 9999)}`;
  await sheets.spreadsheets.values.append({
    spreadsheetId: cfg.spreadsheetId,
    range: rango(cfg.hojaLog, "A:F"),
    valueInputOption: "USER_ENTERED",
    requestBody: { values: [[id_evento, idFamilia, familia, evento, hora, fecha]] },
  });
}

export async function POST(req: Request) {
  try {
    const cfg = getSheetsConfig();
    const body = (await req.json()) as Partial<Accion>;
    if (!body.action) return Response.json({ error: "Falta action." }, { status: 400 });

    const sheets = await getSheetsClient();

    if (body.action === "nuevo-integrante") {
      const { idFamilia, nombre, responsable } = body as { idFamilia?: string; nombre?: string; responsable?: string };
      if (!idFamilia || !nombre?.trim()) return Response.json({ error: "idFamilia y nombre son obligatorios." }, { status: 400 });
      await sheets.spreadsheets.values.append({
        spreadsheetId: cfg.spreadsheetId,
        range: rango(cfg.hojaIntegrantes, "A:D"),
        valueInputOption: "USER_ENTERED",
        requestBody: { values: [[idFamilia, nombre.trim(), "FALSE", (responsable ?? "").trim()]] },
      });
      const fam = (body as Accion & { familiaNombre?: string }).familiaNombre ?? idFamilia;
      const evento = (body as Accion & { evento?: string }).evento ?? `Añadió a ${nombre.trim()}`;
      await anexarLog(sheets, cfg, idFamilia, fam, evento);
      return Response.json({ ok: true });
    }

    if (body.action === "asistencia") {
      const { idFamilia, nombre, asistencia } = body as { idFamilia?: string; nombre?: string; asistencia?: boolean };
      if (!idFamilia || !nombre || typeof asistencia !== "boolean") {
        return Response.json({ error: "idFamilia, nombre y asistencia son obligatorios." }, { status: 400 });
      }
      const { indice } = await filaDeIntegrante(sheets, cfg, idFamilia, nombre);
      await sheets.spreadsheets.values.update({
        spreadsheetId: cfg.spreadsheetId,
        range: rango(cfg.hojaIntegrantes, `C${indice}`),
        valueInputOption: "USER_ENTERED",
        requestBody: { values: [[asistencia ? "TRUE" : "FALSE"]] },
      });
      const fam = (body as Accion & { familiaNombre?: string }).familiaNombre ?? idFamilia;
      const evento = (body as Accion & { evento?: string }).evento ?? `Cambió asistencia de ${nombre} a ${asistencia ? "TRUE" : "FALSE"}`;
      await anexarLog(sheets, cfg, idFamilia, fam, evento);
      return Response.json({ ok: true });
    }

    if (body.action === "responsable") {
      const { idFamilia, nombre, responsable } = body as { idFamilia?: string; nombre?: string; responsable?: string };
      if (!idFamilia || !nombre || responsable === undefined) {
        return Response.json({ error: "idFamilia, nombre y responsable son obligatorios." }, { status: 400 });
      }
      const { indice } = await filaDeIntegrante(sheets, cfg, idFamilia, nombre);
      await sheets.spreadsheets.values.update({
        spreadsheetId: cfg.spreadsheetId,
        range: rango(cfg.hojaIntegrantes, `D${indice}`),
        valueInputOption: "USER_ENTERED",
        requestBody: { values: [[responsable.trim()]] },
      });
      const fam = (body as Accion & { familiaNombre?: string }).familiaNombre ?? idFamilia;
      const evento = (body as Accion & { evento?: string }).evento ?? `Asignó responsable ${responsable.trim()} a ${nombre}`;
      await anexarLog(sheets, cfg, idFamilia, fam, evento);
      return Response.json({ ok: true });
    }

    return Response.json({ error: `Acción no soportada: ${body.action}` }, { status: 400 });
  } catch (e) {
    return Response.json({ error: mensajeError(e) }, { status: 500 });
  }
}

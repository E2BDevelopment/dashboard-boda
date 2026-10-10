import { google } from "googleapis";

export interface SheetsConfig {
  spreadsheetId: string;
  keyFile: string;
  hojaFamilias: string;
  hojaIntegrantes: string;
  hojaLog: string;
}

export function getSheetsConfig(): SheetsConfig {
  const spreadsheetId = process.env.SPREADSHEET_ID?.trim();
  if (!spreadsheetId) throw new Error("Falta SPREADSHEET_ID en el entorno.");
  const keyFileRel = process.env.GOOGLE_SERVICE_ACCOUNT_PATH?.trim() ?? "./service-account.json";
  // Relativa al cwd del servidor (raíz del proyecto en dev y en despliegue).
  // Se evita path.join(process.cwd(), …) para no ensanchar el tracing de Turbopack.
  const keyFile = keyFileRel;
  return {
    spreadsheetId,
    keyFile,
    hojaFamilias: process.env.SHEET_FAMILIAS?.trim() || "Hoja 1",
    hojaIntegrantes: process.env.SHEET_INTEGRANTES?.trim() || "INTEGRANTES_FAMILIA",
    hojaLog: process.env.SHEET_LOG?.trim() || "LOG_INVITADOS",
  };
}

export async function getSheetsClient() {
  const { keyFile } = getSheetsConfig();
  const auth = new google.auth.GoogleAuth({
    keyFile,
    scopes: ["https://www.googleapis.com/auth/spreadsheets"],
  });
  return google.sheets({ version: "v4", auth });
}

/** Envuelve el nombre de pestaña en comillas simples para notación A1. */
export function rango(hoja: string, cols: string): string {
  const nombre = hoja.replace(/'/g, "''");
  return `'${nombre}'!${cols}`;
}

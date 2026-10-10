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

  // En Vercel / serverless no hay archivo service.json (está en .gitignore).
  // Se acepta el JSON completo vía env var GOOGLE_SERVICE_ACCOUNT_JSON o BASE64.
  const jsonInline = process.env.GOOGLE_SERVICE_ACCOUNT_JSON?.trim();
  if (jsonInline) {
    const credentials = JSON.parse(jsonInline);
    // Vercel suele pegar la private_key con \n escapados; normalizar por si acaso.
    if (typeof credentials.private_key === "string") {
      credentials.private_key = credentials.private_key.replace(/\\n/g, "\n");
    }
    const auth = new google.auth.GoogleAuth({
      credentials,
      scopes: ["https://www.googleapis.com/auth/spreadsheets"],
    });
    return google.sheets({ version: "v4", auth });
  }

  const b64 = process.env.GOOGLE_SERVICE_ACCOUNT_BASE64?.trim();
  if (b64) {
    const credentials = JSON.parse(Buffer.from(b64, "base64").toString("utf-8"));
    if (typeof credentials.private_key === "string") {
      credentials.private_key = credentials.private_key.replace(/\\n/g, "\n");
    }
    const auth = new google.auth.GoogleAuth({
      credentials,
      scopes: ["https://www.googleapis.com/auth/spreadsheets"],
    });
    return google.sheets({ version: "v4", auth });
  }

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

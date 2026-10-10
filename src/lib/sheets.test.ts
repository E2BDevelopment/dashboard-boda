import { describe, it, expect } from "vitest";
import {
  filasAFamilias,
  filasAIntegrantes,
  filasALog,
} from "./sheets";

describe("filasAFamilias: rompe si cambia el mapeo de columnas Hoja 1", () => {
  it("mapea ID_FAMILIA, NOMBRE, NUM_INVITADOS, IS_FAMILIY, LINK a Familia", () => {
    const filas = [
      ["ID_FAMILIA", "NOMBRE", "NUM_INVITADOS", "IS_FAMILIY", "LINK PROD"],
      ["abc123", "Puente Carreon", "3", "TRUE", "https://boda-naty-enrique.vercel.app/?id=abc123"],
      ["def456", "alexandro carreon", "1", "FALSE", "https://boda-naty-enrique.vercel.app/?id=def456"],
    ];
    expect(filasAFamilias(filas)).toEqual([
      {
        id_familia: "abc123",
        nombre: "Puente Carreon",
        num_invitados: 3,
        is_family: true,
        link: "https://boda-naty-enrique.vercel.app/?id=abc123",
      },
      {
        id_familia: "def456",
        nombre: "alexandro carreon",
        num_invitados: 1,
        is_family: false,
        link: "https://boda-naty-enrique.vercel.app/?id=def456",
      },
    ]);
  });

  it("ignora filas vacías o sin ID", () => {
    const filas = [
      ["ID_FAMILIA", "NOMBRE", "NUM_INVITADOS", "IS_FAMILIY", "LINK PROD"],
      ["", "", "", "", ""],
      ["ghi789", "Ramos Cansino", "2", "TRUE", "https://x/?id=ghi789"],
    ];
    const res = filasAFamilias(filas);
    expect(res).toHaveLength(1);
    expect(res[0].id_familia).toBe("ghi789");
  });
});

describe("filasAIntegrantes: rompe si ASISTENCIA no se interpreta como booleano", () => {
  it("TRUE/true/1/SI asisten, resto no", () => {
    const filas = [
      ["ID", "NOMBRE", "ASISTENCIA", "RESPONSABLE"],
      ["abc123", "Naty", "TRUE", "+34 612 340 118"],
      ["abc123", "Quique", "true", "+34 612 340 118"],
      ["def456", "Selina Arriaga", "FALSE", ""],
      ["def456", "Otro", "", ""],
    ];
    expect(filasAIntegrantes(filas)).toEqual([
      { id: "abc123", nombre: "Naty", asistencia: true, responsable: "+34 612 340 118" },
      { id: "abc123", nombre: "Quique", asistencia: true, responsable: "+34 612 340 118" },
      { id: "def456", nombre: "Selina Arriaga", asistencia: false, responsable: "" },
      { id: "def456", nombre: "Otro", asistencia: false, responsable: "" },
    ]);
  });

  it("conserva integrantes sin ID de familia (pendientes de asignar) con id vacío", () => {
    const filas = [
      ["ID", "NOMBRE", "ASISTENCIA", "RESPONSABLE"],
      ["", "Victor Huerta Sánchez", "FALSE", ""],
      ["abc123", "", "FALSE", ""],
    ];
    expect(filasAIntegrantes(filas)).toEqual([
      { id: "", nombre: "Victor Huerta Sánchez", asistencia: false, responsable: "" },
    ]);
  });
});

describe("filasALog: rompe si cambia el orden ID_EVENTO,FAMILIA,EVENTO,HORA,FECHA", () => {
  it("mapea las 5 columnas en orden", () => {
    const filas = [
      ["ID_EVENTO", "FAMILIA", "EVENTO", "HORA", "FECHA"],
      ["log-001", "Puente Carreon", "Confirmó asistencia (2 personas)", "10:24", "2026-09-18"],
    ];
    expect(filasALog(filas)).toEqual([
      {
        id_evento: "log-001",
        familia: "Puente Carreon",
        evento: "Confirmó asistencia (2 personas)",
        hora: "10:24",
        fecha: "2026-09-18",
      },
    ]);
  });

  it("mapea el layout real de 6 columnas ID_EVENTO,ID_FAMILIA,FAMILIA,EVENTO,HORA,FECHA", () => {
    const filas = [
      ["ID_EVENTO", "ID_FAMILIA", "FAMILIA", "EVENTO", "HORA ", "FECHA"],
      ["a04a845c-3335", "d9e806837b230add", "LOPEZ LEYVA", "Confirmar asistencia", "13:09:02", "2026-10-01"],
    ];
    expect(filasALog(filas)).toEqual([
      {
        id_evento: "a04a845c-3335",
        id_familia: "d9e806837b230add",
        familia: "LOPEZ LEYVA",
        evento: "Confirmar asistencia",
        hora: "13:09:02",
        fecha: "2026-10-01",
      },
    ]);
  });
});

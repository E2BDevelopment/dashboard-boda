import { describe, it, expect, vi, afterEach } from "vitest";
import { mensajeInvitacion, copiarTexto } from "./boda";

afterEach(() => {
  vi.unstubAllGlobals();
});

describe("mensajeInvitacion: plantilla para copiar en la ficha de familia", () => {
  it("incluye el texto de la invitación y el link personalizado al final", () => {
    const link = "https://boda-naty-enrique.vercel.app/?id=abc123";
    const msg = mensajeInvitacion(link);

    expect(msg).toContain("¡Nos casamos!");
    expect(msg).toContain("Natalia & Enrique");
    expect(msg).toContain("antes del 6 de noviembre");
    expect(msg).toContain(link);
    expect(msg).not.toContain("[LINK PERSONALIZADO]");
  });
});

describe("copiarTexto: copiado robusto con fallback", () => {
  it("usa navigator.clipboard cuando está disponible", async () => {
    const writeText = vi.fn().mockResolvedValue(undefined);
    vi.stubGlobal("navigator", { clipboard: { writeText } });
    await expect(copiarTexto("hola")).resolves.toBe(true);
    expect(writeText).toHaveBeenCalledWith("hola");
  });

  it("hace fallback cuando clipboard falla y devuelve false sin document", async () => {
    const writeText = vi.fn().mockRejectedValue(new Error("denied"));
    vi.stubGlobal("navigator", { clipboard: { writeText } });
    // En entorno node sin document no puede hacer fallback -> false, pero no lanza.
    await expect(copiarTexto("hola")).resolves.toBe(false);
  });
});

import { describe, it, expect } from "vitest";
import { debeSustituirConBd, loadLocalBd, mensajeDeCarga } from "./bd-init";

describe("debeSustituirConBd: la auto-carga solo sustituye si el Sheet trae familias", () => {
  it("true cuando hay familias", () => {
    expect(
      debeSustituirConBd({ familias: [{ id_familia: "a" } as never], integrantes: [], log: [] }),
    ).toBe(true);
  });

  it("false cuando no hay familias", () => {
    expect(debeSustituirConBd({ familias: [], integrantes: [], log: [] })).toBe(false);
  });
});

describe("loadLocalBd: seguro en servidor (sin window devuelve null)", () => {
  it("null cuando no hay window (SSR)", () => {
    expect(loadLocalBd("cualquier-clave")).toBeNull();
  });
});

describe("mensajeDeCarga: texto del banner de error", () => {
  it("usa el mensaje del Error", () => {
    expect(mensajeDeCarga(new Error("Backend respondió 500"))).toBe("Backend respondió 500");
  });

  it("texto genérico si no es Error", () => {
    expect(mensajeDeCarga("raro")).toBe("No se pudo cargar del backend.");
  });
});

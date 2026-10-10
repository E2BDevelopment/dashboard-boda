export type Rsvp = "invitado" | "pendiente" | "confirmado" | "declinado";

export type Lado = "Novia" | "Novio" | "Común";

export interface Guest {
  id: string;
  nombre: string;
  lado: Lado;
  grupo: string;
  telefono: string;
  email: string;
  estado: Rsvp;
  acompanantes: number; // personas extra además del invitado
  seguimiento: boolean;
  notas: string;
}

export const RSVP_META: Record<
  Rsvp,
  { etiqueta: string; sello: string; fondo: string; tinta: string; borde: string }
> = {
  invitado: {
    etiqueta: "Invitado",
    sello: "I",
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
  confirmado: {
    etiqueta: "Confirmado",
    sello: "C",
    fondo: "var(--color-sage-bg)",
    tinta: "var(--color-sage-ink)",
    borde: "rgb(95 112 82 / 0.35)",
  },
  declinado: {
    etiqueta: "Declinado",
    sello: "D",
    fondo: "var(--color-clay-bg)",
    tinta: "var(--color-clay-ink)",
    borde: "rgb(158 79 79 / 0.3)",
  },
};

/** Datos sintéticos de demostración — reemplazar por la lista real. */
export const SAMPLE_GUESTS: Guest[] = [
  { id: "g01", nombre: "Adriana Soler", lado: "Novia", grupo: "Familia", telefono: "+34 612 340 118", email: "adriana.soler@ejemplo.es", estado: "confirmado", acompanantes: 1, seguimiento: false, notas: "Viene con su pareja. Sin alergias." },
  { id: "g02", nombre: "Marcos Vidal", lado: "Novio", grupo: "Amigos", telefono: "+34 655 201 884", email: "marcos.vidal@ejemplo.es", estado: "pendiente", acompanantes: 0, seguimiento: true, notas: "Llamar el lunes; no abrió la invitación." },
  { id: "g03", nombre: "Carmen Ruiz", lado: "Novia", grupo: "Familia", telefono: "+34 609 883 412", email: "carmen.ruiz@ejemplo.es", estado: "confirmado", acompanantes: 2, seguimiento: false, notas: "Mesa con los primos. Trona para la pequeña." },
  { id: "g04", nombre: "Javier Mora", lado: "Novio", grupo: "Compañeros", telefono: "+34 677 450 209", email: "javier.mora@ejemplo.es", estado: "invitado", acompanantes: 1, seguimiento: false, notas: "" },
  { id: "g05", nombre: "Lucía Ferrer", lado: "Común", grupo: "Amigos", telefono: "+34 640 112 765", email: "lucia.ferrer@ejemplo.es", estado: "confirmado", acompanantes: 0, seguimiento: false, notas: "Vegetariana." },
  { id: "g06", nombre: "Pablo Iglesias", lado: "Novio", grupo: "Familia", telefono: "+34 618 990 331", email: "pablo.iglesias@ejemplo.es", estado: "pendiente", acompanantes: 1, seguimiento: true, notas: "Duda por turno de trabajo." },
  { id: "g07", nombre: "Elena Navarro", lado: "Novia", grupo: "Amigos", telefono: "+34 622 478 903", email: "elena.navarro@ejemplo.es", estado: "confirmado", acompanantes: 0, seguimiento: false, notas: "" },
  { id: "g08", nombre: "Diego Serrano", lado: "Novio", grupo: "Amigos", telefono: "+34 633 219 540", email: "diego.serrano@ejemplo.es", estado: "declinado", acompanantes: 0, seguimiento: false, notas: "Fuera del país esa semana." },
  { id: "g09", nombre: "Marta Cobo", lado: "Novia", grupo: "Compañeros", telefono: "+34 600 774 128", email: "marta.cobo@ejemplo.es", estado: "pendiente", acompanantes: 0, seguimiento: true, notas: "Reenviar invitación al correo nuevo." },
  { id: "g10", nombre: "Andrés Gil", lado: "Novio", grupo: "Familia", telefono: "+34 644 902 317", email: "andres.gil@ejemplo.es", estado: "confirmado", acompanantes: 3, seguimiento: false, notas: "Vienen los cuatro. Cuna disponible." },
  { id: "g11", nombre: "Sofía Marín", lado: "Común", grupo: "Amigos", telefono: "+34 611 556 789", email: "sofia.marin@ejemplo.es", estado: "invitado", acompanantes: 1, seguimiento: false, notas: "" },
  { id: "g12", nombre: "Hugo Beltrán", lado: "Novio", grupo: "Amigos", telefono: "+34 666 231 908", email: "hugo.beltran@ejemplo.es", estado: "confirmado", acompanantes: 1, seguimiento: false, notas: "Alergia a frutos secos." },
  { id: "g13", nombre: "Irene Campos", lado: "Novia", grupo: "Familia", telefono: "+34 697 345 210", email: "irene.campos@ejemplo.es", estado: "pendiente", acompanantes: 2, seguimiento: true, notas: "Confirmar número final de niños." },
  { id: "g14", nombre: "Raúl Díaz", lado: "Novio", grupo: "Compañeros", telefono: "+34 620 881 455", email: "raul.diaz@ejemplo.es", estado: "invitado", acompanantes: 0, seguimiento: false, notas: "" },
  { id: "g15", nombre: "Nadia Haddad", lado: "Común", grupo: "Amigos", telefono: "+34 604 119 372", email: "nadia.haddad@ejemplo.es", estado: "confirmado", acompanantes: 0, seguimiento: false, notas: "Menú halal." },
  { id: "g16", nombre: "Tomás Orts", lado: "Novia", grupo: "Familia", telefono: "+34 658 772 901", email: "tomas.orts@ejemplo.es", estado: "declinado", acompanantes: 0, seguimiento: false, notas: "Envía regalo." },
  { id: "g17", nombre: "Clara Puig", lado: "Novia", grupo: "Amigos", telefono: "+34 631 408 556", email: "clara.puig@ejemplo.es", estado: "pendiente", acompanantes: 1, seguimiento: true, notas: "De viaje; responde el viernes." },
  { id: "g18", nombre: "Iván Robles", lado: "Novio", grupo: "Amigos", telefono: "+34 689 203 774", email: "ivan.robles@ejemplo.es", estado: "confirmado", acompanantes: 0, seguimiento: false, notas: "" },
  { id: "g19", nombre: "Aina Vives", lado: "Común", grupo: "Familia", telefono: "+34 615 667 230", email: "aina.vives@ejemplo.es", estado: "invitado", acompanantes: 2, seguimiento: false, notas: "" },
  { id: "g20", nombre: "Joel Costa", lado: "Novio", grupo: "Compañeros", telefono: "+34 642 990 118", email: "joel.costa@ejemplo.es", estado: "pendiente", acompanantes: 0, seguimiento: true, notas: "Teléfono duplicado con g21: verificar." },
  { id: "g21", nombre: "Laia Costa", lado: "Novio", grupo: "Compañeros", telefono: "+34 642 990 118", email: "laia.costa@ejemplo.es", estado: "pendiente", acompanantes: 0, seguimiento: true, notas: "Mismo teléfono que g20: posible duplicado." },
  { id: "g22", nombre: "Quim Sala", lado: "Novia", grupo: "Amigos", telefono: "+34 603 551 889", email: "quim.sala@ejemplo.es", estado: "confirmado", acompanantes: 1, seguimiento: false, notas: "Llega al cóctel, no a la ceremonia." },
  { id: "g23", nombre: "Nora Elizalde", lado: "Común", grupo: "Familia", telefono: "+34 676 334 902", email: "nora.elizalde@ejemplo.es", estado: "invitado", acompanantes: 0, seguimiento: false, notas: "" },
  { id: "g24", nombre: "Pol Martí", lado: "Novio", grupo: "Amigos", telefono: "+34 699 127 445", email: "pol.marti@ejemplo.es", estado: "confirmado", acompanantes: 0, seguimiento: false, notas: "Fotógrafo aficionado: no interfiere." },
];

export function personasDe(g: Guest): number {
  return g.estado === "declinado" ? 0 : 1 + g.acompanantes;
}

export function toCsv(guests: Guest[]): string {
  const head = "nombre;lado;grupo;telefono;email;estado;acompanantes;seguimiento;notas";
  const rows = guests.map((g) =>
    [g.nombre, g.lado, g.grupo, g.telefono, g.email, g.estado, String(g.acompanantes), g.seguimiento ? "sí" : "no", g.notas.replace(/;/g, ",")].join(";"),
  );
  return [head, ...rows].join("\n");
}

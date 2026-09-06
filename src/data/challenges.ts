export interface Challenge {
  id: string
  name: string
  thresholdMs: number
}

export const challenges: Challenge[] = [
  { id: "torre-cubos", name: "Torre de cubos", thresholdMs: 60_000 },
  { id: "clasificar-formas", name: "Clasificar formas", thresholdMs: 45_000 },
  { id: "enhebrar-cuentas", name: "Enhebrar cuentas", thresholdMs: 90_000 },
  { id: "armar-rompecabezas", name: "Armar rompecabezas", thresholdMs: 120_000 },
  { id: "apilar-anillos", name: "Apilar anillos", thresholdMs: 30_000 },
]

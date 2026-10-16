// Kraje z wypraw: nazwa (do opisów i podpowiedzi) + flaga w kształcie kraju.
// Flagi 64×64 WebP w public/icons/flags (oryginały 1024 px w repozytorium RestDayBlamage/BLMZ)
const FLAGS = `${import.meta.env.BASE_URL}icons/flags`;

export const COUNTRIES = {
  PL: { name: "Poland", flag: `${FLAGS}/pl.webp` },
  IT: { name: "Italy", flag: `${FLAGS}/it.webp` },
  VA: { name: "Vatican City", flag: `${FLAGS}/va.webp` },
  SM: { name: "San Marino", flag: `${FLAGS}/sm.webp` },
  CH: { name: "Switzerland", flag: `${FLAGS}/ch.webp` },
  LI: { name: "Liechtenstein", flag: `${FLAGS}/li.webp` },
  DE: { name: "Germany", flag: `${FLAGS}/de.webp` },
  AT: { name: "Austria", flag: `${FLAGS}/at.webp` },
  SI: { name: "Slovenia", flag: `${FLAGS}/si.webp` },
  HR: { name: "Croatia", flag: `${FLAGS}/hr.webp` },
  CZ: { name: "Czechia", flag: `${FLAGS}/cz.webp` },
  SK: { name: "Slovakia", flag: `${FLAGS}/sk.webp` },
  HU: { name: "Hungary", flag: `${FLAGS}/hu.webp` },
};

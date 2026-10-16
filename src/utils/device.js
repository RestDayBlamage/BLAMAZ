// Wąski ekran (telefon) – sprawdzane raz przy starcie strony
export const isMobile = typeof window !== "undefined" && window.matchMedia("(max-width: 767px)").matches;

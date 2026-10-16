// Kolory (monochrom) dla kodu JS (animacje menu, materiały 3D, mapy).
// To lustro zmiennych z src/styles/global.css (:root) – zmieniając kolor, zmień go w obu miejscach.
export const COLORS = {
  ink: "#111111",
  white: "#ffffff",
  grey100: "#d9d9d9",
  muted: "#8c8c8c",
  dark: "#444444", // szarości z polymer.ws
  silver: "#d0d0d0",
  bg: "#f0f0f0",
  accent: "#ff5b1f", // jedyny kolor (signal orange) – tylko tam, gdzie kolor coś znaczy
  // Trasy GPS w szarościach jak rysunek techniczny – od najnowszej (najciemniejszej) do najstarszej;
  // wskazana/wybrana trasa dostaje akcent (TripsMap.jsx)
  routeShades: ["#222222", "#4a4a4a", "#6e6e6e", "#8f8f8f", "#ababab"],
};

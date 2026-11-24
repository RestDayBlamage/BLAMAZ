// Zdjęcia strony w dwóch rozmiarach: 800 px (telefon, karty, miniatury) i pełny (1600–2000 px, duże ekrany / Retina).
// Przeglądarka sama wybiera plik z srcSet według szerokości miejsca (sizes) i gęstości ekranu.
// Wersje -800 wygenerowane z pełnych plików (Pillow, WebP q76). Po podmianie zdjęcia wygeneruj je ponownie.
import trip2026 from "../assets/images/trip-2026.webp";
import trip2026s from "../assets/images/trip-2026-800.webp";
import trip2025 from "../assets/images/trip-2025.webp";
import trip2025s from "../assets/images/trip-2025-800.webp";
import trip2024 from "../assets/images/trip-2024.webp";
import trip2024s from "../assets/images/trip-2024-800.webp";
import trip2023 from "../assets/images/trip-2023.webp";
import trip2023s from "../assets/images/trip-2023-800.webp";
import trip2022 from "../assets/images/trip-2022.webp";
import trip2022s from "../assets/images/trip-2022-800.webp";
import aboutCamp from "../assets/images/about-camp.webp";
import aboutCamps from "../assets/images/about-camp-800.webp";
import aboutMural from "../assets/images/about-mural.webp";
import aboutMurals from "../assets/images/about-mural-800.webp";
import aboutWildfire from "../assets/images/about-wildfire.webp";
import aboutWildfires from "../assets/images/about-wildfire-800.webp";

// { src, srcSet, width, height } – width/height to wymiary pełnego pliku (proporcje dla rezerwacji miejsca)
const photo = (full, small, width, height) => ({
  src: full,
  srcSet: `${small} 800w, ${full} ${width}w`,
  width,
  height,
});

export const PHOTOS = {
  trip2026: photo(trip2026, trip2026s, 1600, 1200),
  trip2025: photo(trip2025, trip2025s, 1600, 1600),
  trip2024: photo(trip2024, trip2024s, 1600, 1600),
  trip2023: photo(trip2023, trip2023s, 1600, 1600),
  trip2022: photo(trip2022, trip2022s, 1600, 1600),
  camp: photo(aboutCamp, aboutCamps, 2000, 1200),
  mural: photo(aboutMural, aboutMurals, 2000, 1200),
  wildfire: photo(aboutWildfire, aboutWildfires, 2000, 1200),
};

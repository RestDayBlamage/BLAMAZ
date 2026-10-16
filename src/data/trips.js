// Wszystkie dane wypraw w jednym miejscu – używane przez mapę tras i galerię wypraw.
// Trasy w szarościach (od najnowszej – najciemniejszej; wskazana na mapie robi się pomarańczowa) + własny wzór linii (dash),
// żeby wyprawy odróżniały się od siebie także bez koloru. Wzory w jednostkach SVG przy grubości linii 2.5.
// photo jest opcjonalne – bez zdjęcia karta w galerii ma szare tło, a hero bierze tylko wyprawy ze zdjęciem.
import { COLORS } from "../styles/tokens";
import photo2026 from "../assets/images/trip-2026.webp";
import photo2025 from "../assets/images/trip-2025.webp";
import photo2024 from "../assets/images/trip-2024.webp";
import photo2023 from "../assets/images/trip-2023.webp";
import photo2022 from "../assets/images/trip-2022.webp";

const [G1, G2, G3, G4, G5] = COLORS.routeShades;
// Trasy GPX w public/data/<rok>/ (uproszczone; surowe pliki ze Stravy w gpx-src/, poza gitem).
// Zdjęcia w src/assets/images (WebP 1600 px; oryginały 2022–2025 w repozytorium RestDayBlamage/BLMZ, 2026 w media-src/).
const GPX = `${import.meta.env.BASE_URL}data`;

const DASH = {
  solid: undefined,
  long: "12 7", // długie kreski
  dots: "0.1 6", // kropki (zaokrąglone końce linii)
  dashDot: "12 6 0.1 6", // kreska-kropka
  short: "5 6", // krótkie kreski
};

export const TRIPS = [
  {
    year: 2026,
    title: "Pogi Team",
    // Cztery dni pętli z kempingu nad jeziorem Bohinj po Triglavskim Parku Narodowym (Vršič, Slap Peričnik, Dražgoše)
    color: G1,
    dash: DASH.solid,
    km: 424,
    days: 4,
    elevation: "5 890 m",
    avgSpeed: "106.0 km/day",
    countries: ["SI"],
    photo: photo2026, // jezioro Jasna (Kranjska Gora), koziorożec
    gpx: `${GPX}/2026/2026full.gpx`,
  },
  {
    year: 2025,
    title: "Labubu Macharelli",
    color: G2,
    dash: DASH.long,
    km: 1307,
    days: 12,
    elevation: "8 110 m",
    avgSpeed: "116.4 km/day",
    countries: ["IT", "VA", "SM"],
    photo: photo2025,
    gpx: `${GPX}/2025/2025full.gpx`,
  },
  {
    year: 2024,
    title: "Italo Disco",
    color: G3,
    dash: DASH.dots,
    km: 1198,
    days: 12,
    elevation: "10 350 m",
    avgSpeed: "108.0 km/day",
    countries: ["CH", "LI", "IT"],
    photo: photo2024,
    gpx: `${GPX}/2024/2024full.gpx`,
  },
  {
    year: 2023,
    title: "Rest Day Blamage",
    color: G4,
    dash: DASH.dashDot,
    km: 1886,
    days: 15,
    elevation: "15 090 m",
    avgSpeed: "129.6 km/day",
    countries: ["CZ", "DE", "AT", "IT", "SI", "HR", "PL"],
    photo: photo2023,
    gpx: `${GPX}/2023/2023full.gpx`,
  },
  {
    year: 2022,
    title: "Schnell wie Niki Lauda",
    color: G5,
    dash: DASH.short,
    km: 1695,
    days: 16,
    elevation: "12 250 m",
    avgSpeed: "110.4 km/day",
    countries: ["PL", "CZ", "AT", "SK", "HU"],
    photo: photo2022,
    gpx: `${GPX}/2022/2022full.gpx`,
  },
];

export const formatKm = (km) => `${km.toLocaleString("en-US").replace(",", " ")} km`;

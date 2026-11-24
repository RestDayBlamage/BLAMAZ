import Panel from "../components/common/Panel";
import { TRIPS, formatKm } from "../data/trips";
import { COUNTRIES } from "../data/countries";
import { hidePreloader } from "../utils/preloader";
import "./HeroSection.css";

// Hero jak na polymer.ws: ekran podzielony na dwa zdjęcia z wypraw (na telefonie jedno pod drugim).
// Najechane zdjęcie rozszerza się kosztem drugiego. Ekran ładowania znika po wczytaniu pierwszego zdjęcia.
// Stała para zdjęć w hero (decyzja właściciela – „ma być zawsze”): po lewej Labubu Macharelli 2025,
// po prawej zdjęcie ekipy z Rest Day Blamage 2023. Na telefonie jedno pod drugim w tej samej kolejności.
const HERO_YEARS = [2025, 2023];
const [first, second] = HERO_YEARS.map((year) => TRIPS.find((t) => t.year === year));

const tagline = (trip) =>
  `${trip.year} · ${trip.countries.length > 3 ? `${trip.countries.length} countries` : trip.countries.map((c) => COUNTRIES[c]?.name ?? c).join(" · ")} · ${formatKm(trip.km)}`;

export default function HeroSection() {
  return (
    <section className="hero" id="home">
      <h1 className="sr-only">BLaMaZ – Bikepacking, Wild Camps &amp; Euro Cycling Trips</h1>
      {[first, second].map((trip, i) => (
        <Panel
          key={trip.year}
          variant="full"
          className="hero__half"
          align={i ? "end" : "start"}
          image={trip.photo}
          alt={`${trip.title} – BLaMaZ trip ${trip.year}`}
          title={trip.title}
          tagline={tagline(trip)}
          href="#trips"
          linkLabel={`See the ${trip.year} trip`}
          sizes="(min-width: 640px) 60vw, 100vw"
          eager
          onImageLoad={i === 0 ? hidePreloader : undefined}
        />
      ))}
    </section>
  );
}

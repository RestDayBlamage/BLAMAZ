import Panel from "../components/common/Panel";
import { TRIPS, formatKm } from "../data/trips";
import { COUNTRIES } from "../data/countries";
import { hidePreloader } from "../utils/preloader";
import "./HeroSection.css";

// Hero jak na polymer.ws: ekran podzielony na dwa zdjęcia z wypraw (na telefonie jedno pod drugim).
// Najechane zdjęcie rozszerza się kosztem drugiego. Ekran ładowania znika po wczytaniu pierwszego zdjęcia.
// Dwie losowe wyprawy ze zdjęciem – inne przy każdym wejściu na stronę (losowanie raz, przy wczytaniu modułu).
const shuffled = TRIPS.filter((t) => t.photo)
  .map((trip) => ({ trip, key: Math.random() }))
  .sort((a, b) => a.key - b.key)
  .map(({ trip }) => trip);
const [first, second] = shuffled;

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
          eager
          onImageLoad={i === 0 ? hidePreloader : undefined}
        />
      ))}
    </section>
  );
}

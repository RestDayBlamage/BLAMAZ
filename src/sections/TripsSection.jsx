import { lazy, useState } from "react";
import LazyMount from "../components/common/LazyMount";
import ArrowButton from "../components/common/ArrowButton";
import TripGallery from "../components/trips/TripGallery";
import { SOCIALS } from "../data/links";
import { TRIPS } from "../data/trips";
import { isMobile } from "../utils/device";

// Leaflet i trasy GPX ładują się dopiero przy przewinięciu w pobliże mapy
const TripsMap = lazy(() => import("../components/maps/TripsMap"));

const komoot = SOCIALS.find((s) => s.id === "komoot");

export default function TripsSection() {
  // Jeden wspólny wybór dla mapy i galerii:
  // - kraj (flaga w galerii) – mapa pokazuje jego kontur i wyróżnia trasy przez niego, galeria filtruje karty
  // - wyprawa (przycisk trasy na mapie, klik w trasę albo w kartę) – mapa kadruje trasę, galeria przewija
  //   się do karty i zaznacza ją akcentem
  const [country, setCountry] = useState(null);
  const [trip, setTrip] = useState(null);

  const changeCountry = (code) => {
    setCountry(code);
    // Wybrana wyprawa nie prowadzi przez nowy kraj – zostałaby ukryta w galerii, więc ją odznaczamy
    const current = TRIPS.find((t) => t.year === trip);
    if (code && current && !current.countries.includes(code)) setTrip(null);
  };

  return (
    <section className="block" id="trips">
      <div className="container">
        {/* Tytuł sekcji jest nałożony na mapę (jak podpisy na kafelkach polymer.ws) */}
        <LazyMount minHeight={isMobile ? 640 : 720}>
          <TripsMap
            country={country}
            selected={trip}
            onSelectedChange={setTrip}
            label="Euro trips"
            title="Five summers, thirteen countries"
          />
        </LazyMount>
      </div>

      <TripGallery country={country} onCountryChange={changeCountry} selected={trip} onSelectedChange={setTrip} />

      {/* Odpowiednik „Shop more Products” z Polymera */}
      <div className="container more-link">
        <span className="h2 more-link__text">More routes on Komoot</span>
        <ArrowButton href={komoot.url} label="BLaMaZ on Komoot" tone="silver" external />
      </div>
    </section>
  );
}

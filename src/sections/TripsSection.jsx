import { lazy, useState } from "react";
import LazyMount from "../components/common/LazyMount";
import ArrowButton from "../components/common/ArrowButton";
import TripGallery from "../components/trips/TripGallery";
import { SOCIALS } from "../data/links";
import { isMobile } from "../utils/device";

// Leaflet i trasy GPX ładują się dopiero przy przewinięciu w pobliże mapy
const TripsMap = lazy(() => import("../components/maps/TripsMap"));

const komoot = SOCIALS.find((s) => s.id === "komoot");

export default function TripsSection() {
  // Kraj wybrany flagą w galerii – mapa pokazuje jego kontur i wyróżnia trasy przez niego
  const [country, setCountry] = useState(null);

  return (
    <section className="block" id="trips">
      <div className="container">
        {/* Tytuł sekcji jest nałożony na mapę (jak podpisy na kafelkach polymer.ws) */}
        <LazyMount minHeight={isMobile ? 640 : 720}>
          <TripsMap country={country} label="Euro trips" title="Five summers, thirteen countries" />
        </LazyMount>
      </div>

      <TripGallery country={country} onCountryChange={setCountry} />

      {/* Odpowiednik „Shop more Products” z Polymera */}
      <div className="container more-link">
        <span className="h2 more-link__text">More routes on Komoot</span>
        <ArrowButton href={komoot.url} label="BLaMaZ on Komoot" tone="silver" external />
      </div>
    </section>
  );
}

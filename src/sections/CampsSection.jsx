import { lazy } from "react";
import Panel from "../components/common/Panel";
import LazyMount from "../components/common/LazyMount";
import camp from "../assets/images/about-camp.webp";
import { isMobile } from "../utils/device";

// Leaflet ładuje się dopiero przy przewinięciu w pobliże mapy
const CampsMap = lazy(() => import("../components/maps/CampsMap"));

// Zdjęcie na cały ekran jako wejście do sekcji, pod nim mapa noclegów
export default function CampsSection() {
  return (
    <>
      <Panel
        id="camps"
        variant="full"
        image={camp}
        alt="Tents and loaded bikes at a wild camp in the hills"
        title="Wild camps"
        tagline="Our overnight spots across Europe"
        href="#camps-map"
        linkLabel="Open the camps map"
      />

      <section className="container block" id="camps-map" aria-label="Map of our overnight spots">
        <LazyMount minHeight={isMobile ? 440 : 560}>
          <CampsMap />
        </LazyMount>
      </section>
    </>
  );
}

import { useEffect, useRef, useState } from "react";
import { TRIPS, formatKm } from "../../data/trips";
import { COUNTRIES } from "../../data/countries";
import RouteSwatch from "../common/RouteSwatch";
import "./TripGallery.css";

// Galeria wypraw: filtr po krajach (flagi), karuzela kart (przeciąganie myszą / strzałki – jak lista
// produktów na polymer.ws) i okno ze szczegółami.
// Wybrany kraj jest wspólny z mapą tras (stan w TripsSection) – mapa pokazuje jego kontur.

function Flag({ code, size = 20 }) {
  const country = COUNTRIES[code];
  if (!country) return null;
  return (
    <img
      className="trip-flag"
      src={country.flag}
      alt={country.name}
      title={country.name}
      width={size}
      height={size}
      loading="lazy"
    />
  );
}

const trips = [...TRIPS].sort((a, b) => b.year - a.year);
const countryCodes = [...new Set(trips.flatMap((t) => t.countries))];

export default function TripGallery({ country = null, onCountryChange = () => {} }) {
  const [active, setActive] = useState(null);
  const railRef = useRef(null);
  const drag = useRef(null);

  const visible = !country ? trips : trips.filter((t) => t.countries.includes(country));

  // Okno szczegółów: blokada przewijania strony i zamykanie klawiszem Esc
  useEffect(() => {
    if (!active) return;
    document.body.style.overflow = "hidden";
    const onKey = (e) => e.key === "Escape" && setActive(null);
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [active]);

  // Przewinięcie karuzeli o jedną kartę w lewo/prawo
  const step = (dir) => {
    const rail = railRef.current;
    const card = rail?.querySelector(".trip-slide");
    if (!rail || !card) return;
    rail.scrollBy({ left: dir * (card.offsetWidth + 20), behavior: "smooth" });
  };

  // Przeciąganie myszą (na dotyku działa zwykłe przewijanie). Po przeciągnięciu klik nie otwiera karty.
  const onPointerDown = (e) => {
    if (e.pointerType !== "mouse") return;
    drag.current = { x: e.clientX, left: railRef.current.scrollLeft, moved: false };
  };
  const onPointerMove = (e) => {
    const d = drag.current;
    if (!d) return;
    const dx = e.clientX - d.x;
    if (Math.abs(dx) > 4) d.moved = true;
    railRef.current.scrollLeft = d.left - dx;
  };
  const onPointerUp = () => {
    const d = drag.current;
    drag.current = null;
    if (d?.moved) {
      // klik, który zaraz przyjdzie po puszczeniu przycisku, jest częścią przeciągnięcia
      railRef.current.addEventListener("click", (ev) => ev.stopPropagation(), { capture: true, once: true });
    }
  };

  return (
    <div className="trip-gallery">
      <div className="container trip-gallery__bar">
        <div className="trip-filters" role="group" aria-label="Filter trips by country">
          <button
            type="button"
            className={`trip-filter ${!country ? "is-active" : ""}`}
            aria-pressed={!country}
            onClick={() => onCountryChange(null)}
          >
            All
          </button>
          {countryCodes.map((code) => (
            <button
              key={code}
              type="button"
              className={`trip-filter ${country === code ? "is-active" : ""}`}
              aria-pressed={country === code}
              aria-label={COUNTRIES[code]?.name ?? code}
              onClick={() => onCountryChange(country === code ? null : code)}
            >
              <Flag code={code} />
            </button>
          ))}
        </div>
        <div className="trip-arrows">
          <button type="button" className="trip-arrow" aria-label="Previous trip" onClick={() => step(-1)}>
            ←
          </button>
          <button type="button" className="trip-arrow" aria-label="Next trip" onClick={() => step(1)}>
            →
          </button>
        </div>
      </div>

      <ul
        ref={railRef}
        className="container trip-rail"
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerLeave={onPointerUp}
      >
        {visible.map((trip) => (
          <li key={trip.year} className="trip-slide">
            <button type="button" className="trip-card" onClick={() => setActive(trip)} draggable={false}>
              {trip.photo ? (
              <img className="trip-card__photo" src={trip.photo} alt="" loading="lazy" decoding="async" draggable={false} />
            ) : (
              <span className="trip-card__photo trip-card__photo--empty" aria-hidden="true">
                {trip.year}
              </span>
            )}
              <span className="trip-card__body">
                <span className="trip-card__title">{trip.title}</span>
                <span className="trip-year">
                  {trip.year}
                  <RouteSwatch color={trip.color} dash={trip.dash} width={64} />
                </span>
                <span className="trip-flags">
                  {trip.countries.slice(0, 3).map((c) => (
                    <span key={c} className="trip-flags__item">
                      <Flag code={c} size={18} />
                    </span>
                  ))}
                </span>
              </span>
            </button>
          </li>
        ))}
      </ul>

      {active && (
        <div className="trip-modal" onClick={() => setActive(null)}>
          <div
            className="trip-modal__dialog"
            role="dialog"
            aria-modal="true"
            aria-labelledby="trip-modal-title"
            onClick={(e) => e.stopPropagation()}
          >
            <button type="button" className="trip-modal__close" aria-label="Close" onClick={() => setActive(null)} autoFocus>
              ×
            </button>
            <h2 id="trip-modal-title" className="trip-modal__title">
              {active.title}
            </h2>
            <span className="trip-year">
              {active.year}
              <RouteSwatch color={active.color} dash={active.dash} width={64} />
            </span>
            {active.photo && <img className="trip-modal__photo" src={active.photo} alt={active.title} />}
            <dl className="trip-stats">
              <dt>Distance</dt>
              <dd>{formatKm(active.km)}</dd>
              <dt>Duration</dt>
              <dd>{active.days} days</dd>
              <dt>Elevation</dt>
              <dd>{active.elevation}</dd>
              <dt>Avg speed</dt>
              <dd>{active.avgSpeed}</dd>
            </dl>
            <div className="trip-flags">
              {active.countries.map((c) => (
                <span key={c} className="trip-flags__item">
                  <Flag code={c} size={22} />
                </span>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

import { useEffect, useRef, useState } from "react";
import { TRIPS, formatKm } from "../../data/trips";
import { COUNTRIES } from "../../data/countries";
import RouteSwatch from "../common/RouteSwatch";
import ArrowButton from "../common/ArrowButton";
import { COLORS } from "../../styles/tokens";
import "./TripGallery.css";

// Galeria wypraw: filtr po krajach (flagi), karuzela kart (przeciąganie myszą / strzałki – jak lista
// produktów na polymer.ws) i okno ze szczegółami.
// Wybrany kraj jest wspólny z mapą tras (stan w TripsSection) – mapa pokazuje jego kontur.

// decorative: flaga obok podpisanej nazwy kraju – bez alt, żeby czytnik nie czytał nazwy dwa razy
function Flag({ code, size = 20, decorative = false }) {
  const country = COUNTRIES[code];
  if (!country) return null;
  return (
    <img
      className="trip-flag"
      src={country.flag}
      alt={decorative ? "" : country.name}
      title={decorative ? undefined : country.name}
      width={size}
      height={size}
      loading="lazy"
    />
  );
}

// Blokada przewijania strony pod otwartym oknem szczegółów
const lockScroll = (on) => {
  document.body.style.overflow = on ? "hidden" : "";
};

const trips = [...TRIPS].sort((a, b) => b.year - a.year);
const countryCodes = [...new Set(trips.flatMap((t) => t.countries))];

// selected / onSelectedChange: wyprawa wybrana na mapie albo kliknięciem karty (stan w TripsSection)
export default function TripGallery({ country = null, onCountryChange = () => {}, selected = null, onSelectedChange = () => {} }) {
  const [active, setActive] = useState(null);
  const railRef = useRef(null);
  const drag = useRef(null);
  const dialogRef = useRef(null);
  const openerRef = useRef(null); // karta, która otworzyła okno – po zamknięciu wraca na nią fokus

  const visible = !country ? trips : trips.filter((t) => t.countries.includes(country));

  const openTrip = (trip, e) => {
    openerRef.current = e.currentTarget;
    setActive(trip);
    onSelectedChange(trip.year); // mapa w tle od razu pokazuje tę trasę
  };

  // „Show route on map”: zamknięcie okna; przewinięcie do mapy robi sprzątanie efektu okna niżej,
  // dopiero po zdjęciu blokady przewijania (body overflow: hidden blokuje też scrollIntoView)
  const scrollToMapRef = useRef(false);
  const showOnMap = (e) => {
    e.preventDefault();
    scrollToMapRef.current = true;
    setActive(null);
  };

  // Wyprawa wybrana na mapie: karuzela przewija się do jej karty (tylko w poziomie, strona stoi w miejscu)
  useEffect(() => {
    const rail = railRef.current;
    const card = selected && rail?.querySelector(`[data-year="${selected}"]`);
    if (!card) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    rail.scrollTo({ left: card.offsetLeft - rail.firstElementChild.offsetLeft, behavior: reduce ? "auto" : "smooth" });
  }, [selected]);

  // Okno szczegółów: blokada przewijania strony, Esc zamyka, Tab nie wychodzi poza okno,
  // po zamknięciu fokus wraca na kartę wyprawy
  useEffect(() => {
    if (!active) return;
    lockScroll(true);
    const onKey = (e) => {
      if (e.key === "Escape") {
        setActive(null);
        return;
      }
      if (e.key !== "Tab" || !dialogRef.current) return;
      const focusable = dialogRef.current.querySelectorAll("button, a[href], [tabindex]:not([tabindex='-1'])");
      if (!focusable.length) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (e.shiftKey && (document.activeElement === first || !dialogRef.current.contains(document.activeElement))) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && (document.activeElement === last || !dialogRef.current.contains(document.activeElement))) {
        e.preventDefault();
        first.focus();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => {
      lockScroll(false);
      window.removeEventListener("keydown", onKey);
      openerRef.current?.focus({ preventScroll: true });
      if (scrollToMapRef.current) {
        scrollToMapRef.current = false;
        const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
        document.getElementById("trips")?.scrollIntoView({ behavior: reduce ? "auto" : "smooth" });
      }
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
              title={COUNTRIES[code]?.name ?? code}
              onClick={() => onCountryChange(country === code ? null : code)}
            >
              <Flag code={code} />
              {/* Kod kraju obok flagi – małe flagi bywają nie do odróżnienia (np. Słowenia i Rosja) */}
              <span className="trip-filter__code" aria-hidden="true">
                {code}
              </span>
            </button>
          ))}
        </div>
        {/* Czytnik ekranu ogłasza wynik filtra (wcześniej karty znikały bez słowa) */}
        <p className="sr-only" role="status">
          {country ? `${visible.length} ${visible.length === 1 ? "trip" : "trips"} through ${COUNTRIES[country]?.name ?? country}` : ""}
        </p>
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
          <li key={trip.year} className="trip-slide" data-year={trip.year}>
            <button type="button" className={`trip-card ${selected === trip.year ? "is-selected" : ""}`}
              aria-current={selected === trip.year || undefined}
              onClick={(e) => openTrip(trip, e)}
              draggable={false}
            >
              {trip.photo ? (
              <img
                className="trip-card__photo"
                src={trip.photo.src}
                srcSet={trip.photo.srcSet}
                sizes="(min-width: 768px) 360px, 80vw"
                width={trip.photo.width}
                height={trip.photo.height}
                alt=""
                loading="lazy"
                decoding="async"
                draggable={false}
              />
            ) : (
              <span className="trip-card__photo trip-card__photo--empty" aria-hidden="true">
                {trip.year}
              </span>
            )}
              <span className="trip-card__body">
                <span className="trip-card__title">{trip.title}</span>
                <span className="trip-year">
                  {trip.year}
                  {/* Wybrana wyprawa – kreska w kolorze akcentu, tak jak jej trasa na mapie */}
                  <RouteSwatch color={selected === trip.year ? COLORS.accent : trip.color} dash={trip.dash} width={64} />
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
            ref={dialogRef}
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
            {active.photo && (
              <img
                className="trip-modal__photo"
                src={active.photo.src}
                srcSet={active.photo.srcSet}
                sizes="(min-width: 768px) 640px, 100vw"
                width={active.photo.width}
                height={active.photo.height}
                alt={active.title}
              />
            )}
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
            {/* Kraje z nazwami (same flagi były nieczytelne i niewidoczne dla czytnika ekranu) */}
            <ul className="trip-modal__countries">
              {active.countries.map((c) => (
                <li key={c} className="trip-modal__country">
                  <Flag code={c} size={22} decorative />
                  {COUNTRIES[c]?.name ?? c}
                </li>
              ))}
            </ul>
            {/* Trasa jest już zaznaczona na mapie (openTrip) – przycisk zamyka okno i przewija do mapy */}
            <ArrowButton href="#trips" label="Show route on map" tone="silver" onClick={showOnMap} />
          </div>
        </div>
      )}
    </div>
  );
}

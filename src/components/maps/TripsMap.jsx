import { useEffect, useRef, useState } from "react";
import L from "leaflet";
import omnivore from "@mapbox/leaflet-omnivore";
import { createMap, addResetControl, addFullscreenControl, addBasemapControl, fitPadding } from "./mapKit";
import Typewriter from "../common/Typewriter";
import RouteSwatch from "../common/RouteSwatch";
import { TRIPS, formatKm } from "../../data/trips";
import { COLORS } from "../../styles/tokens";

// Mapa tras wypraw: tytuł i filtry z nazwami wypraw nałożone na mapę (filtry pełnią też rolę legendy),
// podświetlenie trasy po najechaniu, wybór trasy kliknięciem na mapie lub w filtrze.
// Prop country (flaga wybrana w galerii): kontur kraju + wyróżnienie tras, które przez niego prowadzą.

// Styl polymer.ws: cienkie szare linie jak rysunek techniczny; wskazana trasa – akcent, grubsza, ze startem i metą
const LINE = { weight: 2.5, opacity: 1, lineCap: "round", lineJoin: "round" };
const FOCUS_WEIGHT = 4;
const CASING = { color: COLORS.white, weight: 6, opacity: 0.7 };
// Niewidoczny, szeroki pas nad linią – łapie kursor z ok. 9 px, choć sama linia ma 2,5 px
const HIT = { color: COLORS.ink, weight: 18, opacity: 0, lineCap: "round", lineJoin: "round" };
const DIMMED = 0.18;

// Wzór kreski przeskalowany do grubszej linii (np. wskazanej trasy)
const scaleDash = (dash, k) => dash?.split(" ").map((n) => +(n * k).toFixed(2)).join(" ");

// Pierwszy i ostatni punkt trasy (GPX może mieć kilka odcinków – np. jeden na dzień)
const endpoints = (geojson) => {
  const lines = geojson.features.flatMap((f) =>
    f.geometry.type === "MultiLineString" ? f.geometry.coordinates : f.geometry.type === "LineString" ? [f.geometry.coordinates] : []
  );
  if (!lines.length) return null;
  const [a] = lines[0];
  const b = lines.at(-1).at(-1);
  return [L.latLng(a[1], a[0]), L.latLng(b[1], b[0])];
};

// Znaczniki wskazanej trasy: pusty pierścień na starcie, pełna kropka z podpisem na mecie
const endpointLayer = (trip, [start, end]) =>
  L.layerGroup([
    L.circleMarker(start, { radius: 5, color: COLORS.accent, weight: 2.5, fillColor: COLORS.white, fillOpacity: 1, interactive: false }),
    L.circleMarker(end, { radius: 5, color: COLORS.white, weight: 2, fillColor: COLORS.accent, fillOpacity: 1, interactive: false }).bindTooltip(
      `${trip.year} · ${trip.title}`,
      { permanent: true, direction: "right", offset: [10, 0], className: "map-tip map-tip--label" }
    ),
  ]);
// Linia kropkowana – kontur kraju odróżnia się od tras (ciągłych i przerywanych)
const COUNTRY_STYLE = {
  color: COLORS.dark,
  weight: 3,
  dashArray: "1 7",
  lineCap: "round",
  opacity: 1,
  fillColor: COLORS.dark,
  fillOpacity: 0.06,
};


// Granice krajów (Natural Earth, uproszczone) – pobierane raz, przy pierwszym wyborze flagi
let bordersPromise;
const loadBorders = () =>
  (bordersPromise ??= fetch(`${import.meta.env.BASE_URL}data/countries.geojson`).then((r) => {
    if (!r.ok) throw new Error(`countries.geojson: ${r.status}`);
    return r.json();
  }));

const TripsMap = ({ country = null, label, title }) => {
  const el = useRef(null);
  const mapRef = useRef(null);
  const layers = useRef({}); // rok -> { line, casing, hit, ends }
  const focusLayer = useRef(null);
  const countryLayer = useRef(null);
  const [selected, setSelected] = useState(null); // null = wszystkie
  const [hovered, setHovered] = useState(null);
  const [loaded, setLoaded] = useState(false);

  const fitTo = (year) => {
    const map = mapRef.current;
    if (!map) return;
    const group = year
      ? layers.current[year]?.line
      : L.featureGroup(Object.values(layers.current).map((l) => l.line));
    if (group && group.getBounds().isValid()) map.flyToBounds(group.getBounds(), { ...fitPadding(), duration: 0.8 });
  };

  useEffect(() => {
    const map = createMap(el.current);
    map.setView([46, 12], 5);
    mapRef.current = map;

    let pending = TRIPS.length;
    TRIPS.forEach((trip) => {
      const casing = L.geoJson(null, { style: CASING, interactive: false }).addTo(map);
      const line = omnivore
        .gpx(trip.gpx, null, L.geoJson(null, { style: { ...LINE, color: trip.color, dashArray: trip.dash }, interactive: false }))
        .on("ready", function () {
          const geo = this.toGeoJSON();
          casing.addData(geo);
          layers.current[trip.year].ends = endpoints(geo);
          casing.bringToBack();
          // Podpowiedź, najechanie i kliknięcie obsługuje szeroki niewidoczny pas, nie cienka linia
          const hit = L.geoJson(geo, { style: HIT }).addTo(map);
          hit.bindTooltip(
            `<strong>${trip.title}</strong><span>${trip.year} · ${formatKm(trip.km)} · ${trip.days} days</span>`,
            { sticky: true, className: "map-tip", direction: "top", offset: [0, -8] }
          );
          hit.on("mouseover", () => setHovered(trip.year));
          hit.on("mouseout", () => setHovered(null));
          hit.on("click", () => setSelected((s) => (s === trip.year ? null : trip.year)));
          layers.current[trip.year].hit = hit;
          if (--pending === 0) {
            setLoaded(true);
            fitTo(null);
          }
        })
        .on("error", () => --pending === 0 && setLoaded(true))
        .addTo(map);
      layers.current[trip.year] = { line, casing };
    });

    addResetControl(map, () => {
      setSelected(null);
      fitTo(null);
    });
    addFullscreenControl(map);
    addBasemapControl(map);

    return () => {
      map.remove();
      mapRef.current = null;
      layers.current = {};
    };
  }, []);

  // Styl tras: wskazana/wybrana – akcent, grubsza, ze startem i metą; pozostałe przygaszone.
  // Bez wybranej trasy, ale z wybranym krajem – wyróżnione trasy przez ten kraj (w swoich szarościach).
  useEffect(() => {
    const map = mapRef.current;
    const focus = hovered ?? selected;
    TRIPS.forEach((trip) => {
      const l = layers.current[trip.year];
      if (!l) return;
      const isFocus = focus === trip.year;
      const active = focus ? isFocus : !country || trip.countries.includes(country);
      l.line.setStyle({
        color: isFocus ? COLORS.accent : trip.color,
        dashArray: isFocus ? scaleDash(trip.dash, FOCUS_WEIGHT / LINE.weight) : trip.dash,
        opacity: active ? LINE.opacity : DIMMED,
        weight: isFocus ? FOCUS_WEIGHT : LINE.weight,
      });
      l.casing.setStyle({ opacity: active ? CASING.opacity : 0 });
      if (isFocus) {
        l.casing.bringToFront();
        l.line.bringToFront();
        l.hit?.bringToFront(); // pas wskazanej trasy na wierzchu – kursor nie przeskakuje na sąsiednią
      }
    });

    focusLayer.current?.remove();
    focusLayer.current = null;
    const ends = focus && layers.current[focus]?.ends;
    if (map && ends) focusLayer.current = endpointLayer(TRIPS.find((t) => t.year === focus), ends).addTo(map);
  }, [hovered, selected, country, loaded]);

  // Kadrowanie po zmianie wyboru
  useEffect(() => {
    if (loaded) fitTo(selected);
  }, [selected, loaded]);

  // Kontur wybranego kraju
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;
    countryLayer.current?.remove();
    countryLayer.current = null;
    if (!country) {
      if (loaded) fitTo(selected);
      return;
    }

    let cancelled = false;
    loadBorders()
      .then((geo) => {
        if (cancelled || !mapRef.current) return;
        // Osobna warstwa pod trasami, żeby kontur ich nie zasłaniał
        if (!map.getPane("countries")) map.createPane("countries").style.zIndex = 350;
        const renderer = L.svg({ pane: "countries" });
        const outline = L.geoJSON(geo, {
          filter: (f) => f.properties.code === country,
          pane: "countries",
          renderer,
          interactive: false,
          style: COUNTRY_STYLE,
        });
        const layer = L.featureGroup([outline]);
        // Bardzo małe państwa (Watykan, San Marino, Liechtenstein) – kontur byłby mniejszy niż piksel,
        // więc dodatkowo zaznaczamy je okręgiem
        const b = outline.getBounds();
        if (b.isValid() && b.getNorth() - b.getSouth() < 0.3) {
          L.circleMarker(b.getCenter(), {
            ...COUNTRY_STYLE,
            radius: 26,
            fillOpacity: 0.15,
            pane: "countries",
            renderer,
            interactive: false,
          }).addTo(layer);
        }
        layer.addTo(map);
        countryLayer.current = layer;
        // maxZoom: małe państwa (Watykan, San Marino) pokazane w kontekście okolicy
        if (layer.getBounds().isValid()) map.flyToBounds(layer.getBounds(), { padding: [40, 40], maxZoom: 8, duration: 0.8 });
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [country, loaded]);

  return (
    <div className="map-block">
      <div className="map-stage">
        <div className="map-head">
          {label && <Typewriter as="p" className="pitch map-head__label" text={label} />}
          {title && <h2 className="h2 map-head__title">{title}</h2>}
          <div className="map-filters" role="group" aria-label="Show trip on the map">
            <button
              type="button"
              className={`map-chip ${selected === null ? "is-active" : ""}`}
              aria-pressed={selected === null}
              onClick={() => setSelected(null)}
            >
              All trips
            </button>
            {TRIPS.map((t) => (
              <button
                key={t.year}
                type="button"
                className={`map-chip ${selected === t.year ? "is-active" : ""}`}
                aria-pressed={selected === t.year}
                onClick={() => setSelected((s) => (s === t.year ? null : t.year))}
                onMouseEnter={() => setHovered(t.year)}
                onMouseLeave={() => setHovered(null)}
              >
                <RouteSwatch
              className="map-chip__swatch"
              color={selected === t.year || hovered === t.year ? COLORS.accent : t.color}
              dash={t.dash}
            />
                <span className="map-chip__year">{t.year}</span>
                <span className="map-chip__title">{t.title}</span>
                <span className="map-chip__meta">{formatKm(t.km)}</span>
              </button>
            ))}
          </div>
        </div>
        <div className="map-card">
          <div ref={el} className="map-canvas" />
          {!loaded && <div className="map-loading">Loading routes…</div>}
        </div>
      </div>
    </div>
  );
};

export default TripsMap;

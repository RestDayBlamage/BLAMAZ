import { useEffect, useRef, useState } from "react";
import L from "leaflet";
import { createMap, addResetControl, addFullscreenControl, addBasemapControl, fitPadding } from "./mapKit";
import Typewriter from "../common/Typewriter";
import { SPOTS } from "../../data/camps";

// Mapa noclegów. Karty pod mapą są jednocześnie legendą i filtrem:
// kliknięcie pokazuje/ukrywa dany typ noclegów, karta „most memorable” przenosi do tego miejsca.

const TYPES = {
  wild: { label: "Wild camp", title: "Wild camps", text: <>Free stays in the wild, <b>surrounded by nature</b>.</> },
  camp: { label: "Campsite", title: "Campsites", text: <>Where we could finally take a <b>hot shower</b> after days on the road.</> },
  memorable: {
    label: "Most memorable",
    title: "Most memorable",
    text: <>The night we accidentally camped on a <b>military training ground</b> in Switzerland.</>,
  },
};

const icon = (type) =>
  L.divIcon({
    className: `map-pin map-pin--${type}`,
    iconSize: type === "memorable" ? [14, 14] : [10, 10],
    html: "<span></span>",
  });

const popupHtml = (spot) => {
  const [lat, lng] = spot.coords;
  return `
    <div class="map-pop">
      <span class="map-pop__tag map-pop__tag--${spot.type}">${TYPES[spot.type].label}</span>
      <strong class="map-pop__name">${spot.name}</strong>
      <span class="map-pop__coords">${lat.toFixed(4)}, ${lng.toFixed(4)}</span>
      <a class="map-pop__link" href="https://www.google.com/maps?q=${lat},${lng}" target="_blank" rel="noopener noreferrer">Open in Google Maps ↗</a>
    </div>`;
};

const counts = SPOTS.reduce((acc, s) => ({ ...acc, [s.type]: (acc[s.type] || 0) + 1 }), {});

const CampsMap = () => {
  const el = useRef(null);
  const mapRef = useRef(null);
  const groups = useRef({});
  const [visible, setVisible] = useState({ wild: true, camp: true });

  const fitVisible = (vis) => {
    const map = mapRef.current;
    if (!map) return;
    const shown = Object.entries(groups.current)
      .filter(([type]) => type === "memorable" || vis[type])
      .map(([, g]) => g);
    const bounds = L.featureGroup(shown).getBounds();
    if (bounds.isValid()) map.flyToBounds(bounds, { ...fitPadding(), duration: 0.8 });
  };

  useEffect(() => {
    const map = createMap(el.current);
    mapRef.current = map;

    Object.keys(TYPES).forEach((type) => {
      groups.current[type] = L.featureGroup().addTo(map);
    });

    SPOTS.forEach((spot) => {
      L.marker(spot.coords, {
        icon: icon(spot.type),
        riseOnHover: true,
        keyboard: true,
        title: spot.name,
        // Wyróżniony nocleg zawsze na wierzchu, nad sąsiednimi znacznikami
        zIndexOffset: spot.type === "memorable" ? 1000 : 0,
      })
        .bindTooltip(spot.name, { direction: "top", offset: [0, -10], className: "map-tip" })
        .bindPopup(popupHtml(spot), { className: "map-popup", closeButton: true, offset: [0, -6] })
        .addTo(groups.current[spot.type]);
    });

    const all = L.featureGroup(Object.values(groups.current)).getBounds();
    map.fitBounds(all, fitPadding());
    addResetControl(map, () => {
      map.closePopup();
      setVisible({ wild: true, camp: true });
    });
    addFullscreenControl(map);
    addBasemapControl(map);

    return () => {
      map.remove();
      mapRef.current = null;
      groups.current = {};
    };
  }, []);

  // Pokaż/ukryj typy noclegów i dopasuj kadr do tego, co widać
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;
    ["wild", "camp"].forEach((type) => {
      const g = groups.current[type];
      if (visible[type] && !map.hasLayer(g)) g.addTo(map);
      if (!visible[type] && map.hasLayer(g)) map.removeLayer(g);
    });
    fitVisible(visible);
  }, [visible]);

  const toggle = (type) =>
    setVisible((v) => {
      const next = { ...v, [type]: !v[type] };
      // Zawsze zostaje widoczny przynajmniej jeden typ
      return next.wild || next.camp ? next : v;
    });

  const showMemorable = () => {
    const map = mapRef.current;
    const marker = groups.current.memorable?.getLayers()[0];
    if (!map || !marker) return;
    map.flyTo(marker.getLatLng(), 11, { duration: 1 });
    map.once("moveend", () => marker.openPopup());
    el.current.scrollIntoView({ behavior: "smooth", block: "center" });
  };

  return (
    <div className="map-block">
      <div className="map-stage">
        <div className="map-head">
          <Typewriter as="p" className="pitch map-head__label" text="Overnight spots" />
          <h2 className="h2 map-head__title">{SPOTS.length} nights across Europe</h2>
        </div>
        <div className="map-card">
          <div ref={el} className="map-canvas" />
        </div>
      </div>

      <div className="stats" role="group" aria-label="Filter overnight spots">
        {["wild", "camp"].map((type) => (
          <button
            key={type}
            type="button"
            className={`stat stat--toggle ${visible[type] ? "is-on" : "is-off"}`}
            aria-pressed={visible[type]}
            onClick={() => toggle(type)}
          >
            <span className="stat-top">
              <span className="stat-label">
                <span className={`stat-dot stat-dot--${type}`} aria-hidden="true" />
                {TYPES[type].title}
              </span>
              <span className="stat-action">{visible[type] ? "Shown" : "Hidden"}</span>
            </span>
            <span className="stat-number">{counts[type]}</span>
            <span className="stat-text">{TYPES[type].text}</span>
          </button>
        ))}
        <button type="button" className="stat stat--toggle is-on" onClick={showMemorable}>
          <span className="stat-top">
            <span className="stat-label">
              <span className="stat-dot stat-dot--memorable" aria-hidden="true" />
              {TYPES.memorable.title}
            </span>
            <span className="stat-action stat-action--arrow" aria-label="Show on map">
              <svg width="14" height="12" viewBox="0 0 14 12" aria-hidden="true">
                <path d="M13.59 6.4 8.52 11.46a.56.56 0 0 1-.8-.8L11.83 6.56H.81a.56.56 0 0 1 0-1.12h11.02L7.73 1.34a.56.56 0 0 1 .8-.8l5.06 5.06a.56.56 0 0 1 0 .8Z" fill="currentColor" />
              </svg>
            </span>
          </span>
          <span className="stat-number">{counts.memorable}</span>
          <span className="stat-text">{TYPES.memorable.text}</span>
        </button>
      </div>
    </div>
  );
};

export default CampsMap;

import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "./maps.css";

// Wspólna baza dla map na stronie: szary podkład z rzeźbą terenu (styl polymer.ws), sterowanie w stylu strony i gesty,
// które nie przechwytują przewijania strony (poza trybem pełnoekranowym).

const isTouch =
  typeof window !== "undefined" && window.matchMedia("(hover: none) and (pointer: coarse)").matches;

const ICONS = {
  expand:
    '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 9V4h5M20 9V4h-5M4 15v5h5M20 15v5h-5"/></svg>',
  collapse:
    '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M9 4v5H4M15 4v5h5M9 20v-5H4M15 20v-5h5"/></svg>',
  reset:
    '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4.5 12a7.5 7.5 0 1 0 2.2-5.3M4 4v4h4"/></svg>',
  layers:
    '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 3 3 8l9 5 9-5-9-5ZM3 13l9 5 9-5M3 17.5l9 5 9-5"/></svg>',
};

// Podkłady mapy – wszystkie działają bez klucza API.
// preview: kafelek z Europy Środkowej (z=5) jako miniaturka w przełączniku.
const OSM = '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>';
const ESRI = "https://server.arcgisonline.com/ArcGIS/rest/services";
// Cieniowanie rzeźby terenu (szare, bez podpisów) – nakładane na podkład trybem multiply (relief)
const HILLSHADE = `${ESRI}/Elevation/World_Hillshade/MapServer/tile/{z}/{y}/{x}`;
const BASEMAPS = [
  // Domyślny (styl polymer.ws): jasnoszary podkład + rzeźba terenu, w CSS w pełni szary (maps.css, data-basemap)
  {
    id: "minimal",
    label: "Minimal",
    url: `${ESRI}/Canvas/World_Light_Gray_Base/MapServer/tile/{z}/{y}/{x}`,
    relief: { url: HILLSHADE, opacity: 0.55 },
    maxNativeZoom: 16,
    attribution: "Tiles &copy; Esri &mdash; Esri, DeLorme, NAVTEQ, USGS",
  },
  {
    id: "dark",
    label: "Dark",
    url: `${ESRI}/Canvas/World_Dark_Gray_Base/MapServer/tile/{z}/{y}/{x}`,
    relief: { url: HILLSHADE, opacity: 0.35 },
    maxNativeZoom: 16,
    attribution: "Tiles &copy; Esri &mdash; Esri, DeLorme, NAVTEQ, USGS",
  },
  {
    id: "light",
    label: "Light",
    url: `${ESRI}/Canvas/World_Light_Gray_Base/MapServer/tile/{z}/{y}/{x}`,
    maxNativeZoom: 16,
    attribution: "Tiles &copy; Esri &mdash; Esri, DeLorme, NAVTEQ",
  },
  {
    id: "satellite",
    label: "Satellite",
    url: "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
    labels: "https://server.arcgisonline.com/ArcGIS/rest/services/Reference/World_Boundaries_and_Places/MapServer/tile/{z}/{y}/{x}",
    maxNativeZoom: 19,
    attribution: "Tiles &copy; Esri &mdash; Esri, Maxar, Earthstar Geographics",
  },
  {
    id: "osm",
    label: "OSM",
    url: "https://tile.openstreetmap.org/{z}/{x}/{y}.png",
    maxNativeZoom: 19,
    attribution: OSM,
  },
  {
    id: "cycling",
    label: "Cycling",
    url: "https://{s}.tile-cyclosm.openstreetmap.fr/cyclosm/{z}/{x}/{y}.png",
    maxNativeZoom: 19,
    attribution: `<a href="https://www.cyclosm.org">CyclOSM</a> | ${OSM}`,
  },
];

// Maksymalne przybliżenie map (poziom ulic i budynków). Powyżej maxNativeZoom podkładu
// Leaflet powiększa ostatnie dostępne kafelki zamiast pokazywać pustą mapę.
const MAX_ZOOM = 19;

const STORAGE_KEY = "blmz-basemap-v2"; // v2: nowy domyślny podkład dla wszystkich
const BASEMAP_EVENT = "blmz:basemap";

const savedBasemap = () => {
  try {
    const id = localStorage.getItem(STORAGE_KEY);
    return BASEMAPS.some((b) => b.id === id) ? id : "minimal";
  } catch {
    return "minimal";
  }
};

const preview = (b) => L.Util.template(b.url, { s: "a", z: 5, x: 17, y: 11 });

// Podmienia warstwy podkładu na mapie (podkład + ewentualne podpisy dla satelity)
function setBasemap(map, id) {
  const b = BASEMAPS.find((x) => x.id === id) ?? BASEMAPS[0];
  (map._basemapLayers ?? []).forEach((l) => map.removeLayer(l));
  const opts = { maxNativeZoom: b.maxNativeZoom, maxZoom: MAX_ZOOM, subdomains: b.subdomains ?? "abc", attribution: b.attribution };
  const layers = [L.tileLayer(b.url, opts)];
  if (b.relief) {
    // Rzeźba terenu nad podkładem (multiply – cienie przyciemniają podkład), pod trasami i znacznikami
    if (!map.getPane("relief")) {
      const pane = map.createPane("relief");
      pane.style.zIndex = 210;
      pane.style.pointerEvents = "none";
      pane.style.mixBlendMode = "multiply";
    }
    layers.push(L.tileLayer(b.relief.url, { maxNativeZoom: 16, maxZoom: MAX_ZOOM, pane: "relief", opacity: b.relief.opacity }));
  }
  if (b.labels) {
    // Własna warstwa na podpisy: nad zdjęciem satelitarnym, pod trasami i znacznikami
    if (!map.getPane("labels")) {
      const pane = map.createPane("labels");
      pane.style.zIndex = 250;
      pane.style.pointerEvents = "none";
    }
    layers.push(L.tileLayer(b.labels, { maxNativeZoom: 19, maxZoom: MAX_ZOOM, pane: "labels" }));
  }
  layers.forEach((l) => l.addTo(map));
  layers[0].bringToBack();
  map._basemapLayers = layers;
  map._basemap = b.id;
  // Na karcie (a nie tylko na samej mapie) – kolor tytułu nałożonego na mapę zależy od podkładu
  const card = map.getContainer().closest(".map-block") ?? map.getContainer();
  card.dataset.basemap = b.id;
}

// Margines kadrowania: na komputerze lewy dolny róg zajmuje tytuł z filtrami nałożony na mapę (.map-head)
export const fitPadding = () =>
  window.matchMedia("(min-width: 768px)").matches
    ? { paddingTopLeft: [48, 48], paddingBottomRight: [96, 230] }
    : { padding: [24, 24] };

export function createMap(el, { maxZoom = MAX_ZOOM, minZoom = 3 } = {}) {
  const map = L.map(el, {
    // Mysz: przeciąganie działa od razu. Telefon: jeden palec przewija stronę, dwa ruszają mapą.
    dragging: !isTouch,
    touchZoom: true,
    scrollWheelZoom: false,
    doubleClickZoom: true,
    zoomControl: false,
    closePopupOnClick: true,
    maxZoom,
    minZoom,
    // Pełne poziomy zoomu – ułamkowe dają cienkie białe szczeliny między kafelkami
    zoomSnap: 1,
  });

  // Podkład zapamiętany przez odwiedzającego (domyślnie „Minimal”: jasnoszary Esri z rzeźbą terenu)
  setBasemap(map, savedBasemap());

  L.control.zoom({ position: "bottomright" }).addTo(map);

  // Zoom kółkiem tylko z Ctrl/⌘ – bez niego strona przewija się normalnie.
  // W trybie pełnoekranowym zoom kółkiem obsługuje sam Leaflet.
  let wheelAcc = 0;
  const onWheel = (e) => {
    if (map._fullscreen || !(e.ctrlKey || e.metaKey)) return;
    e.preventDefault();
    wheelAcc += e.deltaY;
    if (Math.abs(wheelAcc) < 40) return;
    const delta = wheelAcc < 0 ? 1 : -1;
    wheelAcc = 0;
    map.setZoomAround(map.mouseEventToContainerPoint(e), map.getZoom() + delta);
  };
  el.addEventListener("wheel", onWheel, { passive: false });

  // Telefon: dwa palce przesuwają i przybliżają mapę, jeden przewija stronę
  const onTouchStart = (e) => {
    if (e.touches.length >= 2) map.dragging.enable();
  };
  const onTouchEnd = (e) => {
    if (!map._fullscreen && e.touches.length < 2) map.dragging.disable();
  };
  if (isTouch) {
    el.addEventListener("touchstart", onTouchStart, { passive: true });
    el.addEventListener("touchend", onTouchEnd, { passive: true });
  }

  map.on("unload", () => {
    el.removeEventListener("wheel", onWheel);
    el.removeEventListener("touchstart", onTouchStart);
    el.removeEventListener("touchend", onTouchEnd);
  });

  return map;
}

function addButton(map, { icon, label, onClick }) {
  const Btn = L.Control.extend({
    options: { position: "bottomright" },
    onAdd() {
      const c = L.DomUtil.create("div", "leaflet-bar leaflet-control");
      const b = L.DomUtil.create("a", "map-btn", c);
      b.href = "#";
      b.title = label;
      b.setAttribute("role", "button");
      b.setAttribute("aria-label", label);
      b.innerHTML = icon;
      L.DomEvent.disableClickPropagation(c);
      L.DomEvent.on(b, "click", (e) => {
        L.DomEvent.preventDefault(e);
        onClick(b);
      });
      return c;
    },
  });
  const control = new Btn();
  map.addControl(control);
  return control.getContainer().firstChild;
}

// Przycisk „pokaż wszystko” – wraca do widoku startowego
export function addResetControl(map, onReset) {
  addButton(map, { icon: ICONS.reset, label: "Show everything", onClick: onReset });
}

// Pełny ekran: Fullscreen API, a tam gdzie go nie ma (iPhone) – mapa rozciągnięta na całe okno.
// W pełnym ekranie mapa działa „normalnie”: przeciąganie jednym palcem/myszą i zoom kółkiem.
export function addFullscreenControl(map) {
  const card = map.getContainer().closest(".map-card") ?? map.getContainer();
  const nativeEl = () => document.fullscreenElement ?? document.webkitFullscreenElement;
  const canNative = !!(card.requestFullscreen || card.webkitRequestFullscreen) &&
    (document.fullscreenEnabled || document.webkitFullscreenEnabled);

  let button;

  const sync = () => {
    const on = nativeEl() === card || card.classList.contains("is-fullscreen");
    map._fullscreen = on;
    button.innerHTML = on ? ICONS.collapse : ICONS.expand;
    const label = on ? "Exit full screen" : "Full screen";
    button.title = label;
    button.setAttribute("aria-label", label);
    if (on) {
      map.dragging.enable();
      map.scrollWheelZoom.enable();
    } else {
      if (isTouch) map.dragging.disable();
      map.scrollWheelZoom.disable();
    }
    // Leaflet musi przeliczyć rozmiar po zmianie wymiarów kontenera
    // Leaflet musi przeliczyć rozmiar po zmianie wymiarów kontenera; środek mapy zostaje na miejscu
    setTimeout(() => map.invalidateSize({ pan: true, animate: false }), 60);
  };

  const exitPseudo = () => {
    card.classList.remove("is-fullscreen");
    document.body.style.overflow = "";
    sync();
  };

  const toggle = () => {
    if (nativeEl() === card) {
      (document.exitFullscreen ?? document.webkitExitFullscreen).call(document);
    } else if (card.classList.contains("is-fullscreen")) {
      exitPseudo();
    } else if (canNative) {
      (card.requestFullscreen ?? card.webkitRequestFullscreen).call(card);
    } else {
      card.classList.add("is-fullscreen");
      document.body.style.overflow = "hidden";
      sync();
    }
  };

  const onKey = (e) => {
    if (e.key === "Escape" && card.classList.contains("is-fullscreen")) exitPseudo();
  };

  button = addButton(map, { icon: ICONS.expand, label: "Full screen", onClick: toggle });
  document.addEventListener("fullscreenchange", sync);
  document.addEventListener("webkitfullscreenchange", sync);
  document.addEventListener("keydown", onKey);

  map.on("unload", () => {
    document.removeEventListener("fullscreenchange", sync);
    document.removeEventListener("webkitfullscreenchange", sync);
    document.removeEventListener("keydown", onKey);
    // Mapa usunięta w trybie „na całe okno” – przywróć przewijanie strony
    card.classList.remove("is-fullscreen");
    document.body.style.overflow = "";
  });
}

// Przełącznik podkładu: okrągły przycisk + panel z miniaturkami.
// Wybór zapamiętuje się w przeglądarce i synchronizuje między mapami na stronie.
export function addBasemapControl(map) {
  const Control = L.Control.extend({
    options: { position: "topright" },
    onAdd() {
      const root = L.DomUtil.create("div", "leaflet-control map-layers");
      L.DomEvent.disableClickPropagation(root);
      L.DomEvent.disableScrollPropagation(root);

      const toggle = L.DomUtil.create("button", "map-layers__toggle", root);
      toggle.type = "button";
      toggle.innerHTML = ICONS.layers;
      toggle.setAttribute("aria-label", "Change map style");
      toggle.setAttribute("aria-expanded", "false");
      toggle.title = "Map style";

      const panel = L.DomUtil.create("div", "map-layers__panel", root);
      panel.setAttribute("role", "radiogroup");
      panel.setAttribute("aria-label", "Map style");
      panel.hidden = true;

      const options = BASEMAPS.map((b) => {
        const opt = L.DomUtil.create("button", "map-layers__option", panel);
        opt.type = "button";
        opt.setAttribute("role", "radio");
        opt.dataset.id = b.id;
        opt.innerHTML = `<img src="${preview(b)}" alt="" width="56" height="56" loading="lazy"><span>${b.label}</span>`;
        L.DomEvent.on(opt, "click", () => {
          choose(b.id);
          close();
        });
        return opt;
      });

      const mark = () =>
        options.forEach((o) => {
          const on = o.dataset.id === map._basemap;
          o.classList.toggle("is-active", on);
          o.setAttribute("aria-checked", String(on));
        });

      const choose = (id) => {
        setBasemap(map, id);
        mark();
        try {
          localStorage.setItem(STORAGE_KEY, id);
        } catch {
          /* tryb prywatny – wybór działa, tylko się nie zapamięta */
        }
        window.dispatchEvent(new CustomEvent(BASEMAP_EVENT, { detail: { id, source: map } }));
      };

      const open = () => {
        panel.hidden = false;
        toggle.setAttribute("aria-expanded", "true");
        root.classList.add("is-open");
      };
      const close = () => {
        panel.hidden = true;
        toggle.setAttribute("aria-expanded", "false");
        root.classList.remove("is-open");
      };

      L.DomEvent.on(toggle, "click", () => (panel.hidden ? open() : close()));
      const onDocClick = (e) => !root.contains(e.target) && close();
      const onKey = (e) => e.key === "Escape" && close();
      // Zmiana podkładu na drugiej mapie
      const onSync = (e) => {
        if (e.detail.source === map || e.detail.id === map._basemap) return;
        setBasemap(map, e.detail.id);
        mark();
      };
      document.addEventListener("click", onDocClick);
      document.addEventListener("keydown", onKey);
      window.addEventListener(BASEMAP_EVENT, onSync);
      map.on("unload", () => {
        document.removeEventListener("click", onDocClick);
        document.removeEventListener("keydown", onKey);
        window.removeEventListener(BASEMAP_EVENT, onSync);
      });

      mark();
      return root;
    },
  });
  map.addControl(new Control());
}
